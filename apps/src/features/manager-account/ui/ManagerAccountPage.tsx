'use client'

import { useState, useEffect } from 'react'
import { CommonHeader } from '@/shared/ui/Header/CommonHeader'
import { AccountProfile, AccountSettings } from '@/features/account'
import { EditProfileModal } from '@/shared/ui/modal/EditProfileModal'
import { managerApi } from '@/entities/account/api/accountApi'
import type { ManagerProfile, UserGender } from '@/entities/account/model/types'
import { GENDER_DISPLAY_MAP } from '@/entities/account/model/types'
import { ManagerAdditionalInfo } from '@/features/auth/signup/ui/ManagerAdditionalInfo'
import { getCoordinatesFromAddress } from '@/utils/kakaoCoords'
import dynamic from 'next/dynamic'

// AddAddressModal을 동적으로 import
const AddAddressModal = dynamic(
  () => import('@/features/address/ui/AddAddressModal'),
  {
    ssr: false,
    loading: () => <div className="animate-pulse bg-gray-200 h-96 rounded-lg">Loading...</div>
  }
);

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
    address?: string;
    addressDetail?: string;
    latitude?: number | null;
    longitude?: number | null;
  }) => {
    if (!userProfile) return;

    try {
      // 주소와 상세주소 합치기
      const fullAddress = data.address && data.addressDetail
        ? `${data.address} ${data.addressDetail}`.trim()
        : data.address || userProfile.managerAddress;

      // 새로운 위도/경도가 있으면 사용하고, 없으면 기존 값 사용
      const latitude = (data.latitude !== undefined && data.latitude !== null) 
        ? data.latitude 
        : userProfile.managerLatitude;
      const longitude = (data.longitude !== undefined && data.longitude !== null)
        ? data.longitude
        : userProfile.managerLongitude;

      const response = await managerApi.updateProfile({
        userName: data.name,
        userTel: data.phone,
        userEmail: data.email,
        userBirth: data.birthDate,
        managerAddress: fullAddress,
        managerLatitude: latitude,
        managerLongitude: longitude,
        managerTime: userProfile.managerTime,
        userType: userProfile.userType,
      });
      setUserProfile(response);
      setIsEditModalOpen(false);
    } catch (err) {
      console.error('프로필 수정에 실패했습니다:', err);
      alert('프로필 수정에 실패했습니다.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-white">
        <CommonHeader title="계정 관리" showBackButton />
        <main className="flex-1 flex flex-col pt-[64px]">
          <div className="flex justify-center items-center h-full">
            <div className="text-gray-400">로딩 중...</div>
          </div>
        </main>
      </div>
    )
  }

  if (error || !userProfile) {
    return (
      <div className="flex min-h-screen flex-col bg-white">
        <CommonHeader title="계정 관리" showBackButton />
        <main className="flex-1 flex flex-col pt-[64px]">
          <div className="flex justify-center items-center h-full">
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
          <AccountProfile 
            profileImage={profileImage}
            userProfileUrl={userProfile?.userProfile}
            onImageChange={handleImageChange}
          />

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <div className="space-y-4">
              <AccountSettings 
                userInfo={{
                  name: userProfile?.userName || '',
                  phone: userProfile?.userTel || '',
                  birthDate: userProfile?.userBirth || '',
                  email: userProfile?.userEmail || '',
                  address: userProfile?.managerAddress
                }}
                appNotification={appNotification}
                onAppNotificationChange={setAppNotification}
                onEditClick={() => setIsEditModalOpen(true)}
              />
            </div>
          </div>
        </div>
      </main>

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        initialData={{
          name: userProfile?.userName || '',
          phone: userProfile?.userTel || '',
          birthDate: userProfile?.userBirth || '',
          email: userProfile?.userEmail || '',
          address: userProfile?.managerAddress
        }}
        showAddressField={true}
        onSubmit={handleEditSubmit}
      />
    </div>
  )
} 