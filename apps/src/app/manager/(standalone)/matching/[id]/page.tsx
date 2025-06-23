'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Image from 'next/image'
import { getReservationDetail } from '@/entities/reservation/api/reservationApi'
import type { ReservationHistory } from '@/entities/reservation/model/types'
import { getAuthToken } from '@/features/auth/lib/auth'
import {
  acceptMatchingRequest,
  rejectMatchingRequest,
} from '@/entities/matching/api/matchingAPi'
import { RejectionModal } from '@/shared/ui/modal/RejectionModal'
import { CommonHeader } from '@/shared/ui/Header/CommonHeader'

export default function ManagerMatchingDetailPage() {
  const router = useRouter()
  const params = useParams()
  const reservationId = params?.id as string
  const [reservation, setReservation] = useState<ReservationHistory | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false)

  useEffect(() => {
    const fetchReservation = async () => {
      if (!reservationId || reservationId === 'unknown') return
      setLoading(true)
      setError(null)
      try {
        const token = getAuthToken()
        if (!token) {
          setError('인증 정보가 없습니다. 다시 로그인 해주세요.')
          setLoading(false)
          return
        }
        const data = await getReservationDetail(Number(reservationId), token)
        setReservation(data)
      } catch (e: any) {
        setError(e?.message || '예약 정보를 불러오지 못했습니다.')
      } finally {
        setLoading(false)
      }
    }
    fetchReservation()
  }, [reservationId])

  const handleAccept = async () => {
    if (!reservation?.matchings[0]?.matchingId || isProcessing) return
    setIsProcessing(true)
    try {
      await acceptMatchingRequest(String(reservation.matchings[0].matchingId))
      alert('매칭을 수락했습니다.')
      router.push('/manager/matching')
    } catch (e: any) {
      setError(e.message || '매칭 수락 중 오류가 발생했습니다.')
      alert(e.message || '매칭 수락 중 오류가 발생했습니다.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleReject = async (reason: string) => {
    if (!reservation?.matchings[0]?.matchingId || isProcessing) return
    setIsProcessing(true)
    try {
      await rejectMatchingRequest(
        String(reservation.matchings[0].matchingId),
        reason,
      )
      alert('매칭을 거절했습니다.')
      router.push('/manager/matching')
    } catch (e: any) {
      setError(e.message || '매칭 거절 중 오류가 발생했습니다.')
      alert(e.message || '매칭 거절 중 오류가 발생했습니다.')
    } finally {
      setIsProcessing(false)
      setIsRejectModalOpen(false)
    }
  }

  // TODO: 예약 상태, 예약 시간, 고객 정보
  // reservations/id/page.tsx 에서도 동일하게 수정해야함!
  return (
    <main className="min-h-screen bg-gray-50">
      <CommonHeader 
        title="매칭 요청 확인"
        showBackButton
      />
      <div className="pt-20 p-5 pb-32 min-h-[calc(100vh-64px)] flex flex-col gap-6 max-w-xl mx-auto w-full">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="text-4xl">⏳</div>
            <div className="mt-4 text-lg text-gray-600">예약 정보를 불러오는 중...</div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="text-4xl">❌</div>
            <div className="mt-4 text-lg text-red-600">{error}</div>
          </div>
        ) : reservation ? (
          <>
            {/* 서비스 정보 카드 */}
            <section className="bg-white rounded-2xl shadow p-6 flex flex-col gap-4">
              <div className="flex items-center gap-4 mb-2">
                <div className="bg-primary/20 rounded-full p-3">
                  <Image src="/icons/customer.svg" alt="서비스" width={32} height={32}/>
                </div>
                <div>
                  <div className="text-xl font-bold text-gray-900">{reservation.categoryName}</div>
                  <div className="text-gray-500 text-base">일반 가정집 청소 서비스</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-gray-700 text-base">
                <Image src="/icons/linear-check.svg" alt="날짜" width={20} height={20} />
                <span>{reservation.reservationDate}</span>
                <span className="mx-1">·</span>
                <span>총 {reservation.totalDuration}시간</span>
              </div>
            </section>

            {/* 주소 정보 카드 */}
            <section className="bg-white rounded-2xl shadow p-6 flex flex-col gap-2">
              <div className="flex items-center gap-2 mb-2">
                <Image src="/icons/map-pin.svg" alt="주소" width={20} height={20} />
                <span className="text-lg font-bold">주소 정보</span>
              </div>
              <div className="text-gray-800 text-base font-medium">{reservation.address}</div>
            </section>

            {/* 옵션 카드 */}
            <section className="bg-white rounded-2xl shadow p-6 flex flex-col gap-2">
              <div className="flex items-center gap-2 mb-2">
                <Image src="/icons/linear-bell.svg" alt="옵션" width={20} height={20}/>
                <span className="text-lg font-bold">옵션 내용</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {reservation.selectedOptions && reservation.selectedOptions.length > 0 ? (
                  reservation.selectedOptions.map((opt) => (
                    <span key={opt} className="bg-gray-100 rounded-lg px-4 py-1 text-base font-medium text-gray-700">{opt}</span>
                  ))
                ) : (
                  <span className="text-gray-400">옵션을 선택하지 않았습니다</span>
                )}
              </div>
            </section>

            {/* 특이사항 카드 */}
            <section className="bg-white rounded-2xl shadow p-6 flex flex-col gap-2">
              <div className="flex items-center gap-2 mb-2">
                <Image src="/icons/linear-share.svg" alt="특이사항" width={20} height={20} />
                <span className="text-lg font-bold">특이사항</span>
              </div>
              <div className="text-gray-700 text-base">
                {reservation.reservationMemo ? reservation.reservationMemo : '수요자가 작성하지 않았습니다'}
              </div>
            </section>

            {/* 결제 정보 카드 */}
            <section className="bg-white rounded-2xl shadow p-6 flex flex-col gap-2">
              <div className="flex items-center gap-2 mb-2">
                <Image src="/icons/linear-card.svg" alt="결제" width={20} height={20} />
                <span className="text-lg font-bold">결제 정보</span>
              </div>
              <div className="flex justify-between text-base">
                <span className="text-gray-500">결제 금액</span>
                <span className="font-bold text-primary">{reservation.totalAmount.toLocaleString()}원</span>
              </div>
            </section>
          </>
        ) : null}
      </div>

      {/* 매칭 수락/거절 버튼 - 화면 바닥에 고정 */}
      {reservation && reservation.reservationStatus === 'WAITING' && (
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-mobile bg-white border-t border-gray-200 p-4 shadow-lg z-50">
          <div className="flex gap-3">
            <button
              onClick={handleAccept}
              disabled={isProcessing}
              className="flex-1 bg-primary text-white rounded-xl py-4 font-bold text-base disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors hover:bg-primary/90"
            >
              {isProcessing ? '처리 중...' : '매칭 수락'}
            </button>
            <button
              onClick={() => setIsRejectModalOpen(true)}
              disabled={isProcessing}
              className="flex-1 bg-gray-200 text-gray-800 rounded-xl py-4 font-bold text-base disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors hover:bg-gray-300"
            >
              매칭 거절
            </button>
          </div>
        </div>
      )}

      <RejectionModal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        onSubmit={handleReject}
        title="매칭 거절 사유"
        isProcessing={isProcessing}
      />
    </main>
  )
}
