import React, { useContext, useState } from 'react'
import { assets } from '../../assets/assets'
import { AdminContext } from '../../context/AdminContext'
import { toast } from 'react-toastify'
import axios from 'axios'

const AddDoctor = () => {

  const [docImg, setDocImg] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [experience, setExperience] = useState('1 Year')
  const [fees, setFees] = useState('')
  const [about, setAbout] = useState('')
  const [speciality, setSpeciality] = useState('General physician')
  const [degree, setDegree] = useState('')
  const [address1, setAddress1] = useState('')
  const [address2, setAddress2] = useState('')
  const [loading, setLoading] = useState(false)

  const { backendUrl, aToken } = useContext(AdminContext)

  const onSubmitHandler = async (event) => {
    event.preventDefault()
    setLoading(true)

    try {
      if (!docImg) {
        setLoading(false)
        return toast.error('Vui lòng tải lên hình ảnh bác sĩ')
      }

      const formData = new FormData()

      formData.append('image', docImg)
      formData.append('name', name)
      formData.append('email', email)
      formData.append('password', password)
      formData.append('experience', experience)
      formData.append('fees', Number(fees))
      formData.append('about', about)
      formData.append('speciality', speciality)
      formData.append('degree', degree)
      formData.append('address', JSON.stringify({ line1: address1, line2: address2 }))

      const { data } = await axios.post(backendUrl + '/api/admin/add-doctor', formData, { headers: { aToken } })

      if (data.success) {
        toast.success(data.message)
        setDocImg(false)
        setName('')
        setPassword('')
        setEmail('')
        setAddress1('')
        setAddress2('')
        setDegree('')
        setAbout('')
        setFees('')
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-6'>
      <div className='max-w-6xl mx-auto'>
        
        {/* Header */}
        <div className='mb-8'>
          <div className='flex items-center gap-3 mb-2'>
            <div className='p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl shadow-lg'>
              <svg className='w-6 h-6 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 6v6m0 0v6m0-6h6m-6 0H6' />
              </svg>
            </div>
            <div>
              <h1 className='text-3xl font-bold text-gray-800'>Thêm Bác Sĩ Mới</h1>
              <p className='text-gray-600 mt-1'>Điền thông tin để thêm bác sĩ vào hệ thống</p>
            </div>
          </div>
        </div>

        <form onSubmit={onSubmitHandler} className='space-y-8'>
          
          {/* Image Upload Section */}
          <div className='bg-white rounded-2xl shadow-xl border border-gray-100 p-8'>
            <h2 className='text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2'>
              <svg className='w-5 h-5 text-blue-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' />
              </svg>
              Ảnh Đại Diện
            </h2>
            
            <div className='flex flex-col items-center gap-4'>
              <label htmlFor="doc-img" className='group cursor-pointer'>
                <div className='relative'>
                  <div className='w-32 h-32 rounded-full border-4 border-dashed border-gray-300 group-hover:border-blue-400 flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:shadow-lg'>
                    {docImg ? (
                      <img className='w-full h-full object-cover rounded-full' src={URL.createObjectURL(docImg)} alt="Doctor" />
                    ) : (
                      <div className='text-center'>
                        <svg className='w-8 h-8 text-gray-400 mx-auto mb-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12' />
                        </svg>
                        <p className='text-sm text-gray-500'>Tải ảnh lên</p>
                      </div>
                    )}
                  </div>
                  {!docImg && (
                    <div className='absolute -bottom-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg'>
                      <svg className='w-4 h-4 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 6v6m0 0v6m0-6h6m-6 0H6' />
                      </svg>
                    </div>
                  )}
                </div>
              </label>
              <input onChange={(e) => setDocImg(e.target.files[0])} type="file" id="doc-img" hidden accept='image/*' />
              <p className='text-gray-600 text-center'>
                Tải lên hình ảnh bác sĩ<br />
                <span className='text-sm text-gray-500'>Định dạng: JPG, PNG (Tối đa 5MB)</span>
              </p>
            </div>
          </div>

          {/* Main Form */}
          <div className='bg-white rounded-2xl shadow-xl border border-gray-100 p-8'>
            <h2 className='text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2'>
              <svg className='w-5 h-5 text-blue-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' />
              </svg>
              Thông Tin Cá Nhân
            </h2>

            <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
              
              {/* Left Column */}
              <div className='space-y-6'>
                
                <div className='group'>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Họ và tên bác sĩ *</label>
                  <div className='relative'>
                    <input 
                      onChange={(e) => setName(e.target.value)} 
                      value={name} 
                      className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 pl-11' 
                      type="text" 
                      placeholder='Nhập họ và tên bác sĩ' 
                      required 
                    />
                    <svg className='w-5 h-5 text-gray-400 absolute left-3 top-3.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' />
                    </svg>
                  </div>
                </div>

                <div className='group'>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Email *</label>
                  <div className='relative'>
                    <input 
                      onChange={(e) => setEmail(e.target.value)} 
                      value={email} 
                      className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 pl-11' 
                      type="email" 
                      placeholder='doctor@example.com' 
                      required 
                    />
                    <svg className='w-5 h-5 text-gray-400 absolute left-3 top-3.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207' />
                    </svg>
                  </div>
                </div>

                <div className='group'>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Mật khẩu *</label>
                  <div className='relative'>
                    <input 
                      onChange={(e) => setPassword(e.target.value)} 
                      value={password} 
                      className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 pl-11' 
                      type="password" 
                      placeholder='Nhập mật khẩu' 
                      required 
                    />
                    <svg className='w-5 h-5 text-gray-400 absolute left-3 top-3.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' />
                    </svg>
                  </div>
                </div>

                <div className='group'>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Kinh nghiệm</label>
                  <div className='relative'>
                    <select 
                      onChange={(e) => setExperience(e.target.value)} 
                      value={experience} 
                      className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 pl-11 appearance-none bg-white'
                    >
                      <option value="1 Year">1 Năm</option>
                      <option value="2 Year">2 Năm</option>
                      <option value="3 Year">3 Năm</option>
                      <option value="4 Year">4 Năm</option>
                      <option value="5 Year">5 Năm</option>
                      <option value="6 Year">6 Năm</option>
                      <option value="7 Year">7 Năm</option>
                      <option value="8 Year">8 Năm</option>
                      <option value="9 Year">9 Năm</option>
                      <option value="10 Year">10 Năm</option>
                    </select>
                    <svg className='w-5 h-5 text-gray-400 absolute left-3 top-3.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' />
                    </svg>
                    <svg className='w-4 h-4 text-gray-400 absolute right-3 top-4 pointer-events-none' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                    </svg>
                  </div>
                </div>

                <div className='group'>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Phí khám *</label>
                  <div className='relative'>
                    <input 
                      onChange={(e) => setFees(e.target.value)} 
                      value={fees} 
                      className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 pl-11' 
                      type="number" 
                      placeholder='' 
                      required 
                    />
                    <svg className='w-5 h-5 text-gray-400 absolute left-3 top-3.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1' />
                    </svg>
                    <span className='absolute right-3 top-3.5 text-gray-500 text-sm'></span>
                  </div>
                </div>

              </div>

              {/* Right Column */}
              <div className='space-y-6'>

                <div className='group'>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Chuyên khoa</label>
                  <div className='relative'>
                    <select 
                      onChange={(e) => setSpeciality(e.target.value)} 
                      value={speciality} 
                      className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 pl-11 appearance-none bg-white'
                    >
                      <option value="General physician">Bác sĩ đa khoa</option>
                      <option value="Gynecologist">Phụ sản</option>
                      <option value="Dermatologist">Da liễu</option>
                      <option value="Pediatricians">Nhi khoa</option>
                      <option value="Neurologist">Thần kinh</option>
                      <option value="Gastroenterologist">Tiêu hóa</option>
                    </select>
                    <svg className='w-5 h-5 text-gray-400 absolute left-3 top-3.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' />
                    </svg>
                    <svg className='w-4 h-4 text-gray-400 absolute right-3 top-4 pointer-events-none' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                    </svg>
                  </div>
                </div>

                <div className='group'>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Bằng cấp *</label>
                  <div className='relative'>
                    <input 
                      onChange={(e) => setDegree(e.target.value)} 
                      value={degree} 
                      className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 pl-11' 
                      type="text" 
                      placeholder='Tiến sĩ Y khoa, Thạc sĩ Y khoa...' 
                      required 
                    />
                    <svg className='w-5 h-5 text-gray-400 absolute left-3 top-3.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 14l9-5-9-5-9 5 9 5z' />
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z' />
                    </svg>
                  </div>
                </div>

                <div className='group'>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Địa chỉ *</label>
                  <div className='space-y-3'>
                    <div className='relative'>
                      <input 
                        onChange={(e) => setAddress1(e.target.value)} 
                        value={address1} 
                        className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 pl-11' 
                        type="text" 
                        placeholder='Số nhà, tên đường' 
                        required 
                      />
                      <svg className='w-5 h-5 text-gray-400 absolute left-3 top-3.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' />
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 11a3 3 0 11-6 0 3 3 0 016 0z' />
                      </svg>
                    </div>
                    <div className='relative'>
                      <input 
                        onChange={(e) => setAddress2(e.target.value)} 
                        value={address2} 
                        className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 pl-11' 
                        type="text" 
                        placeholder='Phường/Xã, Quận/Huyện, Tỉnh/Thành phố' 
                        required 
                      />
                      <svg className='w-5 h-5 text-gray-400 absolute left-3 top-3.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' />
                      </svg>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* About Section */}
            <div className='mt-8 pt-8 border-t border-gray-200'>
              <h3 className='text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2'>
                <svg className='w-5 h-5 text-blue-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
                </svg>
                Giới Thiệu Bác Sĩ
              </h3>
              <div className='relative'>
                <textarea 
                  onChange={(e) => setAbout(e.target.value)} 
                  value={about} 
                  className='w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none' 
                  placeholder='Mô tả kinh nghiệm, chuyên môn và thành tích của bác sĩ...' 
                  rows={6} 
                  required 
                />
                <div className='absolute bottom-3 right-3 text-xs text-gray-400'>
                  {about.length}/1000
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className='flex justify-center'>
            <button 
              type='submit' 
              disabled={loading}
              className='bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-3 min-w-[200px] justify-center'
            >
              {loading ? (
                <>
                  <svg className='animate-spin -ml-1 mr-3 h-5 w-5 text-white' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
                    <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                    <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                  </svg>
                  Đang xử lý...
                </>
              ) : (
                <>
                  <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 6v6m0 0v6m0-6h6m-6 0H6' />
                  </svg>
                  Thêm Bác Sĩ
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}

export default AddDoctor