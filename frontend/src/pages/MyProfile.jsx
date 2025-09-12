import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const MyProfile = () => {

  const { userData, setUserData, token, backendUrl, loadUserProfileData } = useContext(AppContext)

  const [isEdit, setIsEdit] = useState(false)
  const [image, setImage] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Map giới tính từ English -> Tiếng Việt
  const sexMapping = {
    "Male": "Nam",
    "Female": "Nữ",
  }

  const updateUserProfileData = async () => {
    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append('name', userData.name)
      formData.append('phone', userData.phone)
      formData.append('address', JSON.stringify(userData.address))
      formData.append('gender', userData.gender)
      formData.append('dob', userData.dob)

      image && formData.append('image', image)

      const { data } = await axios.post(
        backendUrl + '/api/user/update-profile',
        formData,
        { headers: { token } }
      )

      if (data.success) {
        toast.success(data.message)
        await loadUserProfileData()
        setIsEdit(false)
        setImage(false)
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }
    setIsLoading(false)
  }

  return userData && (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="w-full px-4 py-8">
        <div className="max-w-4xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Hồ sơ cá nhân</h1>
            <p className="text-gray-600">Quản lý thông tin tài khoản và cài đặt cá nhân</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Profile Image Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-xl p-6 text-center">
                <div className="mb-6">
                  {isEdit ? (
                    <label htmlFor="image" className="cursor-pointer group">
                      <div className="relative inline-block">
                        <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-gray-200 group-hover:border-blue-400 transition-colors duration-300 mx-auto">
                          <img 
                            className="w-full h-full object-cover group-hover:opacity-75 transition-opacity duration-300" 
                            src={image ? URL.createObjectURL(image) : userData.image} 
                            alt="Profile" 
                          />
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white shadow-lg group-hover:bg-blue-600 transition-colors duration-300">
                          <span className="text-xl">📸</span>
                        </div>
                        {!image && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-black bg-opacity-50 rounded-full p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <span className="text-white text-sm">Đổi ảnh</span>
                            </div>
                          </div>
                        )}
                      </div>
                      <input 
                        onChange={(e) => setImage(e.target.files[0])} 
                        type="file" 
                        id="image" 
                        accept="image/*"
                        hidden 
                      />
                    </label>
                  ) : (
                    <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-gray-200 mx-auto shadow-lg">
                      <img 
                        className="w-full h-full object-cover" 
                        src={userData.image} 
                        alt="Profile" 
                      />
                    </div>
                  )}
                </div>

                {/* Name */}
                {isEdit ? (
                  <input
                    className="text-2xl font-bold text-gray-900 text-center bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300"
                    type="text"
                    value={userData.name}
                    onChange={e => setUserData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Nhập tên của bạn"
                  />
                ) : (
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{userData.name}</h2>
                )}

                {/* Status Badge */}
                <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium mt-4">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Tài khoản đã xác thực
                </div>
              </div>
            </div>

            {/* Profile Information */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl p-8">
                
                {/* Contact Information */}
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-xl">📞</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Thông tin liên hệ</h3>
                  </div>

                  <div className="grid gap-6">
                    {/* Email */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <label className="text-sm font-medium text-gray-700 w-32 flex items-center gap-2">
                        📧 Email:
                      </label>
                      <div className="flex-1">
                        <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900">
                          {userData.email}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Email không thể thay đổi</p>
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <label className="text-sm font-medium text-gray-700 w-32 flex items-center gap-2">
                        📱 Số điện thoại:
                      </label>
                      <div className="flex-1">
                        {isEdit ? (
                          <input
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300 bg-gray-50 focus:bg-white"
                            type="tel"
                            value={userData.phone || ''}
                            onChange={e => setUserData(prev => ({ ...prev, phone: e.target.value }))}
                            placeholder="Nhập số điện thoại"
                          />
                        ) : (
                          <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900">
                            {userData.phone || 'Chưa cập nhật'}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Address */}
                    <div className="flex flex-col sm:flex-row sm:items-start gap-2">
                      <label className="text-sm font-medium text-gray-700 w-32 flex items-center gap-2">
                        📍 Địa chỉ:
                      </label>
                      <div className="flex-1 space-y-3">
                        {isEdit ? (
                          <>
                            <input
                              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300 bg-gray-50 focus:bg-white"
                              onChange={(e) => setUserData(prev => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))}
                              value={userData.address?.line1 || ''}
                              type="text"
                              placeholder="Số nhà, tên đường"
                            />
                            <input
                              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300 bg-gray-50 focus:bg-white"
                              onChange={(e) => setUserData(prev => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))}
                              value={userData.address?.line2 || ''}
                              type="text"
                              placeholder="Phường, Quận, Thành phố"
                            />
                          </>
                        ) : (
                          <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900">
                            {userData.address?.line1 || userData.address?.line2 ? (
                              <>
                                {userData.address.line1}<br />
                                {userData.address.line2}
                              </>
                            ) : 'Chưa cập nhật'}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-8">
                  {/* Basic Information */}
                  <div className="mb-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <span className="text-xl">👤</span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">Thông tin cơ bản</h3>
                    </div>

                    <div className="grid gap-6">
                      {/* Gender */}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <label className="text-sm font-medium text-gray-700 w-32 flex items-center gap-2">
                          ⚧️ Giới tính:
                        </label>
                        <div className="flex-1">
                          {isEdit ? (
                            <select
                              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300 bg-gray-50 focus:bg-white"
                              onChange={(e) => setUserData(prev => ({ ...prev, gender: e.target.value }))}
                              value={userData.gender || ''}
                            >
                              <option value="">Chọn giới tính</option>
                              <option value="Male">Nam</option>
                              <option value="Female">Nữ</option>
                            </select>
                          ) : (
                            <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900">
                              {sexMapping[userData.gender] || 'Chưa cập nhật'}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Date of Birth */}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <label className="text-sm font-medium text-gray-700 w-32 flex items-center gap-2">
                          🎂 Ngày sinh:
                        </label>
                        <div className="flex-1">
                          {isEdit ? (
                            <input
                              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300 bg-gray-50 focus:bg-white"
                              type="date"
                              onChange={(e) => setUserData(prev => ({ ...prev, dob: e.target.value }))}
                              value={userData.dob || ''}
                            />
                          ) : (
                            <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900">
                              {userData.dob ? new Date(userData.dob).toLocaleDateString('vi-VN') : 'Chưa cập nhật'}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-100">
                  {isEdit ? (
                    <>
                      <button
                        className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                          isLoading
                            ? 'bg-gray-400 text-white cursor-not-allowed'
                            : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                        }`}
                        onClick={updateUserProfileData}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Đang lưu...
                          </div>
                        ) : (
                          <span className="flex items-center justify-center gap-2">
                            💾 Lưu thay đổi
                          </span>
                        )}
                      </button>
                      <button
                        className="flex-1 bg-white border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400 text-gray-700 px-6 py-3 rounded-xl font-semibold transition-all duration-300"
                        onClick={() => {
                          setIsEdit(false)
                          setImage(false)
                          loadUserProfileData()
                        }}
                        disabled={isLoading}
                      >
                        ❌ Hủy
                      </button>
                    </>
                  ) : (
                    <button
                      className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      onClick={() => setIsEdit(true)}
                    >
                      <span className="flex items-center justify-center gap-2">
                        ✏️ Chỉnh sửa thông tin
                      </span>
                    </button>
                  )}
                </div>

                {/* Additional Info */}
                <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="flex items-start gap-3">
                    <span className="text-blue-600 text-lg">💡</span>
                    <div>
                      <p className="text-blue-800 font-medium mb-1">Lưu ý:</p>
                      <ul className="text-blue-700 text-sm space-y-1">
                        <li>• Thông tin chính xác giúp bác sĩ phục vụ bạn tốt hơn</li>
                        <li>• Email không thể thay đổi, liên hệ hỗ trợ nếu cần</li>
                        <li>• Ảnh đại diện nên rõ nét và phù hợp</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyProfile