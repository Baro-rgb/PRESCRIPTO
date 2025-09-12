import React from "react";
import { assets } from "../assets/assets";

const Header = () => {
  return (
    <>
      {/* Fixed full-screen background */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-100 via-blue-200 to-teal-100 -z-10"></div>

      {/* Full background decorations - fixed to viewport */}
      <div className="fixed inset-0 overflow-hidden -z-10">
        {/* Large gradient orbs */}
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-gradient-to-br from-blue-200/20 to-blue-300/25 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-gradient-to-br from-teal-200/20 to-teal-300/25 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 -right-32 w-64 h-64 bg-gradient-to-br from-cyan-200/20 to-cyan-300/25 rounded-full blur-3xl animate-pulse delay-500"></div>
        <div className="absolute bottom-1/4 -left-32 w-72 h-72 bg-gradient-to-br from-blue-200/15 to-blue-300/20 rounded-full blur-3xl animate-pulse delay-700"></div>

        {/* Medium floating elements */}
        <div className="absolute top-20 left-1/4 w-32 h-32 bg-gradient-to-br from-white/20 to-white/30 rounded-full blur-2xl animate-bounce"></div>
        <div className="absolute bottom-32 right-1/3 w-40 h-40 bg-gradient-to-br from-teal-200/15 to-teal-300/20 rounded-full blur-2xl animate-bounce delay-300"></div>

        {/* Small particles */}
        <div className="absolute top-32 right-20 w-16 h-16 bg-white/30 rounded-full blur-xl animate-ping"></div>
        <div className="absolute bottom-40 left-16 w-12 h-12 bg-cyan-200/25 rounded-full blur-xl animate-ping delay-500"></div>
        <div className="absolute top-64 left-1/2 w-20 h-20 bg-teal-200/20 rounded-full blur-xl animate-ping delay-1000"></div>

        {/* Geometric shapes */}
        <div className="absolute top-16 right-1/4 w-24 h-24 bg-gradient-to-r from-white/15 to-white/25 transform rotate-45 blur-xl animate-spin-slow"></div>
        <div className="absolute bottom-24 left-1/3 w-28 h-28 bg-gradient-to-r from-cyan-100/15 to-teal-200/20 transform rotate-12 blur-xl animate-spin-slow delay-2000"></div>

        {/* Medical pattern overlay */}
        <div className="absolute inset-0 opacity-50">
          <div className="absolute top-40 left-20 text-6xl text-blue-400 transform rotate-12 animate-pulse">
            ⚕️
          </div>
          <div className="absolute top-80 right-32 text-5xl text-teal-400 transform -rotate-12 animate-pulse delay-700">
            🩺
          </div>
          <div className="absolute bottom-32 right-20 text-4xl text-cyan-400 transform -rotate-6 animate-pulse delay-1400">
            💊
          </div>
          <div className="absolute bottom-60 left-1/4 text-5xl text-teal-500 transform rotate-15 animate-pulse delay-2100">
            🏥
          </div>
          <div className="absolute top-24 left-2/3 text-4xl text-blue-500 transform rotate-30 animate-pulse delay-500">
            ❤️
          </div>
        </div>

        {/* Animated lines/paths */}
        <div className="absolute top-1/4 left-1/4 w-px h-32 bg-gradient-to-b from-transparent via-white/30 to-transparent animate-pulse delay-300"></div>
        <div className="absolute top-2/3 right-1/4 w-32 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse delay-600"></div>
      </div>

      <div className="relative overflow-hidden h-[625px]">
        {/* Additional overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-blue-600/30 to-transparent"></div>

        {/* Decorative shapes - now relative to component */}
        <div className="absolute top-12 right-12 w-28 h-28 bg-white/10 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-24 left-12 w-20 h-20 bg-white/10 rounded-full blur-xl animate-bounce"></div>
        <div className="absolute top-1/3 right-1/4 w-14 h-14 bg-white/5 rounded-full animate-ping"></div>

        {/* Medical icons floating */}
        <div className="absolute top-24 left-1/5 animate-float">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
            <svg
              className="w-5 h-5 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 2a8 8 0 100 16 8 8 0 000-16zM9 5a1 1 0 112 0v4a1 1 0 11-2 0V5zM9 13a1 1 0 112 0v.01a1 1 0 11-2 0V13z"
              ></path>
            </svg>
          </div>
        </div>

        <div className="absolute bottom-36 right-24 animate-float-delay">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </div>
        </div>

        {/* Container chính */}
        <div className="relative flex flex-col md:flex-row items-center justify-between h-full px-6 md:px-10 lg:px-20 max-w-[1228px] mx-auto py-12">
          {/*----- Bên trái --------*/}
          <div className="md:w-1/2 flex flex-col items-start justify-center gap-5 z-10">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-white text-sm animate-fadeInUp">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Hệ thống y tế đáng tin cậy #1</span>
            </div>

            {/* Main heading */}
            <div className="animate-fadeInUp animation-delay-200">
              <p className="text-3xl md:text-4xl lg:text-5xl text-white font-bold leading-tight mb-3">
                Đặt lịch hẹn{" "}
                <span className="relative">
                  <span className="relative z-10 bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                    nhanh chóng
                  </span>
                  <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-300 to-orange-300 rounded-full opacity-60 animate-pulse"></div>
                </span>
                <br />
                với bác sĩ{" "}
                <span className="relative inline-block">
                  <span className="text-white">uy tín</span>
                  <svg
                    className="absolute -top-1 -right-6 w-8 h-8 text-yellow-300 animate-spin-slow"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </span>
              </p>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 mb-4 animate-fadeInUp animation-delay-400">
              <div className="text-center">
                <p className="text-xl font-bold text-white">500+</p>
                <p className="text-white/80 text-xs">Bác sĩ</p>
              </div>
              <div className="w-px h-8 bg-white/30"></div>
              <div className="text-center">
                <p className="text-xl font-bold text-white">50K+</p>
                <p className="text-white/80 text-xs">Bệnh nhân</p>
              </div>
              <div className="w-px h-8 bg-white/30"></div>
              <div className="text-center">
                <p className="text-xl font-bold text-white">98%</p>
                <p className="text-white/80 text-xs">Hài lòng</p>
              </div>
            </div>

            {/* Description */}
            <div className="flex flex-col md:flex-row items-start gap-3 text-white/90 text-sm font-light mb-4 animate-fadeInUp animation-delay-600">
              <img
                className="w-30 h-16 object-cover rounded-lg shadow-lg"
                src={assets.group_profiles}
                alt=""
              />
              <div>
                <p className="leading-relaxed">
                  🩺 Dễ dàng tìm kiếm trong danh sách bác sĩ uy tín
                  <br className="hidden sm:block" />
                  ⚡ Đặt lịch hẹn nhanh chóng, tiện lợi 24/7
                  <br className="hidden sm:block" />
                  🏥 Hệ thống y tế hiện đại, an toàn
                </p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 animate-fadeInUp animation-delay-800 mb-4">
              <a
                href="#speciality"
                className="group flex items-center justify-center gap-2 bg-gradient-to-r from-white to-gray-100 px-6 py-3 rounded-full text-gray-700 font-semibold text-sm shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 transform hover:-translate-y-1"
              >
                <span>Đặt lịch ngay</span>
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                  <img className="w-3 h-3" src={assets.arrow_icon} alt="" />
                </div>
              </a>

              <button className="flex items-center justify-center gap-2 border-2 border-white/30 backdrop-blur-sm px-6 py-3 rounded-full text-white font-medium text-sm hover:bg-white/10 transition-all duration-300">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832L14 10.202a1 1 0 000-1.664l-4.445-2.37z"
                  ></path>
                </svg>
                Xem video giới thiệu
              </button>
            </div>

            {/* Trust badges */}
            <div className="flex items-center gap-4 animate-fadeInUp animation-delay-1000">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="w-6 h-6 bg-yellow-400 rounded-full border border-white flex items-center justify-center"
                    >
                      <svg
                        className="w-3 h-3 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                  ))}
                </div>
                <span className="text-white/80 text-xs">Đánh giá 5 sao</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-3 h-3 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    ></path>
                  </svg>
                </div>
                <span className="text-white/80 text-xs">Được chứng nhận</span>
              </div>
            </div>
          </div>

          {/*------ Bên phải -------*/}
          <div className="md:w-1/2 relative flex items-center justify-center md:justify-end mt-8 md:mt-0">
            {/* Decorative elements */}
            <div className="absolute top-0 right-8 w-16 h-16 bg-white/20 rounded-2xl rotate-12 animate-float backdrop-blur-sm"></div>
            <div className="absolute top-20 right-2 w-10 h-10 bg-yellow-300/30 rounded-full animate-bounce backdrop-blur-sm"></div>

            {/* Main image */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-t from-blue-600/20 to-transparent rounded-2xl"></div>
              <img
                className="relative w-full h-auto object-cover rounded-2xl shadow-2xl group-hover:scale-105 transition-transform duration-500 animate-fadeInUp animation-delay-300 max-w-[450px] max-h-[400px]"
                src={assets.header_img}
                alt="Medical professionals"
              />
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes float {
            0%,
            100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-15px);
            }
          }

          @keyframes float-delay {
            0%,
            100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-12px);
            }
          }

          @keyframes spin-slow {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }

          .animate-fadeInUp {
            animation: fadeInUp 0.8s ease-out forwards;
          }

          .animation-delay-200 {
            animation-delay: 0.2s;
          }

          .animation-delay-300 {
            animation-delay: 0.3s;
          }

          .animation-delay-400 {
            animation-delay: 0.4s;
          }

          .animation-delay-600 {
            animation-delay: 0.6s;
          }

          .animation-delay-800 {
            animation-delay: 0.8s;
          }

          .animation-delay-1000 {
            animation-delay: 1s;
          }

          .animate-float {
            animation: float 3s ease-in-out infinite;
          }

          .animate-float-delay {
            animation: float-delay 4s ease-in-out infinite;
          }

          .animate-spin-slow {
            animation: spin-slow 8s linear infinite;
          }

          @keyframes spin-slow {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    </>
  );
};

export default Header;
