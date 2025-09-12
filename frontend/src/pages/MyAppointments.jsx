import React, { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const MyAppointments = () => {

  const { backendUrl, token, getDoctorsData, currencySymbol} = useContext(AppContext)

  const [appointments, setAppointments] = useState([])
  const [filter, setFilter] = useState('all')
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [appointmentToCancel, setAppointmentToCancel] = useState(null)
  
  const months = ["","Th1", "Th2", "Th3", "Th4", "Th5", "Th6", "Th7", "Th8", "Th9", "Th10", "Th11", "Th12"]

  // Map chuyên khoa từ English -> Tiếng Việt
  const specialityMapping = {
    "General physician": "Bác sĩ đa khoa",
    "Gynecologist": "Sản phụ khoa", 
    "Dermatologist": "Da liễu",
    "Pediatricians": "Nhi khoa",
    "Neurologist": "Thần kinh",
    "Gastroenterologist": "Tiêu hóa"
  }

  const specialityIcons = {
    "General physician": "👨‍⚕️",
    "Gynecologist": "👩‍⚕️", 
    "Dermatologist": "🩺",
    "Pediatricians": "👶",
    "Neurologist": "🧠",
    "Gastroenterologist": "🫁"
  }

  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split('_')
    return dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2]
  }

  const getStatusInfo = (item) => {
    if (item.cancelled) {
      return { status: 'cancelled', text: 'Đã hủy', color: 'red', icon: '❌' }
    } else if (item.isCompleted) {
      return { status: 'completed', text: 'Hoàn thành', color: 'green', icon: '✅' }
    } else if (item.payment) {
      return { status: 'paid', text: 'Đã thanh toán', color: 'blue', icon: '💳' }
    } else {
      return { status: 'pending', text: 'Chờ thanh toán', color: 'yellow', icon: '⏳' }
    }
  }

  const getFilteredAppointments = () => {
    if (filter === 'all') return appointments
    return appointments.filter(item => {
      const status = getStatusInfo(item).status
      return status === filter
    })
  }

  const navigate = useNavigate()

  const getUserAppointments = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/user/appointments', { headers: { token } })

      if (data.success) {
        setAppointments(data.appointments.reverse())
        console.log(data.appointments);
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }
  }

  const cancelAppointment = async () => {
    if (!appointmentToCancel) return

    try {
      const { data } = await axios.post(
        backendUrl + '/api/user/cancel-appointment',
        { appointmentId: appointmentToCancel },
        { headers: { token } }
      )
      if (data.success) {
        toast.success(data.message)
        getUserAppointments()
        getDoctorsData()
        setShowCancelModal(false)
        setAppointmentToCancel(null)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }
  }

  const initPay = (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: 'Thanh toán lịch hẹn',
      description: 'Thanh toán lịch hẹn',
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        console.log(response)

        try {
          const { data } = await axios(backendUrl + '/api/user/verifyRazorpay', response, { headers: { token } })
          if (data.success) {
            getUserAppointments()
            navigate('/my-appointments')
          }
        } catch (error) {
          console.log(error);
          toast.error(error.message)
        }
      }
    }

    const rzp = new window.Razorpay(options)
    rzp.open()
  }

  const appointmentRazorpay = async (appointmentId) => {
    const { data } = await axios.post(
      backendUrl + '/api/user/payment-razorpay',
      { appointmentId },
      { headers: { token } }
    )
    if (data.success) {
      initPay(data.order)
    }
  }

  useEffect(() => {
    if (token) {
      getUserAppointments()
    }
  }, [token])

  const filteredAppointments = getFilteredAppointments()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="w-full px-4 py-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Lịch hẹn của tôi</h1>
            <p className="text-gray-600">Quản lý và theo dõi các lịch khám của bạn</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Tất cả', count: appointments.length, color: 'blue', filter: 'all' },
              { label: 'Chờ thanh toán', count: appointments.filter(item => !item.payment && !item.cancelled && !item.isCompleted).length, color: 'yellow', filter: 'pending' },
              { label: 'Đã thanh toán', count: appointments.filter(item => item.payment && !item.cancelled && !item.isCompleted).length, color: 'green', filter: 'paid' },
              { label: 'Hoàn thành', count: appointments.filter(item => item.isCompleted).length, color: 'purple', filter: 'completed' }
            ].map((stat) => (
              <div
                key={stat.filter}
                onClick={() => setFilter(stat.filter)}
                className={`bg-white rounded-xl p-4 shadow-lg cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                  filter === stat.filter ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                }`}
              >
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{stat.count}</p>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Filter Tabs */}
          <div className="bg-white rounded-xl shadow-lg p-2 mb-8">
            <div className="flex flex-wrap gap-2">
              {[
                { key: 'all', label: 'Tất cả', icon: '📋' },
                { key: 'pending', label: 'Chờ thanh toán', icon: '⏳' },
                { key: 'paid', label: 'Đã thanh toán', icon: '💳' },
                { key: 'completed', label: 'Hoàn thành', icon: '✅' },
                { key: 'cancelled', label: 'Đã hủy', icon: '❌' }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    filter === tab.key
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Appointments List */}
          {filteredAppointments.length > 0 ? (
            <div className="space-y-6">
              {filteredAppointments.map((item, index) => {
                const statusInfo = getStatusInfo(item)
                
                return (
                  <div key={index} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                    <div className="p-6">
                      <div className="flex flex-col lg:flex-row gap-6">
                        
                        {/* Doctor Image */}
                        <div className="flex-shrink-0">
                          <img 
                            className="w-24 h-24 lg:w-32 lg:h-32 rounded-xl object-cover shadow-md" 
                            src={item.docData.image} 
                            alt={item.docData.name}
                          />
                        </div>

                        {/* Doctor Info */}
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
                            <div>
                              <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                                {item.docData.name}
                                <span className="text-lg">
                                  {specialityIcons[item.docData.speciality] || '👨‍⚕️'}
                                </span>
                              </h3>
                              <p className="text-blue-600 font-medium mb-2">
                                {specialityMapping[item.docData.speciality] || item.docData.speciality}
                              </p>
                            </div>
                            
                            {/* Status Badge */}
                            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
                              statusInfo.color === 'red' ? 'bg-red-100 text-red-700' :
                              statusInfo.color === 'green' ? 'bg-green-100 text-green-700' :
                              statusInfo.color === 'blue' ? 'bg-blue-100 text-blue-700' :
                              'bg-yellow-100 text-yellow-700'
                            }`}>
                              <span>{statusInfo.icon}</span>
                              {statusInfo.text}
                            </div>
                          </div>

                          {/* Address */}
                          <div className="mb-4">
                            <div className="flex items-start gap-2 text-gray-600 mb-2">
                              <span className="text-lg">📍</span>
                              <div>
                                <p className="font-medium text-gray-700">Địa chỉ khám:</p>
                                <p className="text-sm">{item.docData.address.line1}</p>
                                <p className="text-sm">{item.docData.address.line2}</p>
                              </div>
                            </div>
                          </div>

                          {/* Date & Time */}
                          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mb-4">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">📅</span>
                              <div>
                                <p className="font-medium text-gray-700">Thời gian khám</p>
                                <p className="text-lg font-bold text-blue-600">
                                  {slotDateFormat(item.slotDate)} - {item.slotTime}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Fee */}
                          <div className="flex items-center gap-2 text-gray-600 mb-4">
                            <span className="text-lg">💰</span>
                            <span className="font-medium">Phí khám: </span>
                            <span className="font-bold text-green-600">{item.docData.fees} {currencySymbol}</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-3 lg:min-w-[200px]">
                          
                          {/* Paid Status */}
                          {!item.cancelled && item.payment && !item.isCompleted && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
                              <span className="text-blue-700 font-medium">✅ Đã thanh toán</span>
                            </div>
                          )}

                          {/* Payment Button */}
                          {!item.cancelled && !item.payment && !item.isCompleted && (
                            <button 
                              onClick={() => appointmentRazorpay(item._id)}
                              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-3 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
                            >
                              💳 Thanh toán ngay
                            </button>
                          )}

                          {/* Cancel Button */}
                          {!item.cancelled && !item.isCompleted && (
                            <button 
                              onClick={() => {
                                setAppointmentToCancel(item._id)
                                setShowCancelModal(true)
                              }}
                              className="bg-white border-2 border-red-300 hover:bg-red-500 hover:border-red-500 text-red-600 hover:text-white px-4 py-3 rounded-lg font-medium transition-all duration-300"
                            >
                              ❌ Hủy lịch hẹn
                            </button>
                          )}

                          {/* Reschedule Button for paid appointments */}
                          {!item.cancelled && item.payment && !item.isCompleted && (
                            <button 
                              onClick={() => navigate(`/appointment/${item.docData._id}`)}
                              className="bg-blue-50 border-2 border-blue-300 hover:bg-blue-500 hover:border-blue-500 text-blue-600 hover:text-white px-4 py-3 rounded-lg font-medium transition-all duration-300"
                            >
                              📅 Đổi lịch khám
                            </button>
                          )}

                          {/* Contact Doctor */}
                          <button className="bg-gray-50 border-2 border-gray-300 hover:bg-gray-500 hover:border-gray-500 text-gray-600 hover:text-white px-4 py-3 rounded-lg font-medium transition-all duration-300">
                            📞 Liên hệ bác sĩ
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            /* Empty State */
            <div className="text-center py-16">
              <div className="w-32 h-32 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-6xl">📅</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {filter === 'all' ? 'Chưa có lịch hẹn nào' : 'Không có lịch hẹn trong mục này'}
              </h3>
              <p className="text-gray-600 mb-6">
                {filter === 'all' 
                  ? 'Hãy đặt lịch khám với bác sĩ yêu thích của bạn' 
                  : 'Thử chọn mục khác hoặc đặt lịch hẹn mới'
                }
              </p>
              <button
                onClick={() => navigate('/doctors')}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl transition-colors duration-300"
              >
                Đặt lịch khám ngay
              </button>
            </div>
          )}

          {/* Cancel Confirmation Modal */}
          {showCancelModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-3xl">⚠️</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Xác nhận hủy lịch hẹn</h3>
                  <p className="text-gray-600 mb-6">
                    Bạn có chắc chắn muốn hủy lịch hẹn này? Hành động này không thể hoàn tác.
                  </p>
                  <div className="flex gap-4">
                    <button
                      onClick={() => {
                        setShowCancelModal(false)
                        setAppointmentToCancel(null)
                      }}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors duration-300"
                    >
                      Giữ lại
                    </button>
                    <button
                      onClick={cancelAppointment}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-300"
                    >
                      Hủy lịch hẹn
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MyAppointments