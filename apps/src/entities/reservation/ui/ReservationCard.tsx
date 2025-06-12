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
  const {
    id,
    // serviceType,
    // location,
    status,
    dateTime,
    amount,
    worker,
  } = reservation;

  const statusValue = (status ?? '').toUpperCase();

  const formattedAmount = new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
  }).format(amount);

  const personName = userType === 'manager'
    ? '고객명'
    : worker?.name || '미정';
  const personLabel = userType === 'manager' ? '고객' : '담당자';

  const getStatusText = (status: string) => {
    switch (status) {
      case 'SCHEDULED':
        return '예정됨';
      case 'IN-PROGRESS':
        return '진행 중';
      case 'COMPLETED':
        return '완료';
      case 'CANCELLED':
        return '취소됨';
      case 'ERROR':
        return '에러';
      default:
        return '알 수 없음';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SCHEDULED':
        return 'bg-[#E8F8FC] text-[#4DD0E1]';
      case 'IN-PROGRESS':
        return 'bg-[#FFF3E0] text-[#FFB74D]';
      case 'COMPLETED':
        return 'bg-[#F5F5F5] text-[#B0BEC5]';
      case 'CANCELLED':
        return 'bg-[#FFEBEE] text-[#E57373]';
      case 'ERROR':
        return 'bg-[#FFEBEE] text-[#E57373]';
      default:
        return 'bg-[#E8F8FC] text-[#4DD0E1]';
    }
  };

  const renderManagerButtons = () => {
    if (userType !== 'manager') return null;

    switch (statusValue) {
      case 'SCHEDULED':
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
        );
      case 'IN-PROGRESS':
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
        );
      case 'COMPLETED':
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
        );
      default:
        return (
          <button
            onClick={() => onViewDetails?.(id)}
            className="flex-1 rounded-[22px] bg-white border border-[#E0E0E0] py-3 text-sm font-extrabold text-[#757575] hover:bg-[#FAFAFA] transition-colors"
          >
            상세보기
          </button>
        );
    }
  };

  const renderCustomerButtons = () => {
    if (userType !== 'customer') return null;
    return (
      <button
        onClick={() => onViewDetails?.(id)}
        className="flex-1 rounded-[22px] bg-white border border-[#E0E0E0] py-3 text-sm font-extrabold text-[#757575] hover:bg-[#FAFAFA] transition-colors"
      >
        상세보기
      </button>
    );
  };

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-[#E5E7EB] bg-white p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* <h3 className="text-lg font-bold text-black">{serviceType}</h3> */}
          <div className="flex items-center gap-2">
            <Image
              src="/icons/map-pin.svg"
              alt="위치"
              width={16}
              height={16}
              className="text-[#666666]"
            />
            {/* <span className="text-sm text-[#666666]">{location}</span> */}
          </div>
        </div>
        <div className={`rounded-xl px-3 py-1.5 ${getStatusColor(statusValue)}`}>
          <span className="text-xs font-medium">{getStatusText(statusValue)}</span>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-[#666666]">날짜 및 시간</span>
          <span className="text-sm font-medium text-black">{dateTime}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-[#666666]">{personLabel}</span>
          <span className="text-sm font-medium text-black">{personName}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-[#666666]">
            {userType === 'manager' ? '수입 금액' : '결제 금액'}
          </span>
          <span className="text-sm font-extrabold text-black">{formattedAmount}</span>
        </div>
      </div>
      <div className="flex gap-3">
        {userType === 'manager' ? renderManagerButtons() : renderCustomerButtons()}
      </div>
    </div>
  );
};