'use client'

import React, { useState, useEffect } from 'react'
import type { FC } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { ReservationCard } from '@/entities/reservation/ui/ReservationCard'
import type {
  Reservation,
} from '@/entities/reservation/model/types'
import { CustomerAuthGuard } from '@/components/auth/CustomerAuthGuard'
import { ReviewModal } from '@/shared/ui/modal/ReviewModal'
import type { ReviewRequest } from '@/shared/api/review'
import { customerApi } from '@/shared/api/review'
import { getMyReservations } from '@/shared/api/reservation'
import Cookies from 'js-cookie'
import { CommonHeader } from '@/shared/ui/Header/CommonHeader'

export type ReservationTab = 'pending' | 'upcoming' | 'past'

export const MyReservationClient: FC = () => {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<ReservationTab>('pending')
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)
  const [selectedReservationId, setSelectedReservationId] = useState<number | null>(null)

  useEffect(() => {
    getReservations()
  }, [])

  const getReservations = async (): Promise<void> => {
    try {
      const data = await getMyReservations()
      const normalized = normalizeReservations(data)
      setReservations(normalized)
    } catch (error) {
      console.error('Error fetching reservations:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleViewDetails = (id: string) => {
    router.push(`/myreservation/${id}`)
  }

  const handleNewReservation = () => {
    router.push('/reservation')
  }

  const handleOpenReviewModal = (id: string) => {
    setSelectedReservationId(Number(id))
    setIsReviewModalOpen(true)
  }

  const handleCloseReviewModal = () => {
    setSelectedReservationId(null)
    setIsReviewModalOpen(false)
  }

  const handleSubmitReview = async (dto: ReviewRequest) => {
    try {
      await customerApi.createReview(dto)
      await getReservations()
      handleCloseReviewModal()
      alert('리뷰가 성공적으로 등록되었습니다.')
    } catch (error) {
      console.error('Error submitting review:', error)
      alert('리뷰 등록에 실패했습니다. 다시 시도해주세요.')
    }
  }

  const filteredReservations = reservations.filter((r) => {
    const status = r.reservationStatus?.toUpperCase()
    if (activeTab === 'pending') {
      // 매칭 전 예약: WAITING
      return status === 'WAITING'
    } else if (activeTab === 'upcoming') {
      // 진행중 예약: SCHEDULED, MATCHING, PAY
      return ['SCHEDULED', 'MATCHING', 'PAY'].includes(status)
    } else {
      // 지난 예약: DONE, CANCEL, ERROR
      return ['DONE', 'CANCEL', 'ERROR'].includes(status)
    }
  })

  // 오늘 날짜 기준으로 예약 분리 및 정렬
  const sortedReservations = [...filteredReservations].sort((a, b) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // 오늘 날짜의 00:00:00으로 설정
    
    const aDate = new Date(a.reservationDate);
    const bDate = new Date(b.reservationDate);
    
    // 오늘 기준으로 미래/과거 분류
    const aIsFuture = aDate >= today;
    const bIsFuture = bDate >= today;
    
    // 1. 미래 예약을 상단에, 과거 예약을 하단에 배치
    if (aIsFuture && !bIsFuture) return -1;
    if (!aIsFuture && bIsFuture) return 1;
    
    // 2. 같은 그룹 내에서 정렬
    if (aIsFuture && bIsFuture) {
      // 미래 예약: 가까운 날짜순 (오름차순)
      const aDateTime = new Date(`${a.reservationDate}T${a.reservationTime || '00:00'}`);
      const bDateTime = new Date(`${b.reservationDate}T${b.reservationTime || '00:00'}`);
      return aDateTime.getTime() - bDateTime.getTime();
    } else {
      // 과거 예약: 최신순 (내림차순)
      const aDateTime = new Date(`${a.reservationDate}T${a.reservationTime || '00:00'}`);
      const bDateTime = new Date(`${b.reservationDate}T${b.reservationTime || '00:00'}`);
      return bDateTime.getTime() - aDateTime.getTime();
    }
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <CommonHeader 
        title="예약 내역"
        showCloseButton
      />

      <div className="fixed top-[64px] left-1/2 -translate-x-1/2 w-full max-w-mobile z-20 bg-white border-b border-gray-200">
        <div className="grid grid-cols-3">
          <button
            onClick={() => setActiveTab('pending')}
            className={`relative py-3.5 text-sm font-medium transition-colors ${
              activeTab === 'pending' ? 'bg-primary/10' : ''
            }`}
          >
            <span className={activeTab === 'pending' ? 'text-primary' : 'text-gray-600'}>
              매칭 전 예약
            </span>
            {activeTab === 'pending' && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`relative py-3.5 text-sm font-medium transition-colors ${
              activeTab === 'upcoming' ? 'bg-primary/10' : ''
            }`}
          >
            <span className={activeTab === 'upcoming' ? 'text-primary' : 'text-gray-600'}>
              진행중 예약
            </span>
            {activeTab === 'upcoming' && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`relative py-3.5 text-sm font-medium transition-colors ${
              activeTab === 'past' ? 'bg-primary/10' : ''
            }`}
          >
            <span className={activeTab === 'past' ? 'text-primary' : 'text-gray-600'}>
              지난 예약
            </span>
            {activeTab === 'past' && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary" />
            )}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pt-[120px] pb-16">
        {loading ? (
          null
        ) : sortedReservations.length > 0 ? (
          <div className="space-y-4 p-5">
            {sortedReservations.map((reservation, index) => {
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              
              const reservationDate = new Date(reservation.reservationDate);
              const isCurrentReservationPast = reservationDate < today;
              
              // 이전 예약이 미래였고 현재 예약이 과거인 경우 구분선 표시
              const showDivider = index > 0 && (() => {
                const prevReservation = sortedReservations[index - 1];
                const prevDate = new Date(prevReservation.reservationDate);
                const isPrevReservationFuture = prevDate >= today;
                return isPrevReservationFuture && isCurrentReservationPast;
              })();

              return (
                <React.Fragment key={reservation.reservationId}>
                  {showDivider && (
                    <div className="flex items-center gap-4 py-4">
                      <div className="flex-1 h-px bg-gray-200"></div>
                      <span className="text-sm font-medium text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
                        지난 예약
                      </span>
                      <div className="flex-1 h-px bg-gray-200"></div>
                    </div>
                  )}
                  <ReservationCard
                    reservation={reservation}
                    userType="customer"
                    onViewDetails={() =>
                      handleViewDetails(String(reservation.reservationId))
                    }
                    onWriteReview={
                      reservation.reservationStatus === 'DONE' && !reservation.hasReview
                        ? () => handleOpenReviewModal(String(reservation.reservationId))
                        : undefined
                    }
                  />
                </React.Fragment>
              );
            })}
          </div>
        ) : (
          <div className="flex h-[500px] flex-col items-center justify-center gap-6 p-6">
            <div className="flex flex-col items-center gap-3">
              <h2 className="text-xl font-bold text-[#222222]">
                예약 내역이 없습니다
              </h2>
              <p className="text-center text-base text-[#AAAAAA]">
                아직 예약한 청소 서비스가 없습니다.
                <br />
                지금 서비스를 예약해보세요.
              </p>
            </div>
            <button
              onClick={handleNewReservation}
              className="mt-3 w-[280px] rounded-xl bg-primary py-4 text-base font-bold text-white"
            >
              청소 서비스 예약하기
            </button>
          </div>
        )}
      </div>

      {isReviewModalOpen && selectedReservationId && (
        <ReviewModal
          isOpen={isReviewModalOpen}
          reservationId={selectedReservationId}
          onClose={handleCloseReviewModal}
          onSubmit={handleSubmitReview}
          authorType="CUSTOMER"
        />
      )}
    </div>
  )
}

function normalizeReservations(raw: any[]): Reservation[] {
  return raw.map((r) => ({
    reservationId: r.reservationId,
    customerId: r.customerId,
    reservationCreatedAt: r.reservationCreatedAt,
    reservationDate: r.reservationDate,
    reservationTime: r.reservationTime,
    categoryId: r.categoryId,
    categoryName: r.categoryName,
    recommendDuration: r.recommendDuration,
    reservationDuration: r.reservationDuration,
    managerId: r.managerId,
    managerName: r.managerName,
    matchedAt: r.matchedAt,
    reservationStatus: r.reservationStatus,
    reservationCancelReason: r.reservationCancelReason,
    reservationMemo: r.reservationMemo,
    reservationAmount: r.reservationAmount,
    optionIds: r.optionIds,
    optionNames: r.optionNames,
    address: r.address,
    hasReview: r.hasReview,
  }))
}

export const MyReservationClientWithAuth: FC = () => (
  <CustomerAuthGuard>
    <MyReservationClient />
  </CustomerAuthGuard>
)

export default MyReservationClientWithAuth
