'use client'

import React from 'react'
import { MorePageUI } from '@/features/more/ui/MorePageUI'

export default function MorePage() {
  const user = {
    userName: '홍길동',
    userPoint: 1000,
    userType: 'Gold',
    userEmail: 'test@test.com',
  }
  return <MorePageUI user={user} />
}
