import React from "react";
import { assets } from "../assets/assets";

const Footer = () => {
    return (
        <footer className="bg-gradient-to-br from-gray-50 to-gray-100 border-t border-gray-200">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-12">
                    
                    {/*----- Phần thông tin chính --------*/}
                    <div className="lg:col-span-2">
                        <img className="mb-6 w-44 h-auto" src={assets.logo} alt="Prescripto Logo" />
                        <p className="text-gray-600 leading-7 mb-6 max-w-md">
                            Prescripto là nền tảng đặt lịch khám bệnh nhanh chóng và tiện lợi,
                            giúp bạn dễ dàng quản lý sức khỏe mọi lúc, mọi nơi. Chúng tôi luôn
                            nỗ lực mang đến trải nghiệm tốt nhất cho bạn.
                        </p>
                        
                        {/* Social Media */}
                        <div className="flex space-x-4">
                            <a href="#" className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-shadow duration-300 group">
                                <svg className="w-5 h-5 text-blue-600 group-hover:text-blue-700" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                </svg>
                            </a>
                            <a href="#" className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-shadow duration-300 group">
                                <svg className="w-5 h-5 text-pink-600 group-hover:text-pink-700" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.120.112.225.085.345-.09.375-.293 1.199-.335 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.758-1.378l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001 12.017.001z"/>
                                </svg>
                            </a>
                            <a href="#" className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-shadow duration-300 group">
                                <svg className="w-5 h-5 text-blue-600 group-hover:text-blue-700" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                                </svg>
                            </a>
                            <a href="#" className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-shadow duration-300 group">
                                <svg className="w-5 h-5 text-red-600 group-hover:text-red-700" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/*----- Phần công ty --------*/}
                    <div>
                        <h3 className="text-lg font-semibold mb-6 text-gray-800">CÔNG TY</h3>
                        <ul className="space-y-3">
                            <li>
                                <a href="/" className="text-gray-600 hover:text-blue-600 transition-colors duration-200 flex items-center group">
                                    <span className="w-2 h-2 bg-blue-600 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                                    Trang chủ
                                </a>
                            </li>
                            <li>
                                <a href="/about" className="text-gray-600 hover:text-blue-600 transition-colors duration-200 flex items-center group">
                                    <span className="w-2 h-2 bg-blue-600 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                                    Về chúng tôi
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors duration-200 flex items-center group">
                                    <span className="w-2 h-2 bg-blue-600 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                                    Dịch vụ
                                </a>
                            </li>
                            <li>
                                <a href="/contact" className="text-gray-600 hover:text-blue-600 transition-colors duration-200 flex items-center group">
                                    <span className="w-2 h-2 bg-blue-600 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                                    Liên hệ
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors duration-200 flex items-center group">
                                    <span className="w-2 h-2 bg-blue-600 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                                    Chính sách bảo mật
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/*----- Phần liên hệ --------*/}
                    <div>
                        <h3 className="text-lg font-semibold mb-6 text-gray-800">LIÊN HỆ</h3>
                        <div className="space-y-4">
                            <div className="flex items-start space-x-3">
                                <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                                    <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-gray-600 font-medium">Hotline</p>
                                    <a href="tel:+84912345678" className="text-blue-600 hover:text-blue-700 transition-colors">
                                        +84-912-345-678
                                    </a>
                                </div>
                            </div>
                            
                            <div className="flex items-start space-x-3">
                                <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                                    <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-gray-600 font-medium">Email</p>
                                    <a href="mailto:support@prescripto.com" className="text-blue-600 hover:text-blue-700 transition-colors">
                                        support@prescripto.com
                                    </a>
                                </div>
                            </div>
                            
                            <div className="flex items-start space-x-3">
                                <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                                    <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-gray-600 font-medium">Địa chỉ</p>
                                    <p className="text-gray-600 text-sm leading-5">
                                        123 Đường ABC, Quận 1<br />
                                        TP. Hồ Chí Minh, Việt Nam
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/*----- Phần bản quyền --------*/}
                <div className="border-t border-gray-200 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        <p className="text-sm text-gray-500 text-center md:text-left">
                            © 2024 Prescripto. Mọi quyền được bảo lưu.
                        </p>
                        
                        <div className="flex space-x-6 text-sm">
                            <a href="#" className="text-gray-500 hover:text-gray-700 transition-colors">
                                Điều khoản sử dụng
                            </a>
                            <a href="#" className="text-gray-500 hover:text-gray-700 transition-colors">
                                Chính sách bảo mật
                            </a>
                            <a href="#" className="text-gray-500 hover:text-gray-700 transition-colors">
                                Cookies
                            </a>
                        </div>
                    </div>
                </div>

                {/* Back to Top Button */}
                <button 
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="fixed bottom-8 right-8 w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
                    aria-label="Back to top"
                >
                    <svg className="w-5 h-5 transform group-hover:-translate-y-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                </button>
            </div>
        </footer>
    );
};

export default Footer;