import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'

const DoctorsList = () => {

  // Map chuyên khoa từ English -> Tiếng Việt
  const specialityMapping = {
    "General physician": "Bác sĩ đa khoa",
    "Gynecologist": "Sản phụ khoa",
    "Dermatologist": "Da liễu",
    "Pediatricians": "Nhi khoa",
    "Neurologist": "Thần kinh",
    "Gastroenterologist": "Tiêu hóa"
  }

  const { doctors, aToken, getAllDoctors, changeAvailability } = useContext(AdminContext)

  useEffect(()=>{
    if (aToken) {
      getAllDoctors()
    }
  },[aToken])

  return (
    <div className='w-full max-w-7xl m-5'>
      
      {/* Header */}
      <div className='mb-6'>
        <h1 className='text-2xl font-semibold text-gray-800 mb-2'>Danh sách bác sĩ</h1>
        <p className='text-gray-600'>Quản lý thông tin và trạng thái của các bác sĩ</p>
        <div className='flex items-center gap-4 mt-3'>
          <div className='text-sm text-gray-600'>
            Tổng: <span className='font-medium text-blue-600'>{doctors?.length || 0}</span> bác sĩ
          </div>
          <div className='text-sm text-gray-600'>
            Đang hoạt động: <span className='font-medium text-green-600'>{doctors?.filter(d => d.available)?.length || 0}</span>
          </div>
        </div>
      </div>

      {/* Doctors Grid */}
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6'>
        {
          doctors?.map((item, index) => (
            <div className='bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group' key={item._id || index}>
              
              {/* Doctor Image */}
              <div className='relative overflow-hidden'>
                <img 
                  className='w-full h-48 object-cover bg-gradient-to-br from-blue-50 to-indigo-50 group-hover:scale-105 transition-transform duration-300' 
                  src={item.image || '/default-doctor.png'} 
                  alt={item.name}
                />
                {/* Availability Badge */}
                <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${
                  item.available 
                    ? 'bg-green-100 text-green-800 border border-green-200' 
                    : 'bg-red-100 text-red-800 border border-red-200'
                }`}>
                  {item.available ? 'Đang hoạt động' : 'Không hoạt động'}
                </div>
              </div>
              
              {/* Doctor Info */}
              <div className='p-5'>
                <div className='mb-3'>
                  <h3 className='text-lg font-semibold text-gray-900 mb-1 line-clamp-1'>
                    {item.name}
                  </h3>
                  <p className='text-sm text-gray-600 mb-2'>
                    {specialityMapping[item.speciality] || item.speciality}
                  </p>
                  
                  {/* Additional Info */}
                  {item.email && (
                    <p className='text-xs text-gray-500 truncate mb-2'>{item.email}</p>
                  )}
                  
                  {item.experience && (
                    <p className='text-xs text-gray-500 mb-2'>
                      Kinh nghiệm: {item.experience} năm
                    </p>
                  )}
                  
                  {item.fees && (
                    <p className='text-xs text-blue-600 font-medium mb-3'>
                      Phí khám: ${item.fees}
                    </p>
                  )}
                </div>

                {/* Availability Toggle */}
                <div className='flex items-center justify-between pt-3 border-t border-gray-100'>
                  <span className='text-sm font-medium text-gray-700'>
                    Trạng thái hoạt động
                  </span>
                  <label className='relative inline-flex items-center cursor-pointer'>
                    <input 
                      onChange={() => changeAvailability(item._id)} 
                      type="checkbox" 
                      checked={item.available}
                      className='sr-only peer'
                    />
                    <div className='w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[""] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600'></div>
                  </label>
                </div>
              </div>
            </div>
          ))
        }
      </div>

      {/* Empty State */}
      {(!doctors || doctors.length === 0) && (
        <div className='text-center py-12'>
          <div className='w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4'>
            <svg className='w-12 h-12 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' />
            </svg>
          </div>
          <h3 className='text-lg font-medium text-gray-900 mb-2'>Chưa có bác sĩ nào</h3>
          <p className='text-gray-500'>Danh sách bác sĩ sẽ xuất hiện ở đây khi có dữ liệu.</p>
        </div>
      )}

      {/* Loading State */}
      {!doctors && (
        <div className='text-center py-12'>
          <div className='inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
          <p className='mt-4 text-gray-500'>Đang tải danh sách bác sĩ...</p>
        </div>
      )}
    </div>
  )
}

export default DoctorsList