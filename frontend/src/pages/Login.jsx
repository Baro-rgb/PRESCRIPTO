import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const Login = () => {

  const { backendUrl, token, setToken } = useContext(AppContext)
  const navigate = useNavigate()

  const [state, setState] = useState('Đăng ký')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const onSubmitHandler = async (event) => {
    event.preventDefault()
    setIsLoading(true)

    try {
      if (state === 'Đăng ký') {
        const { data } = await axios.post(backendUrl + '/api/user/register', { name, password, email })
        if (data.success) {
          // ✅ Thêm CustomEvent khi đăng ký thành công
          localStorage.setItem('token', data.token)
          localStorage.setItem('user', JSON.stringify(data.user)) // 👈 thêm dòng này
          setToken(data.token)
          window.dispatchEvent(new CustomEvent('authUpdate')) // Trigger manual update
          toast.success('Đăng ký thành công!')
        } else {
          toast.error(data.message)
        }
      } else {
        const { data } = await axios.post(backendUrl + '/api/user/login', { password, email })
        if (data.success) {
          // ✅ Thêm CustomEvent khi đăng nhập thành công
          localStorage.setItem('token', data.token)
          localStorage.setItem('user', JSON.stringify(data.user)) // 👈 thêm dòng này
          setToken(data.token)
          window.dispatchEvent(new CustomEvent('authUpdate')) // Trigger manual update
          toast.success('Đăng nhập thành công!')
        } else {
          toast.error(data.message)
        }
      }
    } catch (error) {
      toast.error(error.message)
    }
    
    setIsLoading(false)
  }

  // ✅ Thêm hàm logout (nếu cần)
  const handleLogout = () => {
    localStorage.removeItem('token')
    setToken('')
    window.dispatchEvent(new CustomEvent('authUpdate')) // Trigger manual update
    toast.success('Đăng xuất thành công!')
    navigate('/login')
  }

  useEffect(() => {
    if (token) {
      navigate('/')
    }
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mb-4">
            <span className="text-2xl text-white">🏥</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {state === 'Đăng ký' ? "Tạo tài khoản mới" : "Chào mừng trở lại"}
          </h1>
          <p className="text-gray-600">
            {state === 'Đăng ký' 
              ? "Đăng ký để trải nghiệm dịch vụ y tế tốt nhất" 
              : "Đăng nhập để tiếp tục đặt lịch khám"
            }
          </p>
        </div>

        {/* Form */}
        <form onSubmit={onSubmitHandler} className="bg-white rounded-2xl shadow-2xl p-8 space-y-6">
          
          {/* Toggle Buttons */}
          <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
            <button
              type="button"
              onClick={() => setState('Đăng nhập')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-300 ${
                state === 'Đăng nhập'
                  ? 'bg-white text-blue-600 shadow-md'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Đăng nhập
            </button>
            <button
              type="button"
              onClick={() => setState('Đăng ký')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-300 ${
                state === 'Đăng ký'
                  ? 'bg-white text-blue-600 shadow-md'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Đăng ký
            </button>
          </div>

          {/* Name Field (only for register) */}
          {state === "Đăng ký" && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                <span className="flex items-center gap-2">
                  👤 Họ và tên
                </span>
              </label>
              <input
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300 bg-gray-50 focus:bg-white"
                type="text"
                onChange={(e) => setName(e.target.value)}
                value={name}
                placeholder="Nhập họ và tên của bạn"
                required
              />
            </div>
          )}

          {/* Email Field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              <span className="flex items-center gap-2">
                📧 Email
              </span>
            </label>
            <input
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300 bg-gray-50 focus:bg-white"
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              placeholder="Nhập địa chỉ email"
              required
            />
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              <span className="flex items-center gap-2">
                🔒 Mật khẩu
              </span>
            </label>
            <div className="relative">
              <input
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300 bg-gray-50 focus:bg-white"
                type={showPassword ? "text" : "password"}
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                placeholder="Nhập mật khẩu"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                {showPassword ? '👁️' : '🙈'}
              </button>
            </div>
            
            {state === 'Đăng ký' && (
              <div className="text-xs text-gray-500 mt-1">
                Mật khẩu phải có ít nhất 6 ký tự
              </div>
            )}
          </div>

          {/* Forgot Password (only for login) */}
          {state === 'Đăng nhập' && (
            <div className="text-right">
              <button
                type="button"
                className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
              >
                Quên mật khẩu?
              </button>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-xl font-semibold text-white transition-all duration-300 ${
              isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Đang xử lý...
              </div>
            ) : (
              <span className="flex items-center justify-center gap-2">
                {state === 'Đăng ký' ? '🎉 Tạo tài khoản' : '🚀 Đăng nhập'}
              </span>
            )}
          </button>

          {/* Terms (only for register) */}
          {state === "Đăng ký" && (
            <div className="text-xs text-gray-500 text-center">
              Bằng việc đăng ký, bạn đồng ý với{' '}
              <button type="button" className="text-blue-600 hover:underline">
                Điều khoản dịch vụ
              </button>{' '}
              và{' '}
              <button type="button" className="text-blue-600 hover:underline">
                Chính sách bảo mật
              </button>
            </div>
          )}

          {/* Switch Form */}
          <div className="text-center pt-4 border-t border-gray-100">
            {state === "Đăng ký" ? (
              <p className="text-gray-600">
                Đã có tài khoản?{" "}
                <button
                  type="button"
                  onClick={() => setState('Đăng nhập')}
                  className="text-blue-600 font-medium hover:text-blue-700 transition-colors"
                >
                  Đăng nhập ngay
                </button>
              </p>
            ) : (
              <p className="text-gray-600">
                Chưa có tài khoản?{" "}
                <button
                  type="button"
                  onClick={() => setState('Đăng ký')}
                  className="text-blue-600 font-medium hover:text-blue-700 transition-colors"
                >
                  Đăng ký miễn phí
                </button>
              </p>
            )}
          </div>
        </form>

        {/* Social Login */}
        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gradient-to-br from-blue-50 via-white to-indigo-50 text-gray-500">
                Hoặc tiếp tục với
              </span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <button
              type="button"
              className="w-full bg-white border-2 border-gray-300 rounded-xl py-3 px-4 hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 flex items-center justify-center gap-2 font-medium text-gray-700"
            >
              <span className="text-lg">🔍</span>
              Google
            </button>
            <button
              type="button"
              className="w-full bg-white border-2 border-gray-300 rounded-xl py-3 px-4 hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 flex items-center justify-center gap-2 font-medium text-gray-700"
            >
              <span className="text-lg">📘</span>
              Facebook
            </button>
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
            Tại sao chọn chúng tôi?
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <span className="text-green-500">✅</span>
              Đặt lịch khám nhanh chóng, tiện lợi
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <span className="text-green-500">✅</span>
              Đội ngũ bác sĩ chuyên nghiệp, giàu kinh nghiệm
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <span className="text-green-500">✅</span>
              Hệ thống thanh toán an toàn, bảo mật
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <span className="text-green-500">✅</span>
              Hỗ trợ khách hàng 24/7
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login