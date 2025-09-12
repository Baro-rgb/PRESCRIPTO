import React, { useState } from 'react'
import { assets } from '../assets/assets'

const Contact = () => {
    const [hoveredCard, setHoveredCard] = useState(null)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    })

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        // Handle form submission
        console.log('Form submitted:', formData)
    }

    return (
        <>
            {/* Fixed full-screen background */}
            <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 -z-10"></div>
            
            {/* Full background decorations */}
            <div className="fixed inset-0 overflow-hidden -z-10">
                {/* Large gradient orbs */}
                <div className="absolute -top-20 -left-20 w-80 h-80 bg-gradient-to-br from-blue-400/15 to-blue-600/25 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-gradient-to-br from-purple-400/15 to-purple-600/25 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/3 -right-32 w-64 h-64 bg-gradient-to-br from-pink-400/15 to-pink-600/25 rounded-full blur-3xl animate-pulse delay-500"></div>
                
                {/* Communication pattern overlay */}
                <div className="absolute inset-0 opacity-3">
                    <div className="absolute top-40 left-20 text-6xl text-blue-500 transform rotate-12 animate-pulse">📞</div>
                    <div className="absolute top-80 right-32 text-5xl text-purple-500 transform -rotate-12 animate-pulse delay-700">✉️</div>
                    <div className="absolute bottom-32 right-20 text-4xl text-pink-500 transform -rotate-6 animate-pulse delay-1400">🏢</div>
                    <div className="absolute bottom-60 left-1/4 text-5xl text-green-500 transform rotate-15 animate-pulse delay-2100">💼</div>
                </div>
            </div>

            <div className="relative min-h-screen px-4 md:px-10 py-16">
                {/* Header Section */}
                <div className='text-center mb-16'>
                    <div className='flex items-center justify-center gap-3 mb-6'>
                        <div className='w-12 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full'></div>
                        <span className='text-blue-600 font-semibold text-sm uppercase tracking-wide'>Contact Us</span>
                        <div className='w-12 h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full'></div>
                    </div>
                    
                    <h1 className='text-4xl md:text-6xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent leading-tight mb-4'>
                        LIÊN <span className='text-blue-600'>HỆ</span>
                    </h1>
                    
                    <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
                        Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn. Hãy liên hệ với chúng tôi qua các kênh dưới đây
                    </p>
                </div>

                {/* Main Content Section */}
                <div className='max-w-7xl mx-auto mb-20'>
                    <div className='grid lg:grid-cols-2 gap-16 items-start'>
                        {/* Left Side - Image and Office Info */}
                        <div className='space-y-8'>
                            {/* Image Section */}
                            <div className='relative group'>
                                <div className='absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl blur-xl transform rotate-3'></div>
                                <div className='relative bg-white rounded-3xl p-6 shadow-2xl group-hover:shadow-3xl transition-all duration-500'>
                                    <img 
                                        className='w-full h-auto object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500' 
                                        src={assets.contact_image} 
                                        alt="Contact Prescripto" 
                                    />
                                    
                                    {/* Floating contact badge */}
                                    <div className='absolute -top-4 -right-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl p-4 shadow-xl'>
                                        <div className='text-center'>
                                            <div className='text-xl font-bold'>24/7</div>
                                            <div className='text-xs'>Hỗ trợ</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Office Information Cards */}
                            <div className='space-y-6'>
                                {/* Office Location */}
                                <div className='bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300'>
                                    <div className='flex items-start gap-4'>
                                        <div className='w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0'>
                                            <span className='text-white text-xl'>🏢</span>
                                        </div>
                                        <div>
                                            <h3 className='text-xl font-bold text-gray-800 mb-2'>VĂN PHÒNG CỦA CHÚNG TÔI</h3>
                                            <p className='text-gray-600 leading-relaxed'>
                                                123 Nguyễn Huệ, Quận 1<br />
                                                Thành phố Hồ Chí Minh, Việt Nam
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Contact Information */}
                                <div className='bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300'>
                                    <div className='flex items-start gap-4'>
                                        <div className='w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center flex-shrink-0'>
                                            <span className='text-white text-xl'>📞</span>
                                        </div>
                                        <div>
                                            <h3 className='text-xl font-bold text-gray-800 mb-2'>THÔNG TIN LIÊN HỆ</h3>
                                            <div className='space-y-2 text-gray-600'>
                                                <p className='flex items-center gap-2'>
                                                    <span className='text-blue-500'>📞</span>
                                                    <a href="tel:+84123456789" className='hover:text-blue-600 transition-colors'>
                                                        +84 123 456 789
                                                    </a>
                                                </p>
                                                <p className='flex items-center gap-2'>
                                                    <span className='text-blue-500'>✉️</span>
                                                    <a href="mailto:contact@prescripto.vn" className='hover:text-blue-600 transition-colors'>
                                                        contact@prescripto.vn
                                                    </a>
                                                </p>
                                                <p className='flex items-center gap-2'>
                                                    <span className='text-blue-500'>🌐</span>
                                                    <a href="/" className='hover:text-blue-600 transition-colors'>
                                                        www.prescripto.vn
                                                    </a>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Career Information */}
                                <div className='bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300'>
                                    <div className='flex items-start gap-4'>
                                        <div className='w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0'>
                                            <span className='text-white text-xl'>💼</span>
                                        </div>
                                        <div className='flex-1'>
                                            <h3 className='text-xl font-bold text-gray-800 mb-2'>CƠ HỘI NGHỀ NGHIỆP</h3>
                                            <p className='text-gray-600 mb-4 leading-relaxed'>
                                                Tìm hiểu thêm về đội ngũ và các vị trí tuyển dụng của chúng tôi. Cùng nhau xây dựng tương lai y tế số.
                                            </p>
                                            <button className='bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl'>
                                                🚀 Xem việc làm
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Side - Contact Form */}
                        <div className='bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/50'>
                            <div className='mb-8'>
                                <h2 className='text-2xl font-bold text-gray-800 mb-2'>Gửi tin nhắn cho chúng tôi</h2>
                                <p className='text-gray-600'>Chúng tôi sẽ phản hồi trong vòng 24 giờ</p>
                            </div>

                            <form onSubmit={handleSubmit} className='space-y-6'>
                                <div>
                                    <label className='block text-gray-700 font-medium mb-2'>Họ và tên *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className='w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 bg-white/50'
                                        placeholder='Nhập họ và tên của bạn'
                                        required
                                    />
                                </div>

                                <div>
                                    <label className='block text-gray-700 font-medium mb-2'>Email *</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className='w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 bg-white/50'
                                        placeholder='your.email@example.com'
                                        required
                                    />
                                </div>

                                <div>
                                    <label className='block text-gray-700 font-medium mb-2'>Tin nhắn *</label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        rows={6}
                                        className='w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 resize-none bg-white/50'
                                        placeholder='Hãy cho chúng tôi biết bạn cần hỗ trợ gì...'
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className='w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl'
                                >
                                    📤 Gửi tin nhắn
                                </button>
                            </form>

                            {/* Quick Contact Options */}
                            <div className='mt-8 pt-8 border-t border-gray-200'>
                                <p className='text-center text-gray-600 mb-4'>Hoặc liên hệ trực tiếp qua:</p>
                                <div className='flex justify-center gap-4'>
                                    <a
                                        href="tel:+84123456789"
                                        className='flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105'
                                    >
                                        <span>📞</span>
                                        <span className='font-medium'>Gọi ngay</span>
                                    </a>
                                    <a
                                        href="mailto:contact@prescripto.vn"
                                        className='flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105'
                                    >
                                        <span>✉️</span>
                                        <span className='font-medium'>Email</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className='max-w-4xl mx-auto'>
                    <div className='text-center mb-12'>
                        <h2 className='text-3xl font-bold text-gray-800 mb-4'>
                            Câu hỏi <span className='text-blue-600'>thường gặp</span>
                        </h2>
                        <p className='text-gray-600'>Tìm câu trả lời nhanh cho những thắc mắc phổ biến</p>
                    </div>

                    <div className='grid md:grid-cols-2 gap-6'>
                        <div className='bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300'>
                            <h3 className='text-lg font-bold text-gray-800 mb-2'>Làm thế nào để đặt lịch hẹn?</h3>
                            <p className='text-gray-600'>Bạn có thể đặt lịch trực tuyến qua website hoặc ứng dụng mobile của chúng tôi 24/7.</p>
                        </div>

                        <div className='bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300'>
                            <h3 className='text-lg font-bold text-gray-800 mb-2'>Chi phí khám bệnh như thế nào?</h3>
                            <p className='text-gray-600'>Chi phí được niêm yết rõ ràng cho từng dịch vụ và được cập nhật thường xuyên.</p>
                        </div>

                        <div className='bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300'>
                            <h3 className='text-lg font-bold text-gray-800 mb-2'>Có hỗ trợ tư vấn online không?</h3>
                            <p className='text-gray-600'>Có, chúng tôi cung cấp dịch vụ tư vấn trực tuyến qua video call với các bác sĩ chuyên khoa.</p>
                        </div>

                        <div className='bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300'>
                            <h3 className='text-lg font-bold text-gray-800 mb-2'>Thông tin cá nhân có được bảo mật?</h3>
                            <p className='text-gray-600'>Tuyệt đối. Chúng tôi tuân thủ nghiêm ngặt các quy định về bảo mật thông tin y tế.</p>
                        </div>
                    </div>
                </div>

                {/* Bottom CTA */}
                <div className='max-w-4xl mx-auto mt-16 text-center bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl p-12 text-white'>
                    <h2 className='text-3xl font-bold mb-4'>Sẵn sàng bắt đầu?</h2>
                    <p className='text-lg mb-8 opacity-90'>
                        Tham gia cùng hàng ngàn người dùng đã tin tưởng Prescripto cho nhu cầu chăm sóc sức khỏe
                    </p>
                    <div className='flex flex-col sm:flex-row gap-4 justify-center'>
                        <button className='bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transform hover:scale-105 transition-all duration-300 shadow-lg'>
                            🚀 Đăng ký ngay
                        </button>
                        <button className='bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-blue-600 transform hover:scale-105 transition-all duration-300'>
                            📞 Tư vấn miễn phí
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Contact