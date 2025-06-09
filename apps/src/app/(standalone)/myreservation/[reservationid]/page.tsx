// 내 예약 -> 예약 상세 페이지

/**
 * TODO: 예약 상세 페이지 디자인 수정 필요
 *
 * 1. 결제하면 결제 컴포넌트 불러오기 ✅
 * 2. 예약 취소 버튼 누르면 예약 취소 모달 띄우기 RejectReservationModal ✅
 * 3. 결제 페이지 이동 필요 ✅
 * 4. 예약 리스트 예약 상태 수정
 * 5. 매니저 리스트 추가 필요
 * 6. 환불 기능 구현 ✅
 * 7. 모달 컴포넌트 분리 ✅
 **/

'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import ReservationStatusSection from '@/entities/reservation/ui/ReservationStatusSection'
import ServiceInfoSection from '@/entities/reservation/ui/ServiceInfoSection'
import PaymentPreviewSection from '@/entities/reservation/ui/PaymentPreviewSection'
import PaymentInfoSection from '@/entities/reservation/ui/PaymentInfoSection'
import CleanerInfoSection from '@/entities/manager/ui/CleanerInfoSection'
import { ReservationDetail } from '@/entities/reservation/types'
import ReservationHeader from '@/entities/reservation/ui/ReservationHeader'
import ActionButtonsSection from '@/features/reservation/ui/ActionButtonsSection'

interface ReservationDetailPageProps {
  params: {
    id: string
  }
}

// 타입 정의
interface Worker {
  id: string
  name: string
  rating: number
  experience: string
  age: number
  gender: string
  avatar: string
  phone: string
}

// 임시 데이터
const mockReservationDetail: ReservationDetail = {
  id: '1',
  reservationNumber: 'CL-20230510-1234',
  serviceType: '정기 청소 (주 1회)',
  status: 'scheduled',
  paymentStatus: 'pending', // 'pending' | 'paid' | 'refunded'
  dateTime: '2023년 5월 15일 · 오전 10:00',
  duration: '3시간',
  location: '서울시 강남구',
  detailedAddress: '서울특별시 강남구 테헤란로 152',
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
  baseAmount: 60000,
  discount: 6000,
  paymentMethod: '신한카드 (1234-56XX-XXXX-7890)', // 결제 전에는 undefined일 수 있음
  options: [],
  createdAt: '2023-05-10',
}

export default function ReservationDetailPage({
  params,
}: ReservationDetailPageProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [reservation, setReservation] = useState<ReservationDetail>(
    mockReservationDetail,
  )

  // 결제 성공 시 처리
  useEffect(() => {
    if (searchParams) {
      const paymentSuccess = searchParams.get('payment')
      if (paymentSuccess === 'success') {
        setReservation((prev) => ({
          ...prev,
          paymentStatus: 'paid',
          paymentMethod: '신한카드 (1234-56XX-XXXX-7890)',
        }))
      }
    }
  }, [searchParams])

  const handleCancel = (reason: string) => {
    console.log('Cancel reservation:', params.id, 'Reason:', reason)

    // 취소 처리 및 상태 업데이트
    setReservation((prev) => ({
      ...prev,
      status: 'cancelled',
      paymentStatus: prev.paymentStatus === 'paid' ? 'refunded' : 'pending',
    }))

    // TODO: 실제 취소 API 호출
    // API를 통해 취소 사유와 함께 취소 요청을 서버에 전송
  }

  const handlePayment = () => {
    console.log('Navigate to payment page for reservation:', params.id)
    // 결제 페이지로 이동
    router.push(`/myreservation/${params.id}/payment`)
  }

  const handleRefund = (reason: string) => {
    console.log('Process refund for reservation:', params.id, 'Reason:', reason)

    // 환불 처리 및 상태 업데이트
    setReservation((prev) => ({
      ...prev,
      status: 'cancelled',
      paymentStatus: 'refunded',
    }))

    // TODO: 실제 환불 API 호출
    // API를 통해 환불 사유와 함께 환불 요청을 서버에 전송
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[375px] mx-auto min-h-screen bg-white flex flex-col">
        <div className="sticky top-0 z-30 bg-white">
          <ReservationHeader />
        </div>

        <div className="flex-1 overflow-y-auto pb-[140px]">
          <div className="divide-y divide-gray-100">
            <ReservationStatusSection reservation={reservation} />
            <ServiceInfoSection reservation={reservation} />
            <CleanerInfoSection worker={reservation.worker} />

            {/* 결제 상태에 따라 다른 컴포넌트 표시 */}
            {reservation.paymentStatus === 'pending' ? (
              <PaymentPreviewSection reservation={reservation} />
            ) : (
              <PaymentInfoSection reservation={reservation} />
            )}
          </div>
        </div>

        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[375px] bg-white border-t border-gray-100">
          <ActionButtonsSection
            reservation={reservation}
            onCancel={handleCancel}
            onPayment={handlePayment}
            onRefund={handleRefund}
            reservationId={params.id}
          />
        </div>
      </div>
    </div>
  )
}
