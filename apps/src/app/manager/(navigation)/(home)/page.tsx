'use client'

import { HomeHeader } from '@/features/home/ui/HomeHeader'
import { BanknotesIcon, CalendarIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ReservationCard } from '@/entities/reservation/ui/ReservationCard'
import { ReviewModal } from '@/shared/ui/modal/ReviewModal'
import { getMyReservations, checkIn, checkOut } from '@/entities/reservation/api/reservationApi'
import type { Reservation } from '@/entities/reservation/model/types'
import { useAuthStore } from '@/shared/stores/authStore'
import { managerApi, type ReviewRequest, type ReviewAuthorType } from '@/shared/api/review'
import { getAuthToken } from '@/features/auth/lib/auth'

const isToday = (dateString: string) => {
  const today = new Date()
  const date = new Date(dateString)
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  )
}

const ManagerTodaySchedule = () => {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [reviewModal, setReviewModal] = useState<{
    isOpen: boolean
    reservationId: number
  }>({
    isOpen: false,
    reservationId: 0,
  })
  const router = useRouter()
  const { user } = useAuthStore()
  const userRole = user?.userRole

  useEffect(() => {
    const token = getAuthToken()
    if (!token) return

    getMyReservations(token)
      .then((data) => setReservations(data.filter(r => isToday(r.reservationDate))))
      .finally(() => setLoading(false))
  }, [])

  const handleCheckIn = async (id: string) => {
    setProcessingId(id)
    try {
      const token = getAuthToken()
      if (!token) return
      
      await checkIn(Number(id), new Date().toISOString(), token)
      setReservations((prev) => prev.map(r => r.reservationId.toString() === id ? { ...r, checkinAt: new Date().toISOString() } : r))
    } finally {
      setProcessingId(null)
    }
  }

  const handleCheckOut = async (id: string) => {
    setProcessingId(id)
    try {
      const token = getAuthToken()
      if (!token) return
      
      await checkOut(Number(id), { checkoutAt: new Date().toISOString(), comment: '' }, token)
      setReservations((prev) => prev.map(r => 
        r.reservationId.toString() === id 
          ? { ...r, checkoutAt: new Date().toISOString(), reservationStatus: 'DONE' } 
          : r
      ))
      
      // Check-out 완료 후 리뷰 모달 열기
      setReviewModal({
        isOpen: true,
        reservationId: Number(id),
      })
    } finally {
      setProcessingId(null)
    }
  }

  return (
    <section className="px-4 pt-6">
      <h2 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
        <CalendarIcon className="w-6 h-6 text-primary" />
        오늘의 일정
      </h2>
      {loading ? (
        <div className="py-8 text-center text-gray-400">오늘의 일정을 불러오는 중...</div>
      ) : reservations.length === 0 ? (
        <div className="py-8 text-center text-gray-400">오늘 예정된 업무가 없습니다.</div>
      ) : (
        <ul className="space-y-4">
          {reservations
            .sort((a, b) => {
              // 1. 완료된 예약(DONE)을 최하단으로
              if (a.reservationStatus === 'DONE' && b.reservationStatus !== 'DONE') return 1
              if (a.reservationStatus !== 'DONE' && b.reservationStatus === 'DONE') return -1
              
              // 2. 같은 상태일 경우 시간순 정렬 (빠른 시간이 위로)
              const aTime = typeof a.reservationTime === 'string' 
                ? a.reservationTime 
                : `${String(a.reservationTime.hour).padStart(2, '0')}:${String(a.reservationTime.minute).padStart(2, '0')}`
              const bTime = typeof b.reservationTime === 'string' 
                ? b.reservationTime 
                : `${String(b.reservationTime.hour).padStart(2, '0')}:${String(b.reservationTime.minute).padStart(2, '0')}`
              
              return aTime.localeCompare(bTime)
            })
            .map((reservation) => (
              <li key={reservation.reservationId}>
                <ReservationCard
                  reservation={reservation}
                  userType="manager"
                  onCheckIn={handleCheckIn}
                  onCheckOut={handleCheckOut}
                  onViewDetails={() => router.push(`/manager/reservations/${reservation.reservationId}`)}
                  onWriteReview={(id) => setReviewModal({ isOpen: true, reservationId: Number(id) })}
                />
              </li>
            ))}
        </ul>
      )}
      
      {/* Review Modal */}
      {reviewModal.isOpen && (
        <ReviewModal
          isOpen={reviewModal.isOpen}
          reservationId={reviewModal.reservationId}
          onClose={() => setReviewModal({ isOpen: false, reservationId: 0 })}
          onSubmit={async (dto: ReviewRequest) => {
            try {
              await managerApi.createReview(dto);
              // 리뷰 작성 후 예약 목록 갱신
              const token = getAuthToken()
              if (token) {
                const updatedReservations = await getMyReservations(token)
                setReservations(updatedReservations.filter(r => isToday(r.reservationDate)))
              }
              
              setReviewModal({ isOpen: false, reservationId: 0 });
              alert('후기가 성공적으로 등록되었습니다!');
            } catch (e) {
              console.error('리뷰 등록 에러:', e);
              alert('리뷰 등록에 실패했습니다.');
            }
          }}
          authorType={userRole as ReviewAuthorType}
        />
      )}
    </section>
  )
}

export default function ManagerHomePage() {
  const router = useRouter()
  return (
    <main className="min-h-screen bg-white">
      <div className="relative">
        <HomeHeader
          title="앤트워크로 달라지는 일상"
          subtitle="바쁜 일상에서 효율적으로 일해보세요"
          buttonText="급여 확인하기"
          onButtonClick={() => router.push('/manager/salary')}
          buttonIcon={<BanknotesIcon className="w-6 h-6 text-black" />}
          requireAuth="MANAGER"
        />
      </div>
      <ManagerTodaySchedule />
    </main>
  )
}