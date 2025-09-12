import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const Banner = () => {
    const navigate = useNavigate()

    return (
        <div className='relative flex bg-gradient-to-br from-primary via-primary to-blue-600 rounded-2xl px-6 sm:px-10 md:px-14 lg:px-12 my-20 md:mx-10 overflow-hidden shadow-2xl'>
            {/* Animated background elements */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full animate-pulse"></div>
                <div className="absolute top-32 right-20 w-16 h-16 bg-white rounded-full animate-bounce delay-300"></div>
                <div className="absolute bottom-20 left-20 w-12 h-12 bg-white rounded-full animate-pulse delay-700"></div>
                <div className="absolute top-20 right-40 w-8 h-8 bg-white rounded-full animate-bounce delay-1000"></div>
            </div>

            {/* Floating medical icons */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-16 left-16 text-white/20 text-2xl animate-float">
                    <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                </div>
                <div className="absolute top-32 right-32 text-white/20 text-xl animate-float delay-500">
                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14h-4v-4H6v-2h4V7h4v4h4v2h-4v4z"/>
                    </svg>
                </div>
                <div className="absolute bottom-24 left-24 text-white/20 text-lg animate-float delay-1000">
                    <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                </div>
            </div>

            {/*----- Left Side --------*/}
            <div className='flex-1 py-8 sm:py-10 md:py-16 lg:py-24 lg:pl-5 relative z-10'>
                <div className='text-xl sm:text-2xl md:text-3xl lg:text-5xl font-bold text-white leading-tight'>
                    <p className='transform hover:scale-105 transition-transform duration-300 inline-block'>
                        Đặt lịch hẹn
                    </p>
                    <p className='mt-4 transform hover:scale-105 transition-transform duration-300 inline-block bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent'>
                        Với hơn <span className='text-yellow-300 font-extrabold animate-pulse'>100+</span> bác sĩ đáng tin cậy
                    </p>
                </div>
                
                {/* Additional features list */}
                <div className='mt-6 space-y-2 text-white/90'>
                    <div className='flex items-center space-x-2 transform hover:translate-x-2 transition-transform duration-300'>
                        <svg className='w-5 h-5 text-green-300' fill='currentColor' viewBox='0 0 20 20'>
                            <path fillRule='evenodd' d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' clipRule='evenodd' />
                        </svg>
                        <span className='text-sm sm:text-base'>Đặt lịch 24/7 - Dễ dàng & nhanh chóng</span>
                    </div>
                    <div className='flex items-center space-x-2 transform hover:translate-x-2 transition-transform duration-300'>
                        <svg className='w-5 h-5 text-green-300' fill='currentColor' viewBox='0 0 20 20'>
                            <path fillRule='evenodd' d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' clipRule='evenodd' />
                        </svg>
                        <span className='text-sm sm:text-base'>Bác sĩ chuyên khoa hàng đầu</span>
                    </div>
                    <div className='flex items-center space-x-2 transform hover:translate-x-2 transition-transform duration-300'>
                        <svg className='w-5 h-5 text-green-300' fill='currentColor' viewBox='0 0 20 20'>
                            <path fillRule='evenodd' d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' clipRule='evenodd' />
                        </svg>
                        <span className='text-sm sm:text-base'>Tư vấn miễn phí qua video call</span>
                    </div>
                </div>

                <div className='flex flex-col sm:flex-row gap-4 mt-8'>
                    <button 
                        onClick={()=>{navigate('/login'); scrollTo(0,0)}} 
                        className='group relative bg-white text-sm sm:text-base text-gray-700 font-semibold px-8 py-4 rounded-full hover:bg-gray-50 hover:scale-110 transform transition-all duration-300 shadow-lg hover:shadow-xl overflow-hidden'
                    >
                        <span className='relative z-10'>🚀 Tạo tài khoản ngay</span>
                        <div className='absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300'></div>
                    </button>
                    
                    <button className='group bg-transparent border-2 border-white text-white text-sm sm:text-base font-semibold px-8 py-4 rounded-full hover:bg-white hover:text-primary transform hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl'>
                        <span className='flex items-center justify-center space-x-2'>
                            <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
                                <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z' clipRule='evenodd' />
                            </svg>
                            <span>Xem demo</span>
                        </span>
                    </button>
                </div>

                {/* Stats */}
                <div className='flex flex-wrap gap-6 mt-8 text-white/80'>
                    <div className='text-center'>
                        <div className='text-2xl font-bold text-yellow-300'>15K+</div>
                        <div className='text-xs'>Bệnh nhân hài lòng</div>
                    </div>
                    <div className='text-center'>
                        <div className='text-2xl font-bold text-green-300'>4.9⭐</div>
                        <div className='text-xs'>Đánh giá trung bình</div>
                    </div>
                    <div className='text-center'>
                        <div className='text-2xl font-bold text-blue-300'>24/7</div>
                        <div className='text-xs'>Hỗ trợ khẩn cấp</div>
                    </div>
                </div>
            </div>

            {/*----- Right Side --------*/}
            <div className='hidden md:block md:w-1/2 lg:w-[370px] relative'>
                <div className='absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent rounded-2xl'></div>
                <img 
                    className='w-full absolute bottom-0 right-0 max-w-md transform hover:scale-105 transition-transform duration-500 filter drop-shadow-2xl' 
                    src={assets.appointment_img} 
                    alt="Doctor appointment illustration" 
                />
                
                {/* Floating cards */}
                <div className='absolute top-8 right-8 bg-white/10 backdrop-blur-sm rounded-xl p-4 shadow-xl animate-bounce'>
                    <div className='flex items-center space-x-2'>
                        <div className='w-3 h-3 bg-green-400 rounded-full animate-pulse'></div>
                        <span className='text-white text-sm font-medium'>Online 24/7</span>
                    </div>
                </div>
                
                {/* <div className='absolute bottom-32 right-16 bg-white/10 backdrop-blur-sm rounded-xl p-3 shadow-xl animate-pulse delay-500'>
                    <div className='text-white text-xs'>
                        <div className='font-semibold'>Dr. Nguyễn Văn A</div>
                        <div className='text-white/80'>Chuyên khoa tim mạch</div>
                        <div className='flex mt-1'>
                            <span className='text-yellow-400'>⭐⭐⭐⭐⭐</span>
                        </div>
                    </div>
                </div> */}
            </div>

            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                }
                .animate-float {
                    animation: float 3s ease-in-out infinite;
                }
            `}</style>
        </div>
    )
}

export default Banner