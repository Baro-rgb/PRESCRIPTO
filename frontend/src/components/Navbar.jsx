import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { NavLink, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'

const Navbar = () => {

    const navigate = useNavigate()

    const {token,setToken,userData} = useContext(AppContext)

    const [showMenu, setShowMenu] = useState(false)
    //const [token, setToken] = useState(true)

    // ✅ Updated logout function with CustomEvent
    const logout = () => {
        setToken(false)
        localStorage.removeItem('token')
        
        // ✅ Trigger authUpdate event để các component khác update
        window.dispatchEvent(new CustomEvent('authUpdate'))
        
        // ✅ Show success message
        toast.success('Đăng xuất thành công!')
        
        // ✅ Navigate to home page
        navigate('/')
    }

  return (
    <div className='flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400'>
        <img onClick={()=>navigate('/')} className='w-44 cursor-pointer' src={assets.logo} alt=""/>
        <ul className='hidden md:flex items-start gap-5 font-medium'>
            <NavLink to='/'>
                <li className='py-1'>TRANG CHỦ</li>
                <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden'/>
            </NavLink>
            <NavLink to='/doctors'>
                <li className='py-1'>TẤT CẢ BÁC SĨ</li>
                <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden'/>
            </NavLink>
            <NavLink  to='/about'>
                <li className='py-1'>VỀ CHÚNG TÔI</li>
                <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden'/>
            </NavLink>
            <NavLink to='/contact'>
                <li className='py-1'>LIÊN HỆ</li>
                <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden'/>
            </NavLink>
        </ul>
        <div className='flex items-center gap-4'>
            {
                token && userData
                ? <div className='flex items-center gap-2 cursor-pointer group relative'>
                    <img className='w-8 rounded-full' src={userData.image} alt="" />
                    <img className='w-2.5' src={assets.dropdown_icon} alt="" />
                    <div className='absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block'>
                        <div className='min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4'>
                            <p onClick={()=>navigate('my-profile')} className='hover:text-black cursor-pointer'>Hồ sơ của tôi</p>
                            <p onClick={()=>navigate('my-appointments')} className='hover:text-black cursor-pointer'>Lịch hẹn của tôi</p>
                            <p onClick={logout} className='hover:text-black cursor-pointer'>Đăng xuất</p>
                        </div>
                    </div>
                </div>
                :<button onClick={()=>navigate('/login')} className='bg-primary text-white px-8 py-3 rounded-full font-light hidden md:block'>Tạo tài khoản</button>
            }
            <img onClick={()=>setShowMenu(true)} className='w-6 md:hidden' src={assets.menu_icon} alt="" />
            {/*----- Mobile Menu --------*/}
            <div className={` ${showMenu ? 'fixed w-full' : 'h-0 w-0'} md:hidden right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all`}>
                <div className='flex items-center justify-between px-5 py-6'>
                    <img className='w-36' src={assets.logo} alt="" />
                    <img className='w-7' onClick={()=>setShowMenu(false)} src={assets.cross_icon} alt="" />
                </div>
                <ul className='flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium'>
                    <NavLink onClick={()=>setShowMenu(false)} to='/'><p className='px-4 py-2 rounded inline-block'>TRANG CHỦ</p></NavLink>
                    <NavLink onClick={()=>setShowMenu(false)} to='/doctors'><p className='px-4 py-2 rounded inline-block'>TẤT CẢ BÁC SĨ</p></NavLink>
                    <NavLink onClick={()=>setShowMenu(false)} to='/about'><p className='px-4 py-2 rounded inline-block'>VỀ CHÚNG TÔI</p></NavLink>
                    <NavLink onClick={()=>setShowMenu(false)} to='/contact'><p className='px-4 py-2 rounded inline-block'>LIÊN HỆ</p></NavLink>
                </ul>
                
                {/* ✅ Mobile menu - User section */}
                <div className='px-5 mt-8'>
                    {token && userData ? (
                        <div className='flex flex-col items-center gap-4 p-4 bg-stone-100 rounded'>
                            <div className='flex items-center gap-3'>
                                <img className='w-10 rounded-full' src={userData.image} alt="" />
                                <span className='font-medium'>{userData.name}</span>
                            </div>
                            <div className='flex flex-col gap-2 w-full text-center'>
                                <button 
                                    onClick={() => {
                                        setShowMenu(false)
                                        navigate('my-profile')
                                    }} 
                                    className='py-2 px-4 bg-white rounded hover:bg-gray-50 transition-colors'
                                >
                                    Hồ sơ của tôi
                                </button>
                                <button 
                                    onClick={() => {
                                        setShowMenu(false)
                                        navigate('my-appointments')
                                    }} 
                                    className='py-2 px-4 bg-white rounded hover:bg-gray-50 transition-colors'
                                >
                                    Lịch hẹn của tôi
                                </button>
                                <button 
                                    onClick={() => {
                                        setShowMenu(false)
                                        logout()
                                    }} 
                                    className='py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600 transition-colors'
                                >
                                    Đăng xuất
                                </button>
                            </div>
                        </div>
                    ) : (
                        <button 
                            onClick={() => {
                                setShowMenu(false)
                                navigate('/login')
                            }} 
                            className='w-full bg-primary text-white py-3 rounded-full font-light'
                        >
                            Tạo tài khoản
                        </button>
                    )}
                </div>
            </div>
        </div>
    </div>
  )
}

export default Navbar