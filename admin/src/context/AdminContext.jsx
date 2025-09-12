import { createContext, useState } from "react";
import axios from 'axios'
import { toast } from "react-toastify";

export const AdminContext = createContext()

const AdminContextProvider = (props) => {

    const [aToken,setAToken] = useState(localStorage.getItem('aToken')?localStorage.getItem('aToken'):'')
    const [doctors,setDoctors] = useState([])
    const [appointments, setAppointments] = useState([])
    const [dashData, setDashData] = useState(false)
    
    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const getAllDoctors = async () => {
        try {
            
            const {data} = await axios.post(backendUrl + '/api/admin/all-doctors' , {} , {headers:{aToken}})
            if (data.success) {
                setDoctors(data.doctors)
                console.log(data.doctors);
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const changeAvailability = async (docId) => {
        try {
            
            const { data } = await axios.post(backendUrl + '/api/admin/change-availability', {docId},{headers:{aToken}})
            if (data.success) {
                toast.success (data.message)
                getAllDoctors()
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }
    }

    const getAllAppointments = async () => {

        try {
            
            const { data } = await axios.get(backendUrl + '/api/admin/appointments',{headers:{aToken}})

            if (data.success) {
                setAppointments(data.appointments)
                console.log(data.appointments);
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }

    }

    const cancelAppointment = async (appointmentId) => {
        try {
            
            const {data} = await axios.post(backendUrl+'/api/admin/cancel-appointment',{appointmentId},{headers:{aToken}})
            if (data.success) {
                toast.success(data.message)
                getAllAppointments()
            } else {
                toast.error(data.message)
            }
            
        } catch (error) {
            toast.error(error.message)
        }
    }

    const getDashData = async () => {

        try {
            
            const { data } = await axios.get(backendUrl + '/api/admin/dashboard',{headers:{aToken}})
            if (data.success) {
                setDashData(data.dashData)
                console.log(data.dashData);
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }

    }

    // =============== CHAT METHODS ===============
    const getChatPatients = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/admin/chat-patients', {
                headers: { aToken }
            })
            
            if (data.success) {
                return data.patients
            } else {
                toast.error(data.message)
                return []
            }
        } catch (error) {
            toast.error(error.message)
            return []
        }
    }

    const getChatHistory = async (patientId) => {
        try {
            const { data } = await axios.get(backendUrl + `/api/admin/chat-history/${patientId}`, {
                headers: { aToken }
            })
            
            if (data.success) {
                return data.messages
            } else {
                toast.error(data.message)
                return []
            }
        } catch (error) {
            toast.error(error.message)
            return []
        }
    }

    const sendAdminMessage = async (patientId, message) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/admin/send-message', {
                patientId,
                message
            }, {
                headers: { aToken }
            })
            
            if (data.success) {
                return data.data
            } else {
                toast.error(data.message)
                return null
            }
        } catch (error) {
            toast.error(error.message)
            return null
        }
    }

    const markMessagesAsRead = async (patientId) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/admin/mark-messages-read', {
                patientId
            }, {
                headers: { aToken }
            })
            
            if (!data.success) {
                console.log('Failed to mark messages as read:', data.message)
            }
        } catch (error) {
            console.log('Error marking messages as read:', error.message)
        }
    }

    const value = {
        aToken,setAToken,
        backendUrl,doctors,
        getAllDoctors, changeAvailability,
        appointments, setAppointments,
        getAllAppointments,
        cancelAppointment,
        dashData,getDashData,
        // Chat methods
        getChatPatients,
        getChatHistory,
        sendAdminMessage,
        markMessagesAsRead
    }

    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    )

}

export default AdminContextProvider