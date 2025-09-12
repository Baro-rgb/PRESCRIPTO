import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import adminRouter from './routes/adminRoute.js'
import doctorRouter from './routes/doctorRoute.js'
import userRouter from './routes/userRoute.js'
import http from 'http'
import { Server } from 'socket.io'
import jwt from 'jsonwebtoken'
import chatModel from './models/chatModel.js'

const app = express()
const port = process.env.PORT || 4000 
connectDB()
connectCloudinary()

app.use(express.json())
app.use(cors())

app.use('/api/admin',adminRouter)
app.use('/api/doctor',doctorRouter)
app.use('/api/user',userRouter)

app.get('/',(req,res)=>{
    res.send('API WORKING')
})

const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true
    }
})

// 🔹 Lưu trữ user online, admin và rooms
const onlineUsers = new Map() // userId -> socketInfo
const onlineAdmins = new Map() // adminId -> socketInfo
const userRooms = new Map() // socketId -> roomId

// 🔹 Middleware xác thực socket
io.use(async (socket, next) => {
    try {
        const token = socket.handshake.auth.token
        const userType = socket.handshake.auth.userType || 'user'
        
        if (!token) {
            return next(new Error('Authentication error: No token provided'))
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        
        if (userType === 'admin') {
            // Verify admin token
            if (decoded.email !== process.env.ADMIN_EMAIL) {
                return next(new Error('Authentication error: Invalid admin token'))
            }
            socket.userId = 'admin'
            socket.userType = 'admin'
            socket.adminEmail = decoded.email
        } else {
            // Regular user token
            socket.userId = decoded.id
            socket.userType = 'user'
        }
        
        next()
    } catch (error) {
        console.error('Socket authentication error:', error)
        next(new Error('Authentication error: Invalid token'))
    }
})

io.on("connection", (socket) => {
    console.log(`✅ User connected: ${socket.userId} (${socket.userType})`)

    if (socket.userType === 'admin') {
        // =================== ADMIN CONNECTIONS ===================
        onlineAdmins.set('admin', {
            socketId: socket.id,
            email: socket.adminEmail,
            connectedAt: new Date()
        })
        console.log('👨‍⚕️ Admin connected')
        
        // Send list of online users to admin
        socket.emit('online_users', Array.from(onlineUsers.keys()))
        
        // 🔹 Admin join specific patient room
        socket.on('admin_join_room', (patientId) => {
            const roomId = `chat_${patientId}`
            socket.join(roomId)
            userRooms.set(socket.id, roomId)
            console.log(`👨‍⚕️ Admin joined room: ${roomId}`)
        })

        // 🔥 FIX: Admin send message to patient - IMPROVED VERSION
        socket.on('admin_send_message', async (data) => {
            try {
                const { receiverId, text } = data
                
                console.log(`📤 Admin sending message to patient ${receiverId}:`, text)

                // Save to database
                const newMessage = new chatModel({
                    senderType: "admin",
                    senderId: "admin",
                    receiverType: "user", 
                    receiverId: receiverId.toString(),
                    message: text.trim(),
                    timestamp: new Date(),
                    isRead: false
                })

                await newMessage.save()

                const formattedMessage = {
                    senderId: 'admin',
                    receiverId: receiverId,
                    text: text.trim(),
                    time: new Date().toLocaleTimeString('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit'
                    }),
                    timestamp: new Date(),
                    senderType: 'admin'
                }

                // 🔥 FIX: Send to patient if online
                const patientInfo = onlineUsers.get(receiverId.toString())
                if (patientInfo) {
                    console.log(`📨 Sending admin message to online patient ${receiverId}`)
                    io.to(patientInfo.socketId).emit('receive_message', formattedMessage)
                } else {
                    console.log(`⚠️ Patient ${receiverId} is offline, message saved to DB only`)
                }

                // 🔥 FIX: Confirm to admin that message was processed
                socket.emit('message_sent', { 
                    ...formattedMessage, 
                    status: 'sent',
                    patientOnline: !!patientInfo 
                })

            } catch (error) {
                console.error('Error sending admin message:', error)
                socket.emit('message_error', { 
                    error: 'Failed to send message',
                    details: error.message 
                })
            }
        })

        // 🔹 Admin disconnect
        socket.on('disconnect', () => {
            console.log('👨‍⚕️ Admin disconnected')
            onlineAdmins.delete('admin')
            userRooms.delete(socket.id)
        })

    } else {
        // =================== USER CONNECTIONS ===================
        onlineUsers.set(socket.userId.toString(), {
            socketId: socket.id,
            userId: socket.userId,
            connectedAt: new Date()
        })
        console.log(`👤 User ${socket.userId} connected`)
        
        // Join user's personal support room
        const roomId = `support_${socket.userId}`
        socket.join(roomId)
        userRooms.set(socket.id, roomId)
        
        // Notify admin about user coming online
        const adminInfo = onlineAdmins.get('admin')
        if (adminInfo) {
            io.to(adminInfo.socketId).emit('user_online', socket.userId.toString())
            // Also update the online users list
            io.to(adminInfo.socketId).emit('online_users', Array.from(onlineUsers.keys()))
        }

        // 🔹 User join chat support (legacy support for existing chatbox)
        socket.on("join_support", (userData) => {
            const { userId, userName, userEmail } = userData
            
            console.log(`${userName} (${userEmail}) joined support room: ${roomId}`)
            
            // Send welcome message (optional - can be removed if not needed)
            socket.emit("receive_message", {
                text: `Xin chào ${userName}! Chúng tôi có thể hỗ trợ gì cho bạn?`,
                sender: "Hệ thống",
                senderId: "system",
                time: new Date().toLocaleTimeString('vi-VN', {
                    hour: '2-digit',
                    minute: '2-digit'
                }),
                timestamp: new Date(),
                type: "system",
                senderType: "system"
            })
        })

        // 🔥 FIX: User send message to support/admin - IMPROVED VERSION
        socket.on("send_message", async (data) => {
            try {
                const { text } = data
                const userId = socket.userId.toString()

                console.log(`📤 User ${userId} sending message:`, text)

                // Save to database
                const newMessage = new chatModel({
                    senderType: "user",
                    senderId: userId,
                    receiverType: "admin",
                    receiverId: "admin", 
                    message: text.trim(),
                    timestamp: new Date(),
                    isRead: false
                })

                await newMessage.save()

                const formattedMessage = {
                    senderId: userId,
                    receiverId: 'admin',
                    text: text.trim(),
                    time: new Date().toLocaleTimeString('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit'
                    }),
                    timestamp: new Date(),
                    senderType: 'user'
                }

                // 🔥 FIX: Send to admin if online
                const adminInfo = onlineAdmins.get('admin')
                if (adminInfo) {
                    console.log(`📨 Sending user message to admin`)
                    io.to(adminInfo.socketId).emit('admin_receive_message', formattedMessage)
                } else {
                    console.log(`⚠️ Admin is offline, message saved to DB only`)
                }

                // 🔥 FIX: Confirm to user that message was processed
                socket.emit('message_sent', { 
                    ...formattedMessage, 
                    status: 'sent',
                    adminOnline: !!adminInfo 
                })

            } catch (error) {
                console.error('Error saving user message:', error)
                socket.emit('message_error', { 
                    error: 'Failed to send message',
                    details: error.message 
                })
            }
        })

        // 🔹 User disconnect
        socket.on("disconnect", () => {
            console.log(`👤 User ${socket.userId} disconnected`)
            onlineUsers.delete(socket.userId.toString())
            userRooms.delete(socket.id)
            
            // Notify admin about user going offline
            const adminInfo = onlineAdmins.get('admin')
            if (adminInfo) {
                io.to(adminInfo.socketId).emit('user_offline', socket.userId.toString())
                // Also update the online users list
                io.to(adminInfo.socketId).emit('online_users', Array.from(onlineUsers.keys()))
            }
        })
    }

    // =================== LEGACY SUPPORT (for existing support system) ===================
    // Support staff join để hỗ trợ
    socket.on("join_as_support", (supportData) => {
        const { supportId, supportName } = supportData
        onlineUsers.set(socket.id, { 
            userId: supportId, 
            userName: supportName, 
            socketId: socket.id,
            role: "support" 
        })
        
        console.log(`Support ${supportName} is online`)
    })

    // Support reply
    socket.on("support_reply", (data) => {
        const { userId, message } = data
        const supportInfo = onlineUsers.get(socket.id)
        
        if (!supportInfo || supportInfo.role !== "support") {
            socket.emit("error", "Unauthorized")
            return
        }

        const roomId = `support_${userId}`
        socket.join(roomId)
        
        const messageData = {
            text: message,
            sender: supportInfo.userName,
            senderId: supportInfo.userId,
            time: new Date().toLocaleTimeString('vi-VN', {
                hour: '2-digit',
                minute: '2-digit'
            }),
            timestamp: new Date(),
            type: "support",
            senderType: "support"
        }

        io.to(roomId).emit("receive_message", messageData)
        console.log(`Support replied in room ${roomId}:`, messageData)
    })

    // =================== GENERAL EVENTS ===================
    socket.on('get_online_users', () => {
        if (socket.userType === 'admin') {
            socket.emit('online_users', Array.from(onlineUsers.keys()))
        }
    })

    socket.on('ping', () => {
        socket.emit('pong')
    })

    // =================== ERROR HANDLING ===================
    socket.on('error', (error) => {
        console.error('Socket error:', error)
    })
})

// =================== SERVER ERROR HANDLING ===================
io.engine.on("connection_error", (err) => {
    console.log('Connection error:', err.req)
    console.log('Error code:', err.code)
    console.log('Error message:', err.message)
    console.log('Error context:', err.context)
})

server.listen(port, () => {
    console.log("Server Started on", port)
    console.log("Socket.IO server is ready for connections")
})