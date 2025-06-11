"use client";

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import type { Reservation } from '@/entities/reservation/model/types';

// 임시 데이터 (실제로는 API에서 가져와야 함)
const MOCK_RESERVATION: Reservation = {
  id: '1',
  reservationNumber: 'CL-20230510-1234',
  serviceType: '정기 청소 (주 1회)',
  status: 'scheduled',
  paymentStatus: 'paid',
  dateTime: '2023년 5월 15일 · 오전 10:00',
  duration: '3시간',
  location: '서울특별시 강남구 테헤란로 152',
  detailedAddress: '서울특별시 강남구 테헤란로 152, 45층',
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
  paymentMethod: '신한카드 (1234-56XX-XXXX-7890)',
  options: [],
  createdAt: '2023-05-10T10:00:00Z',
};

export default function ReservationDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const reservation = MOCK_RESERVATION; // 실제로는 params.id를 사용하여 API에서 데이터를 가져와야 함

  const handleCancel = () => {
    // TODO: Implement reservation cancellation
    console.log('Cancel reservation:', params.id);
  };

  const handleContact = () => {
    // TODO: Implement contact functionality
    console.log('Contact worker:', reservation.worker.id);
  };

  return (
    <main className="flex min-h-screen flex-col bg-white">
      {/* Header */}
      <header className="flex items-center justify-between p-5">
        <button onClick={() => router.back()} className="flex h-6 w-6 items-center justify-center">
          <Image src="/icons/arrow-left.svg" alt="뒤로가기" width={24} height={24} />
        </button>
        <h1 className="flex-1 text-center text-2xl font-bold">예약 상세</h1>
        <div className="h-6 w-6" /> {/* Spacer for alignment */}
      </header>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-8 p-5">
        {/* Reservation Status */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">예약 상태</h2>
            <div className="rounded-xl bg-[#E8F0FE] px-3 py-1.5">
              <span className="text-xs font-medium text-[#0fbcd6]">
                {reservation.status === 'scheduled' ? '예정됨' : reservation.status === 'completed' ? '완료' : '취소됨'}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-[#666666]">예약 번호</span>
              <span className="text-sm font-medium">{reservation.reservationNumber}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-[#666666]">예약일</span>
              <span className="text-sm font-medium">{reservation.dateTime.split(' · ')[0]}</span>
            </div>
          </div>
        </section>

        {/* Service Info */}
        <section className="flex flex-col gap-4">
          <h2 className="text-lg font-bold">서비스 정보</h2>
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-[#666666]">서비스 유형</span>
              <span className="text-sm font-medium">{reservation.serviceType}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-[#666666]">날짜 및 시간</span>
              <span className="text-sm font-medium">{reservation.dateTime}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-[#666666]">소요 시간</span>
              <span className="text-sm font-medium">{reservation.duration}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-[#666666]">주소</span>
              <span className="text-sm font-medium">{reservation.location}</span>
            </div>
          </div>
        </section>

        {/* Cleaner Info */}
        <section className="flex flex-col gap-4">
          <h2 className="text-lg font-bold">청소 도우미</h2>
          <div className="flex items-center gap-4">
            <div className="flex h-[60px] w-[60px] items-center justify-center rounded-full bg-[#0fbcd6]">
              <span className="text-base font-extrabold text-white">
                {reservation.worker.name.charAt(0)}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="text-lg font-extrabold">{reservation.worker.name}</span>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-medium">{reservation.worker.rating}</span>
                  <Image src="/icons/star.svg" alt="별점" width={16} height={16} />
                </div>
              </div>
              <span className="text-sm text-[#666666]">{reservation.worker.experience}</span>
            </div>
          </div>
        </section>

        {/* Payment Info */}
        <section className="flex flex-col gap-4">
          <h2 className="text-lg font-bold">결제 정보</h2>
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-[#666666]">기본 요금 ({reservation.duration})</span>
              <span className="text-sm font-medium">
                {new Intl.NumberFormat('ko-KR', {
                  style: 'currency',
                  currency: 'KRW',
                }).format(reservation.baseAmount || 0)}
              </span>
            </div>
            {reservation.discount && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[#666666]">정기 할인</span>
                <span className="text-sm font-medium text-[#FF6B35]">
                  -{new Intl.NumberFormat('ko-KR', {
                    style: 'currency',
                    currency: 'KRW',
                  }).format(reservation.discount)}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-base font-extrabold">총 결제 금액</span>
              <span className="text-base font-bold">
                {new Intl.NumberFormat('ko-KR', {
                  style: 'currency',
                  currency: 'KRW',
                }).format(reservation.amount || 0)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-[#666666]">결제 수단</span>
              <span className="text-sm font-medium">{reservation.paymentMethod}</span>
            </div>
          </div>
        </section>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 p-5">
        <button
          onClick={handleCancel}
          className="flex-1 rounded-xl border border-[#CCCCCC] py-4 text-base font-extrabold text-[#666666]"
        >
          예약 취소
        </button>
        <button
          onClick={handleContact}
          className="flex-1 rounded-xl bg-[#0fbcd6] py-4 text-base font-extrabold text-white"
        >
          청소 도우미에게 연락하기
        </button>
      </div>
    </main>
  );
} 