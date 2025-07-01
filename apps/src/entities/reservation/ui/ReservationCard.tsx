'use client'

import React from 'react'
import type { Reservation, ReservationStatus } from '../model/types'

interface ReservationCardProps {
  reservation: Reservation
  userType: 'customer' | 'manager'
  onViewDetails?: (id: string) => void
  onCheckIn?: (id: string) => void
  onCheckOut?: (id: string) => void
  onWriteReview?: (id: string) => void
  onCancel?: (id: string) => void
}

export const ReservationCard: React.FC<ReservationCardProps> = ({
  reservation,
  userType,
  onViewDetails,
  onCheckIn,
  onCheckOut,
  onWriteReview,
  onCancel,
}) => {
  const {
    reservationId,
    categoryName,
    reservationStatus,
    reservationDate,
    reservationTime,
    reservationDuration,
    reservationAmount,
    optionNames,
    reservationMemo,
  } = reservation

  const formattedAmount = new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
  }).format(reservationAmount)

  const getStatusText = (status: ReservationStatus) => {
    switch (status) {
      case 'WAITING':
        return '대기중'
      case 'MATCHING':
        return '매칭중'
      case 'PAY':
        return '결제완료'
      case 'DONE':
        return '완료'
      case 'CANCEL':
        return '취소됨'
      case 'ERROR':
        return '에러'
      case 'SCHEDULED':
        return '신청중'
      default:
        return '알 수 없음'
    }
  }

  const getStatusColor = (status: ReservationStatus) => {
    switch (status) {
      case 'WAITING':
        return 'bg-[#E8F8FC] text-[#4DD0E1]'
      case 'MATCHING':
        return 'bg-[#FFF3E0] text-[#FFB74D]'
      case 'PAY':
        return 'bg-[#E8F5E9] text-[#66BB6A]'
      case 'DONE':
        return 'bg-[#F5F5F5] text-[#B0BEC5]'
      case 'CANCEL':
        return 'bg-[#FFEBEE] text-[#E57373]'
      case 'ERROR':
        return 'bg-[#FFEBEE] text-[#E57373]'
      case 'SCHEDULED':
        return 'bg-[#E8F8FC] text-[#4DD0E1]'
      default:
        return 'bg-[#E8F8FC] text-[#4DD0E1]'
    }
  }

  const renderManagerButtons = () => {
    if (userType !== 'manager') return null

    switch (reservationStatus) {
      case 'WAITING':
        return (
          <button
            onClick={() => onViewDetails?.(reservationId.toString())}
            className="flex-1 rounded-[22px] bg-white border border-[#E0E0E0] py-3 text-sm font-extrabold text-[#757575] hover:bg-[#FAFAFA] transition-colors"
          >
            상세보기
          </button>
        )
      case 'MATCHING': {
        const today = new Date()
        const resDate = new Date(reservationDate)
        const isReservationDay =
          today.getFullYear() === resDate.getFullYear() &&
          today.getMonth() === resDate.getMonth() &&
          today.getDate() === resDate.getDate()

        if (!isReservationDay) {
          return (
            <button
              onClick={() => onViewDetails?.(reservationId.toString())}
              className="flex-1 rounded-[22px] bg-white border border-[#E0E0E0] py-3 text-sm font-extrabold text-[#757575] hover:bg-[#FAFAFA] transition-colors"
            >
              상세보기
            </button>
          )
        }

        return (
          <>
          <button
              onClick={() => onViewDetails?.(reservationId.toString())}
              className="flex-1 rounded-[22px] bg-white border border-[#E0E0E0] py-3 text-sm font-extrabold text-[#757575] hover:bg-[#FAFAFA] transition-colors"
            >
              상세보기
            </button>
            {reservation.checkinAt ? (
              <button
                onClick={() => onCheckOut?.(reservationId.toString())}
                className="flex-1 rounded-[22px] bg-[#FFB74D] py-3 text-sm font-medium text-white hover:bg-[#FFA726] transition-colors"
              >
                Check-out
              </button>
            ) : (
              <button
                onClick={() => onCheckIn?.(reservationId.toString())}
                className="flex-1 rounded-[22px] bg-[#4DD0E1] py-3 text-sm font-medium text-white hover:bg-[#26C6DA] transition-colors"
              >
                Check-in
              </button>
            )}
          </>
        )
      }
      case 'DONE':
        if (!reservation.hasReview) {
          return (
            <>
              <button
                onClick={() => onViewDetails?.(reservationId.toString())}
                className="flex-1 rounded-[22px] bg-white border border-[#E0E0E0] py-3 text-sm font-extrabold text-[#757575] hover:bg-[#FAFAFA] transition-colors"
              >
                상세보기
              </button>
              <button
                onClick={() => onWriteReview?.(reservationId.toString())}
                className="flex-1 rounded-[22px] bg-primary-500 py-3 text-sm font-medium text-white hover:bg-primary-600 transition-colors"
              >
                리뷰 작성
              </button>
            </>
          )
        }
        return (
          <>
            <button
              onClick={() => onViewDetails?.(reservationId.toString())}
              className="flex-1 rounded-[22px] bg-white border border-[#E0E0E0] py-3 text-sm font-extrabold text-[#757575] hover:bg-[#FAFAFA] transition-colors"
            >
              상세보기
            </button>
            <button
              disabled
              className="flex-1 rounded-[22px] bg-[#B0BEC5] py-3 text-sm font-medium text-white cursor-not-allowed"
            >
              완료됨
            </button>
          </>
        )
      default:
        return (
          <button
            onClick={() => onViewDetails?.(reservationId.toString())}
            className="flex-1 rounded-[22px] bg-white border border-[#E0E0E0] py-3 text-sm font-extrabold text-[#757575] hover:bg-[#FAFAFA] transition-colors"
          >
            상세보기
          </button>
        )
    }
  }

  const renderCustomerButtons = () => {
    if (userType !== 'customer') return null
    
    if (reservationStatus === 'DONE') {
      if (!reservation.hasReview && onWriteReview) {
        return (
          <>
            <button
              onClick={() => onViewDetails?.(reservationId.toString())}
              className="flex-1 rounded-[22px] bg-white border border-[#E0E0E0] py-3 text-sm font-extrabold text-[#757575] hover:bg-[#FAFAFA] transition-colors"
            >
              상세보기
            </button>
            <button
              onClick={() => onWriteReview(reservationId.toString())}
              className="flex-1 rounded-[22px] bg-[#4DD0E1] py-3 text-sm font-medium text-white hover:bg-[#26C6DA] transition-colors"
            >
              리뷰 작성
            </button>
          </>
        )
      } else {
        return (
          <>
            <button
              onClick={() => onViewDetails?.(reservationId.toString())}
              className="flex-1 rounded-[22px] bg-white border border-[#E0E0E0] py-3 text-sm font-extrabold text-[#757575] hover:bg-[#FAFAFA] transition-colors"
            >
              상세보기
            </button>
            <button
              disabled
              className="flex-1 rounded-[22px] bg-[#B0BEC5] py-3 text-sm font-medium text-white cursor-not-allowed"
            >
              완료됨
            </button>
          </>
        )
      }
    }
    
    return (
      <button
        onClick={() => onViewDetails?.(reservationId.toString())}
        className="flex-1 rounded-[22px] bg-white border border-[#E0E0E0] py-3 text-sm font-extrabold text-[#757575] hover:bg-[#FAFAFA] transition-colors"
      >
        상세보기
      </button>
    )
  }

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-[#E5E7EB] bg-white p-5">
      {/* 서비스명 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-black">{categoryName}</span>
        </div>
        <div
          className={`rounded-xl px-3 py-1.5 ${getStatusColor(reservationStatus as ReservationStatus)}`}
        >
          <span className="text-xs font-medium">
            {getStatusText(reservationStatus as ReservationStatus)}
          </span>
        </div>
      </div>

      {/* 날짜, 시간, 금액, 기간 */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-[#666666]">
            날짜 및 시간
          </span>
          <span className="text-sm font-medium text-black">
            {new Date(reservationDate).toLocaleDateString()}{' '}
            {typeof reservationTime === 'string'
              ? reservationTime
              : `${reservationTime.hour}:${reservationTime.minute.toString().padStart(2, '0')}`}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-[#666666]">금액</span>
          <span className="text-sm font-extrabold text-black">
            {formattedAmount}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-[#666666]">이용 시간</span>
          <span className="text-sm font-medium text-black">
            {reservationDuration}시간
          </span>
        </div>
      </div>

      {/* 옵션 */}
      {optionNames && optionNames.length > 0 && (
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium text-[#666666]">옵션</span>
          <ul className="list-disc pl-5">
            {optionNames.map((opt, idx) => (
              <li key={idx} className="text-sm text-black">
                {opt}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 메모 */}
      {reservationMemo && (
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium text-[#666666]">메모</span>
          <span className="text-sm text-black">{reservationMemo}</span>
        </div>
      )}

      {/* 버튼 */}
      <div className="flex gap-3">
        {userType === 'manager'
          ? renderManagerButtons()
          : renderCustomerButtons()}
      </div>
    </div>
  )
}