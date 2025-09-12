import React from 'react'
import { assets } from '../assets/assets'

const About = () => {
    return (
        <>
            {/* Fixed full-screen background */}
            <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-white to-green-50 -z-10"></div>
            
            {/* Full background decorations */}
            <div className="fixed inset-0 overflow-hidden -z-10">
                {/* Large gradient orbs */}
                <div className="absolute -top-20 -left-20 w-80 h-80 bg-gradient-to-br from-blue-400/15 to-blue-600/25 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-gradient-to-br from-green-400/15 to-green-600/25 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 -right-32 w-64 h-64 bg-gradient-to-br from-purple-400/15 to-purple-600/25 rounded-full blur-3xl animate-pulse delay-500"></div>
                
                {/* Medical pattern overlay */}
                <div className="absolute inset-0 opacity-3">
                    <div className="absolute top-40 left-20 text-6xl text-blue-500 transform rotate-12 animate-pulse">⚕️</div>
                    <div className="absolute top-80 right-32 text-5xl text-green-500 transform -rotate-12 animate-pulse delay-700">🩺</div>
                    <div className="absolute bottom-32 right-20 text-4xl text-purple-500 transform -rotate-6 animate-pulse delay-1400">💊</div>
                </div>
            </div>

            <div className="relative min-h-screen px-4 md:px-10 py-16">
                {/* Header Section */}
                <div className='text-center mb-16'>
                    <div className='flex items-center justify-center gap-3 mb-6'>
                        <div className='w-12 h-1 bg-gradient-to-r from-blue-500 to-green-500 rounded-full'></div>
                        <span className='text-blue-600 font-semibold text-sm uppercase tracking-wide'>About Us</span>
                        <div className='w-12 h-1 bg-gradient-to-r from-green-500 to-blue-500 rounded-full'></div>
                    </div>
                    
                    <h1 className='text-4xl md:text-6xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent leading-tight mb-4'>
                        VỀ <span className='text-blue-600'>CHÚNG TÔI</span>
                    </h1>
                    
                    <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
                        Khám phá câu chuyện về Prescripto - nền tảng chăm sóc sức khỏe hiện đại hàng đầu Việt Nam
                    </p>
                </div>

                {/* Main Content Section */}
                <div className='max-w-7xl mx-auto mb-20'>
                    <div className='grid md:grid-cols-2 gap-12 items-center'>
                        {/* Image Section */}
                        <div className='relative group'>
                            <div className='absolute inset-0 bg-gradient-to-br from-blue-500/20 to-green-500/20 rounded-3xl blur-xl transform rotate-3'></div>
                            <div className='relative bg-white rounded-3xl p-6 shadow-2xl group-hover:shadow-3xl transition-all duration-500'>
                                <img 
                                    className='w-full h-auto object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500' 
                                    src={assets.about_image} 
                                    alt="About Prescripto" 
                                />
                                
                                {/* Floating stats */}
                                <div className='absolute -top-4 -right-4 bg-white rounded-2xl p-4 shadow-xl border border-gray-100'>
                                    <div className='text-center'>
                                        <div className='text-2xl font-bold text-blue-600'>10K+</div>
                                        <div className='text-xs text-gray-500'>Bệnh nhân tin tưởng</div>
                                    </div>
                                </div>
                                
                                <div className='absolute -bottom-4 -left-4 bg-white rounded-2xl p-4 shadow-xl border border-gray-100'>
                                    <div className='text-center'>
                                        <div className='text-2xl font-bold text-green-600'>98%</div>
                                        <div className='text-xs text-gray-500'>Hài lòng</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Content Section */}
                        <div className='space-y-8'>
                            <div className='bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/50'>
                                <h2 className='text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3'>
                                    <div className='w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center'>
                                        <span className='text-white text-sm'>🚀</span>
                                    </div>
                                    Câu chuyện của chúng tôi
                                </h2>
                                <p className='text-gray-600 leading-relaxed mb-4'>
                                    Chào mừng bạn đến với <span className='text-blue-600 font-semibold'>Prescripto</span>, người bạn đồng hành đáng tin cậy trong việc quản lý nhu cầu chăm sóc sức khỏe của bạn một cách tiện lợi và hiệu quả. Tại Prescripto, chúng tôi thấu hiểu những khó khăn mà mọi người thường gặp phải khi đặt lịch hẹn với bác sĩ và quản lý hồ sơ y tế.
                                </p>
                                <p className='text-gray-600 leading-relaxed'>
                                    Prescripto cam kết mang đến sự xuất sắc trong công nghệ y tế. Chúng tôi không ngừng nỗ lực nâng cấp nền tảng, tích hợp các tiến bộ mới nhất để cải thiện trải nghiệm người dùng và mang đến dịch vụ tốt nhất.
                                </p>
                            </div>

                            <div className='bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/50'>
                                <h2 className='text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3'>
                                    <div className='w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center'>
                                        <span className='text-white text-sm'>🎯</span>
                                    </div>
                                    Tầm nhìn của chúng tôi
                                </h2>
                                <p className='text-gray-600 leading-relaxed'>
                                    Tầm nhìn của Prescripto là tạo ra một trải nghiệm chăm sóc sức khỏe liền mạch cho mọi người. Chúng tôi mong muốn thu hẹp khoảng cách giữa bệnh nhân và các chuyên gia y tế, giúp bạn dễ dàng tiếp cận dịch vụ y tế khi cần thiết.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Why Choose Us Section */}
                <div className='max-w-7xl mx-auto'>
                    <div className='text-center mb-12'>
                        <h2 className='text-3xl md:text-4xl font-bold text-gray-800 mb-4'>
                            TẠI SAO <span className='text-blue-600'>CHỌN CHÚNG TÔI</span>
                        </h2>
                        <p className='text-gray-600 max-w-2xl mx-auto'>
                            Những giá trị cốt lõi làm nên sự khác biệt của Prescripto
                        </p>
                    </div>

                    <div className='grid md:grid-cols-3 gap-8'>
                        {/* Efficiency Card */}
                        <div className='group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-500 border border-gray-100 hover:border-blue-200 overflow-hidden'>
                            {/* Background gradient on hover */}
                            <div className='absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500'></div>
                            
                            {/* Floating particles */}
                            <div className='absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500'>
                                <div className='absolute top-4 right-4 w-2 h-2 bg-white rounded-full animate-ping'></div>
                                <div className='absolute bottom-6 left-6 w-1 h-1 bg-white rounded-full animate-ping delay-300'></div>
                            </div>
                            
                            <div className='relative z-10'>
                                <div className='w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-white/20 transition-all duration-300'>
                                    <span className='text-2xl'>⚡</span>
                                </div>
                                
                                <h3 className='text-xl font-bold text-gray-800 group-hover:text-white transition-colors duration-300 mb-4'>
                                    HIỆU QUẢ
                                </h3>
                                
                                <p className='text-gray-600 group-hover:text-white/90 transition-colors duration-300 leading-relaxed'>
                                    Đặt lịch hẹn nhanh chóng, phù hợp với lịch trình bận rộn của bạn. Chỉ với vài cú click, bạn có thể tìm và đặt lịch với bác sĩ phù hợp.
                                </p>
                                
                                <div className='mt-6 flex items-center gap-2 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300'>
                                    <span className='text-white text-sm font-medium'>Tìm hiểu thêm</span>
                                    <svg className='w-4 h-4 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Convenience Card */}
                        <div className='group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-500 border border-gray-100 hover:border-green-200 overflow-hidden'>
                            <div className='absolute inset-0 bg-gradient-to-br from-green-500 to-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500'></div>
                            
                            <div className='absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500'>
                                <div className='absolute top-4 right-4 w-2 h-2 bg-white rounded-full animate-ping'></div>
                                <div className='absolute bottom-6 left-6 w-1 h-1 bg-white rounded-full animate-ping delay-300'></div>
                            </div>
                            
                            <div className='relative z-10'>
                                <div className='w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-white/20 transition-all duration-300'>
                                    <span className='text-2xl'>🎯</span>
                                </div>
                                
                                <h3 className='text-xl font-bold text-gray-800 group-hover:text-white transition-colors duration-300 mb-4'>
                                    TIỆN LỢI
                                </h3>
                                
                                <p className='text-gray-600 group-hover:text-white/90 transition-colors duration-300 leading-relaxed'>
                                    Kết nối với mạng lưới các bác sĩ và chuyên gia y tế uy tín gần bạn. Tìm kiếm theo địa điểm, chuyên khoa và đánh giá.
                                </p>
                                
                                <div className='mt-6 flex items-center gap-2 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300'>
                                    <span className='text-white text-sm font-medium'>Tìm hiểu thêm</span>
                                    <svg className='w-4 h-4 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Personalization Card */}
                        <div className='group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-500 border border-gray-100 hover:border-purple-200 overflow-hidden'>
                            <div className='absolute inset-0 bg-gradient-to-br from-purple-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500'></div>
                            
                            <div className='absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500'>
                                <div className='absolute top-4 right-4 w-2 h-2 bg-white rounded-full animate-ping'></div>
                                <div className='absolute bottom-6 left-6 w-1 h-1 bg-white rounded-full animate-ping delay-300'></div>
                            </div>
                            
                            <div className='relative z-10'>
                                <div className='w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-white/20 transition-all duration-300'>
                                    <span className='text-2xl'>⭐</span>
                                </div>
                                
                                <h3 className='text-xl font-bold text-gray-800 group-hover:text-white transition-colors duration-300 mb-4'>
                                    CÁ NHÂN HÓA
                                </h3>
                                
                                <p className='text-gray-600 group-hover:text-white/90 transition-colors duration-300 leading-relaxed'>
                                    Đưa ra gợi ý và nhắc nhở phù hợp để bạn luôn chủ động trong việc chăm sóc sức khỏe. AI thông minh học hỏi từ thói quen của bạn.
                                </p>
                                
                                <div className='mt-6 flex items-center gap-2 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300'>
                                    <span className='text-white text-sm font-medium'>Tìm hiểu thêm</span>
                                    <svg className='w-4 h-4 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Section */}
                <div className='max-w-6xl mx-auto mt-20 bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50'>
                    <div className='grid grid-cols-2 md:grid-cols-4 gap-8 text-center'>
                        <div className='space-y-2'>
                            <div className='text-3xl font-bold text-blue-600'>10,000+</div>
                            <div className='text-gray-600'>Bệnh nhân tin tưởng</div>
                        </div>
                        <div className='space-y-2'>
                            <div className='text-3xl font-bold text-green-600'>500+</div>
                            <div className='text-gray-600'>Bác sĩ chuyên khoa</div>
                        </div>
                        <div className='space-y-2'>
                            <div className='text-3xl font-bold text-purple-600'>98%</div>
                            <div className='text-gray-600'>Tỷ lệ hài lòng</div>
                        </div>
                        <div className='space-y-2'>
                            <div className='text-3xl font-bold text-pink-600'>24/7</div>
                            <div className='text-gray-600'>Hỗ trợ khách hàng</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default About