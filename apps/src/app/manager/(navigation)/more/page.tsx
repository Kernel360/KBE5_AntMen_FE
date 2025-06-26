'use client'

import React from 'react'
import { MorePageUI } from '@/features/more/ui/MorePageUI'
import { useAuthStore } from '@/shared/stores/authStore'
import { managerApi } from '@/entities/account/api/accountApi'
import { useEffect, useState } from 'react'
import type { UserProfile } from '@/entities/account/model/types'

export default function MorePage() {
  const { user: authUser, userData } = useAuthStore()
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await managerApi.getProfile()
        setUserProfile(data)
      } catch (err) {
        console.error('프로필 정보를 불러오는데 실패했습니다:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [])

  // 로딩 중이거나 프로필 정보가 없을 경우 기본값 사용
  const user = {
    userName: userProfile?.userName || '관리자',
    userPoint: 0,
    userType: authUser?.userRole === 'MANAGER' ? 'Manager' : userData?.userType || 'User',
    userEmail: userProfile?.userEmail || 'manager@antmen.com',
    userProfile: userProfile?.userProfile,
  }

  if (isLoading) {
    return <div>로딩 중...</div>
  }

  return <MorePageUI user={user} />
}
