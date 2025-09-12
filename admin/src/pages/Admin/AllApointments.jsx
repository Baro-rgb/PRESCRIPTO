import React from 'react'
import { useContext, useState, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'
import axios from 'axios'

const AllAppointments = () => {

  const { aToken, backendUrl, cancelAppointment } = useContext(AdminContext)
  const { calculateAge, slotDateFormat, currency } = useContext(AppContext)

  // State cho appointments và pagination
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalAppointments: 0,
    hasMore: false,
    limit: 7
  })

  // State cho filters
  const [filters, setFilters] = useState({
    sortBy: 'newest',
    status: 'all',
    doctorId: '',
    startDate: '',
    endDate: ''
  })

  // State cho doctors list (for filter dropdown)
  const [doctors, setDoctors] = useState([])

  // Fetch appointments với filters
  const fetchAppointments = async (page = 1, append = false) => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page,
        limit: pagination.limit,
        ...filters
      }).toString()

      const { data } = await axios.get(
        `${backendUrl}/api/admin/appointments?${params}`,
        { headers: { aToken } }
      )

      if (data.success) {
        if (append) {
          setAppointments(prev => [...prev, ...data.appointments])
        } else {
          setAppointments(data.appointments)
        }
        setPagination(data.pagination)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  // Fetch doctors cho filter dropdown
  const fetchDoctors = async () => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/admin/all-doctors`,
        {},
        { headers: { aToken } }
      )
      if (data.success) {
        setDoctors(data.doctors)
      }
    } catch (error) {
      console.log(error)
    }
  }

  // Load more appointments
  const loadMore = () => {
    if (pagination.hasMore && !loading) {
      fetchAppointments(pagination.currentPage + 1, true)
    }
  }

  // Handle filter change
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  // Reset về trang 1 khi filter thay đổi
  useEffect(() => {
    if (aToken) {
      fetchAppointments(1, false)
    }
  }, [filters, aToken])

  // Fetch doctors khi component mount
  useEffect(() => {
    if (aToken) {
      fetchDoctors()
    }
  }, [aToken])

  // Handle cancel appointment
  const handleCancelAppointment = async (appointmentId) => {
    await cancelAppointment(appointmentId)
    // Refresh data after cancellation
    fetchAppointments(1, false)
  }

  return (
    <div className='w-full max-w-6xl m-5'>
      
      {/* Header với Filter */}
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3'>
        <div>
          <h2 className='text-lg font-medium'>Tất cả lịch hẹn</h2>
          <p className='text-sm text-gray-500'>
            Tổng: {pagination.totalAppointments} lịch hẹn
          </p>
        </div>
        
        {/* Filters */}
        <div className='flex flex-wrap gap-2'>
          {/* Sort Filter */}
          <select 
            value={filters.sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            className='border rounded px-3 py-1 text-sm bg-white'
          >
            <option value="newest">Mới nhất</option>
            <option value="oldest">Cũ nhất</option>
            <option value="upcoming">Lịch sắp tới</option>
            <option value="recent_date">Ngày hẹn gần nhất</option>
            <option value="patient_name">Theo tên bệnh nhân</option>
          </select>

          {/* Status Filter */}
          <select 
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className='border rounded px-3 py-1 text-sm bg-white'
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="pending">Chờ khám</option>
            <option value="completed">Đã hoàn thành</option>
            <option value="cancelled">Đã hủy</option>
          </select>

          {/* Doctor Filter */}
          <select 
            value={filters.doctorId}
            onChange={(e) => handleFilterChange('doctorId', e.target.value)}
            className='border rounded px-3 py-1 text-sm bg-white'
          >
            <option value="">Tất cả bác sĩ</option>
            {doctors.map(doctor => (
              <option key={doctor._id} value={doctor._id}>
                {doctor.name}
              </option>
            ))}
          </select>

          {/* Date Range Filters */}
          <div className='flex gap-1'>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
              className='border rounded px-2 py-1 text-sm'
              placeholder="Từ ngày"
            />
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
              className='border rounded px-2 py-1 text-sm'
              placeholder="Đến ngày"
            />
          </div>

          {/* Reset Filters */}
          <button
            onClick={() => setFilters({
              sortBy: 'newest',
              status: 'all',
              doctorId: '',
              startDate: '',
              endDate: ''
            })}
            className='px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded'
          >
            Tạo lại
          </button>
        </div>
      </div>

      {/* Appointments Table */}
      <div className='bg-white border rounded text-sm max-h-[80vh] min-h-[60vh] overflow-y-scroll'>
        
        {/* Header */}
        <div className='hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] grid-flow-col py-3 px-6 border-b bg-gray-50'>
          <p className="font-medium">STT</p>
          <p className="font-medium">Bệnh nhân</p>
          <p className="font-medium">Tuổi</p>
          <p className="font-medium">Ngày và Giờ</p>
          <p className="font-medium">Bác sĩ</p>
          <p className="font-medium">Phí</p>
          <p className="font-medium">Trạng thái</p>
        </div>

        {/* Loading State */}
        {loading && appointments.length === 0 && (
          <div className="flex justify-center items-center py-8">
            <div className="text-gray-500">Đang tải...</div>
          </div>
        )}

        {/* Appointments List */}
        {appointments.length > 0 ? (
          appointments.map((item, index) => (
            <div className='flex flex-wrap justify-between max-sm:gap-2 sm:grid sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50' key={item._id}>
              <p className='max-sm:hidden'>{(pagination.currentPage - 1) * pagination.limit + index + 1}</p>
              
              <div className='flex items-center gap-2'>
                {/* ✅ Ưu tiên userId.image, fallback userData.image */}
                <img 
                  className='w-8 rounded-full' 
                  src={item.userId?.image || item.userData?.image || '/default-avatar.png'} 
                  alt="" 
                /> 
                {/* ✅ Ưu tiên userId.name, fallback userData.name */}
                <p>{item.userId?.name || item.userData?.name || 'Unknown'}</p>
              </div>
              
              {/* 🔥 SỬA LỖI: Ưu tiên userId.dob, fallback userData.dob */}
              <p className='max-sm:hidden'>
                {calculateAge(item.userId?.dob || item.userData?.dob) || 'N/A'}
              </p>
              
              <p>{slotDateFormat(item.slotDate)}, {item.slotTime}</p>
              
              <div className='flex items-center gap-2'>
                {/* ✅ Ưu tiên docId.image, fallback docData.image */}
                <img 
                  className='w-8 rounded-full bg-gray-200' 
                  src={item.docId?.image || item.docData?.image || '/default-doctor.png'} 
                  alt="" 
                /> 
                {/* ✅ Ưu tiên docId.name, fallback docData.name */}
                <p>{item.docId?.name || item.docData?.name || 'Unknown Doctor'}</p>
              </div>
              
              <p>{currency}{item.amount}</p>
              
              <div className="flex items-center">
                {item.cancelled ? (
                  <p className='text-red-400 text-xs font-medium'>Đã hủy</p>
                ) : item.isCompleted ? (
                  <p className='text-green-500 text-xs font-medium'>Hoàn thành</p>
                ) : (
                  <img 
                    onClick={() => handleCancelAppointment(item._id)} 
                    className='w-10 cursor-pointer hover:scale-110 transition-transform' 
                    src={assets.cancel_icon} 
                    alt="Cancel" 
                  />
                )}
              </div>
            </div>
          ))
        ) : !loading && (
          <div className="flex justify-center items-center py-8">
            <p className="text-gray-500">Không tìm thấy lịch hẹn nào</p>
          </div>
        )}

        {/* Load More Button */}
        {pagination.hasMore && (
          <div className="flex justify-center py-4 border-t bg-gray-50">
            <button
              onClick={loadMore}
              disabled={loading}
              className='px-6 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed'
            >
              {loading ? 'Đang tải...' : `Xem thêm (+${Math.min(3, pagination.totalAppointments - appointments.length)} lịch hẹn)`}
            </button>
          </div>
        )}
      </div>

      {/* Pagination Info */}
      <div className="mt-3 text-sm text-gray-500 text-center">
        Đang hiển thị {appointments.length} / {pagination.totalAppointments} lịch hẹn
      </div>
    </div>
  )
}

export default AllAppointments