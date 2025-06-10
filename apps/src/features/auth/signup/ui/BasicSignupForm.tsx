import React from 'react';

export interface BasicSignupFormData {
  username: string;
  password: string;
  name: string;
  phone: string;
  email: string;
  gender: string;
  birthDate: string;
  profileImage: File | null;
}

interface BasicSignupFormProps {
  formData: BasicSignupFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onImageChange: (file: File | null) => void;
  errors?: {
    [key: string]: string;
  };
  isSocialSignup?: boolean;
}

export const BasicSignupForm: React.FC<BasicSignupFormProps> = ({
  formData,
  onChange,
  onImageChange,
  errors = {},
  isSocialSignup = false,
}) => {
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageChange(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Image Upload */}
      <div className="flex flex-col items-center space-y-2">
        <div className={`w-24 h-24 bg-[#F9F9F9] rounded-full flex items-center justify-center overflow-hidden ${
          errors.profileImage ? 'border-2 border-red-500' : ''
        }`}>
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
        {errors.profileImage && (
          <span className="text-red-500 text-sm">{errors.profileImage}</span>
        )}
      </div>

      {/* Username
      <div className="space-y-2">
        <label className="block text-base font-medium">아이디</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={onChange}
          className={`w-full h-[52px] px-4 bg-[#F9F9F9] rounded-lg text-base focus:outline-none ${
            errors.username ? 'border-2 border-red-500' : ''
          }`}
          placeholder="아이디를 입력해주세요"
        />
        {errors.username && (
          <span className="text-red-500 text-sm">{errors.username}</span>
        )}
      </div> */}
      {!isSocialSignup && (
        <>
          {/* Username */}
          <div className="space-y-2">
            <label className="block text-base font-medium">아이디</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={onChange}
              className={`w-full h-[52px] px-4 bg-[#F9F9F9] rounded-lg text-base focus:outline-none ${
                errors.username ? 'border-2 border-red-500' : ''
              }`}
              placeholder="아이디를 입력해주세요"
            />
            {errors.username && (
              <span className="text-red-500 text-sm">{errors.username}</span>
            )}
          </div>

      {/* Password
      <div className="space-y-2">
        <label className="block text-base font-medium">비밀번호</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={onChange}
          className={`w-full h-[52px] px-4 bg-[#F9F9F9] rounded-lg text-base focus:outline-none ${
            errors.password ? 'border-2 border-red-500' : ''
          }`}
          placeholder="비밀번호를 입력해주세요"
        />
        {errors.password && (
          <span className="text-red-500 text-sm">{errors.password}</span>
        )}
      </div> */}
      {/* Password */}
      <div className="space-y-2">
            <label className="block text-base font-medium">비밀번호</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={onChange}
              className={`w-full h-[52px] px-4 bg-[#F9F9F9] rounded-lg text-base focus:outline-none ${
                errors.password ? 'border-2 border-red-500' : ''
              }`}
              placeholder="비밀번호를 입력해주세요"
            />
            {errors.password && (
              <span className="text-red-500 text-sm">{errors.password}</span>
            )}
          </div>
        </>
      )}

      {/* Name */}
      <div className="space-y-2">
        <label className="block text-base font-medium">이름</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={onChange}
          className={`w-full h-[52px] px-4 bg-[#F9F9F9] rounded-lg text-base focus:outline-none ${
            errors.name ? 'border-2 border-red-500' : ''
          }`}
          placeholder="이름을 입력해주세요"
        />
        {errors.name && (
          <span className="text-red-500 text-sm">{errors.name}</span>
        )}
      </div>

      {/* Phone */}
      <div className="space-y-2">
        <label className="block text-base font-medium">전화번호</label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={onChange}
          className={`w-full h-[52px] px-4 bg-[#F9F9F9] rounded-lg text-base focus:outline-none ${
            errors.phone ? 'border-2 border-red-500' : ''
          }`}
          placeholder="전화번호를 입력해주세요"
        />
        {errors.phone && (
          <span className="text-red-500 text-sm">{errors.phone}</span>
        )}
      </div>

      {/* Email */}
      <div className="space-y-2">
        <label className="block text-base font-medium">이메일</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={onChange}
          disabled={isSocialSignup}
          className={`w-full h-[52px] px-4 bg-[#F9F9F9] rounded-lg text-base focus:outline-none ${
            errors.email ? 'border-2 border-red-500' : ''
          } ${isSocialSignup ? 'cursor-not-allowed bg-gray-200' : ''}`}
          placeholder="이메일을 입력해주세요"
        />
        {errors.email && (
          <span className="text-red-500 text-sm">{errors.email}</span>
        )}
      </div>

      {/* Gender */}
      <div className="space-y-2">
        <label className="block text-base font-medium mb-2">성별</label>
        <div className="flex gap-8">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="gender"
              value="M"
              checked={formData.gender === 'M'}
              onChange={onChange}
              className={`w-5 h-5 text-[#00D1FF] bg-[#F9F9F9] border-gray-300 focus:ring-[#00D1FF] ${
                errors.gender ? 'border-2 border-red-500' : ''
              }`}
            />
            <span className="text-base">남성</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="gender"
              value="W"
              checked={formData.gender === 'W'}
              onChange={onChange}
              className={`w-5 h-5 text-[#00D1FF] bg-[#F9F9F9] border-gray-300 focus:ring-[#00D1FF] ${
                errors.gender ? 'border-2 border-red-500' : ''
              }`}
            />
            <span className="text-base">여성</span>
          </label>
        </div>
        {errors.gender && (
          <span className="text-red-500 text-sm">{errors.gender}</span>
        )}
      </div>

      {/* Birth Date */}
      <div className="space-y-2">
        <label className="block text-base font-medium">생년월일</label>
        <input
          type="date"
          name="birthDate"
          value={formData.birthDate}
          onChange={onChange}
          className={`w-full h-[52px] px-4 bg-[#F9F9F9] rounded-lg text-base focus:outline-none ${
            errors.birthDate ? 'border-2 border-red-500' : ''
          }`}
        />
        {errors.birthDate && (
          <span className="text-red-500 text-sm">{errors.birthDate}</span>
        )}
      </div>
    </div>
  );
}; 