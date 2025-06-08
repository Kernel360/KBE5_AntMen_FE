'use client'

import React from 'react';
import Image from 'next/image';
import type { Reservation, ReservationStatus } from '../model/types';

interface ReservationCardProps {
  reservation: Reservation;
  userType: 'customer' | 'manager';
  onViewDetails?: (id: string) => void;
  onCheckIn?: (id: string) => void;
  onCheckOut?: (id: string) => void;
  onWriteReview?: (id: string) => void;
  onCancel?: (id: string) => void;
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
  const { id, serviceType, location, status, dateTime, amount, customer, worker } = reservation;

  const formattedAmount = new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
  }).format(amount)

  const personName = userType === 'manager' ? customer?.name : worker.name;
  const personLabel = userType === 'manager' ? '고객' : '담당자';

  const getStatusText = (status: ReservationStatus | string) => {
    switch (status) {
      case 'scheduled':
        return '예정됨'
      case 'in-progress':
        return '진행 중'
      case 'completed':
      case 'completed-pending-review':
        return '완료'
      case 'cancelled':
        return '취소됨'
      default:
        return '알 수 없음'
    }
  }

  const getStatusColor = (status: ReservationStatus | string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-[#E8F8FC] text-[#4DD0E1]' // 파란색
      case 'in-progress':
        return 'bg-[#FFF3E0] text-[#FFB74D]' // 주황색
      case 'completed':
        return 'bg-[#F5F5F5] text-[#B0BEC5]' // 회색
      case 'completed-pending-review':
        return 'bg-[#F3E5F5] text-[#CE93D8]' // 보라색
      case 'cancelled':
        return 'bg-[#FFEBEE] text-[#E57373]' // 빨간색
      default:
        return 'bg-[#E8F8FC] text-[#4DD0E1]'
    }
  }

  const renderManagerButtons = () => {
    if (userType !== 'manager') return null;

    switch (status) {
      case 'scheduled':
        return (
          <>
            <button
              onClick={() => onCheckIn?.(id)}
              className="flex-1 rounded-[22px] bg-[#4DD0E1] py-3 text-sm font-medium text-white hover:bg-[#26C6DA] transition-colors"
            >
              Check-in
            </button>
            <button
              onClick={() => onViewDetails?.(id)}
              className="flex-1 rounded-[22px] bg-white border border-[#E0E0E0] py-3 text-sm font-extrabold text-[#757575] hover:bg-[#FAFAFA] transition-colors"
            >
              상세보기
            </button>
          </>
        )

      case 'in-progress':
        return (
          <>
            <button
              onClick={() => onCheckOut?.(id)}
              className="flex-1 rounded-[22px] bg-[#FFB74D] py-3 text-sm font-medium text-white hover:bg-[#FFA726] transition-colors"
            >
              Check-out
            </button>
            <button
              onClick={() => onViewDetails?.(id)}
              className="flex-1 rounded-[22px] bg-white border border-[#E0E0E0] py-3 text-sm font-extrabold text-[#757575] hover:bg-[#FAFAFA] transition-colors"
            >
              상세보기
            </button>
          </>
        )

      case 'completed-pending-review':
        return (
          <>
            <button
              onClick={() => onWriteReview?.(id)}
              className="flex-1 rounded-[22px] bg-[#CE93D8] py-3 text-sm font-medium text-white hover:bg-[#BA68C8] transition-colors"
            >
              후기 작성
            </button>
            <button
              onClick={() => onViewDetails?.(id)}
              className="flex-1 rounded-[22px] bg-white border border-[#E0E0E0] py-3 text-sm font-extrabold text-[#757575] hover:bg-[#FAFAFA] transition-colors"
            >
              상세보기
            </button>
          </>
        )

      case 'completed':
        return (
          <>
            <button
              disabled
              className="flex-1 rounded-[22px] bg-[#B0BEC5] py-3 text-sm font-medium text-white cursor-not-allowed"
            >
              완료됨
            </button>
            <button
              onClick={() => onViewDetails?.(id)}
              className="flex-1 rounded-[22px] bg-white border border-[#E0E0E0] py-3 text-sm font-extrabold text-[#757575] hover:bg-[#FAFAFA] transition-colors"
            >
              상세보기
            </button>
          </>
        )

      default:
        return (
          <button
            onClick={() => onViewDetails?.(id)}
            className="flex-1 rounded-[22px] bg-white border border-[#E0E0E0] py-3 text-sm font-extrabold text-[#757575] hover:bg-[#FAFAFA] transition-colors"
          >
            상세보기
          </button>
        )
    }
  }

  const renderCustomerButtons = () => {
    if (userType !== 'customer') return null;

    return (
      <button
        onClick={() => onViewDetails?.(id)}
        className="flex-1 rounded-[22px] bg-white border border-[#E0E0E0] py-3 text-sm font-extrabold text-[#757575] hover:bg-[#FAFAFA] transition-colors"
      >
        상세보기
      </button>
    )
  }

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-[#E5E7EB] bg-white p-5">
      {/* Service Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-bold text-black">{serviceType}</h3>
          <div className="flex items-center gap-2">
            <Image
              src="/icons/map-pin.svg"
              alt="위치"
              width={16}
              height={16}
              className="text-[#666666]"
            />
            <span className="text-sm text-[#666666]">{location}</span>
          </div>
        </div>
        <div className={`rounded-xl px-3 py-1.5 ${getStatusColor(status)}`}>
          <span className="text-xs font-medium">{getStatusText(status)}</span>
        </div>
      </div>

      {/* Details */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-[#666666]">
            날짜 및 시간
          </span>
          <span className="text-sm font-medium text-black">{dateTime}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-[#666666]">
            {personLabel}
          </span>
          <span className="text-sm font-medium text-black">{personName}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-[#666666]">
            {userType === 'manager' ? '수입 금액' : '결제 금액'}
          </span>
          <span className="text-sm font-extrabold text-black">{formattedAmount}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        {userType === 'manager' ? renderManagerButtons() : renderCustomerButtons()}
      </div>
    </div>
  )
}
