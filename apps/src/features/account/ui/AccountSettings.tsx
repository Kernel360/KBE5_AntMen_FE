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
  eventNotification: boolean
  appNotification: boolean
  onEventNotificationChange: (value: boolean) => void
  onAppNotificationChange: (value: boolean) => void
  onEditClick: () => void
}

export const AccountSettings = ({
  userInfo,
  eventNotification,
  appNotification,
  onEventNotificationChange,
  onAppNotificationChange,
  onEditClick,
}: AccountSettingsProps) => {
  return (
    <>
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
          <span className="text-[#00BCD4]">
            {userInfo.birthDate.replace(/-/g, '.')}
          </span>
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
        onClick={onEditClick}
      >
        정보 수정
      </button>
      <hr className="border-[#F0F0F0]" />
      <button className="text-left py-2 text-black hover:text-[#00BCD4] transition-colors">
        회원 탈퇴
      </button>
      <hr className="border-[#F0F0F0]" />

      {/* Notifications Section */}
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-black">앱 푸시 알림</span>
            <Toggle enabled={appNotification} onChange={onAppNotificationChange} />
          </div>
          <p className="text-xs text-[#999999]">
            중요한 서비스 진행 소식을 알려드려요.
          </p>
        </div>
      </div>
    </>
  )
} 