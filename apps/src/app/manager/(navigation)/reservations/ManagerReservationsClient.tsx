'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { ReservationCard } from '@/entities/reservation/ui/ReservationCard'
import { ReviewModal } from '@/shared/ui/modal/ReviewModal'
import {
  Reservation,
  ReservationTab,
  ReservationStatus,
  ReservationStatusMap,
} from '@/entities/reservation/model/types'
import {
  changeReservationStatus,
  getMyReservations,
  checkIn,
  checkOut,
} from '@/entities/reservation/api/reservationApi'
import { useAuthStore } from '@/shared/stores/authStore'
import { managerApi, type ReviewRequest, type ReviewAuthorType } from '@/shared/api/review'

interface ManagerReservationsClientProps {
  initialReservations: Reservation[]
}

export const ManagerReservationsClient = ({
  initialReservations,
}: ManagerReservationsClientProps) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState<ReservationTab>('upcoming')
  const [reservations, setReservations] = useState<Reservation[]>(
    initialReservations.map(mapReservationApiToClient),
  )
  const [reviewModal, setReviewModal] = useState<{
    isOpen: boolean
    reservationId: number
  }>({
    isOpen: false,
    reservationId: 0,
  })
  const [checkoutModal, setCheckoutModal] = useState<{
    isOpen: boolean
    reservationId: number
  }>({
    isOpen: false,
    reservationId: 0,
  })
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuthStore()
  const userRole = user.userRole

  // 클라이언트에서 예약 데이터 fetch
  const fetchReservations = async () => {
    try {
      const rawToken =
        document.cookie
          .split('; ')
          .find((row) => row.startsWith('auth-token='))
          ?.split('=')[1] || ''
      const decodedToken = decodeURIComponent(rawToken)
      const token = decodedToken.replace(/^Bearer\s+/, '')
      const authHeader = `Bearer ${token}`
      const data = await getMyReservations(authHeader)
      setReservations(data.map(mapReservationApiToClient))
    } catch (e) {
      setError('예약 데이터를 불러오지 못했습니다.')
    }
  }

  // 최초 마운트 및 탭 전환 시마다 fetch
  useEffect(() => {
    fetchReservations()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab])

  // URL 파라미터에서 취소된 예약 ID 확인
  useEffect(() => {
    const cancelledId = searchParams?.get('cancelled')
    if (cancelledId) {
      setReservations((prev) =>
        prev.map((reservation) =>
          reservation.reservationId.toString() === cancelledId
            ? { ...reservation, reservationStatus: 'CANCEL' }
            : reservation,
        ),
      )
      // URL 파라미터 제거 (히스토리를 깔끔하게 유지)
      const newUrl = window.location.pathname
      window.history.replaceState({}, '', newUrl)
    }
  }, [searchParams])

  const updateReservationStatus = async (
    id: string,
    newStatus: Partial<Reservation>,
  ) => {
    try {
      // 쿠키에서 토큰 가져오기
      const rawToken =
        document.cookie
          .split('; ')
          .find((row) => row.startsWith('auth-token='))
          ?.split('=')[1] || ''
      const decodedToken = decodeURIComponent(rawToken)
      const token = decodedToken.replace(/^Bearer\s+/, '')
      const authHeader = `Bearer ${token}`
      await changeReservationStatus(
        parseInt(id),
        newStatus.reservationStatus as ReservationStatus,
        authHeader,
      )
      // 로컬 상태 업데이트
      setReservations((prev) =>
        prev.map((reservation) =>
          reservation.reservationId.toString() === id
            ? { ...reservation, ...newStatus }
            : reservation,
        ),
      )
    } catch (error) {
      console.error('Error updating reservation:', error)
      setError('상태 변경에 실패했습니다. 다시 시도해주세요.')
    }
  }

  const handleCheckIn = async (id: string) => {
    console.log('Check-in for reservation:', id)
    const rawToken =
      document.cookie
        .split('; ')
        .find((row) => row.startsWith('auth-token='))
        ?.split('=')[1] || ''
    const decodedToken = decodeURIComponent(rawToken)
    const token = decodedToken.replace(/^Bearer\s+/, '')
    const authHeader = `Bearer ${token}`

    const checkinTime = new Date().toISOString()

    // Optimistic Update
    setReservations(prev =>
      prev.map(r =>
        r.reservationId.toString() === id
          ? { ...r, checkinAt: checkinTime }
          : r,
      ),
    )

    try {
      await checkIn(Number(id), checkinTime, authHeader)
    } catch (error) {
      console.error('Check-in failed:', error)
      alert('체크인에 실패했습니다. 다시 시도해주세요.')
      // Rollback on error
      setReservations(prev =>
        prev.map(r =>
          r.reservationId.toString() === id ? { ...r, checkinAt: null } : r,
        ),
      )
    }
  }

  const handleCheckOut = (id: string) => {
    console.log('Check-out for reservation:', id)
    setCheckoutModal({
      isOpen: true,
      reservationId: Number(id),
    })
  }

  const handleCheckoutSubmit = async (comment: string) => {
    if (!checkoutModal.reservationId) return

    const id = checkoutModal.reservationId
    const rawToken =
      document.cookie
        .split('; ')
        .find(row => row.startsWith('auth-token='))
        ?.split('=')[1] || ''
    const decodedToken = decodeURIComponent(rawToken)
    const token = decodedToken.replace(/^Bearer\s+/, '')
    const authHeader = `Bearer ${token}`

    const checkoutTime = new Date().toISOString()
    
    try {
      await checkOut(id, { checkoutAt: checkoutTime, comment }, authHeader)
      
      // 로컬 상태 DONE으로 변경
      await updateReservationStatus(id.toString(), {
        reservationStatus: 'DONE',
      })

      // 리뷰 모달 열기
      setReviewModal({
        isOpen: true,
        reservationId: id,
      })
    } catch (error) {
      console.error('Check-out failed:', error)
      alert('체크아웃에 실패했습니다.')
    } finally {
      setCheckoutModal({ isOpen: false, reservationId: 0 })
    }
  }

  const handleWriteReview = (id: string) => {
    setReviewModal({
      isOpen: true,
      reservationId: Number(id),
    })
  }

  const handleReviewSubmit = async (dto: ReviewRequest) => {
    try {
      console.log('리뷰 제출 데이터:', dto);
      const response = await managerApi.createReview(dto);
      console.log('리뷰 제출 응답:', response);

      await fetchReservations();
      console.log('예약 목록 갱신 후:', reservations);

      setReviewModal({
        isOpen: false,
        reservationId: 0,
      });

      alert('후기가 성공적으로 등록되었습니다!');
    } catch (e) {
      console.error('리뷰 등록 에러:', e);
      alert('리뷰 등록에 실패했습니다.');
    }
  };

  const handleReviewModalClose = () => {
    // 후기를 작성하지 않고 모달을 닫았을 때
    setReviewModal({
      isOpen: false,
      reservationId: 0,
    })
  }

  const handleCancel = (id: string) => {
    // 매니저의 경우 예약 취소가 아닌 업무 포기/변경 요청
    console.log('업무 포기/변경 요청:', id)
    // TODO: 매니저용 취소/변경 로직 구현
  }

  const handleViewDetails = (id: string) => {
    router.push(`/manager/reservations/${id}`) // 매니저용 예약 상세 페이지 경로
  }

  const handleNewWork = () => {
    // 새로운 업무 찾기 또는 매칭 요청
    router.push('/manager/matching')
  }

  const filteredReservations = reservations.filter((reservation) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0) // 시간, 분, 초를 0으로 설정하여 날짜만 비교

    const reservationDate = new Date(reservation.reservationDate)
    reservationDate.setHours(0, 0, 0, 0)

    const isPastDate = reservationDate < today

    const isUpcomingStatus =
      reservation.reservationStatus === 'WAITING' ||
      reservation.reservationStatus === 'MATCHING'

    const isPastStatus =
      reservation.reservationStatus === 'DONE' ||
      reservation.reservationStatus === 'CANCEL' ||
      reservation.reservationStatus === 'ERROR'

    if (activeTab === 'upcoming') {
      // 오늘 또는 미래의 날짜 && 예정된 상태
      return !isPastDate && isUpcomingStatus
    }

    if (activeTab === 'past') {
      // 지난 날짜이거나 || 이미 지난 상태
      return isPastDate || isPastStatus
    }

    return false // 그 외의 경우
  })

  if (error) {
    return (
      <main className="flex min-h-screen flex-col bg-white">
        {/* Header */}
        <header className="flex items-center justify-between p-5">
          <button
            onClick={() => router.back()}
            className="flex h-6 w-6 items-center justify-center"
          >
            <Image
              src="/icons/arrow-left.svg"
              alt="뒤로가기"
              width={24}
              height={24}
            />
          </button>
          <h1 className="flex-1 text-center text-2xl font-bold">업무 내역</h1>
          <div className="h-6 w-6" /> {/* Spacer for alignment */}
        </header>

        {/* Tab Section */}
        <div className="flex flex-col gap-4 px-5">
          <div className="flex gap-10">
            <button
              onClick={() => setActiveTab('upcoming')}
              className="flex flex-col items-center gap-2"
            >
              <span
                className={`text-base ${
                  activeTab === 'upcoming'
                    ? 'font-extrabold text-[#4DD0E1]'
                    : 'font-medium text-[#B0BEC5]'
                }`}
              >
                예정된 업무
              </span>
              {activeTab === 'upcoming' && (
                <div className="h-0.5 w-full bg-[#4DD0E1]" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className="flex flex-col items-center gap-2"
            >
              <span
                className={`text-base ${
                  activeTab === 'past'
                    ? 'font-extrabold text-[#4DD0E1]'
                    : 'font-medium text-[#B0BEC5]'
                }`}
              >
                지난 업무
              </span>
              {activeTab === 'past' && (
                <div className="h-0.5 w-full bg-[#4DD0E1]" />
              )}
            </button>
          </div>
        </div>

        {/* Error 안내문구 */}
        <section className="flex flex-1 flex-col items-center justify-center bg-gray-50 p-5">
          <div className="flex flex-col items-center">
            <h2 className="text-xl font-semibold text-red-600 mb-2">
              오류가 발생했습니다
            </h2>
            <p className="text-gray-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
            >
              다시 시도
            </button>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen flex-col bg-white">
      {/* Header */}
      <header className="flex items-center justify-between p-5">
        <button
          onClick={() => router.back()}
          className="flex h-6 w-6 items-center justify-center"
        >
          <Image
            src="/icons/arrow-left.svg"
            alt="뒤로가기"
            width={24}
            height={24}
          />
        </button>
        <h1 className="flex-1 text-center text-2xl font-bold">업무 내역</h1>
        <div className="h-6 w-6" /> {/* Spacer for alignment */}
      </header>

      {/* Tab Section */}
      <div className="flex flex-col gap-4 px-5">
        <div className="flex gap-10">
          <button
            onClick={() => setActiveTab('upcoming')}
            className="flex flex-col items-center gap-2"
          >
            <span
              className={`text-base ${
                activeTab === 'upcoming'
                  ? 'font-extrabold text-[#4DD0E1]'
                  : 'font-medium text-[#B0BEC5]'
              }`}
            >
              예정된 업무
            </span>
            {activeTab === 'upcoming' && (
              <div className="h-0.5 w-full bg-[#4DD0E1]" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className="flex flex-col items-center gap-2"
          >
            <span
              className={`text-base ${
                activeTab === 'past'
                  ? 'font-extrabold text-[#4DD0E1]'
                  : 'font-medium text-[#B0BEC5]'
              }`}
            >
              지난 업무
            </span>
            {activeTab === 'past' && (
              <div className="h-0.5 w-full bg-[#4DD0E1]" />
            )}
          </button>
        </div>
      </div>

      {/* Reservation List or 안내문구 */}
      <section className="flex flex-1 flex-col overflow-y-auto bg-gray-50 p-5">
        {filteredReservations.length > 0 ? (
          <div className="space-y-4">
            {filteredReservations.map((reservation) => (
              <ReservationCard
                key={reservation.reservationId}
                reservation={reservation}
                userType="manager"
                onCheckIn={handleCheckIn}
                onCheckOut={handleCheckOut}
                onWriteReview={handleWriteReview}
                onCancel={handleCancel}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-6 rounded-2xl bg-white">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100" />
            <div className="text-center">
              <p className="text-lg font-bold text-gray-800">
                {activeTab === 'upcoming'
                  ? '예정된 업무가 없습니다'
                  : '지난 업무가 없습니다'}
              </p>
              <p className="mt-2 text-sm text-gray-500">
                {activeTab === 'upcoming'
                  ? '새로운 업무를 찾거나 매칭 요청을 확인해보세요.'
                  : '완료된 업무 내역이 여기에 표시됩니다.'}
              </p>
            </div>
            {activeTab === 'upcoming' && (
              <button
                onClick={handleNewWork}
                className="rounded-xl bg-gray-800 px-6 py-3 text-base font-bold text-white"
              >
                새로운 업무 찾기
              </button>
            )}
          </div>
        )}
      </section>

      {/* Review Modal */}
      {reviewModal.isOpen && (
        <ReviewModal
          isOpen={reviewModal.isOpen}
          reservationId={reviewModal.reservationId}
          onClose={handleReviewModalClose}
          onSubmit={handleReviewSubmit}
          authorType={userRole as ReviewAuthorType}
        />
      )}
      
      {/* Checkout Comment Modal */}
      {checkoutModal.isOpen && (
        <CheckoutCommentModal
          isOpen={checkoutModal.isOpen}
          onClose={() => setCheckoutModal({ isOpen: false, reservationId: 0 })}
          onSubmit={handleCheckoutSubmit}
        />
      )}
    </main>
  )
}

const CheckoutCommentModal = ({
  isOpen,
  onClose,
  onSubmit,
}: {
  isOpen: boolean
  onClose: () => void
  onSubmit: (comment: string) => void
}) => {
  const [comment, setComment] = useState('')

  if (!isOpen) return null

  const handleSubmit = () => {
    if (!comment.trim()) {
      alert('코멘트를 입력해주세요.')
      return
    }
    onSubmit(comment)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-[90%] max-w-md">
        <h3 className="text-lg font-bold mb-4">체크아웃 코멘트</h3>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="고객에게 전달할 코멘트를 남겨주세요."
          className="w-full h-32 p-3 border border-gray-300 rounded-lg mb-4"
        />
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 text-gray-800 rounded-xl py-3 font-bold"
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 bg-[#4abed9] text-white rounded-xl py-3 font-bold"
          >
            체크아웃 완료
          </button>
        </div>
      </div>
    </div>
  )
}

function mapReservationApiToClient(apiData: Reservation): Reservation {
  return {
    ...apiData,
    reservationStatus:
      ReservationStatusMap[apiData.reservationStatus] ||
      apiData.reservationStatus,
    reservationTime:
      typeof apiData.reservationTime === 'string'
        ? apiData.reservationTime
        : `${String(apiData.reservationTime.hour).padStart(2, '0')}:${String(apiData.reservationTime.minute).padStart(2, '0')}:${String(apiData.reservationTime.second ?? 0).padStart(2, '0')}`,
  }
}
