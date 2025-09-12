import React, { useState } from 'react'
import { specialityData } from '../assets/assets'
import { Link } from 'react-router-dom'

const SpecilaityMenu = () => {
    const [hoveredIndex, setHoveredIndex] = useState(null)

    // Map chuyên khoa từ English -> Tiếng Việt
    const specialityMapping = {
        "General physician": "Bác sĩ đa khoa",
        "Gynecologist": "Sản phụ khoa", 
        "Dermatologist": "Da liễu",
        "Pediatricians": "Nhi khoa",
        "Neurologist": "Thần kinh",
        "Gastroenterologist": "Tiêu hóa"
    }

    // Icon mapping cho từng chuyên khoa
    const iconMapping = {
        "General physician": "🩺",
        "Gynecologist": "👶",
        "Dermatologist": "✨",
        "Pediatricians": "🧸",
        "Neurologist": "🧠", 
        "Gastroenterologist": "🫁"
    }

    // Màu sắc cho từng chuyên khoa
    const colorMapping = {
        "General physician": "from-blue-400 to-blue-600",
        "Gynecologist": "from-pink-400 to-pink-600",
        "Dermatologist": "from-purple-400 to-purple-600", 
        "Pediatricians": "from-yellow-400 to-orange-500",
        "Neurologist": "from-indigo-400 to-indigo-600",
        "Gastroenterologist": "from-green-400 to-green-600"
    }

    return (
        <div className='relative flex flex-col items-center gap-6 py-20 text-gray-800 overflow-hidden' id='speciality'>
            {/* Background decorations */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-10 left-10 w-32 h-32 bg-blue-500 rounded-full blur-3xl"></div>
                <div className="absolute top-20 right-20 w-40 h-40 bg-purple-500 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 left-1/4 w-36 h-36 bg-pink-500 rounded-full blur-3xl"></div>
            </div>

            {/* Header Section */}
            <div className='text-center space-y-4 relative z-10'>
                <div className='flex items-center justify-center gap-3 mb-4'>
                    <div className='w-12 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full'></div>
                    <span className='text-blue-600 font-semibold text-sm uppercase tracking-wide'>Chuyên khoa</span>
                    <div className='w-12 h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full'></div>
                </div>
                
                <h1 className='text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent leading-tight'>
                    Tìm theo chuyên ngành
                </h1>
                
                <p className='sm:w-1/2 mx-auto text-center text-gray-600 text-lg leading-relaxed'>
                    Chỉ cần duyệt qua danh sách dài các bác sĩ đáng tin cậy của chúng tôi và 
                    <span className='text-blue-600 font-semibold'> đặt lịch hẹn mà không gặp rắc rối</span>
                </p>

                {/* Quick stats */}
                <div className='flex justify-center gap-8 mt-6 text-sm text-gray-500'>
                    <div className='flex items-center gap-2'>
                        <div className='w-2 h-2 bg-green-500 rounded-full animate-pulse'></div>
                        <span>100+ Bác sĩ chuyên khoa</span>
                    </div>
                    <div className='flex items-center gap-2'>
                        <div className='w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-300'></div>
                        <span>6 Chuyên ngành chính</span>
                    </div>
                </div>
            </div>

            {/* Speciality Cards Grid */}
            <div className='w-full max-w-7xl mx-auto px-4'>
                <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 pt-8'>
                    {specialityData.map((item, index) => (
                        <Link 
                            onClick={() => scrollTo(0, 0)} 
                            className='group relative' 
                            key={index} 
                            to={`/doctors/${item.speciality}`}
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                        >
                            {/* Card Container */}
                            <div className='relative p-6 rounded-2xl bg-white shadow-lg hover:shadow-2xl transform hover:scale-105 hover:rotate-1 transition-all duration-500 border border-gray-100 overflow-hidden group-hover:border-blue-200'>
                                
                                {/* Animated background gradient */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${colorMapping[item.speciality] || 'from-gray-400 to-gray-600'} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                                
                                {/* Floating particles effect */}
                                <div className='absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500'>
                                    <div className='absolute top-2 right-2 w-1 h-1 bg-blue-400 rounded-full animate-ping'></div>
                                    <div className='absolute bottom-3 left-3 w-1 h-1 bg-purple-400 rounded-full animate-ping delay-300'></div>
                                    <div className='absolute top-4 left-1/2 w-1 h-1 bg-pink-400 rounded-full animate-ping delay-700'></div>
                                </div>

                                {/* Content */}
                                <div className='relative z-10 flex flex-col items-center text-center space-y-4'>
                                    {/* Image with icon overlay */}
                                    <div className='relative'>
                                        <img 
                                            className='w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl shadow-md group-hover:shadow-xl transition-all duration-500 transform group-hover:scale-110' 
                                            src={item.image} 
                                            alt={specialityMapping[item.speciality] || item.speciality}
                                        />
                                        
                                        {/* Floating icon */}
                                        <div className='absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-300 delay-200'>
                                            <span className='text-lg'>{iconMapping[item.speciality] || '⚕️'}</span>
                                        </div>
                                    </div>

                                    {/* Text Content */}
                                    <div className='space-y-2'>
                                        <p className='font-semibold text-gray-800 text-sm sm:text-base group-hover:text-blue-600 transition-colors duration-300'>
                                            {specialityMapping[item.speciality] || item.speciality}
                                        </p>
                                        
                                        {/* Subtitle - shows on hover */}
                                        <p className='text-xs text-gray-500 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300'>
                                            {item.speciality === "General physician" && "Khám tổng quát & theo dõi sức khỏe"}
                                            {item.speciality === "Gynecologist" && "Chăm sóc sức khỏe phụ nữ"}  
                                            {item.speciality === "Dermatologist" && "Điều trị da & thẩm mỹ"}
                                            {item.speciality === "Pediatricians" && "Chăm sóc sức khỏe trẻ em"}
                                            {item.speciality === "Neurologist" && "Điều trị bệnh thần kinh"}
                                            {item.speciality === "Gastroenterologist" && "Chuyên khoa tiêu hóa"}
                                        </p>
                                    </div>

                                    {/* Arrow indicator */}
                                    <div className='opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 delay-100'>
                                        <svg className='w-4 h-4 text-blue-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
                                        </svg>
                                    </div>
                                </div>

                                {/* Ripple effect */}
                                <div className='absolute inset-0 rounded-2xl overflow-hidden'>
                                    <div className={`absolute inset-0 bg-gradient-to-br ${colorMapping[item.speciality] || 'from-gray-400 to-gray-600'} opacity-0 group-hover:opacity-5 transform scale-0 group-hover:scale-100 transition-all duration-700 rounded-full`}></div>
                                </div>
                            </div>

                            {/* Tooltip */}
                            {hoveredIndex === index && (
                                <div className='absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-3 py-1 rounded-lg text-xs whitespace-nowrap z-20 animate-fade-in'>
                                    <div className='absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45'></div>
                                    Xem danh sách bác sĩ
                                </div>
                            )}
                        </Link>
                    ))}
                </div>
            </div>

            {/* Bottom CTA Section */}
            <div className='mt-12 text-center space-y-4'>
                <p className='text-gray-600'>Không tìm thấy chuyên khoa phù hợp?</p>
                <button className='bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl'>
                    Liên hệ tư vấn miễn phí
                </button>
            </div>

            {/* Custom CSS for animations */}
            <style jsx>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 0.3s ease-out;
                }
            `}</style>
        </div>
    )
}

export default SpecilaityMenu