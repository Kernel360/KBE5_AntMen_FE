// 내 예약 -> 예약 상세 페이지

/**
 * TODO: 예약 상세 페이지 디자인 수정 필요
 *
 * 1. 결제하면 결제 컴포넌트 불러오기 ✅
 * 2. 예약 취소 버튼 누르면 예약 취소 모달 띄우기 RejectReservationModal ✅
 * 3. 결제 페이지 이동 필요 ✅
 * 4. 예약 리스트 예약 상태 수정 ✅
 * 5. 매니저 리스트 추가 필요
 * 6. 환불 기능 구현 ✅
 * 7. 모달 컴포넌트 분리 ✅
 **/

import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { ReservationDetailPageClient } from './ReservationDetailPageClient'
import type { Reservation, ReservationStatus, PaymentStatus } from '@/entities/reservation/model/types'

interface PageProps {
  params: {
    reservationid: string
  }
}

// --- 데이터 페칭 함수 ---
async function getReservationDetail(id: string): Promise<Reservation | null> {
  try {
    const res = await fetch(`https://api.antmen.site:9091/api/v1/customer/reservations/${id}/history`, {
      cache: 'no-store', // 항상 최신 데이터를 가져옴
    })

    if (!res.ok) {
      if (res.status === 404) {
        return null // 404의 경우 null을 반환하여 페이지에서 처리
      }
      throw new Error(`Failed to fetch reservation: ${res.statusText}`)
    }

    const data = await res.json()
    
    // API 응답을 기존 Reservation 타입으로 변환
    const reservation: Reservation = {
      id: data.reservationId.toString(),
      reservationNumber: data.reservationId.toString(),
      serviceType: data.categoryName,
      status: data.reservationStatus as ReservationStatus,
      paymentStatus: 'paid' as PaymentStatus, // API 응답에 따라 적절히 매핑 필요
      dateTime: data.reservationDate,
      duration: `${data.totalDuration}시간`,
      location: data.address,
      detailedAddress: data.address,
      worker: {
        id: data.manager.userId.toString(),
        name: data.manager.name,
        rating: 0, // API 응답에 없으므로 기본값 설정
        experience: '', // API 응답에 없으므로 기본값 설정
        age: data.manager.age,
        gender: data.manager.gender,
        avatar: data.manager.profileImage,
        phone: '', // API 응답에 없으므로 기본값 설정
      },
      customer: {
        id: data.customer.userId.toString(),
        name: data.customer.name,
      },
      amount: data.totalAmount,
      baseAmount: data.totalAmount, // API 응답에 없으므로 totalAmount로 설정
      discount: 0, // API 응답에 없으므로 기본값 설정
      paymentMethod: '카드', // API 응답에 없으므로 기본값 설정
      options: data.selectedOptions.map((option: string) => ({
        name: option,
        price: 0, // API 응답에 없으므로 기본값 설정
      })),
      createdAt: data.reservationDate, // API 응답에 없으므로 reservationDate로 설정
    }

    return reservation
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
          {/* Reservation Status Skeleton */}
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
          {/* Cleaner Info Skeleton */}
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
          {/* Payment Skeleton */}
          <div className="bg-white px-5 py-6">
            <div className="h-6 w-32 bg-gray-200 rounded mb-6"></div>
            <div className="space-y-4">
              <div className="flex justify-between">
                <div className="w-24 h-5 bg-gray-200 rounded"></div>
                <div className="w-20 h-5 bg-gray-200 rounded"></div>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <div className="w-28 h-6 bg-gray-200 rounded"></div>
                <div className="w-24 h-6 bg-gray-200 rounded"></div>
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
