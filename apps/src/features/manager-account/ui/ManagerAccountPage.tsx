'use client'

import { useState, useEffect } from 'react'
import { CommonHeader } from '@/shared/ui/Header/CommonHeader'
import { AccountProfile, AccountSettings } from '@/features/account'
import { EditProfileModal } from '@/shared/ui/modal/EditProfileModal'
import { managerApi } from '@/entities/account/api/accountApi'
import type { ManagerProfile, UserGender } from '@/entities/account/model/types'
import { GENDER_DISPLAY_MAP } from '@/entities/account/model/types'

export const ManagerAccountPage = () => {
  const [profileImage, setProfileImage] = useState<File | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [appNotification, setAppNotification] = useState(true)
  const [userProfile, setUserProfile] = useState<ManagerProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true)
        const data = await managerApi.getProfile()
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
        await managerApi.updateProfile(
          {},
          { profileImage: file }
        );
        
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
      const response = await managerApi.updateProfile({
        userName: data.name,
        userTel: data.phone,
        userEmail: data.email,
        userBirth: data.birthDate,
        managerAddress: userProfile.managerAddress,
        managerLatitude: userProfile.managerLatitude,
        managerLongitude: userProfile.managerLongitude,
        managerTime: userProfile.managerTime,
        userType: userProfile.userType
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
    <div className="min-h-screen bg-gray-50">
      <CommonHeader 
        title="계정 관리"
        showBackButton
      />

      <main className="pt-20 pb-20">
        <div className="space-y-6 p-5">
          <AccountProfile 
            profileImage={profileImage}
            userProfileUrl={userProfile.userProfile}
            onImageChange={handleImageChange}
          />

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