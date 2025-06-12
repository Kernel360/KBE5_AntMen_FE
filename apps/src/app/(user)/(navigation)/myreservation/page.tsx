'use client'

// 내 예약 페이지 (예약리스트)

/**
 * TODO
 * 1. 예약 폼 데이터 연동
 * 2. 지난 예약 연결
 */

import { Suspense } from 'react'
import type { Reservation } from '@/entities/reservation/model/types'
import MyReservationClientWithAuth from './MyReservationClient'
import { CustomerAuthGuard } from '@/components/auth/CustomerAuthGuard'

async function getReservations(): Promise<Reservation[]> {
  try {
    // API URL을 환경 변수로 관리하는 것이 좋습니다.
    const res = await fetch(`/api/v1/customer/reservations`, {
      cache: 'no-store',
    })

    if (!res.ok) {
      throw new Error('Failed to fetch reservations')
    }

    const data = await res.json()
    return data
  } catch (error) {
    console.error('Error fetching reservations:', error)
    return []
  }
}

function PageSkeleton() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Header Skeleton */}
      <header className="sticky top-0 z-30 flex items-center justify-between p-5 bg-white">
        <div className="h-6 w-6 rounded bg-gray-200 animate-pulse" />
        <div className="h-7 w-32 rounded bg-gray-200 animate-pulse" />
        <div className="h-6 w-6" />
      </header>
      {/* Tab Skeleton */}
      <div className="sticky top-[72px] z-20 bg-white">
        <div className="flex flex-col gap-4 px-5">
          <div className="flex gap-10">
            <div className="h-7 w-24 rounded bg-gray-200 animate-pulse" />
            <div className="h-7 w-20 rounded bg-gray-200 animate-pulse" />
          </div>
        </div>
      </div>
      {/* Card List Skeleton */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        <div className="h-48 w-full rounded-xl bg-gray-200 animate-pulse" />
        <div className="h-48 w-full rounded-xl bg-gray-200 animate-pulse" />
        <div className="h-48 w-full rounded-xl bg-gray-200 animate-pulse" />
      </div>
    </div>
  )
}

export default async function MyReservationPage() {
  const initialReservations = await getReservations()

  return (
    <main className="flex min-h-screen flex-col bg-white">
      <Suspense fallback={<PageSkeleton />}>
        <MyReservationClientWithAuth
          initialReservations={initialReservations}
        />
      </Suspense>
    </main>
  )
}
