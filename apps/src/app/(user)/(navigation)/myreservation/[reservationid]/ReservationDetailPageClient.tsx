'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import type {
  ReservationHistory,
  ReservationStatus,
} from '@/entities/reservation/model/types'
import { respondToMatching } from '@/entities/matching/api/matchingAPi'

interface ReservationDetailPageClientProps {
  initialReservation: ReservationHistory | null
}

// --- 각 섹션 컴포넌트들 (기존 page.tsx에서 분리) ---

// 헤더 컴포넌트
const ReservationHeader = () => {
  const router = useRouter()

  return (
    <header className="bg-white px-5 py-4">
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="flex items-center justify-center w-6 h-6"
          aria-label="뒤로가기"
        >
          <ChevronLeft className="w-6 h-6 text-black" />
        </button>
        <h1 className="text-2xl font-bold text-black">예약 상세</h1>
      </div>
    </header>
  )
}

// 예약 상태 섹션
const ReservationStatusSection = ({
  reservation,
}: {
  reservation: ReservationHistory
}) => {
  return (
    <div className="bg-white px-5 py-6 mb-3 rounded-xl">
      <h2 className="text-lg font-bold text-black mb-6">예약 상태</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">예약 신청일</span>
          <span className="text-sm font-medium text-black">
            {reservation.reservationDate}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">신청 시간</span>
          <span className="text-sm font-medium text-black">
            {reservation.reservationTime || '-'}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">주소</span>
          <span className="text-sm font-medium text-black text-right max-w-[200px]">
            {reservation.address}
          </span>
        </div>
      </div>
    </div>
  )
}

// 서비스 정보 섹션
const ServiceInfoSection = ({
  reservation,
}: {
  reservation: ReservationHistory
}) => {
  return (
    <div className="bg-white px-5 py-6 mb-3 rounded-xl">
      <h2 className="text-lg font-bold text-black mb-6">서비스 정보</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">서비스 유형</span>
          <span className="text-sm font-medium text-black">
            {reservation.categoryName}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">소요 시간</span>
          <span className="text-sm font-medium text-black">
            {reservation.totalDuration}시간
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">선택한 옵션</span>
          <span className="text-sm font-medium text-black text-right max-w-[200px]">
            {reservation.selectedOptions &&
            reservation.selectedOptions.length > 0
              ? reservation.selectedOptions.join(', ')
              : '없음'}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">결제 금액</span>
          <span className="text-base font-bold text-black">
            {reservation.totalAmount?.toLocaleString()}원
          </span>
        </div>
      </div>
    </div>
  )
}

// 매칭 매니저 정보 섹션
const ManagerInfoSection = ({ manager }: { manager?: any }) => {
  return (
    <div className="bg-white px-5 py-6 mb-3 rounded-xl">
      <h2 className="text-lg font-bold text-black mb-6">매칭 매니저</h2>
      {manager ? (
        <div className="flex flex-col gap-2">
          <span className="text-base font-bold text-black">{manager.name}</span>
          <span className="text-sm text-gray-600">
            {manager.gender} · {manager.age}세
          </span>
        </div>
      ) : (
        <div className="flex items-center justify-center text-gray-400 h-20">
          매칭된 매니저가 없습니다.
        </div>
      )}
    </div>
  )
}

// 매칭 응답 액션 버튼 섹션
const MatchingActionSection = ({
  matchingId,
  onAccept,
  onReject,
  isProcessing,
}: {
  matchingId: number
  onAccept: () => void
  onReject: (reason: string) => void
  isProcessing: boolean
}) => {
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false)
  const [rejectReason, setRejectReason] = useState('')

  const handleRejectConfirm = () => {
    if (!rejectReason.trim()) {
      alert('거절 사유를 입력해주세요.')
      return
    }
    onReject(rejectReason)
    setIsRejectModalOpen(false)
    setRejectReason('')
  }

  return (
    <div className="sticky bottom-20 bg-white p-5 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
      <div className="flex gap-3">
        <button
          onClick={onAccept}
          disabled={isProcessing}
          className="flex-1 bg-[#4abed9] text-white rounded-xl py-4 font-bold text-base disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {isProcessing ? '처리 중...' : '매칭 수락'}
        </button>
        <button
          onClick={() => setIsRejectModalOpen(true)}
          disabled={isProcessing}
          className="flex-1 bg-gray-200 text-gray-800 rounded-xl py-4 font-bold text-base disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          매칭 거절
        </button>
      </div>

      {/* 거절 사유 입력 모달 */}
      {isRejectModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[90%] max-w-md">
            <h3 className="text-lg font-bold mb-4">매칭 거절 사유</h3>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="거절 사유를 입력해주세요"
              className="w-full h-32 p-3 border border-gray-300 rounded-lg mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setIsRejectModalOpen(false)
                  setRejectReason('')
                }}
                className="flex-1 bg-gray-200 text-gray-800 rounded-xl py-3 font-bold"
              >
                취소
              </button>
              <button
                onClick={handleRejectConfirm}
                className="flex-1 bg-[#4abed9] text-white rounded-xl py-3 font-bold"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// --- 메인 클라이언트 컴포넌트 ---
export const ReservationDetailPageClient = ({
  initialReservation,
}: ReservationDetailPageClientProps) => {
  const router = useRouter()
  const [reservation, setReservation] = useState<ReservationHistory | null>(
    initialReservation,
  )
  const [isProcessing, setIsProcessing] = useState(false)

  if (!reservation) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <ReservationHeader />
        <div className="flex-grow flex items-center justify-center">
          <p>예약 정보를 불러오지 못했습니다.</p>
        </div>
      </div>
    )
  }

  const handleAcceptMatching = async () => {
    if (isProcessing || !reservation?.matchings[0]?.matchingId) return
    setIsProcessing(true)
    try {
      await respondToMatching(reservation.matchings[0].matchingId, {
        matchingIsFinal: true,
      })
      setReservation((prev) =>
        prev ? { ...prev, reservationStatus: 'MATCHING' } : null,
      )
      alert('매칭이 수락되었습니다.')
    } catch (error) {
      console.error('Failed to accept matching:', error)
      alert('매칭 수락에 실패했습니다.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleRejectMatching = async (reason: string) => {
    if (isProcessing || !reservation?.matchings[0]?.matchingId) return
    setIsProcessing(true)
    try {
      await respondToMatching(reservation.matchings[0].matchingId, {
        matchingIsFinal: false,
        matchingRefuseReason: reason,
      })
      setReservation((prev) =>
        prev ? { ...prev, reservationStatus: 'CANCEL' } : null,
      )
      alert('매칭이 거절되어 예약이 취소되었습니다.')
    } catch (error) {
      console.error('Failed to reject matching:', error)
      alert('매칭 거절에 실패했습니다.')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <ReservationHeader />

      <main className="flex-grow pb-24">
        <div className="space-y-2">
          <ReservationStatusSection reservation={reservation} />
          <ServiceInfoSection reservation={reservation} />
          <ManagerInfoSection manager={reservation.matchings[0]?.manager} />
        </div>
      </main>
      {reservation.reservationStatus === 'WAITING' && (
        <MatchingActionSection
          matchingId={reservation.reservationId}
          onAccept={handleAcceptMatching}
          onReject={handleRejectMatching}
          isProcessing={isProcessing}
        />
      )}
    </div>
  )
}
