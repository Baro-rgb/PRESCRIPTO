import validator from "validator";
import bcrypt from 'bcrypt'
import userModel from '../models/userModel.js'
import jwt from 'jsonwebtoken'
import {v2 as cloudinary} from 'cloudinary'
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import razorpay from 'razorpay'
import chatModel from "../models/chatModel.js"

// API to register user
const registerUser = async (req, res) => {
    try {

        const { name, email, password } = req.body;

        if (!name || !password || !email) {
            return res.json({ success: false, message: "Thiếu chi tiết" });
        }

        //validating email format
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Nhập email hợp lệ" });
        }

         // Kiểm tra email đã tồn tại
        const existingUser = await userModel.findOne({email})
        if (existingUser) {
            return res.json({success:false,message:"Email đã được sử dụng"})
        }

        //validating strong password
        if (password.length < 8) {
            return res.json({success:false,message:"Nhập một mật khẩu mạnh"})
        }

        //hashing user password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)

        const userData = {
            name,
            email,
            password : hashedPassword
        }

        const newUser = new userModel(userData)
        const user = await newUser.save()

        const token = jwt.sign({id:user._id}, process.env.JWT_SECRET )

        res.json({success:true,token})

    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
    }
}

//API for user login
const loginUser = async (req,res) => {
    try {
        
        const {email,password} = req.body
        const user = await userModel.findOne({email})

        if (!user) {
            return res.json({success:false,message:'Người dùng không tồn tại'})
        }

        const isMatch = await bcrypt.compare(password,user.password)

        if (isMatch) {
            const token = jwt.sign({id:user._id}, process.env.JWT_SECRET)
            res.json({success:true,token})
        } else {
            res.json({success:false,message:"Thông tin đăng nhập không hợp lệ"})
        }

    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
    }
}

// Thay thế getProfile function trong userController.js

const getProfile = async (req, res) => {
    try {
        console.log("🔍 getProfile called");
        console.log("- req.userId:", req.userId);
        console.log("- typeof req.userId:", typeof req.userId);
        
        const userId = req.userId;
        
        if (!userId) {
            console.log("❌ No userId found");
            return res.json({ success: false, message: 'UserId not found' });
        }
        
        console.log("📞 Finding user with ID:", userId);
        const userData = await userModel.findById(userId).select('-password');
        console.log("👤 User found:", userData ? "Yes" : "No");
        
        if (!userData) {
            console.log("❌ User not found in database");
            return res.json({ success: false, message: 'User not found' });
        }
        
        console.log("✅ Returning user data");
        res.json({ success: true, userData });
    } catch (error) {
        console.log("❌ getProfile error:", error);
        res.json({ success: false, message: error.message });
    }
};

