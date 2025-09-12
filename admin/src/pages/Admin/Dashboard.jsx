import React from 'react'
import { AdminContext } from '../../context/AdminContext'
import { useEffect } from 'react'
import { useContext } from 'react'
import { assets } from '../../assets/assets'
import { AppContext } from '../../context/AppContext'

const Dashboard = () => {

  const {aToken, getDashData, cancelAppointment, dashData} = useContext(AdminContext)
  const {slotDateFormat} = useContext(AppContext)

  useEffect(()=>{
      if (aToken) {
        getDashData()
      }
  },[aToken])

  return dashData && (
    <div className='w-full max-w-7xl mx-auto p-6'>

      {/* Header */}
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-800 mb-2'>Tổng quan hệ thống</h1>
        <p className='text-gray-600'>Theo dõi hoạt động và thống kê của hệ thống</p>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8'>

        <div className='group bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1'>
          <div className='flex items-center justify-between mb-4'>
            <div className='w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform'>
              <img className='w-7 h-7' src={assets.doctor_icon} alt="" />
            </div>
            <div className='text-right'>
              <p className='text-2xl font-bold text-blue-700'>{dashData.doctors}</p>
              <p className='text-blue-600 text-sm font-medium'>Bác sĩ</p>
            </div>
          </div>
          <div className='flex items-center justify-between'>
            <span className='text-blue-600 text-sm'>Tổng số bác sĩ</span>
            <div className='flex items-center text-green-600 text-xs'>
              <svg className='w-3 h-3 mr-1' fill='currentColor' viewBox='0 0 20 20'>
                <path fillRule='evenodd' d='M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z' clipRule='evenodd'/>
              </svg>
              Hoạt động
            </div>
          </div>
        </div>

        <div className='group bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1'>
          <div className='flex items-center justify-between mb-4'>
            <div className='w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform'>
              <img className='w-7 h-7' src={assets.appointments_icon} alt="" />
            </div>
            <div className='text-right'>
              <p className='text-2xl font-bold text-green-700'>{dashData.appointments}</p>
              <p className='text-green-600 text-sm font-medium'>Cuộc hẹn</p>
            </div>
          </div>
          <div className='flex items-center justify-between'>
            <span className='text-green-600 text-sm'>Tổng cuộc hẹn</span>
            <div className='flex items-center text-green-600 text-xs'>
              <svg className='w-3 h-3 mr-1' fill='currentColor' viewBox='0 0 20 20'>
                <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' clipRule='evenodd'/>
              </svg>
              Đã đặt
            </div>
          </div>
        </div>

        <div className='group bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1'>
          <div className='flex items-center justify-between mb-4'>
            <div className='w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform'>
              <img className='w-7 h-7' src={assets.patients_icon} alt="" />
            </div>
            <div className='text-right'>
              <p className='text-2xl font-bold text-purple-700'>{dashData.patients}</p>
              <p className='text-purple-600 text-sm font-medium'>Bệnh nhân</p>
            </div>
          </div>
          <div className='flex items-center justify-between'>
            <span className='text-purple-600 text-sm'>Tổng bệnh nhân</span>
            <div className='flex items-center text-green-600 text-xs'>
              <svg className='w-3 h-3 mr-1' fill='currentColor' viewBox='0 0 20 20'>
                <path fillRule='evenodd' d='M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z' clipRule='evenodd'/>
              </svg>
              Tăng trưởng
            </div>
          </div>
        </div>

      </div>

      {/* Recent Appointments Section */}
      <div className='bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden'>
        <div className='flex items-center justify-between px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200'>
          <div className='flex items-center gap-3'>
            <div className='w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center'>
              <img className='w-5 h-5' src={assets.list_icon} alt="" />
            </div>
            <div>
              <h2 className='font-semibold text-gray-800 text-lg'>Cuộc hẹn mới nhất</h2>
              <p className='text-gray-600 text-sm'>Danh sách các cuộc hẹn gần đây</p>
            </div>
          </div>
          <button className='px-4 py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors'>
            Xem tất cả
          </button>
        </div>

        <div className='divide-y divide-gray-100'>
          {
            dashData.latestAppointments && dashData.latestAppointments.length > 0 ? 
            dashData.latestAppointments.map((item, index) => (
              <div className='flex items-center px-6 py-4 hover:bg-gray-50 transition-colors group' key={item._id || index}>
                <div className='flex-shrink-0 mr-4'>
                  <img className='w-12 h-12 rounded-full object-cover ring-2 ring-gray-200 group-hover:ring-blue-300 transition-colors' 
                       src={item.docData?.image || '/default-doctor.png'} 
                       alt={item.docData?.name} />
                </div>
                
                <div className='flex-1 min-w-0'>
                  <div className='flex items-center justify-between mb-1'>
                    <p className='text-sm font-semibold text-gray-900 truncate'>
                      Bác sĩ {item.docData?.name || 'N/A'}
                    </p>
                    <div className='flex items-center text-xs text-gray-500'>
                      <svg className='w-3 h-3 mr-1' fill='currentColor' viewBox='0 0 20 20'>
                        <path fillRule='evenodd' d='M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z' clipRule='evenodd'/>
                      </svg>
                      {slotDateFormat(item.slotDate)}
                    </div>
                  </div>
                  
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center text-xs text-gray-500'>
                      <svg className='w-3 h-3 mr-1' fill='currentColor' viewBox='0 0 20 20'>
                        <path fillRule='evenodd' d='M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z' clipRule='evenodd'/>
                      </svg>
                      Bệnh nhân: {item.userData?.name || 'N/A'}
                    </div>
                    <div className='flex items-center text-xs text-gray-500'>
                      <svg className='w-3 h-3 mr-1' fill='currentColor' viewBox='0 0 20 20'>
                        <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z' clipRule='evenodd'/>
                      </svg>
                      {item.slotTime}
                    </div>
                  </div>
                </div>

                <div className='flex-shrink-0 ml-4'>
                  {
                    item.cancelled ? (
                      <span className='inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200'>
                        <svg className='w-3 h-3 mr-1' fill='currentColor' viewBox='0 0 20 20'>
                          <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z' clipRule='evenodd'/>
                        </svg>
                        Đã hủy
                      </span>
                    ) : item.isCompleted ? (
                      <span className='inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200'>
                        <svg className='w-3 h-3 mr-1' fill='currentColor' viewBox='0 0 20 20'>
                          <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' clipRule='evenodd'/>
                        </svg>
                        Hoàn thành
                      </span>
                    ) : (
                      <button 
                        onClick={() => cancelAppointment(item._id)}
                        className='inline-flex items-center px-3 py-1 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors border border-red-200 hover:border-red-300'
                      >
                        <svg className='w-3 h-3 mr-1' fill='currentColor' viewBox='0 0 20 20'>
                          <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z' clipRule='evenodd'/>
                        </svg>
                        Hủy
                      </button>
                    )
                  }
                </div>
              </div>
            )) : (
              <div className='flex flex-col items-center justify-center py-12'>
                <div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4'>
                  <svg className='w-8 h-8 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6m-6 0l-2 2m8-2l2 2m-2 0v8a2 2 0 01-2 2h-4a2 2 0 01-2-2v-8m8 0V9a2 2 0 00-2-2H8a2 2 0 00-2 2v8z' />
                  </svg>
                </div>
                <h3 className='text-lg font-medium text-gray-900 mb-2'>Chưa có cuộc hẹn nào</h3>
                <p className='text-gray-500 text-center max-w-sm'>Các cuộc hẹn mới sẽ xuất hiện ở đây khi có bệnh nhân đặt lịch.</p>
              </div>
            )
          }
        </div>
      </div>

      {/* Loading State */}
      {!dashData && (
        <div className='flex items-center justify-center py-12'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
          <span className='ml-3 text-gray-600'>Đang tải dữ liệu...</span>
        </div>
      )}

    </div>
  )
}

export default Dashboard