import validator from "validator" 
import bcrypt from 'bcrypt'
import { v2 as cloudinary } from "cloudinary"
import doctorModel from "../models/doctorModel.js"
import jwt from 'jsonwebtoken'
import appointmentModel from "../models/appointmentModel.js"
import userModel from "../models/userModel.js"
// Thêm các import cần thiết vào đầu file adminController.js
import chatModel from "../models/chatModel.js"

// API for adding doctor
const addDoctor = async (req,res) => {

    try {

        const { name, email, password, speciality, degree, experience, about, fees, address } = req.body
        const imageFile = req.file

        //checking for all data to add doctor
        if(!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address) {
            return res.json({success:false,message:"Missing Details"})
        }

        //validating email format
        if (!validator.isEmail(email)) {
            return res.json({success:false,message:"Please enter a valid email"})
        }

        //validating strong password
        if(password.length < 8) {
            return res.json({success:false,message:"Please enter a strong password"})
        } 

        // hashing doctor password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        // upload image to cloudinary
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, {resource_type:"image"})
        const imageUrl = imageUpload.secure_url

        const doctorData = {
            name,
            email,
            image: imageUrl,
            password: hashedPassword,
            speciality,
            degree,
            experience,
            about,
            fees,
            address: JSON.parse(address),
            date: Date.now()
        }

        const existingDoctor = await doctorModel.findOne({ email });
        if (existingDoctor) {
            return res.json({ success: false, message: "Email already exists" });
        }

        const newDoctor = new doctorModel(doctorData)
        await newDoctor.save()

        res.json({success:true,message:"Doctor Added"})
        
    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
    }

}

// API for admin Login
const loginAdmin = async (req,res) => {
    try {

        const {email,password} = req.body

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD ) {

            const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.json({success:true,token})

        } else {
            res.json({success:false,message:"Thông tin đăng nhập không hợp lệ"})
        }
        
    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
    }
}

// API to get all doctors list for admin panel
const allDoctors = async (req,res) => {
    try {
        
        const doctors = await doctorModel.find({}).select('-password')
        res.json({success:true,doctors})

    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
    }
}

// API to get all appointments list with filtering and pagination
const appointmentsAdmin = async (req, res) => {

    try {
        const { 
            sortBy = 'newest', 
            status = 'all', 
            page = 1, 
            limit = 7,
            doctorId,
            startDate,
            endDate 
        } = req.query;

        // Build filter object
        let filter = {};
        
        // Status filter
        if (status === 'completed') {
            filter.isCompleted = true;
            filter.cancelled = { $ne: true };
        } else if (status === 'cancelled') {
            filter.cancelled = true;
        } else if (status === 'pending') {
            filter.isCompleted = { $ne: true };
            filter.cancelled = { $ne: true };
        }
        
        // Doctor filter
        if (doctorId) {
            filter.docId = doctorId;
        }
        
        // Date range filter
        if (startDate || endDate) {
            filter.slotDate = {};
            if (startDate) filter.slotDate.$gte = startDate;
            if (endDate) filter.slotDate.$lte = endDate;
        }

        // Build sort object
        let sort = {};
        switch (sortBy) {
            case 'newest':
                sort = { date: -1 }; // Mới nhất trước
                break;
            case 'oldest':
                sort = { date: 1 }; // Cũ nhất trước
                break;
            case 'upcoming':
                // Lịch hẹn sắp tới (theo ngày và giờ)
                sort = { slotDate: 1, slotTime: 1 };
                break;
            case 'recent_date':
                // Theo ngày hẹn gần nhất
                sort = { slotDate: -1 };
                break;
            case 'patient_name':
                // Sắp xếp theo tên bệnh nhân (cần populate)
                sort = { 'userData.name': 1 };
                break;
            default:
                sort = { date: -1 };
        }

        // Calculate pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);
        
        // Get appointments with pagination
        const appointments = await appointmentModel
            .find(filter)
            .populate('userId', 'name image dob')
            .populate('docId', 'name image speciality')
            .sort(sort)
            .skip(skip)
            .limit(parseInt(limit));

        // Get total count for pagination
        const totalAppointments = await appointmentModel.countDocuments(filter);
        const totalPages = Math.ceil(totalAppointments / parseInt(limit));
        const hasMore = page < totalPages;

        res.json({
            success: true,
            appointments,
            pagination: {
                currentPage: parseInt(page),
                totalPages,
                totalAppointments,
                hasMore,
                limit: parseInt(limit)
            }
        });

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }

}

