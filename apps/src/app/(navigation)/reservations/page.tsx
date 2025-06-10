'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ReservationCard } from '@/entities/reservation/ui/ReservationCard'
import { ReviewModal } from '@/features/review'
import type {
  Reservation,
  ReservationTab,
} from '@/entities/reservation/model/types'
import type { CreateReviewData } from '@/entities/review'

// 임시 데이터
const MOCK_RESERVATIONS: Reservation[] = [
  {
    id: '1',
    reservationNumber: 'RES-001',
    serviceType: '정기 청소',
    status: 'scheduled',
    paymentStatus: 'paid',
    dateTime: '2024년 3월 15일 · 오전 10:00',
    duration: '2시간',
    location: '서울시 강남구',
    detailedAddress: '서울시 강남구 테헤란로 123',
    worker: {
      id: '1',
      name: '김민준',
      rating: 4.9,
      experience: '경력 3년',
      age: 32,
      gender: '남성',
      avatar: '민준',
      phone: '010-1234-5678',
    },
    amount: 54000,
    baseAmount: 54000,
    discount: 0,
    paymentMethod: '신용카드',
    options: [],
    createdAt: '2024-03-01T10:00:00Z',
  },
  {
    id: '2',
    reservationNumber: 'RES-002',
    serviceType: '정기 청소',
    status: 'scheduled',
    paymentStatus: 'paid',
    dateTime: '2024년 3월 22일 · 오전 10:00',
    duration: '2시간',
    location: '서울시 강남구',
    detailedAddress: '서울시 강남구 테헤란로 123',
    worker: {
      id: '1',
      name: '김민준',
      rating: 4.9,
      experience: '경력 3년',
      age: 32,
      gender: '남성',
      avatar: '민준',
      phone: '010-1234-5678',
    },
    amount: 54000,
    baseAmount: 54000,
    discount: 0,
    paymentMethod: '신용카드',
    options: [],
    createdAt: '2024-03-01T10:00:00Z',
  },
  {
    id: '3',
    reservationNumber: 'RES-003',
    serviceType: '대청소',
    status: 'completed',
    paymentStatus: 'paid',
    dateTime: '2024년 2월 28일 · 오전 9:00',
    duration: '4시간',
    location: '서울시 서초구',
    detailedAddress: '서울시 서초구 서초대로 456',
    worker: {
      id: '2',
      name: '이수정',
      rating: 4.8,
      experience: '경력 5년',
      age: 29,
      gender: '여성',
      avatar: '수정',
      phone: '010-8765-4321',
    },
    amount: 75000,
    baseAmount: 75000,
    discount: 0,
    paymentMethod: '신용카드',
    options: [],
    createdAt: '2024-02-20T10:00:00Z',
  },
  {
    id: '4',
    reservationNumber: 'RES-004',
    serviceType: '부분 청소',
    status: 'completed',
    paymentStatus: 'paid',
    dateTime: '2024년 2월 20일 · 오후 2:00',
    duration: '2시간',
    location: '서울시 마포구',
    detailedAddress: '서울시 마포구 홍대입구로 789',
    worker: {
      id: '3',
      name: '박영호',
      rating: 4.7,
      experience: '경력 2년',
      age: 45,
      gender: '남성',
      avatar: '영호',
      phone: '010-5555-4444',
    },
    amount: 45000,
    baseAmount: 45000,
    discount: 0,
    paymentMethod: '신용카드',
    options: [],
    createdAt: '2024-02-15T10:00:00Z',
  },
]

export default function ReservationsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<ReservationTab>('upcoming')
  const [reservations, setReservations] =
    useState<Reservation[]>(MOCK_RESERVATIONS)
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)
  const [selectedReservationId, setSelectedReservationId] = useState<string>('')

  const handleCancel = (id: string) => {
    // TODO: Implement reservation cancellation
    console.log('Cancel reservation:', id)
  }

  const handleViewDetails = (id: string) => {
    router.push(`/reservations/${id}`)
  }

  const handleNewReservation = () => {
    // TODO: Navigate to reservation creation page
    router.push('/reservation/form')
  }

  const handleReview = (id: string) => {
    setSelectedReservationId(id)
    setIsReviewModalOpen(true)
  }

  const handleReviewSubmit = (reviewData: CreateReviewData) => {
    // TODO: Implement review submission API call
    console.log('Submit review:', reviewData)
    // 실제 구현에서는 API 호출 후 성공 메시지 표시
    alert('리뷰가 등록되었습니다.')
  }

  const filteredReservations = reservations.filter((reservation) =>
    activeTab === 'upcoming'
      ? reservation.status === 'scheduled'
      : reservation.status !== 'scheduled',
  )

  return (
    <main className="flex min-h-screen flex-col bg-white">
      {/* Header */}
      <header className="flex items-center justify-between p-5">
        <button
          onClick={() => router.back()}
          className="flex h-6 w-6 items-center justify-center"
        >
          <img
            src="/icons/arrow-left.svg"
            alt="뒤로가기"
            className="size-6"
          />
        </button>
        <h1 className="flex-1 text-center text-2xl font-bold">예약 내역</h1>
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
                  ? 'font-extrabold text-[#0fbcd6]'
                  : 'font-medium text-[#999999]'
              }`}
            >
              예정된 예약
            </span>
            {activeTab === 'upcoming' && (
              <div className="h-0.5 w-full bg-[#0fbcd6]" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className="flex flex-col items-center gap-2"
          >
            <span
              className={`text-base ${
                activeTab === 'past'
                  ? 'font-extrabold text-[#0fbcd6]'
                  : 'font-medium text-[#999999]'
              }`}
            >
              지난 예약
            </span>
            {activeTab === 'past' && (
              <div className="h-0.5 w-full bg-[#0fbcd6]" />
            )}
          </button>
        </div>
      </div>

      {/* Reservation List or Empty State */}
      <div className="flex flex-1 flex-col gap-6 p-5">
        {filteredReservations.length > 0 ? (
          filteredReservations.map((reservation) => (
            <ReservationCard
              key={reservation.id}
              reservation={reservation}
              userType="customer"
              onViewDetails={handleViewDetails}
              onWriteReview={handleReview}
            />
          ))
        ) : (
          <div className="flex h-[500px] flex-col items-center justify-center gap-6 p-6">
            <div className="relative h-[120px] w-[120px]">
              <div className="absolute left-[10px] top-[10px] h-[100px] w-[100px] bg-[#BBBBBB]" />
              <div className="absolute left-[60px] top-[40px] h-[20px] w-[20px] rounded-full border-[6px] border-[#BBBBBB]" />
            </div>
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
              className="mt-3 w-[280px] rounded-xl bg-[#0fbcd6] py-4 text-base font-bold text-white"
            >
              청소 서비스 예약하기
            </button>
          </div>
        )}
      </div>

      {/* Review Modal */}
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        onSubmit={handleReviewSubmit}
        reservationId={selectedReservationId}
      />
    </main>
  )
}
