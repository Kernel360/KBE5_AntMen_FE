'use client'

import React from 'react'
import { MorePageUI } from '@/features/more/ui/MorePageUI'

export default function MorePage() {
  const user = {
    name: '홍길동',
    points: 1000,
    membershipType: 'Gold',
    email: 'test@test.com',
  }
  return <MorePageUI user={user} />
}
