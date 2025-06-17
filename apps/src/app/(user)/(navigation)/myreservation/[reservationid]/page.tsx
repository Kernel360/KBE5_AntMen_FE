// 내 예약 -> 예약 상세 페이지
'use client'
import { Suspense } from 'react'
import type { ReservationHistory } from '@/entities/reservation/model/types'
import { ReservationDetailPageClient } from './ReservationDetailPageClient'
import { notFound } from 'next/navigation'
import { customFetch } from '@/shared/api/base'

interface PageProps {
  params: {
    reservationid: string
  }
}

// --- 데이터 페칭 함수 ---
async function getReservationDetail(id: string): Promise<ReservationHistory | null> {
  try {
    console.log('ReservationDetailPage: params.reservationid =', id) // 실제 전달 값 확인
    // 실제 백엔드 API 주소로 변경
    const res = await customFetch(
      `https://api.antmen.site:9091/api/v1/customer/reservations/${id}/history`,
      {
        cache: 'no-store', // 항상 최신 데이터를 가져옴
      },
    )

    return res as ReservationHistory
  } catch (error) {
    console.error('Failed to fetch reservation detail:', error)
    // 에러 발생 시에도 null 반환
    return null
  }
}

// --- 스켈레톤 UI ---
function PageSkeleton() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 animate-pulse">
      {/* Header Skeleton */}
      <header className="bg-white px-5 py-4">
        <div className="flex items-center gap-4">
          <div className="w-6 h-6 bg-gray-200 rounded"></div>
          <div className="w-32 h-8 bg-gray-200 rounded"></div>
        </div>
      </header>

      <main className="flex-grow pb-24">
        <div className="space-y-2">
          {/* Service Info Skeleton */}
          <div className="bg-white px-5 py-6">
            <div className="h-6 w-24 bg-gray-200 rounded mb-6"></div>
            <div className="space-y-4">
              <div className="flex justify-between">
                <div className="w-20 h-5 bg-gray-200 rounded"></div>
                <div className="w-28 h-5 bg-gray-200 rounded"></div>
              </div>
              <div className="flex justify-between">
                <div className="w-16 h-5 bg-gray-200 rounded"></div>
                <div className="w-24 h-5 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
          {/* Manager Info Skeleton */}
          <div className="bg-white px-5 py-6">
            <div className="h-6 w-24 bg-gray-200 rounded mb-6"></div>
            <div className="flex items-start gap-4">
              <div className="w-15 h-15 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-6 w-20 bg-gray-200 rounded"></div>
                <div className="h-5 w-32 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Action Button Skeleton */}
      <div className="sticky bottom-0 bg-white p-5 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
        <div className="w-full h-12 bg-gray-200 rounded-xl"></div>
      </div>
    </div>
  )
}

export default async function ReservationDetailPage({ params }: PageProps) {
  const reservationDetail = await getReservationDetail(params.reservationid)

  if (!reservationDetail) {
    notFound()
  }

  return (
    <Suspense fallback={<PageSkeleton />}>
      <ReservationDetailPageClient initialReservation={reservationDetail} />
    </Suspense>
  )
}
