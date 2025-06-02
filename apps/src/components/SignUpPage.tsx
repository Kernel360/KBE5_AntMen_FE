"use client";
import React, { useState } from 'react';

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    phone: '',
    email: '',
    gender: '',
    birthDate: '',
    profileImage: null as File | null
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({
        ...prev,
        profileImage: e.target.files![0]
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <div className="min-h-screen bg-white flex justify-center">
      <div className="w-[30rem] px-4 pt-4 pb-8">
        {/* Header */}
        <div className="mb-8">
          <button className="p-2 text-2xl">&larr;</button>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          <div className="space-y-2">
            <h1 className="text-[28px] font-bold leading-tight">
              회원가입을 위한<br />
              정보를 입력해주세요.
            </h1>
            <p className="text-gray-600 text-base leading-relaxed">
              서비스 이용을 위해<br />
              필요한 정보를 입력해주세요.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Image Upload */}
            <div className="flex flex-col items-center space-y-2">
              <div className="w-24 h-24 bg-[#F9F9F9] rounded-full flex items-center justify-center overflow-hidden">
                {formData.profileImage ? (
                  <img 
                    src={URL.createObjectURL(formData.profileImage)} 
                    alt="Profile preview" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-400 text-4xl">+</span>
                )}
              </div>
              <input
                type="file"
                id="profileImage"
                name="profileImage"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <label 
                htmlFor="profileImage"
                className="text-[#0fbcd6] text-sm cursor-pointer"
              >
                프로필 사진 업로드
              </label>
            </div>

            {/* Username */}
            <div className="space-y-2">
              <label className="block text-base font-medium">아이디</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full h-[52px] px-4 bg-[#F9F9F9] rounded-lg text-base focus:outline-none"
                placeholder="아이디를 입력해주세요"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="block text-base font-medium">비밀번호</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full h-[52px] px-4 bg-[#F9F9F9] rounded-lg text-base focus:outline-none"
                placeholder="비밀번호를 입력해주세요"
              />
            </div>

            {/* Name */}
            <div className="space-y-2">
              <label className="block text-base font-medium">이름</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full h-[52px] px-4 bg-[#F9F9F9] rounded-lg text-base focus:outline-none"
                placeholder="이름을 입력해주세요"
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label className="block text-base font-medium">전화번호</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full h-[52px] px-4 bg-[#F9F9F9] rounded-lg text-base focus:outline-none"
                placeholder="전화번호를 입력해주세요"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="block text-base font-medium">이메일</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full h-[52px] px-4 bg-[#F9F9F9] rounded-lg text-base focus:outline-none"
                placeholder="이메일을 입력해주세요"
              />
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <label className="block text-base font-medium mb-2">성별</label>
              <div className="flex gap-8">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={formData.gender === 'male'}
                    onChange={handleChange}
                    className="w-5 h-5 text-[#00D1FF] bg-[#F9F9F9] border-gray-300 focus:ring-[#00D1FF]"
                  />
                  <span className="text-base">남성</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={formData.gender === 'female'}
                    onChange={handleChange}
                    className="w-5 h-5 text-[#00D1FF] bg-[#F9F9F9] border-gray-300 focus:ring-[#00D1FF]"
                  />
                  <span className="text-base">여성</span>
                </label>
              </div>
            </div>

            {/* Birth Date */}
            <div className="space-y-2">
              <label className="block text-base font-medium">생년월일</label>
              <input
                type="date"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleChange}
                className="w-full h-[52px] px-4 bg-[#F9F9F9] rounded-lg text-base focus:outline-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full h-[52px] bg-[#0fbcd6] text-white rounded-lg mt-8 text-base font-medium"
            >
              회원가입
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage; 