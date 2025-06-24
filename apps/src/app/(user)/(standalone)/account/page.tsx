'use client'

import { Toggle } from '@/shared/ui/Toggle'
import { ArrowLeft } from '@/shared/icons/ArrowLeft'
import { EditProfileModal } from '@/shared/ui/modal/EditProfileModal'
import Link from 'next/link'
import { useState } from 'react'
import Image from 'next/image'
import { CommonHeader } from '@/shared/ui/Header/CommonHeader'
import { AccountProfile, AccountSettings } from '@/features/account'

export default function AccountPage() {
  const [eventNotification, setEventNotification] = useState(false)
  const [appNotification, setAppNotification] = useState(true)
  const [profileImage, setProfileImage] = useState<File | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [userInfo, setUserInfo] = useState({
    name: '홍길동',
    phone: '010-1111-2222',
    birthDate: '2025-06-05',
    email: 'test@gmail.com',
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(e.target.files[0])
    }
  }

  const handleEditSubmit = (data: {
    name: string
    phone: string
    birthDate: string
    email: string
  }) => {
    setUserInfo(data)
    setIsEditModalOpen(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader 
        title="계정 관리"
        showBackButton
      />

      <main className="pt-20 pb-20">
        <div className="space-y-6 p-5">
          {/* Profile Image Upload */}
          <AccountProfile 
            profileImage={profileImage}
            onImageChange={handleImageChange}
          />

          {/* Account Settings */}
          <AccountSettings 
            userInfo={userInfo}
            eventNotification={eventNotification}
            appNotification={appNotification}
            onEventNotificationChange={setEventNotification}
            onAppNotificationChange={setAppNotification}
            onEditClick={() => setIsEditModalOpen(true)}
          />
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
  )
}
