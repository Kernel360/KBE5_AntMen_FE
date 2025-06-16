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
import { changeReservationStatus, getMyReservations } from '@/entities/reservation/api/reservationApi'

interface ManagerReservationsClientProps {
  initialReservations: Reservation[]
}

export const ManagerReservationsClient = ({
  initialReservations,
}: ManagerReservationsClientProps) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState<ReservationTab>('upcoming')
  const [reservations, setReservations] =
    useState<Reservation[]>(initialReservations.map(mapReservationApiToClient))
  const [reviewModal, setReviewModal] = useState<{
    isOpen: boolean
    reservationId: string
    customerName: string
  }>({
    isOpen: false,
    reservationId: '',
    customerName: '',
  })
  const [error, setError] = useState<string | null>(null)

  // 클라이언트에서 예약 데이터 fetch
  const fetchReservations = async () => {
    try {
      const rawToken = document.cookie
        .split('; ')
        .find((row) => row.startsWith('auth-token='))
        ?.split('=')[1] || '';
      const decodedToken = decodeURIComponent(rawToken);
      const token = decodedToken.replace(/^Bearer\s+/, '');
      const authHeader = `Bearer ${token}`;
      const data = await getMyReservations(authHeader);
      setReservations(data.map(mapReservationApiToClient));
    } catch (e) {
      setError('예약 데이터를 불러오지 못했습니다.');
    }
  };

  // 최초 마운트 및 탭 전환 시마다 fetch
  useEffect(() => {
    fetchReservations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  // URL 파라미터에서 취소된 예약 ID 확인
  useEffect(() => {
    const cancelledId = searchParams?.get('cancelled')
    if (cancelledId) {
      setReservations((prev) =>
        prev.map((reservation) =>
          reservation.reservationId.toString() === cancelledId
            ? { ...reservation, reservationStatus: 'C' }
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
      const rawToken = document.cookie
        .split('; ')
        .find((row) => row.startsWith('auth-token='))
        ?.split('=')[1] || '';
      const decodedToken = decodeURIComponent(rawToken);
      const token = decodedToken.replace(/^Bearer\s+/, '');
      const authHeader = `Bearer ${token}`;
      // FE 상태코드('M', 'W', 'D' 등)를 그대로 전달
      await changeReservationStatus(
        parseInt(id),
        newStatus.reservationStatus as ReservationStatus,
        authHeader
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
    await updateReservationStatus(id, {
      reservationStatus: 'M',
    })
  }

  const handleCheckOut = async (id: string) => {
    console.log('Check-out for reservation:', id)
    const reservation = reservations.find((r) => r.reservationId.toString() === id)
    if (!reservation) return

    await updateReservationStatus(id, {
      reservationStatus: 'D',
    })

    setReviewModal({
      isOpen: true,
      reservationId: id,
      customerName: '고객님',
    })
  }

  const handleWriteReview = (id: string) => {
    const reservation = reservations.find((r) => r.reservationId.toString() === id)
    if (!reservation) return

    setReviewModal({
      isOpen: true,
      reservationId: id,
      customerName: '고객님',
    })
  }

  const handleReviewSubmit = async (rating: number, content: string) => {
    const reviewData = {
      rating,
      content,
      createdAt: new Date().toISOString(),
    }

    await updateReservationStatus(reviewModal.reservationId, {
      reservationStatus: 'D',
    })

    // 모달 닫기
    setReviewModal({
      isOpen: false,
      reservationId: '',
      customerName: '',
    })

    alert('후기가 성공적으로 등록되었습니다!')
  }

  const handleReviewModalClose = () => {
    // 후기를 작성하지 않고 모달을 닫았을 때
    setReviewModal({
      isOpen: false,
      reservationId: '',
      customerName: '',
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

  const filteredReservations = reservations.filter((reservation) =>
    activeTab === 'upcoming'
      ? reservation.reservationStatus === 'W' || reservation.reservationStatus === 'M'
      : reservation.reservationStatus === 'D' ||
        reservation.reservationStatus === 'C' ||
        reservation.reservationStatus === 'E',
  )

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
            <h2 className="text-xl font-semibold text-red-600 mb-2">오류가 발생했습니다</h2>
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
          onClose={handleReviewModalClose}
          onSubmit={handleReviewSubmit}
          customerName={reviewModal.customerName}
        />
      )}
    </main>
  )
}

function mapReservationApiToClient(apiData: Reservation): Reservation {
  return {
    ...apiData,
    reservationStatus: ReservationStatusMap[apiData.reservationStatus] || apiData.reservationStatus,
    reservationTime: typeof apiData.reservationTime === 'string'
      ? apiData.reservationTime
      : `${String(apiData.reservationTime.hour).padStart(2, '0')}:${String(apiData.reservationTime.minute).padStart(2, '0')}:${String(apiData.reservationTime.second ?? 0).padStart(2, '0')}`,
  }
}
