"use client";

import { Toggle } from '@/shared/ui/Toggle';
import { ArrowLeft } from '@/shared/icons/ArrowLeft';
import { EditProfileModal } from '@/shared/ui/modal/EditProfileModal';
import Link from 'next/link';
import { useState } from 'react';

export default function AccountPage() {
  const [eventNotification, setEventNotification] = useState(false);
  const [appNotification, setAppNotification] = useState(true);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: '홍길동',
    phone: '010-1111-2222',
    birthDate: '2025-06-05',
    email: 'test@gmail.com',
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(e.target.files[0]);
    }
  };

  const handleEditSubmit = (data: {
    name: string;
    phone: string;
    birthDate: string;
    email: string;
  }) => {
    setUserInfo(data);
    setIsEditModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="flex items-center gap-x-2.5 px-4 py-4">
        <Link href="/" className="p-1">
          <ArrowLeft className="w-6 h-6 text-black" />
        </Link>
        <h1 className="text-2xl font-bold text-black">계정 정보</h1>
      </header>

      {/* Content */}
      <main className="p-4 flex flex-col gap-y-4">
        {/* Profile Image Upload */}
        <div className="flex flex-col items-center mb-6">
          <label 
            htmlFor="profileImage"
            className="cursor-pointer group relative"
          >
            <div className="w-24 h-24 bg-[#F9F9F9] rounded-full flex items-center justify-center overflow-hidden">
              {profileImage ? (
                <>
                  <img 
                    src={URL.createObjectURL(profileImage)} 
                    alt="Profile preview" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">수정하기</span>
                  </div>
                </>
              ) : (
                <>
                  <span className="text-gray-400 text-4xl">+</span>
                  <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">추가하기</span>
                  </div>
                </>
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
          </label>
        </div>

        {/* Personal Info Section */}
        <div className="space-y-6">
          <div className="flex justify-between items-center py-1">
            <span className="text-black">이름</span>
            <span className="text-[#00BCD4]">{userInfo.name}</span>
          </div>
          <div className="flex justify-between items-center py-1">
            <span className="text-black">전화번호</span>
            <span className="text-[#00BCD4]">{userInfo.phone}</span>
          </div>
          <div className="flex justify-between items-center py-1">
            <span className="text-black">생년월일</span>
            <span className="text-[#00BCD4]">{userInfo.birthDate.replace(/-/g, '.')}</span>
          </div>
          <div className="flex justify-between items-center py-1">
            <span className="text-black">이메일</span>
            <span className="text-[#00BCD4]">{userInfo.email}</span>
          </div>
        </div>

        <hr className="border-[#F0F0F0] mt-2" />

        {/* Actions Section */}
        <button 
          className="text-left py-2 text-black hover:text-[#00BCD4] transition-colors"
          onClick={() => setIsEditModalOpen(true)}
        >
          정보 수정
        </button>
        <hr className="border-[#F0F0F0]" />
        <button className="text-left py-2 text-black hover:text-[#00BCD4] transition-colors">로그아웃</button>
        <hr className="border-[#F0F0F0]" />
        <button className="text-left py-2 text-black hover:text-[#00BCD4] transition-colors">탈퇴</button>
        <hr className="border-[#F0F0F0]" />

        {/* Notifications Section */}
        <div className="space-y-6 pb-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-black">이벤트 소식 알림</span>
              <Toggle enabled={eventNotification} onChange={setEventNotification} />
            </div>
            <p className="text-xs text-[#999999]">
              카카오톡, SMS, 앱푸시를 통해 이벤트 소식을 알려드립니다.
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-black">앱 푸시 알림</span>
              <Toggle enabled={appNotification} onChange={setAppNotification} />
            </div>
            <p className="text-xs text-[#999999]">
              중요한 서비스 진행 소식을 알려드려요.
            </p>
          </div>
        </div>
      </main>

      {/* Home Indicator */}
      <div className="flex justify-center">
        <div className="w-[134px] h-[5px] bg-black rounded"></div>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        initialData={userInfo}
        onSubmit={handleEditSubmit}
      />
    </div>
  );
} 