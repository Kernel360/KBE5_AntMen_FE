'use client'

import { Toggle } from '@/shared/ui/Toggle'
import { ArrowLeft } from '@/shared/icons/ArrowLeft'
import { EditProfileModal } from '@/shared/ui/modal/EditProfileModal'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { CommonHeader } from '@/shared/ui/Header/CommonHeader'
import { AccountProfile, AccountSettings } from '@/features/account'
import { accountApi } from '@/entities/account/api/accountApi'
import type { UserProfile, UserGender } from '@/entities/account/model/types'
import { GENDER_DISPLAY_MAP } from '@/entities/account/model/types'

export default function AccountPage() {
  const [profileImage, setProfileImage] = useState<File | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [appNotification, setAppNotification] = useState(true)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true)
        const data = await accountApi.getProfile()
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
        // 먼저 미리보기를 위해 상태 업데이트
        setProfileImage(file);
        
        // 이미지 업로드 API 호출
        await accountApi.updateProfileImage(file);
        
        // 성공하면 현재 프로필 정보에서 이미지 URL 업데이트
        if (userProfile) {
          setUserProfile({
            ...userProfile,
            userProfile: URL.createObjectURL(file)
          });
        }
        
        // 로컬 미리보기 이미지 초기화
        setProfileImage(null);
      } catch (err) {
        console.error('프로필 이미지 업로드 실패:', err);
        alert('프로필 이미지 업로드에 실패했습니다.');
        // 실패 시 미리보기 이미지 초기화
        setProfileImage(null);
      }
    }
  }

  const handleEditSubmit = async (data: {
    name: string;
    phone: string;
    birthDate: string;
    email: string;
    gender: UserGender;  // 이미 'M' | 'W' 형태로 받음
    userProfile: string;
  }) => {
    try {
      const response = await accountApi.updateProfile({
        userName: data.name,
        userTel: data.phone,
        userEmail: data.email,
        userBirth: data.birthDate,
        userGender: data.gender,  // 이미 'M' | 'W' 형태이므로 변환 불필요
        userProfile: data.userProfile,
      })
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
            userProfileUrl={userProfile.userProfile}
            onImageChange={handleImageChange}
          />

          {/* Account Settings */}
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
      </main>

      {/* Home Indicator */}
      <div className="flex justify-center">
        <div className="w-[134px] h-[5px] bg-black rounded"></div>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        initialData={{
          name: userProfile.userName,
          phone: userProfile.userTel,
          birthDate: userProfile.userBirth,
          email: userProfile.userEmail,
          gender: GENDER_DISPLAY_MAP[userProfile.userGender as keyof typeof GENDER_DISPLAY_MAP],
          userProfile: userProfile.userProfile,
        }}
        onSubmit={handleEditSubmit}
      />
    </div>
  )
}
