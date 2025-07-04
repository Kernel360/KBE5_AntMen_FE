'use client'

import Image from 'next/image'
import React, { useState } from 'react'
import { LoginIdInput } from './LoginIdInput'

export interface BasicSignupFormData {
  username: string
  password: string
  name: string
  phone: string
  email: string
  gender: string
  birthDate: string
  profileImage: File | null
  existingProfileImageUrl?: string // 기존 프로필 이미지 URL (재신청용)
}

interface BasicSignupFormProps {
  formData: BasicSignupFormData
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
  onImageChange: (file: File | null) => void
  errors?: {
    [key: string]: string
  }
  isSocialSignup?: boolean
  onIdValidationChange: (isValid: boolean) => void
  showUsernameField?: boolean
  showPasswordField?: boolean
  isPasswordFocused?: boolean
  setIsPasswordFocused?: (focused: boolean) => void
}

export const BasicSignupForm: React.FC<BasicSignupFormProps> = ({
  formData,
  onChange,
  onImageChange,
  errors = {},
  isSocialSignup = false,
  onIdValidationChange,
  showUsernameField = true,
  showPasswordField = true,
  isPasswordFocused = false,
  setIsPasswordFocused = () => {},
}) => {

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageChange(e.target.files[0])
    }
  }

  // 생년월일 드롭다운용 상태
  const today = new Date();
  const currentYear = today.getFullYear();
  const [birthYear, setBirthYear] = useState('');
  const [birthMonth, setBirthMonth] = useState('');
  const [birthDay, setBirthDay] = useState('');

  // 연도 옵션 (1920~올해)
  const years = Array.from({ length: 150 }, (_, i) => String(currentYear - i));
  // 월 옵션
  const months = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
  // 일 옵션 (월/윤년 고려)
  function getDaysInMonth(year: string, month: string) {
    if (!year || !month) return [];
    const y = parseInt(year, 10);
    const m = parseInt(month, 10);
    const lastDay = new Date(y, m, 0).getDate();
    return Array.from({ length: lastDay }, (_, i) => String(i + 1).padStart(2, '0'));
  }
  const days = getDaysInMonth(birthYear, birthMonth);

  // 오늘 이전만 선택 가능하도록 제한
  const isFuture = (y: string, m: string, d: string) => {
    if (!y || !m || !d) return false;
    const selected = new Date(`${y}-${m}-${d}`);
    return selected > today;
  };

  // 드롭다운 변경 핸들러
  const handleBirthChange = (type: 'year' | 'month' | 'day', value: string) => {
    let newYear = birthYear, newMonth = birthMonth, newDay = birthDay;
    if (type === 'year') newYear = value;
    if (type === 'month') newMonth = value;
    if (type === 'day') newDay = value;
    // 미래 날짜 선택 방지
    if (isFuture(newYear, newMonth, newDay)) {
      if (type === 'year') setBirthYear('');
      if (type === 'month') setBirthMonth('');
      if (type === 'day') setBirthDay('');
      return;
    }
    setBirthYear(newYear);
    setBirthMonth(newMonth);
    setBirthDay(newDay);
    // 모두 선택 시 YYYY-MM-DD로 부모에 전달
    if (newYear && newMonth && newDay) {
      const birthDate = `${newYear}-${newMonth}-${newDay}`;
      onChange({
        target: {
          name: 'birthDate',
          value: birthDate,
        }
      } as React.ChangeEvent<HTMLInputElement>);
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Image Upload */}
      <div className="flex flex-col items-center space-y-2">
        <div
          className={`w-24 h-24 bg-[#F9F9F9] rounded-full flex items-center justify-center overflow-hidden ${
            errors.profileImage ? 'border-2 border-red-500' : ''
          }`}
        >
          {formData.profileImage ? (
            <Image
              src={URL.createObjectURL(formData.profileImage)}
              alt="Profile preview"
              className="w-full h-full object-cover"
              width={96}
              height={96}
            />
          ) : formData.existingProfileImageUrl ? (
            <Image
              src={formData.existingProfileImageUrl}
              alt="Current profile"
              className="w-full h-full object-cover"
              width={96}
              height={96}
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
          className="text-primary-700 text-sm cursor-pointer"
        >
          {formData.existingProfileImageUrl ? '프로필 사진 변경' : '프로필 사진 업로드'}
        </label>
        {errors.profileImage && (
          <span className="text-red-500 text-sm">{errors.profileImage}</span>
        )}
      </div>

      {!isSocialSignup && showUsernameField && (
        <LoginIdInput
          value={formData.username}
          onChange={onChange}
          error={errors.username}
          disabled={isSocialSignup}
          onValidationChange={onIdValidationChange}
        />
      )}

      {!isSocialSignup && showPasswordField && (
        <div className="space-y-2">
          <label className="block text-base font-medium">비밀번호</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={onChange}
            onFocus={() => setIsPasswordFocused(true)}
            onBlur={() => setIsPasswordFocused(false)}
            className={`w-full h-[52px] px-4 bg-[#F9F9F9] rounded-lg text-base focus:outline-none ${
              errors.password ? 'border-2 border-red-500' : ''
            }`}
            placeholder="비밀번호를 입력해주세요"
          />
          {isPasswordFocused && (
            <span className="text-xs text-gray-500 mt-1 block">
              비밀번호는 6자리 이상이어야 합니다.
            </span>
          )}
          {errors.password && (
            <span className="text-red-500 text-sm">{errors.password}</span>
          )}
        </div>
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
              className={`w-5 h-5 bg-white border-gray-300 ${
                errors.gender ? 'border-2 border-red-500' : ''
              }`}
              style={{
                accentColor: '#000000'
              }}
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
              className={`w-5 h-5 bg-white border-gray-300 ${
                errors.gender ? 'border-2 border-red-500' : ''
              }`}
              style={{
                accentColor: '#000000'
              }}
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
        <div className="flex gap-2">
          <select
            name="birthYear"
            value={birthYear}
            onChange={e => handleBirthChange('year', e.target.value)}
            className={`w-full h-[52px] px-4 bg-[#F9F9F9] rounded-lg text-base focus:outline-none ${errors.birthDate ? 'border-2 border-red-500' : ''}`}
          >
            <option value="">년</option>
            {years.map(y => (
              <option key={y} value={y}>{y}년</option>
            ))}
          </select>
          <select
            name="birthMonth"
            value={birthMonth}
            onChange={e => handleBirthChange('month', e.target.value)}
            className={`w-full h-[52px] px-4 bg-[#F9F9F9] rounded-lg text-base focus:outline-none ${errors.birthDate ? 'border-2 border-red-500' : ''}`}
            disabled={!birthYear}
          >
            <option value="">월</option>
            {months.map(m => (
              <option key={m} value={m}>{m}월</option>
            ))}
          </select>
          <select
            name="birthDay"
            value={birthDay}
            onChange={e => handleBirthChange('day', e.target.value)}
            className={`w-full h-[52px] px-4 bg-[#F9F9F9] rounded-lg text-base focus:outline-none ${errors.birthDate ? 'border-2 border-red-500' : ''}`}
            disabled={!birthYear || !birthMonth}
          >
            <option value="">일</option>
            {days.map(d => (
              <option key={d} value={d}>{d}일</option>
            ))}
          </select>
        </div>
        {errors.birthDate && (
          <span className="text-red-500 text-sm">{errors.birthDate}</span>
        )}
      </div>
    </div>
  )
}