// API to update user profile
const updateProfile = async (req,res) => {
    try {
        
        const {name, phone, address, dob, gender } = req.body
        const imageFile = req.file
        const userId = req.userId;
        if (!name || !phone || !dob || !gender) {
            return res.json({success:false,message:"Dữ liệu bị thiếu"})
        }

        await userModel.findByIdAndUpdate(userId,{name,phone,address:JSON.parse(address),dob,gender})

        if (imageFile) {
            
            //upload image to cloudinary
            const imageUpload = await cloudinary.uploader.upload(imageFile.path,{resource_type:'image'})
            const imageURL = imageUpload.secure_url

            await userModel.findByIdAndUpdate(userId,{image:imageURL})
        }

        res.json({success:true,message:"Hồ sơ đã được cập nhật"})

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// API to book appointment
const bookAppointment = async (req,res) => {
    
    try {
        
        // Lấy userId từ middleware authUser
        const userId = req.userId;
        const { docId, slotDate, slotTime } = req.body;

        const docData = await doctorModel.findById(docId).select('-password')

        if (!docData.available) {
            return res.json({success:false,message:'Bác sĩ không có mặt'})
        }

        let slots_booked = docData.slots_booked

        // checking for slot availability
        if (slots_booked[slotDate]) {
            if (slots_booked[slotDate].includes(slotTime)) {
                return res.json({success:false,message:'Lịch hẹn không có sẵn'})
            } else {
                slots_booked[slotDate].push(slotTime)
            }
        } else {
            slots_booked[slotDate] = []
            slots_booked[slotDate].push(slotTime)
        }

        const userData = await userModel.findById(userId).select('-password')

        delete docData.slots_booked

        const appointmentData = {
            userId,
            docId,
            userData,
            docData,
            amount:docData.fees,
            slotTime,
            slotDate,
            date: Date.now()
        }

        const newAppointment = new appointmentModel(appointmentData)
        await newAppointment.save()

        //save new slots data in docData
        await doctorModel.findByIdAndUpdate(docId,{slots_booked})

        res.json({success:true,message:'Lịch hẹn đã được đặt'})

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }

}

// API to get user appointments for frontend my-appointments page
const listAppointment = async (req,res) => {

    try {

        //const {userId} = req.body
        const userId = req.userId; // Lấy từ middleware đã gán

        const appointments = await appointmentModel.find({userId})

        res.json({success:true,appointments})

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API to cancel appointment
const cancelAppointment = async (req,res) => {

    try {
        
        const userId = req.userId; // Lấy từ middleware đã gán
        const {appointmentId} = req.body

        const appointmentData = await appointmentModel.findById(appointmentId)

        // verify appointment user
        if (appointmentData.userId !== userId) {
            return res.json({success:false,message:'Unauthorized action'})
        }

        await appointmentModel.findByIdAndUpdate(appointmentId, {cancelled:true})

        // releasing doctor slot

        const {docId, slotDate, slotTime} = appointmentData

        const doctorData = await doctorModel.findById(docId)

        let slots_booked = doctorData.slots_booked

        slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime)

        await doctorModel.findByIdAndUpdate(docId, {slots_booked})

        res.json({success:true, message:'Lịch hẹn đã được hủy'})

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
})

// API to make payment of appointment using razorpay
const paymentRazorpay = async (req, res) => {

    try {
        
        const { appointmentId } = req.body
        const appointmentData = await appointmentModel.findById(appointmentId)

        if (!appointmentData || appointmentData.cancelled) {
            return res.json({success:false,message:"Cuộc hẹn đã hủy hoặc không tìm thấy"})
        }

        // creating options for razorpay payment
        const options = {
            amount: appointmentData.amount * 100,
            currency: process.env.CURRENCY,
            receipt: appointmentId,
        }

        // creation of an order
        const order = await razorpayInstance.orders.create(options)

        res.json({success:true,order})

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to verify payment of razorpay
const verifyRazorpay = async (req, res) => {
    try {

        const {razorpay_order_id} = req.body
        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)

        if (orderInfo.status === 'paid') {
            await appointmentModel.findByIdAndUpdate(orderInfo.receipt,{payment:true})
            res.json({success:true,message:"Thanh toán thành công"})
        } else {
            res.json({success:false,message:"Thanh toán thất bại"})
        }

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get user info for chat
const getChatProfile = async (req, res) => {
    try {
        const userId = req.userId; // Từ authUser middleware
        const userData = await userModel.findById(userId).select('name email phone image');
        
        if (!userData) {
            return res.json({ success: false, message: 'User not found' });
        }
        
        res.json({ 
            success: true, 
            chatUser: {
                id: userData._id,
                name: userData.name,
                email: userData.email,
                phone: userData.phone,
                image: userData.image
            }
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};


// API to send message from user to admin
const sendUserMessage = async (req, res) => {
    try {
        console.log("sendUserMessage called");
        console.log("req.userId:", req.userId);
        console.log("req.body:", req.body);
        
        const userId = req.userId; // Từ authUser middleware
        const { message } = req.body;
        
        // Validation
        if (!userId) {
            console.log("No userId found");
            return res.json({ success: false, message: "User not authenticated" });
        }
        
        if (!message || !message.trim()) {
            console.log("No message provided");
            return res.json({ success: false, message: "Message is required" });
        }

        console.log("Creating new chat message...");
        
        // 🔥 SỬA LỖI: Sử dụng đúng tên biến
        const newMessage = new chatModel({
            senderType: "user",
            senderId: userId.toString(), // ✅ Sửa từ user._id thành userId
            receiverType: "admin",
            receiverId: "admin",
            message: message.trim(), // ✅ Sửa từ text thành message
            timestamp: new Date(),
            isRead: false
        });

        await newMessage.save(); // ✅ Thêm await
        console.log("Message saved successfully");

        const responseData = {
            senderId: userId.toString(),
            receiverId: 'admin',
            text: message.trim(),
            time: new Date().toLocaleTimeString('vi-VN', {
                hour: '2-digit',
                minute: '2-digit'
            }),
            timestamp: new Date(),
            senderType: 'user'
        };

        res.json({
            success: true,
            message: "Message sent successfully", 
            data: responseData
        });

    } catch (error) {
        console.log("sendUserMessage error:", error);
        res.json({ success: false, message: error.message });
    }
};

// API to get chat history between user and admin
const getUserChatHistory = async (req, res) => {
    try {
        const userId = req.userId;
        
        if (!userId) {
            return res.json({ success: false, message: "User not authenticated" });
        }
        
        console.log("Getting chat history for user:", userId);
        
        const messages = await chatModel.find({
            $or: [
                { senderId: userId.toString(), receiverId: 'admin' },
                { senderId: 'admin', receiverId: userId.toString() }
            ]
        })
        .sort({ timestamp: 1 })
        .limit(100);

        const formattedMessages = messages.map(msg => ({
            senderId: msg.senderId,
            receiverId: msg.receiverId,
            text: msg.message,
            time: new Date(msg.timestamp).toLocaleTimeString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit"
            }),
            timestamp: msg.timestamp,
            senderType: msg.senderId === 'admin' ? 'admin' : 'user'
        }));

        res.json({
            success: true,
            messages: formattedMessages
        });

    } catch (error) {
        console.log("getUserChatHistory error:", error);
        res.json({ success: false, message: error.message });
    }
};

// API to mark admin messages as read
const markAdminMessagesAsRead = async (req, res) => {
    try {
        const userId = req.userId;
        
        if (!userId) {
            return res.json({ success: false, message: "User not authenticated" });
        }
        
        await chatModel.updateMany(
            { senderId: 'admin', receiverId: userId.toString(), isRead: false },
            { isRead: true }
        );

        res.json({
            success: true,
            message: "Admin messages marked as read"
        });

    } catch (error) {
        console.log("markAdminMessagesAsRead error:", error);
        res.json({ success: false, message: error.message });
    }
};

export {registerUser, loginUser, 
        getProfile, updateProfile, 
        bookAppointment, listAppointment, cancelAppointment, 
        paymentRazorpay,verifyRazorpay, 
        getChatProfile, sendUserMessage, getUserChatHistory, markAdminMessagesAsRead
    } 