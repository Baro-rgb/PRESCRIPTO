import React, { useEffect, useState } from 'react'
import { useContext } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const Doctors = () => {

  const { speciality } = useParams()
  const [filterDoc, setFilterDoc] = useState([])
  const [showFilter, setShowFilter] = useState(false)

  const navigate = useNavigate()

  const { doctors } = useContext(AppContext)

  const applyFilter = () => {
    if (speciality) {
      setFilterDoc(doctors.filter(doc => doc.speciality === speciality))
    } else {
      setFilterDoc(doctors)
    }
  }

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

  useEffect(() => {
    applyFilter()
  }, [doctors, speciality])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Đội ngũ bác sĩ chuyên nghiệp
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Tìm kiếm và đặt lịch khám với các bác sĩ hàng đầu theo từng chuyên khoa
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden">
            <button
              className={`w-full py-3 px-6 rounded-xl font-medium transition-all duration-300 shadow-md ${
                showFilter 
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-blue-200' 
                  : 'bg-white text-gray-700 border border-gray-200 hover:shadow-lg'
              }`}
              onClick={() => setShowFilter(prev => !prev)}
            >
              <span className="flex items-center justify-center gap-2">
                🔍 Bộ lọc chuyên khoa
                <svg className={`w-5 h-5 transition-transform ${showFilter ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </span>
            </button>
          </div>

          {/* Sidebar Filter */}
          <div className={`lg:w-80 ${showFilter ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                🏥 Chuyên khoa
              </h3>
              
              <div className="space-y-3">
                {Object.entries(specialityMapping).map(([engSpec, vietSpec]) => (
                  <button
                    key={engSpec}
                    onClick={() => speciality === engSpec ? navigate('/doctors') : navigate(`/doctors/${engSpec}`)}
                    className={`w-full text-left p-4 rounded-xl transition-all duration-300 group ${
                      speciality === engSpec
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-200'
                        : 'bg-gray-50 hover:bg-blue-50 text-gray-700 hover:text-blue-700 border border-gray-100 hover:border-blue-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{specialityIcons[engSpec]}</span>
                      <div>
                        <p className={`font-medium ${speciality === engSpec ? 'text-white' : 'text-gray-900'}`}>
                          {vietSpec}
                        </p>
                        <p className={`text-sm ${speciality === engSpec ? 'text-blue-100' : 'text-gray-500'}`}>
                          {doctors.filter(doc => doc.speciality === engSpec).length} bác sĩ
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
                
                {speciality && (
                  <button
                    onClick={() => navigate('/doctors')}
                    className="w-full text-left p-4 rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 transition-all duration-300 border-2 border-dashed border-gray-300"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🔄</span>
                      <div>
                        <p className="font-medium text-gray-900">Xem tất cả</p>
                        <p className="text-sm text-gray-500">Hiển thị toàn bộ bác sĩ</p>
                      </div>
                    </div>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Main Content - Doctors Grid */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {speciality ? specialityMapping[speciality] : 'Tất cả bác sĩ'}
                  </h2>
                  <p className="text-gray-600 mt-1">
                    Tìm thấy {filterDoc.length} bác sĩ
                  </p>
                </div>
                <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500">
                  <span>Sắp xếp theo:</span>
                  <select className="bg-white border border-gray-200 rounded-lg px-3 py-1 text-gray-700">
                    <option>Độ phổ biến</option>
                    <option>Đánh giá cao nhất</option>
                    <option>Kinh nghiệm</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Doctors Grid */}
            {filterDoc.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filterDoc.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => navigate(`/appointment/${item._id}`)}
                    className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden border border-gray-100 hover:border-blue-200 hover:-translate-y-2"
                  >
                    {/* Doctor Image */}
                    <div className="relative overflow-hidden">
                      <img 
                        className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700" 
                        src={item.image} 
                        alt={item.name}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      {/* Status Badge */}
                      <div className="absolute top-4 left-4">
                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-sm ${
                          item.available 
                            ? 'bg-green-100/90 text-green-700 border border-green-200' 
                            : 'bg-red-100/90 text-red-700 border border-red-200'
                        }`}>
                          <div className={`w-2 h-2 rounded-full ${item.available ? 'bg-green-500' : 'bg-red-500'}`}></div>
                          {item.available ? 'Đang nhận khám' : 'Tạm nghỉ'}
                        </div>
                      </div>
                    </div>

                    {/* Doctor Info */}
                    <div className="p-6">
                      <div className="mb-3">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                          {item.name}
                        </h3>
                        <p className="text-blue-600 font-medium mt-1 flex items-center gap-2">
                          <span>{specialityIcons[item.speciality]}</span>
                          {specialityMapping[item.speciality] || item.speciality}
                        </p>
                      </div>

                      {/* Additional Info */}
                      <div className="space-y-2 text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-2">
                          <span>⭐</span>
                          <span>4.8 (127 đánh giá)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>🎓</span>
                          <span><span>{translateExperience(item.experience)}</span></span>                            
                        </div>
                        <div className="flex items-center gap-2">
                          <span>📍</span>
                          <span>{item.degree}</span>
                        </div>
                      </div>

                      {/* CTA Button */}
                      <button 
                        className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
                          item.available
                            ? 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg shadow-blue-200 hover:shadow-blue-300'
                            : 'bg-gray-100 text-gray-500 cursor-not-allowed'
                        }`}
                        disabled={!item.available}
                      >
                        {item.available ? '📅 Đặt lịch khám' : 'Hiện không khả dụng'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="text-center py-16">
                <div className="w-32 h-32 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-6xl">🔍</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Không tìm thấy bác sĩ
                </h3>
                <p className="text-gray-600 mb-6">
                  Hiện tại chưa có bác sĩ nào trong chuyên khoa này.
                </p>
                <button
                  onClick={() => navigate('/doctors')}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl transition-colors duration-300"
                >
                  Xem tất cả bác sĩ
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Doctors