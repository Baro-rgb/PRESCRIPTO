import express from 'express'
import { registerUser,loginUser, getProfile, updateProfile, bookAppointment, listAppointment, cancelAppointment, paymentRazorpay, verifyRazorpay, getChatProfile, getUserChatHistory, markAdminMessagesAsRead, sendUserMessage } from '../controllers/userController.js'
import authUser from '../middlewares/authUser.js'
import upload from '../middlewares/multer.js'
import { markMessagesAsRead, sendAdminMessage } from '../controllers/adminController.js'

const userRouter = express.Router()

userRouter.post('/register',registerUser)
userRouter.post('/login',loginUser)

userRouter.get('/get-profile',authUser,getProfile)
userRouter.post('/update-profile',authUser,upload.single('image'),updateProfile);
userRouter.post('/book-appointment',authUser,bookAppointment)
userRouter.get('/appointments',authUser,listAppointment)
userRouter.post('/cancel-appointment',authUser,cancelAppointment)
userRouter.post('/payment-razorpay',authUser,paymentRazorpay)
userRouter.post('/verifyRazorpay',authUser,verifyRazorpay)
userRouter.get('/chat-profile', authUser, getChatProfile)

// Chat routes
userRouter.post('/send-message', authUser, sendUserMessage);
userRouter.get('/chat-history', authUser, getUserChatHistory);  
userRouter.put('/mark-admin-messages-read', authUser, markMessagesAsRead);


export default userRouter