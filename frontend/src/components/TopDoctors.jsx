import React, { useState } from 'react'
import { doctors } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { AppContext } from '../context/AppContext'

const TopDoctors = () => {
    const [hoveredCard, setHoveredCard] = useState(null)
    const [viewMode, setViewMode] = useState('grid') // grid or list

    // Map chuyên khoa từ English -> Tiếng Việt
    const specialityMapping = {
        "General physician": "Bác sĩ đa khoa",
        "Gynecologist": "Sản phụ khoa",
        "Dermatologist": "Da liễu",
        "Pediatricians": "Nhi khoa",
        "Neurologist": "Thần kinh",
        "Gastroenterologist": "Tiêu hóa"
    }

    // Rating và experience giả lập cho demo
    const doctorStats = {
        rating: [4.8, 4.9, 4.7, 4.6, 4.8, 4.9, 4.5, 4.7, 4.8, 4.6],
        experience: [5, 7, 3, 4, 6, 5, 7, 8, 3, 5],
        patients: [1200, 800, 600, 2000, 900, 1500, 400, 1100, 750, 1300]
    }

    const navigate = useNavigate()
    const { doctors } = useContext(AppContext)

    return (
        <div className='relative flex flex-col items-center gap-6 my-20 text-gray-900 md:mx-10 overflow-hidden'>
            {/* Background decorations */}
            <div className="absolute inset-0 opacity-3">
                <div className="absolute top-20 left-10 w-40 h-40 bg-blue-500 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-10 w-32 h-32 bg-green-500 rounded-full blur-3xl"></div>
                <div className="absolute top-40 right-1/4 w-36 h-36 bg-purple-500 rounded-full blur-3xl"></div>
            </div>

            {/* Header Section */}
            <div className='text-center space-y-4 relative z-10 max-w-4xl mx-auto'>
                <div className='flex items-center justify-center gap-3 mb-4'>
                    <div className='w-12 h-1 bg-gradient-to-r from-green-500 to-blue-500 rounded-full'></div>
                    <span className='text-blue-600 font-semibold text-sm uppercase tracking-wide'>Top Doctors</span>
                    <div className='w-12 h-1 bg-gradient-to-r from-blue-500 to-green-500 rounded-full'></div>
                </div>

                <h1 className='text-4xl md:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent leading-tight'>
                    Bác sĩ hàng đầu để đặt lịch hẹn
                </h1>
                
                <p className='sm:w-2/3 mx-auto text-center text-gray-600 text-lg leading-relaxed'>
                    Đội ngũ bác sĩ giày vàng với nhiều năm kinh nghiệm, được đào tạo chuyên sâu và 
                    <span className='text-blue-600 font-semibold'> luôn sẵn sàng phục vụ bạn</span>
                </p>

                {/* View toggle and filters */}
                <div className='flex items-center justify-between max-w-md mx-auto mt-6'>
                    <div className='flex items-center gap-4 text-sm text-gray-600'>
                        <span>Hiển thị: 10 bác sĩ hàng đầu</span>
                    </div>
                    
                    <div className='flex items-center gap-2'>
                        <button 
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'}`}
                        >
                            <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 24 24'>
                                <path d='M10 4H4c-.55 0-1 .45-1 1v6c0 .55.45 1 1 1h6c.55 0 1-.45 1-1V5c0-.55-.45-1-1-1zM10 13H4c-.55 0-1 .45-1 1v6c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-6c0-.55-.45-1-1-1zM21 4h-6c-.55 0-1 .45-1 1v6c0 .55.45 1 1 1h6c.55 0 1-.45 1-1V5c0-.55-.45-1-1-1zM21 13h-6c-.55 0-1 .45-1 1v6c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-6c0-.55-.45-1-1-1z'/>
                            </svg>
                        </button>
                        <button 
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'}`}
                        >
                            <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 24 24'>
                                <path d='M4 6h2v2H4zm0 5h2v2H4zm0 5h2v2H4zm16-8V6H8.023v2H18.8zM8 11h12v2H8zm0 5h12v2H8z'/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Doctors Grid/List */}
            <div className={`w-full relative z-10 ${viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6' : 'flex flex-col gap-4 max-w-4xl mx-auto'} pt-8 px-3 sm:px-0`}>
                {doctors.slice(0, 10).map((item, index) => (
                    <div 
                        key={index}
                        onClick={() => { navigate(`/appointment/${item._id}`); scrollTo(0, 0) }}
                        onMouseEnter={() => setHoveredCard(index)}
                        onMouseLeave={() => setHoveredCard(null)}
                        className={`group relative bg-white rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-500 border border-gray-100 hover:border-blue-200 ${viewMode === 'list' ? 'flex items-center p-6 gap-6' : 'flex flex-col'}`}
                    >
                        {/* Animated background gradient */}
                        <div className='absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-green-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500'></div>
                        
                        {/* Floating particles */}
                        <div className='absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500'>
                            <div className='absolute top-4 right-4 w-2 h-2 bg-blue-400 rounded-full animate-ping'></div>
                            <div className='absolute bottom-4 left-4 w-1 h-1 bg-green-400 rounded-full animate-ping delay-300'></div>
                            <div className='absolute top-1/2 left-6 w-1 h-1 bg-purple-400 rounded-full animate-ping delay-700'></div>
                        </div>

                        {/* Doctor Image */}
                        <div className={`relative ${viewMode === 'list' ? 'w-24 h-24 flex-shrink-0' : 'w-full'}`}>
                            <img 
                                className={`${viewMode === 'list' ? 'w-24 h-24 rounded-xl object-cover' : 'w-full h-48 object-cover'} bg-gradient-to-br from-blue-50 to-green-50 group-hover:scale-110 transition-transform duration-500`}
                                src={item.image} 
                                alt={item.name}
                            />
                            
                            {/* Status badge */}
                            <div className={`absolute ${viewMode === 'list' ? 'top-2 right-2' : 'top-4 right-4'} flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium shadow-lg`}>
                                <div className={`w-2 h-2 rounded-full ${item.available ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                                <span className={item.available ? 'text-green-600' : 'text-gray-500'}>
                                    {item.available ? 'Online' : 'Offline'}
                                </span>
                            </div>

                            {/* Rating badge */}
                            <div className={`absolute ${viewMode === 'list' ? 'bottom-2 right-2' : 'bottom-4 right-4'} bg-yellow-400 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg transform scale-0 group-hover:scale-100 transition-transform duration-300 delay-200`}>
                                ⭐ {doctorStats.rating[index]}
                            </div>
                        </div>

                        {/* Doctor Info */}
                        <div className={`relative z-10 ${viewMode === 'list' ? 'flex-1' : 'p-6'} space-y-3`}>
                            {/* Header Info */}
                            <div className='space-y-2'>
                                <div className='flex items-center justify-between'>
                                    <h3 className='text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300'>
                                        {item.name}
                                    </h3>
                                    {viewMode === 'list' && (
                                        <div className='text-right'>
                                            <div className='text-sm font-semibold text-green-600'>
                                                {doctorStats.experience[index]} năm kinh nghiệm
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <p className='text-blue-600 text-sm font-medium bg-blue-50 px-3 py-1 rounded-full inline-block'>
                                    {specialityMapping[item.speciality] || item.speciality}
                                </p>
                            </div>

                            {/* Stats Row */}
                            <div className={`grid ${viewMode === 'list' ? 'grid-cols-3' : 'grid-cols-2'} gap-4 text-center`}>
                                <div className='space-y-1'>
                                    <div className='text-lg font-bold text-gray-800'>{doctorStats.experience[index]}</div>
                                    <div className='text-xs text-gray-500'>Năm KN</div>
                                </div>
                                <div className='space-y-1'>
                                    <div className='text-lg font-bold text-gray-800'>{doctorStats.patients[index]}+</div>
                                    <div className='text-xs text-gray-500'>Bệnh nhân</div>
                                </div>
                                {viewMode === 'list' && (
                                    <div className='space-y-1'>
                                        <div className='text-lg font-bold text-yellow-600'>⭐{doctorStats.rating[index]}</div>
                                        <div className='text-xs text-gray-500'>Đánh giá</div>
                                    </div>
                                )}
                            </div>

                            {/* Action Button */}
                            <div className={`pt-3 ${hoveredCard === index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} transition-all duration-300`}>
                                <button className='w-full bg-gradient-to-r from-blue-500 to-green-500 text-white py-2 px-4 rounded-xl font-semibold hover:from-blue-600 hover:to-green-600 transform hover:scale-105 transition-all duration-300 shadow-lg'>
                                    {item.available ? '📅 Đặt lịch ngay' : '📞 Đặt lịch chờ'}
                                </button>
                            </div>

                            {/* Quick info tags */}
                            <div className='flex flex-wrap gap-2 pt-2'>
                                <span className='text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full'>Tư vấn online</span>
                                <span className='text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full'>Khám tại nhà</span>
                                {item.available && <span className='text-xs bg-yellow-100 text-yellow-600 px-2 py-1 rounded-full'>Có lịch hôm nay</span>}
                            </div>
                        </div>

                        {/* Hover glow effect */}
                        <div className='absolute inset-0 bg-gradient-to-r from-blue-400/10 via-green-400/10 to-purple-400/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none'></div>
                    </div>
                ))}
            </div>

            {/* Bottom Section */}
            <div className='mt-12 text-center space-y-6 relative z-10'>
                {/* Statistics */}
                <div className='flex justify-center gap-8 mb-8'>
                    <div className='text-center'>
                        <div className='text-3xl font-bold text-blue-600'>100+</div>
                        <div className='text-sm text-gray-600'>Bác sĩ chuyên khoa</div>
                    </div>
                    <div className='text-center'>
                        <div className='text-3xl font-bold text-green-600'>15K+</div>
                        <div className='text-sm text-gray-600'>Lịch hẹn thành công</div>
                    </div>
                    <div className='text-center'>
                        <div className='text-3xl font-bold text-purple-600'>4.8⭐</div>
                        <div className='text-sm text-gray-600'>Đánh giá trung bình</div>
                    </div>
                </div>

                {/* CTA Buttons */}
                <div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
                    <button 
                        onClick={() => { navigate('/doctors'); scrollTo(0, 0) }} 
                        className='bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-full font-semibold hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl'
                    >
                        🔍 Xem tất cả bác sĩ
                    </button>
                    
                    <button className='bg-white border-2 border-gray-200 text-gray-700 px-8 py-4 rounded-full font-semibold hover:border-blue-300 hover:text-blue-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl'>
                        📞 Tư vấn miễn phí
                    </button>
                </div>

                {/* Trust indicators */}
                <div className='flex justify-center items-center gap-4 text-sm text-gray-500 mt-6'>
                    <div className='flex items-center gap-2'>
                        <div className='w-2 h-2 bg-green-500 rounded-full animate-pulse'></div>
                        <span>Được chứng nhận bởi Bộ Y Tế</span>
                    </div>
                    <div className='hidden sm:block w-1 h-4 bg-gray-300'></div>
                    <div className='flex items-center gap-2'>
                        <div className='w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-300'></div>
                        <span>Bảo mật thông tin 100%</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TopDoctors