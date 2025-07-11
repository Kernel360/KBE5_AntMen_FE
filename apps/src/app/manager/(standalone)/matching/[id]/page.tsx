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

  // 현재 응답해야 할 매칭 찾기
  const currentMatching = reservation?.matchings.find(
    m => m.isRequested && m.isAccepted === null
  );

  const handleAccept = async () => {
    if (!currentMatching?.matchingId || isProcessing) return;
    setIsProcessing(true);
    try {
      await acceptMatchingRequest(String(currentMatching.matchingId));
      alert('매칭을 수락했습니다.');
      router.push('/manager/matching');
    } catch (e: any) {
      setError(e.message || '매칭 수락 중 오류가 발생했습니다.');
      alert(e.message || '매칭 수락 중 오류가 발생했습니다.');
    } finally {
      setIsProcessing(false)
    }
  }

  const handleReject = async (reason: string) => {
    if (!currentMatching?.matchingId || isProcessing) return;
    setIsProcessing(true);
    try {
      await rejectMatchingRequest(String(currentMatching.matchingId), reason);
      alert('매칭을 거절했습니다.');
      router.push('/manager/matching');
    } catch (e: any) {
      setError(e.message || '매칭 거절 중 오류가 발생했습니다.');
      alert(e.message || '매칭 거절 중 오류가 발생했습니다.');
    } finally {
      setIsProcessing(false);
      setIsRejectModalOpen(false);
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
      <div className="pt-20 p-5 pb-32 min-h-[calc(100vh-64px)] flex flex-col gap-2 max-w-xl mx-auto w-full">
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
            {/* 매칭 요청 안내 */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-3 mb-2">
              <div className="flex items-start gap-3">
                <span className="text-blue-500 text-lg">ℹ️</span>
                <div>
                  <h4 className="text-sm font-semibold text-blue-800 mb-1">매칭 요청 확인</h4>
                  <p className="text-xs text-blue-700 leading-relaxed">
                    고객의 매칭 요청을 신중히 검토하신 후 수락 또는 거절을 선택해주세요.<br/>
                    수락 시 해당 예약 건이 확정되며, 거절 시 다른 매니저에게 재배정됩니다.
                  </p>
                </div>
              </div>
            </div>

            {/* 서비스 정보 */}
            <div className="bg-white rounded-2xl border border-gray-200 p-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">🏠</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-0.5">{reservation.categoryName}</h3>
                  <div className="text-sm font-medium text-gray-600 space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span>예약 날짜</span>
                      <span>{reservation.reservationDate} </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>예약 시간</span>
                      <span>{reservation.reservationTime ? `${reservation.reservationTime}` : '협의 후 결정'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>서비스 제공</span>
                      <span>{reservation.totalDuration}시간</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 위치 정보 */}
            <div className="bg-white rounded-2xl border border-gray-200 p-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">📍</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">서비스 위치</h3>
                  <p className="text-sm text-gray-700">{reservation.address}</p>
                </div>
              </div>
            </div>

            {/* 추가 옵션 */}
            <div className="bg-white rounded-2xl border border-gray-200 p-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">⚙️</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">추가 옵션</h3>
                  {reservation.selectedOptions && reservation.selectedOptions.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {reservation.selectedOptions.map((opt) => (
                        <span key={opt} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {opt}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">선택된 옵션이 없습니다</p>
                  )}
                </div>
              </div>
            </div>

            {/* 특이사항 */}
            <div className="bg-white rounded-2xl border border-gray-200 p-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">📝</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">특이사항</h3>
                  <p className={`text-sm font-medium ${reservation.reservationMemo ? 'text-gray-700' : 'text-gray-500'}`}>
                    {reservation.reservationMemo || '특별한 요청사항이 없습니다'}
                  </p>
                </div>
              </div>
            </div>

            {/* 고객 정보 */}
            {reservation.customer && (
              <div className="bg-white rounded-2xl border border-gray-200 p-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">👤</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">고객 정보</h3>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                        {reservation.customer.profileImage ? (
                          <img
                            src={reservation.customer.profileImage}
                            alt={reservation.customer.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-gray-400 text-xl">👤</span>
                        )}
                      </div>
                                              <div className="flex-1">
                          <h4 className="font-medium text-gray-900 mb-0.5">{reservation.customer.name}</h4>
                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                          <span>{reservation.customer.gender}</span>
                          <span>•</span>
                          <span>{reservation.customer.age >= 0 ? `${reservation.customer.age}세` : '나이 미상'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <div className="flex items-center">
                            {[1,2,3,4,5].map(i => (
                              <span
                                key={i}
                                className={`text-sm ${i <= Math.round((reservation.customer as any)?.avgRating ?? 0) ? 'text-yellow-400' : 'text-gray-300'}`}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                          <span className="text-gray-600">
                            {(reservation.customer as any)?.avgRating?.toFixed(1) || '-'} ({(reservation.customer as any)?.totalReviews || 0}개 리뷰)
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 결제 정보 */}
            <div className="bg-white rounded-2xl border border-gray-200 p-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">💰</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">결제 정보</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 text-sm">총 결제 금액</span>
                    <span className="text-lg font-bold text-primary">{reservation.totalAmount.toLocaleString()}원</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 하단 주의사항 */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-3 mt-2">
              <div className="flex items-start gap-3">
                <span className="text-yellow-600 text-lg">⚠️</span>
                <div>
                  <h4 className="text-sm font-semibold text-yellow-800 mb-1">주의사항</h4>
                  <ul className="text-xs text-yellow-700 space-y-1">
                    <li>• 매칭 수락 후에는 취소가 어려우니 신중히 결정해주세요</li>
                    <li>• 예약 시간 30분 전까지는 현장에 도착해주시기 바랍니다</li>
                    <li>• 고객과의 원활한 소통을 위해 예의를 지켜주세요</li>
                  </ul>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </div>

      {/* 매칭 수락/거절 버튼 */}
      {reservation && reservation.reservationStatus === 'WAITING' && (
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-mobile bg-white border-t border-gray-200 p-4 z-50">
          <div className="flex gap-3">
            <button
              onClick={handleAccept}
              disabled={isProcessing || !currentMatching?.matchingId}
              className="flex-1 bg-primary text-white rounded-2xl py-3 font-medium disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors hover:bg-primary/90"
            >
              {isProcessing ? '처리 중...' : '매칭 수락'}
            </button>
            <button
              onClick={() => setIsRejectModalOpen(true)}
              disabled={isProcessing || !currentMatching?.matchingId}
              className="flex-1 bg-gray-100 text-gray-700 rounded-2xl py-3 font-medium disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors hover:bg-gray-200 border border-gray-300"
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
