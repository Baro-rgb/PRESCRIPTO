import doctorModel from "../models/doctorModel.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import appointmentModel from "../models/appointmentModel.js";
import {v2 as cloudinary} from 'cloudinary'

const changeAvailablity = async (req,res) => {
    try {
        
        const {docId} = req.body

        const docData = await doctorModel.findById(docId)
        await doctorModel.findByIdAndUpdate(docId,{available: !docData.available })
        res.json({success:true, message: 'Tính khả dụng đã thay đổi'})

    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
    }
}

const doctorList = async (req,res) => {
    try {
        
        const doctors = await doctorModel.find({}).select(['-password','-email'])

        res.json({success:true,doctors})

    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
    }
}

// API for doctor login - với debug logs
const loginDoctor = async (req,res) => {

    try {
        
        const { email, password } = req.body
        console.log('Login attempt for email:', email); // Debug log
        
        const doctor = await doctorModel.findOne({email})
        console.log('Doctor found:', doctor ? 'Yes' : 'No'); // Debug log
        
        if (!doctor) {
            console.log('Doctor not found in database'); // Debug log
            return res.json({success:false,message:'Thông tin đăng nhập không hợp lệ'})
        }

        console.log('Comparing passwords...'); // Debug log
        const isMatch = await bcrypt.compare(password, doctor.password)
        console.log('Password match:', isMatch); // Debug log

        if (isMatch) {
            console.log('Login successful, generating token...'); // Debug log
            const token = jwt.sign({id:doctor._id},process.env.JWT_SECRET)
            console.log('Token generated:', token); // Debug log
            res.json({success:true,token})
        } else {
            console.log('Password mismatch'); // Debug log
            res.json({success:false,message:'Thông tin đăng nhập không hợp lệ'})
        }

    } catch (error) {
        console.log('Login error:', error);
        res.json({success:false,message:error.message})
    }

}

// API to get doctor appointments for doctor panel
const appointmentsDoctor = async (req, res) => {
    try {

        const docId = req.docId   // lấy từ middleware
        const appointments = await appointmentModel.find({ docId })

        res.json({ success: true, appointments})

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

// API to mark appointment completed for doctor panel
const appointmentComplete = async (req,res) => {

    try {
        
        const docId = req.docId   // lấy từ middleware
        const { appointmentId } = req.body

        const appointmentData = await appointmentModel.findById(appointmentId)

        if (appointmentData && appointmentData.docId === docId) {

            await appointmentModel.findByIdAndUpdate(appointmentId, {isCompleted: true})
            return res.json({success:true,message:'Cuộc hẹn đã hoàn thành'})

        } else {
            return res.json({success:false,message:'Đánh dấu thất bại'})
        }

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }

}

// API to cancel appointment for doctor panel
const appointmentCancel = async (req,res) => {

    try {
        
        const docId = req.docId   // lấy từ middleware
        const { appointmentId } = req.body

        const appointmentData = await appointmentModel.findById(appointmentId)

        if (appointmentData && appointmentData.docId === docId) {
            await appointmentModel.findByIdAndUpdate(appointmentId, {cancelled: true})
            return res.json({success:true,message:'Cuộc hẹn đã bị hủy'})
        } else {
            return res.json({success:false,message:'Hủy lịch không thành công'})
        }

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }

}

// API to get dashboard data for doctor panel
const doctorDashboard = async (req,res) => {
    try {

        const docId = req.docId   // lấy từ middleware
        
        const appointments = await appointmentModel.find({docId})
        
        let earnings = 0
        
        appointments.map((item)=>{
            if (item.isCompleted || item.payment) {
                earnings += item.amount
            }
        })
        
        let patients = []

        appointments.map((item)=>{
            if (!patients.includes(item.userId)) {
                patients.push(item.userId)
            }
        })

        const dashData = {
            earnings,
            appointments: appointments.length,
            patients: patients.length,
            latestAppointments: appointments.reverse().slice(0,5)
        }

        res.json({success:true, dashData})
        
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

// API to get doctor profile for Doctor panel
const doctorProfile = async (req,res) => {
    try {

        const docId = req.docId   // lấy từ middleware
        const profileData = await doctorModel.findById(docId).select('-password')
        
        res.json({success:true, profileData})
        
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

// API to update doctor profile data from Doctor Panel
const updateDoctorProfile = async (req, res) => {
    try {
        const docId = req.docId; // lấy từ middleware
        const {
            fees, 
            address, 
            available, 
            about, 
            name, 
            degree, 
            speciality, 
            experience
        } = req.body;

        const imageFile = req.file;

        // Nếu address gửi lên dạng string thì parse sang object
        const parsedAddress = typeof address === 'string' ? JSON.parse(address) : address;

        // Cập nhật thông tin text trước
        await doctorModel.findByIdAndUpdate(docId, {
            fees, 
            address: parsedAddress, 
            available, 
            about, 
            name, 
            degree, 
            speciality, 
            experience
        });

        // Nếu có file ảnh mới thì upload cloudinary
        if (imageFile) {
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
                resource_type: 'image'
            });
            const imageURL = imageUpload.secure_url;

            await doctorModel.findByIdAndUpdate(docId, { image: imageURL });
        }

        res.json({ success: true, message: "Doctor profile updated successfully" });

    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};


export {changeAvailablity,doctorList,loginDoctor,appointmentsDoctor,appointmentCancel,appointmentComplete,doctorDashboard,doctorProfile,updateDoctorProfile}