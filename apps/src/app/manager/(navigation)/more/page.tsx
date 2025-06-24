'use client'

import React from 'react'
import { MorePageUI } from '@/features/more/ui/MorePageUI'
import { useAuthStore } from '@/shared/stores/authStore'

export default function MorePage() {
  const { user: authUser, userData } = useAuthStore()
  
  // authUser 또는 userData에서 필요한 정보를 추출하여 MorePageUI에 맞는 형태로 변환
  const user = {
    userName: '관리자',
    userPoint: userData?.userPoint || 0,
    userType: authUser?.userRole === 'MANAGER' ? 'Manager' : userData?.userType || 'User',
    userEmail: 'manager@antmen.com',
  }

  return <MorePageUI user={user} />
}
