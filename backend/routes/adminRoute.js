import express from 'express'
import { 
    addDoctor,
    adminDashboard,
    allDoctors,
    appointmentCancel,
    appointmentsAdmin,
    loginAdmin,
    getChatPatients,
    getChatHistory,
    sendAdminMessage,
    markMessagesAsRead
} from '../controllers/adminController.js'
import upload from '../middlewares/multer.js'
import authAdmin from '../middlewares/authAdmin.js'
import { changeAvailablity } from '../controllers/doctorController.js'

const adminRouter = express.Router()

// Existing routes
adminRouter.post('/add-doctor', authAdmin, upload.single('image'), addDoctor)
adminRouter.post('/login', loginAdmin)
adminRouter.post('/all-doctors', authAdmin, allDoctors)
adminRouter.post('/change-availability', authAdmin, changeAvailablity)
adminRouter.get('/appointments', authAdmin, appointmentsAdmin)
adminRouter.post('/cancel-appointment', authAdmin, appointmentCancel)
adminRouter.get('/dashboard', authAdmin, adminDashboard)

// New chat routes
adminRouter.get('/chat-patients', authAdmin, getChatPatients)
adminRouter.get('/chat-history/:patientId', authAdmin, getChatHistory)
adminRouter.post('/send-message', authAdmin, sendAdminMessage)
adminRouter.post('/mark-messages-read', authAdmin, markMessagesAsRead)

export default adminRouter