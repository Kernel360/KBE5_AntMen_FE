'use client'

import { Toggle } from '@/shared/ui/Toggle'
import React from 'react'

interface AccountSettingsProps {
  userInfo: {
    name: string
    phone: string
    birthDate: string
    email: string
  }
  appNotification: boolean
  onAppNotificationChange: (value: boolean) => void
  onEditClick: () => void
}

export const AccountSettings = ({
  userInfo,
  appNotification,
  onAppNotificationChange,
  onEditClick,
}: AccountSettingsProps) => {
  return (
    <div className="space-y-6">
      {/* Personal Info Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center py-2">
          <span className="text-gray-600">이름</span>
          <span className="text-gray-900 font-medium">{userInfo.name}</span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-gray-600">전화번호</span>
          <span className="text-gray-900 font-medium">{userInfo.phone}</span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-gray-600">생년월일</span>
          <span className="text-gray-900 font-medium">
            {userInfo.birthDate.replace(/-/g, '.')}
          </span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-gray-600">이메일</span>
          <span className="text-gray-900 font-medium">{userInfo.email}</span>
        </div>
      </div>

      <hr className="border-gray-100" />

      {/* Actions Section */}
      <div className="space-y-4">
        <button
          className="w-full text-left py-3 text-gray-900 hover:text-primary transition-colors flex items-center justify-between"
          onClick={onEditClick}
        >
          <span>정보 수정</span>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
        <button 
          className="w-full text-left py-3 text-gray-900 hover:text-primary transition-colors flex items-center justify-between"
        >
          <span>회원 탈퇴</span>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>

      <hr className="border-gray-100" />

      {/* Notifications Section */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <div>
            <span className="text-gray-900">앱 푸시 알림</span>
            <p className="text-sm text-gray-500 mt-1">
              중요한 서비스 진행 소식을 알려드려요.
            </p>
          </div>
          <Toggle enabled={appNotification} onChange={onAppNotificationChange} />
        </div>
      </div>
    </div>
  )
} 