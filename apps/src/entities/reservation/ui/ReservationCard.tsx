"use client";

import React from 'react';
import Image from 'next/image';
import type { Reservation } from '../model/types';

interface ReservationCardProps {
  reservation: Reservation;
  onCancel?: (id: string) => void;
  onViewDetails?: (id: string) => void;
}

export const ReservationCard: React.FC<ReservationCardProps> = ({
  reservation,
  onCancel,
  onViewDetails,
}) => {
  const { id, serviceType, location, status, dateTime, worker, amount } = reservation;

  const formattedAmount = new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
  }).format(amount);

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
        <div className="rounded-xl bg-[#E8F0FE] px-3 py-1.5">
          <span className="text-xs font-medium text-[#2563EB]">
            {status === 'scheduled' ? '예정됨' : status === 'completed' ? '완료' : '취소됨'}
          </span>
        </div>
      </div>

      {/* Details */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-[#666666]">날짜 및 시간</span>
          <span className="text-sm font-medium text-black">{dateTime}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-[#666666]">담당자</span>
          <span className="text-sm font-medium text-black">{worker.name}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-[#666666]">결제 금액</span>
          <span className="text-sm font-extrabold text-black">{formattedAmount}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        {status === 'scheduled' && (
          <button
            onClick={() => onCancel?.(id)}
            className="flex-1 rounded-[22px] border border-[#CCCCCC] py-3 text-sm font-medium text-[#666666]"
          >
            취소
          </button>
        )}
        <button
          onClick={() => onViewDetails?.(id)}
          className="flex-1 rounded-[22px] bg-[#2563EB] py-3 text-sm font-extrabold text-white"
        >
          상세보기
        </button>
      </div>
    </div>
  );
}; 