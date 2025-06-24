'use client'

import { MorePageUI } from '@/features/more/ui/MorePageUI'
import { useAuthStore } from '@/shared/stores/authStore'

export default function MorePage() {
  const { user: authUser, userData } = useAuthStore()
  
  // authUser 또는 userData에서 필요한 정보를 추출하여 MorePageUI에 맞는 형태로 변환
  const user = {
    userName: authUser?.name || userData?.userName || '김고객',
    userPoint: userData?.userPoint || 1000,
    userType: userData?.userType || 'Gold',
    userEmail: authUser?.email || userData?.userEmail || 'customer@test.com',
  }
  
  return <MorePageUI user={user} />
}
