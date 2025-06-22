'use client'

// 내 예약 페이지 (예약리스트)

/**
 * TODO
 * 1. 예약 폼 데이터 연동
 * 2. 지난 예약 연결
 */

import { Suspense } from 'react'
import MyReservationClientWithAuth from './MyReservationClient'

function PageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Skeleton - CommonHeader 스타일 */}
      <div className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm">
        <div className="h-[64px] flex items-stretch relative">
          <div className="absolute left-0 w-[48px] h-[64px] flex items-center justify-start pl-4">
            <div className="h-6 w-6 rounded bg-gray-200 animate-pulse" />
          </div>
          <div className="w-full h-[64px] flex flex-col items-center justify-center mx-[48px]">
            <div className="h-5 w-20 rounded bg-gray-200 animate-pulse" />
          </div>
        </div>
      </div>
      
      {/* Tab Skeleton */}
      <div className="sticky top-[64px] z-20 bg-white border-b">
        <div className="flex gap-10 px-5 py-3">
          <div className="h-7 w-24 rounded bg-gray-200 animate-pulse" />
          <div className="h-7 w-20 rounded bg-gray-200 animate-pulse" />
          <div className="h-7 w-16 rounded bg-gray-200 animate-pulse" />
        </div>
      </div>
      
      {/* Card List Skeleton */}
      <div className="pb-20 min-h-[calc(100vh-64px-60px)] overflow-y-auto p-5 space-y-4">
        <div className="h-48 w-full rounded-xl bg-gray-200 animate-pulse" />
        <div className="h-48 w-full rounded-xl bg-gray-200 animate-pulse" />
        <div className="h-48 w-full rounded-xl bg-gray-200 animate-pulse" />
      </div>
    </div>
  )
}

export default function MyReservationPage() {
  return (
    <main className="bg-gray-50 pb-[72px]">
      <Suspense fallback={<PageSkeleton />}>
        <MyReservationClientWithAuth />
      </Suspense>
    </main>
  )
}
