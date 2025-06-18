'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Image from 'next/image'
import { getReservationDetail } from '@/entities/reservation/api/reservationApi'
import type { ReservationHistory} from '@/entities/reservation/model/types'
import { getAuthToken } from '@/features/auth/lib/auth'

export default function ManagerReservationDetailPage() {
  const router = useRouter()
  const params = useParams()
  const reservationId = params?.id as string
  const [reservation, setReservation] = useState<ReservationHistory | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

  return (
    <main className="flex min-h-screen flex-col bg-gray-50">
      {/* Header */}
      <header className="flex items-center justify-between p-5 bg-white border-b">
        <button 
          onClick={() => router.back()} 
          className="flex h-6 w-6 items-center justify-center"
        >
          <Image src="/icons/arrow-left.svg" alt="뒤로가기" width={24} height={24} />
        </button>
        <h1 className="flex-1 text-center text-2xl font-bold">예약 확인</h1>
        <div className="h-6 w-6" />
      </header>
      <div className="flex flex-1 flex-col gap-6 p-5 max-w-xl mx-auto w-full">
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
    </main>
  )
} 