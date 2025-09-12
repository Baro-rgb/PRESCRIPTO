import React, { useContext, useEffect, useRef, useState } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const DoctorProfile = () => {

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

  const { dToken, profileData, setProfileData, getProfileData, backendUrl } = useContext(DoctorContext)
  const { currency } = useContext(AppContext)

  const [isEdit, setIsEdit] = useState(false)
  const fileInputRef = useRef(null)

  const updateProfile = async () => {
    try {
      const formData = new FormData();

      formData.append("fees", profileData.fees);
      formData.append("available", profileData.available);
      formData.append("about", profileData.about);
      formData.append("name", profileData.name);
      formData.append("degree", profileData.degree);
      formData.append("speciality", profileData.speciality);
      formData.append("experience", profileData.experience);
      formData.append("address", JSON.stringify(profileData.address));

      // Nếu có ảnh mới chọn thì append file
      if (profileData.imageFile) {
        formData.append("imageFile", profileData.imageFile); 
      }

      const { data } = await axios.post(
        backendUrl + "/api/doctor/update-profile",
        formData,
        {
          headers: {
            dToken,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (data.success) {
        toast.success(data.message);
        setIsEdit(false);
        getProfileData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  // Thêm function để parse address an toàn
  const parseAddress = (address) => {
    try {
      return typeof address === 'string' ? JSON.parse(address) : address || {}
    } catch {
      return {}
    }
  }

  useEffect(() => {
    if (dToken) {
      getProfileData()
    }
  }, [dToken])

  // 🔹 Hàm chọn file
  const openFilePicker = () => {
    fileInputRef.current.click()
  }

  // 🔹 Hàm xử lý khi chọn ảnh
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setProfileData((prev) => ({
        ...prev,
        imageFile: file,
        image: URL.createObjectURL(file) // preview tạm ảnh mới
      }))
    }
  }

  return profileData && (
    <div>
      <div className="flex flex-col gap-4 m-5">
        <div className="relative w-full sm:max-w-64">
          <img
            className="bg-primary/80 w-full rounded-lg"
            src={profileData.image}
            alt=""
          />
          {isEdit && (
            <>
              <button
                onClick={openFilePicker}
                className="absolute bottom-2 right-2 bg-blue-600 text-white text-sm px-3 py-1 rounded shadow hover:bg-blue-700"
              >
                Chỉnh sửa ảnh
              </button>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageChange}
                className="hidden"
              />
            </>
          )}
        </div>

        <div className="flex-1 border border-stone-100 rounded-lg p-8 py-7 bg-white">
          {/* ----- Doc Info : name, degree, exp, .... ------ */}

          {/* Doctor Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Tên bác sĩ:</label>
            {isEdit ? (
              <input 
                type="text" 
                onChange={(e) => setProfileData(prev => ({...prev, name: e.target.value}))} 
                value={profileData.name || ''} 
                className='text-3xl font-medium text-gray-700 border rounded px-3 py-2 w-full max-w-md'
                placeholder="Enter doctor name"
              />
            ) : (
              <p className='text-3xl font-medium text-gray-700'>{profileData.name}</p>
            )}
          </div>

          {/* Degree and Speciality */}
          <div className='flex flex-col gap-3 mb-4'>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Bằng cấp:</label>
                {isEdit ? (
                  <input 
                    type="text" 
                    onChange={(e) => setProfileData(prev => ({...prev, degree: e.target.value}))} 
                    value={profileData.degree || ''} 
                    className='border rounded px-3 py-2 w-full'
                    placeholder="Enter degree"
                  />
                ) : (
                  <p className="text-gray-600">{profileData.degree}</p>
                )}
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Chuyên khoa:</label>
                {isEdit ? (
                  <select 
                    onChange={(e) => setProfileData(prev => ({...prev, speciality: e.target.value}))} 
                    value={profileData.speciality || ''} 
                    className='border rounded px-3 py-2 w-full bg-white'
                  >
                    <option value="">----Chọn chuyên khoa----</option>
                    <option value="General physician">Bác sĩ đa khoa</option>
                    <option value="Gynecologist">Sản phụ khoa</option>
                    <option value="Dermatologist">Da liễu</option>
                    <option value="Pediatricians">Nhi khoa</option>
                    <option value="Neurologist">Thần kinh</option>
                    <option value="Gastroenterologist">Tiêu hóa</option>
                  </select>
                ) : (
                  <p className="text-gray-600">{specialityMapping[profileData.speciality] || profileData.speciality}</p>
                )}
              </div>
            </div>

            {/* Experience */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kinh nghiệm:</label>
              {isEdit ? (
                <select 
                  onChange={(e) => setProfileData(prev => ({...prev, experience: e.target.value}))} 
                  value={profileData.experience || ''} 
                  className='border rounded px-3 py-2 w-full max-w-xs bg-white'
                >
                  <option value="">----Chọn kinh nghiệm----</option>
                  <option value="1 Year">1 Năm</option>
                  <option value="2 Years">2 Năm</option>
                  <option value="3 Years">3 Năm</option>
                  <option value="4 Years">4 Năm</option>
                  <option value="5 Years">5 Năm</option>
                  <option value="6 Years">6 Năm</option>
                  <option value="7 Years">7 Năm</option>
                  <option value="8 Years">8 Năm</option>
                  <option value="9 Years">9 Năm</option>
                  <option value="10+ Years">10+ Năm</option>
                </select>
              ) : (
                <button className='py-0.5 px-2 border text-xs rounded-full'>{translateExperience(profileData.experience)}</button>
              )}
            </div>
          </div>

          {/* ----- Doc About ------ */}
          <div className="mb-4">
            <label className='block text-sm font-medium text-neutral-800 mb-1'>Về tôi:</label>
            {isEdit ? (
              <textarea 
                onChange={(e) => setProfileData(prev => ({...prev, about: e.target.value}))} 
                value={profileData.about || ''} 
                className='text-sm text-gray-600 w-full border rounded px-3 py-2 min-h-[100px] resize-y'
                placeholder="Write about the doctor..."
              />
            ) : (
              <p className='text-sm text-gray-600 max-w-[700px]'>
                {profileData.about}
              </p>
            )}
          </div>

          {/* Appointment Fee */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Phí hẹn:</label>
            <div className="flex items-center gap-2">
              <span className='text-gray-600'>{currency}</span>
              {isEdit ? (
                <input 
                  type="number" 
                  onChange={(e) => setProfileData(prev => ({...prev, fees: e.target.value}))} 
                  value={profileData.fees || ''} 
                  className='border rounded px-2 py-1 w-24'
                  placeholder="0"
                  min="0"
                />
              ) : (
                <span className='text-gray-800 font-medium'>{profileData.fees}</span>
              )}
            </div>
          </div>

          {/* Address */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ:</label>
            {isEdit ? (
              <div className='space-y-2 max-w-md'>
                <input 
                  type="text" 
                  placeholder="Address Line 1"
                  onChange={(e) => setProfileData(prev => ({
                    ...prev,
                    address: {
                      ...parseAddress(prev.address),
                      line1: e.target.value
                    }
                  }))} 
                  value={parseAddress(profileData.address).line1 || ''} 
                  className='border rounded px-2 py-1 w-full'
                />
                <input 
                  type="text" 
                  placeholder="Address Line 2"
                  onChange={(e) => setProfileData(prev => ({
                    ...prev,
                    address: {
                      ...parseAddress(prev.address),
                      line2: e.target.value
                    }
                  }))} 
                  value={parseAddress(profileData.address).line2 || ''} 
                  className='border rounded px-2 py-1 w-full'
                />
              </div>
            ) : (
              <div className='text-sm text-gray-600'>
                <p>{parseAddress(profileData.address).line1 || 'No address line 1'}</p>
                <p>{parseAddress(profileData.address).line2 || 'No address line 2'}</p>
              </div>
            )}
          </div>

          <div className='flex gap-1 pt-2'>
            <input onChange={()=> isEdit && setProfileData(prev => ({...prev,available: !prev.available}))} checked={profileData.available} type="checkbox" name="" id="" />
            <label htmlFor="">Rảnh</label>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            {isEdit ? (
              <>
                <button 
                  onClick={updateProfile} 
                  className='px-6 py-2 bg-primary text-white text-sm rounded-full hover:bg-primary/90 transition-all'
                >
                  Lưu thay đổi
                </button>
                <button 
                  onClick={() => {
                    setIsEdit(false);
                    getProfileData(); // Reset data to original
                  }} 
                  className='px-6 py-2 border border-gray-300 text-sm rounded-full hover:bg-gray-50 transition-all'
                >
                  Hủy
                </button>
              </>
            ) : (
              <button 
                onClick={() => setIsEdit(true)} 
                className='px-6 py-2 border border-primary text-primary text-sm rounded-full hover:bg-primary hover:text-white transition-all'
              >
                Chỉnh sửa hồ sơ
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DoctorProfile