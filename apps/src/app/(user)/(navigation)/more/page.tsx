'use client'

import { MorePageUI } from '@/features/more/ui/MorePageUI'
import { useAuthStore } from '@/shared/stores/authStore'
import { customerApi } from '@/entities/account/api/accountApi'
import { useEffect, useState } from 'react'
import type { UserProfile, CustomerProfile } from '@/entities/account/model/types'

export default function MorePage() {
  const { user: authUser, userData } = useAuthStore()
  const [userProfile, setUserProfile] = useState<CustomerProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await customerApi.getProfile()
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
    userName: userProfile?.userName || '김고객',
    userPoint: userProfile?.customerPoint || 0,
    userType: userData?.userType || 'Gold',
    userEmail: userProfile?.userEmail || 'customer@test.com',
    userProfile: userProfile?.userProfile,
  }

  if (isLoading) {
    return <div>로딩 중...</div>
  }

  return <MorePageUI user={user} />
}
