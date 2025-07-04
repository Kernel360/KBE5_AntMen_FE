'use client'

import { Toggle } from '@/shared/ui/Toggle'
import { ArrowLeft } from '@/shared/icons/ArrowLeft'
import { EditProfileModal } from '@/shared/ui/modal/EditProfileModal'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { CommonHeader } from '@/shared/ui/Header/CommonHeader'
import { AccountProfile, AccountSettings } from '@/features/account'
import { customerApi } from '@/entities/account/api/accountApi'
import type { CustomerProfile, UserGender } from '@/entities/account/model/types'
import { GENDER_DISPLAY_MAP } from '@/entities/account/model/types'

export default function AccountPage() {
  const [profileImage, setProfileImage] = useState<File | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [appNotification, setAppNotification] = useState(true)
  const [userProfile, setUserProfile] = useState<CustomerProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true)
        const data = await customerApi.getProfile()
        setUserProfile(data)
      } catch (err) {
        console.error('프로필 정보를 불러오는데 실패했습니다:', err)
        setError('프로필 정보를 불러오는데 실패했습니다.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      try {
        setProfileImage(file);
        await customerApi.updateProfileImage(file);
        
        if (userProfile) {
          setUserProfile({
            ...userProfile,
            userProfile: URL.createObjectURL(file)
          });
        }
        
        setProfileImage(null);
      } catch (err) {
        console.error('프로필 이미지 업로드 실패:', err);
        alert('프로필 이미지 업로드에 실패했습니다.');
        setProfileImage(null);
      }
    }
  }

  const handleEditSubmit = async (data: {
    name: string;
    phone: string;
    birthDate: string;
    email: string;
  }) => {
    if (!userProfile) return;

    try {
      const response = await customerApi.updateProfile({
        userName: data.name,
        userTel: data.phone,
        userEmail: data.email,
        userBirth: data.birthDate,
      });
      setUserProfile(response)
      setIsEditModalOpen(false)
    } catch (err) {
      console.error('프로필 수정에 실패했습니다:', err)
      alert('프로필 수정에 실패했습니다.')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <CommonHeader title="계정 관리" showBackButton />
        <main className="pt-20 pb-20">
          <div className="flex justify-center items-center h-[calc(100vh-160px)]">
            <div className="text-slate-500">로딩 중...</div>
          </div>
        </main>
      </div>
    )
  }

  if (error || !userProfile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <CommonHeader title="계정 관리" showBackButton />
        <main className="pt-20 pb-20">
          <div className="flex justify-center items-center h-[calc(100vh-160px)]">
            <div className="text-red-500">{error || '프로필을 불러올 수 없습니다.'}</div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <CommonHeader 
        title="계정 관리"
        showBackButton
      />

      <main className="flex-1 flex flex-col pt-[64px]">
        <div className="p-5 space-y-6">
          {/* 프로필 이미지 */}
          <AccountProfile 
            profileImage={profileImage}
            userProfileUrl={userProfile.userProfile}
            onImageChange={handleImageChange}
          />

          {/* 계정 설정 카드 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <AccountSettings 
              userInfo={{
                name: userProfile.userName,
                phone: userProfile.userTel,
                birthDate: userProfile.userBirth,
                email: userProfile.userEmail,
              }}
              appNotification={appNotification}
              onAppNotificationChange={setAppNotification}
              onEditClick={() => setIsEditModalOpen(true)}
            />
          </div>
        </div>
      </main>

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        initialData={{
          name: userProfile.userName,
          phone: userProfile.userTel,
          birthDate: userProfile.userBirth,
          email: userProfile.userEmail,
        }}
        onSubmit={handleEditSubmit}
      />
    </div>
  )
}
