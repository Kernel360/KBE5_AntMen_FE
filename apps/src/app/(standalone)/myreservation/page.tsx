// 내 예약 페이지 (예약리스트)

/**
 * TODO
 * 1. 예약 폼 데이터 연동
 * 2. 지난 예약 연결
 */
"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ReservationCard } from '@/entities/reservation/ui/ReservationCard';
import type { Reservation, ReservationTab } from '@/entities/reservation/model/types';

// 임시 데이터
const MOCK_RESERVATIONS: Reservation[] = [
  {
    id: '1',
    serviceType: '정기 청소',
    location: '서울시 강남구',
    status: 'scheduled',
    dateTime: '2024년 3월 15일 · 오전 10:00',
    worker: {
      id: '1',
      name: '김민준',
    },
    amount: 54000,
  },
  {
    id: '2',
    serviceType: '정기 청소',
    location: '서울시 강남구',
    status: 'scheduled',
    dateTime: '2024년 3월 22일 · 오전 10:00',
    worker: {
      id: '1',
      name: '김민준',
    },
    amount: 54000,
  },
];

export default function ReservationsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ReservationTab>('upcoming');
  const [reservations, setReservations] = useState<Reservation[]>(MOCK_RESERVATIONS); // 실제로는 API에서 가져와야 함

  const handleViewDetails = (id: string) => {
    router.push(`/myreservation/${id}`); // 예약 상세 페이지 경로
  };

  const handleNewReservation = () => {
    // TODO: Navigate to reservation creation page
    router.push('/reservation/form'); 
  };

  const filteredReservations = reservations.filter((reservation) =>
    activeTab === 'upcoming' ? reservation.status === 'scheduled' : reservation.status !== 'scheduled'
  );

  return (
    <main className="flex min-h-screen flex-col bg-white">
      {/* Header */}
      <header className="sticky top-0 z-30 flex items-center justify-between p-5 bg-white">
        <button onClick={() => router.back()} className="flex h-6 w-6 items-center justify-center">
          <Image src="/icons/arrow-left.svg" alt="뒤로가기" width={24} height={24} />
        </button>
        <h1 className="flex-1 text-center text-2xl font-bold">예약 내역</h1>
        <div className="h-6 w-6" /> {/* Spacer for alignment */}
      </header>

      {/* Tab Section */}
      <div className="sticky top-[72px] z-20 bg-white">
        <div className="flex flex-col gap-4 px-5">
          <div className="flex gap-10">
            <button
              onClick={() => setActiveTab('upcoming')}
              className="flex flex-col items-center gap-2"
            >
              <span
                className={`text-base ${
                  activeTab === 'upcoming' ? 'font-extrabold text-[#0fbcd6]' : 'font-medium text-[#999999]'
                }`}
              >
                예정된 예약
              </span>
              {activeTab === 'upcoming' && (
                <div className="h-0.5 w-full bg-[#0fbcd6]" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className="flex flex-col items-center gap-2"
            >
              <span
                className={`text-base ${
                  activeTab === 'past' ? 'font-extrabold text-[#0fbcd6]' : 'font-medium text-[#999999]'
                }`}
              >
                지난 예약
              </span>
              {activeTab === 'past' && (
                <div className="h-0.5 w-full bg-[#0fbcd6]" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Reservation List or Empty State */}
      <div className="flex-1 overflow-y-auto">
        {filteredReservations.length > 0 ? (
          <div className="space-y-4 p-5">
            {filteredReservations.map((reservation) => (
              <ReservationCard
                key={reservation.id}
                reservation={reservation}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        ) : (
          <div className="flex h-[500px] flex-col items-center justify-center gap-6 p-6">
            <div className="relative h-[120px] w-[120px]">
              <div className="absolute left-[10px] top-[10px] h-[100px] w-[100px] bg-[#BBBBBB]" />
              <div className="absolute left-[60px] top-[40px] h-[20px] w-[20px] rounded-full border-[6px] border-[#BBBBBB]" />
            </div>
            <div className="flex flex-col items-center gap-3">
              <h2 className="text-xl font-bold text-[#222222]">예약 내역이 없습니다</h2>
              <p className="text-center text-base text-[#AAAAAA]">
                아직 예약한 청소 서비스가 없습니다.
                <br />
                지금 서비스를 예약해보세요.
              </p>
            </div>
            <button
              onClick={handleNewReservation}
              className="mt-3 w-[280px] rounded-xl bg-[#0fbcd6] py-4 text-base font-bold text-white"
            >
              청소 서비스 예약하기
            </button>
          </div>
        )}
      </div>
    </main>
  );
} 