// API for appointments cancellation
const appointmentCancel = async (req,res) => {

    try {
        
        //const userId = req.userId; // Lấy từ middleware đã gán
        const {appointmentId} = req.body

        const appointmentData = await appointmentModel.findById(appointmentId)

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



// API to get dashboard data for admin panel
const adminDashboard = async (req,res) => {

    try {

        const doctors = await doctorModel.find({})
        const users = await userModel.find({})
        const appointments = await appointmentModel.find({})

        const dashData = {
            doctors: doctors.length,
            appointments:appointments.length,
            patients: users.length,
            latestAppointments: appointments.reverse().slice(0,5)
        }

        res.json({success:true,dashData})

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API to get all patients who have chatted with admin
const getChatPatients = async (req, res) => {
    try {
        // Lấy tất cả chat có liên quan đến admin
        const chats = await chatModel.find({
            $or: [
                { senderId: "admin" },
                { receiverId: "admin" }
            ]
        }).sort({ timestamp: -1 });

        const uniquePatients = [];
        const patientIds = new Set();

        for (const chat of chats) {
            const patientId = chat.senderId === "admin" ? chat.receiverId : chat.senderId;

            if (patientId !== "admin" && !patientIds.has(patientId)) {
                patientIds.add(patientId);
                
                // Lấy thông tin user từ userModel
                const patientInfo = await userModel.findById(patientId).select('name email phone image');
                
                if (patientInfo) {
                    uniquePatients.push({
                        _id: patientInfo._id,
                        name: patientInfo.name,
                        email: patientInfo.email,
                        phone: patientInfo.phone || "",
                        image: patientInfo.image || "",
                        lastMessage: chat.message,
                        lastMessageTime: chat.timestamp
                    });
                }
            }
        }
        
        console.log("Found patients:", uniquePatients);
        
        res.json({
            success: true,
            patients: uniquePatients
        });

    } catch (error) {
        console.log("getChatPatients error:", error);
        res.json({ success: false, message: error.message });
    }
};


// API to get chat history between admin and a specific patient
const getChatHistory = async (req, res) => {
    try {
        const { patientId } = req.params;
        
        if (!patientId) {
            return res.json({ success: false, message: "Patient ID is required" });
        }

        const messages = await chatModel.find({
            $or: [
                { senderId: "admin", receiverId: patientId.toString() },
                { senderId: patientId.toString(), receiverId: "admin" }
            ]
            }).sort({ timestamp: 1 });


        // Format trả về FE
        const formattedMessages = messages.map(msg => ({
            senderId: msg.senderId,
            receiverId: msg.receiverId,
            text: msg.message,
            time: new Date(msg.timestamp).toLocaleTimeString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit"
            }),
            timestamp: msg.timestamp,
            senderType: msg.senderId === "admin" ? "admin" : "patient"
        }));

        res.json({
            success: true,
            messages: formattedMessages
        });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};



// API to send message from admin to patient
const sendAdminMessage = async (req, res) => {
    try {
        const { patientId, message } = req.body;
        
        if (!patientId || !message) {
            return res.json({ success: false, message: "Patient ID and message are required" });
        }

        // 🔥 SỬA LỖI: Tạo tin nhắn mới với đúng tên biến
        const newMessage = new chatModel({
            senderType: "admin",
            senderId: "admin",
            receiverType: "user",
            receiverId: patientId.toString(),
            message: message.trim(), // ✅ Sửa từ text thành message
            timestamp: new Date(),
            isRead: false
        });
        
        await newMessage.save(); // ✅ Thêm await
        console.log("Admin message saved successfully");

        res.json({
            success: true,
            message: "Message sent successfully",
            data: {
                senderId: 'admin',
                receiverId: patientId,
                text: message.trim(),
                time: new Date().toLocaleTimeString('vi-VN', {
                    hour: '2-digit',
                    minute: '2-digit'
                }),
                timestamp: new Date(),
                senderType: 'admin'
            }
        });

    } catch (error) {
        console.log("sendAdminMessage error:", error)
        res.json({ success: false, message: error.message })
    }
}

// API to mark messages as read
const markMessagesAsRead = async (req, res) => {
    try {
        const { patientId } = req.body;
        
        if (!patientId) {
            return res.json({ success: false, message: "Patient ID is required" });
        }

        // Đánh dấu tất cả tin nhắn từ bệnh nhân này đã đọc
        await chatModel.updateMany(
            { senderId: patientId, receiverId: 'admin', isRead: false },
            { isRead: true }
        );

        res.json({
            success: true,
            message: "Messages marked as read"
        });

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}


export {addDoctor,loginAdmin,allDoctors,appointmentsAdmin,appointmentCancel,adminDashboard,
        getChatPatients,
    getChatHistory,
    sendAdminMessage,
    markMessagesAsRead        
}