import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import RelatedDoctors from '../components/RelatedDoctors'
import { toast } from 'react-toastify'
import axios from 'axios'

const Appointment = () => {

  // Map chuyển Year -> Năm
  const experienceMapping = {
    "Years":"Năm"
  }

  // Utils để dịch experience
  const translateExperience = (exp) => {
    if (!exp) return "";
    return exp.replace("Years", experienceMapping["Years"]);
  };

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

  const { docId } = useParams()
  const { doctors, currencySymbol, backendUrl, token, getDoctorsData } = useContext(AppContext)
  const daysOfWeek = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']
  const monthNames = ['Th1', 'Th2', 'Th3', 'Th4', 'Th5', 'Th6', 'Th7', 'Th8', 'Th9', 'Th10', 'Th11', 'Th12']

  const navigate = useNavigate()

  const [docInfo, setDocInfo] = useState(null)
  const [docSlots, setDocSlots] = useState([])
  const [slotIndex, setSlotIndex] = useState(0)
  const [slotTime, setSlotTIme] = useState('')

  const fetchDocInfo = async () => {
    const docInfo = doctors.find(doc => doc._id === docId)
    setDocInfo(docInfo)
    console.log(docInfo)
  }

  const getAvailableSlots = async () => {
    if (!docInfo || !docInfo.slots_booked) {
      console.warn("Thông tin bác sĩ chưa sẵn sàng hoặc không có slots_booked")
      return
    }

    setDocSlots([])

    let today = new Date()

    for (let i = 0; i < 7; i++) {
      let currentDate = new Date(today)
      currentDate.setDate(today.getDate() + i)

      let endTime = new Date()
      endTime.setDate(today.getDate() + i)
      endTime.setHours(21, 0, 0, 0)

      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10)
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0)
      } else {
        currentDate.setHours(10)
        currentDate.setMinutes(0)
      }

      let timeSlots = []

      while (currentDate < endTime) {
        let formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

        let day = currentDate.getDate()
        let month = currentDate.getMonth() + 1
        let year = currentDate.getFullYear()

        const slotDate = day + "_" + month + "_" + year
        const slotTime = formattedTime

        const isSlotAvailable = docInfo.slots_booked[slotDate] && docInfo.slots_booked[slotDate].includes(slotTime) ? false : true

        if (isSlotAvailable) {
          timeSlots.push({
            datetime: new Date(currentDate),
            time: formattedTime
          })
        }

        currentDate.setMinutes(currentDate.getMinutes() + 30)
      }

      setDocSlots(prev => ([...prev, timeSlots]))
    }
  }

  const bookAppointment = async () => {
    if (!token) {
      toast.warn('Vui lòng đăng nhập để đặt lịch hẹn')
      return navigate('/login')
    }

    if (!slotTime) {
      toast.warn('Vui lòng chọn khung giờ khám')
      return
    }

    try {
      const date = docSlots[slotIndex][0].datetime

      let day = date.getDate()
      let month = date.getMonth() + 1
      let year = date.getFullYear()

      const slotDate = day + "_" + month + "_" + year

      const { data } = await axios.post(
        backendUrl + '/api/user/book-appointment',
        { docId, slotDate, slotTime },
        { headers: { token } }
      )

      if (data.success) {
        toast.success(data.message)
        getDoctorsData()
        navigate('/my-appointments')
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchDocInfo()
  }, [doctors, docId])

  useEffect(() => {
    getAvailableSlots()
  }, [docInfo])

  useEffect(() => {
    console.log(docSlots)
  }, [docSlots])

  return docInfo && (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="w-full px-4 py-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
            <button onClick={() => navigate('/doctors')} className="hover:text-blue-600 transition-colors">
              Bác sĩ
            </button>
            <span>›</span>
            <span className="text-gray-900">{docInfo.name}</span>
          </div>

          {/*----- Thông tin bác sĩ --------*/}
          <div className='flex flex-col xl:flex-row gap-8 mb-12'>
            
            {/* Doctor Image */}
            <div className='xl:w-1/3'>
              <div className="relative">
                <img 
                  className='w-full h-96 xl:h-[500px] object-cover rounded-2xl shadow-2xl' 
                  src={docInfo.image} 
                  alt={docInfo.name} 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
                
                {/* Status Badge */}
                <div className="absolute top-6 left-6">
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm ${
                    docInfo.available 
                      ? 'bg-green-100/90 text-green-700 border border-green-200' 
                      : 'bg-red-100/90 text-red-700 border border-red-200'
                  }`}>
                    <div className={`w-3 h-3 rounded-full ${docInfo.available ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    {docInfo.available ? 'Đang nhận khám' : 'Tạm nghỉ'}
                  </div>
                </div>
              </div>
            </div>

            {/* Doctor Info */}
            <div className='xl:w-2/3'>
              <div className='bg-white rounded-2xl shadow-xl p-8'>
                
                {/*----- Tên, bằng cấp, kinh nghiệm --------*/}
                <div className="mb-6">
                  <div className='flex items-center gap-3 mb-3'>
                    <h1 className='text-3xl font-bold text-gray-900'>{docInfo.name}</h1>
                    <img className='w-6 h-6' src={assets.verified_icon} alt="verified" />
                  </div>
                  
                  <div className='flex flex-wrap items-center gap-3 mb-4'>
                    <div className="flex items-center gap-2 text-blue-600 font-medium">
                      <span className="text-xl">{specialityIcons[docInfo.speciality]}</span>
                      <span>{specialityMapping[docInfo.speciality] || docInfo.speciality}</span>
                    </div>
                    <span className='text-gray-400'>•</span>
                    <span className='text-gray-600'>{docInfo.degree}</span>
                    <div className='bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium'>
                      {translateExperience(docInfo.experience)}
                    </div>
                  </div>

                  {/* Rating and Experience */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
                    <div className="flex items-center gap-1">
                      <span>⭐⭐⭐⭐⭐</span>
                      <span className="font-medium">4.8 (127 đánh giá)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>👥</span>
                      <span>1,200+ bệnh nhân đã khám</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>📍</span>
                      <span>Bệnh viện Đa khoa Quốc tế</span>
                    </div>
                  </div>
                </div>

                {/*----- Giới thiệu bác sĩ --------*/}
                <div className="mb-6">
                  <div className='flex items-center gap-2 mb-3'>
                    <h3 className='text-lg font-semibold text-gray-900'>Giới thiệu</h3>
                    <img src={assets.info_icon} alt="info" className="w-4 h-4" />
                  </div>
                  <p className='text-gray-600 leading-relaxed'>{docInfo.about}</p>
                </div>

                {/* Fee */}
                <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className='text-gray-700 font-medium'>Phí khám bệnh</p>
                      <p className='text-2xl font-bold text-gray-900'>
                        {currencySymbol}{docInfo.fees}
                      </p>
                    </div>
                    <div className="text-4xl opacity-20">💰</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/*----- Khung giờ khám --------*/}
          <div className='bg-white rounded-2xl shadow-xl p-8'>
            <h2 className='text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3'>
              📅 Chọn lịch khám
            </h2>
            
            {/* Date Selection */}
            <div className="mb-8">
              <h3 className='text-lg font-semibold text-gray-700 mb-4'>Chọn ngày</h3>
              <div className='flex gap-4 overflow-x-auto pb-2'>
                {
                  docSlots.length && docSlots.map((item, index) => (
                    <div
                      onClick={() => {setSlotIndex(index); setSlotTIme('')}}
                      className={`flex flex-col items-center min-w-[100px] p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                        slotIndex === index 
                          ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg transform scale-105' 
                          : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200'
                      }`}
                      key={index}
                    >
                      <p className={`text-sm font-medium ${slotIndex === index ? 'text-blue-100' : 'text-gray-500'}`}>
                        {daysOfWeek[item[0] && item[0].datetime.getDay()]}
                      </p>
                      <p className="text-2xl font-bold my-1">
                        {item[0] && item[0].datetime.getDate()}
                      </p>
                      <p className={`text-xs ${slotIndex === index ? 'text-blue-100' : 'text-gray-500'}`}>
                        {item[0] && monthNames[item[0].datetime.getMonth()]}
                      </p>
                      <div className={`w-2 h-2 rounded-full mt-2 ${slotIndex === index ? 'bg-white' : 'bg-blue-400'}`}></div>
                    </div>
                  ))
                }
              </div>
            </div>

            {/* Time Selection */}
            <div className="mb-8">
              <h3 className='text-lg font-semibold text-gray-700 mb-4'>
                Chọn giờ khám
                {docSlots[slotIndex] && (
                  <span className="text-sm text-gray-500 font-normal ml-2">
                    ({docSlots[slotIndex].length} khung giờ có sẵn)
                  </span>
                )}
              </h3>
              
              {docSlots.length && docSlots[slotIndex] && docSlots[slotIndex].length > 0 ? (
                <div className='grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3'>
                  {docSlots[slotIndex].map((item, index) => (
                    <button
                      onClick={() => setSlotTIme(item.time)}
                      className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                        item.time === slotTime 
                          ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg transform scale-105' 
                          : 'bg-gray-50 hover:bg-blue-50 text-gray-700 border border-gray-200 hover:border-blue-300'
                      }`}
                      key={index}
                    >
                      {item.time}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">😔</span>
                  </div>
                  <p className="text-gray-500">Không có khung giờ nào khả dụng cho ngày này</p>
                </div>
              )}
            </div>

            {/* Booking Summary */}
            {slotTime && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Thông tin đặt lịch</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Bác sĩ</p>
                    <p className="font-medium text-gray-900">{docInfo.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Ngày khám</p>
                    <p className="font-medium text-gray-900">
                      {docSlots[slotIndex] && docSlots[slotIndex][0] && 
                        `${daysOfWeek[docSlots[slotIndex][0].datetime.getDay()]}, ${docSlots[slotIndex][0].datetime.getDate()}/${docSlots[slotIndex][0].datetime.getMonth() + 1}`
                      }
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Giờ khám</p>
                    <p className="font-medium text-gray-900">{slotTime}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Book Button */}
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <button
                onClick={bookAppointment}
                disabled={!slotTime}
                className={`flex-1 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
                  slotTime
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                {slotTime ? '📅 Đặt lịch khám ngay' : 'Vui lòng chọn khung giờ'}
              </button>
              
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>🔒</span>
                <span>Thông tin được bảo mật</span>
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-6 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
              <div className="flex items-start gap-3">
                <span className="text-yellow-600 text-lg">💡</span>
                <div>
                  <p className="text-yellow-800 font-medium mb-1">Lưu ý quan trọng:</p>
                  <ul className="text-yellow-700 text-sm space-y-1">
                    <li>• Vui lòng đến trước 15 phút so với giờ hẹn</li>
                    <li>• Mang theo CMND/CCCD và các giấy tờ y tế liên quan</li>
                    <li>• Liên hệ hotline nếu cần thay đổi lịch hẹn</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/*----- Danh sách bác sĩ liên quan --------*/}
          <div className="mt-12">
            <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Appointment