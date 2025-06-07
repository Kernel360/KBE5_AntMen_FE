'use client';

import React from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';

export default function ManagerReservationDetailPage() {
  const router = useRouter();
  const params = useParams();
  const reservationId = (params?.id as string) || 'unknown';

  return (
    <main className="flex min-h-screen flex-col bg-white">
      {/* Header */}
      <header className="flex items-center justify-between p-5">
        <button 
          onClick={() => router.back()} 
          className="flex h-6 w-6 items-center justify-center"
        >
          <Image src="/icons/arrow-left.svg" alt="뒤로가기" width={24} height={24} />
        </button>
        <h1 className="flex-1 text-center text-2xl font-bold">업무 상세</h1>
        <div className="h-6 w-6" /> {/* Spacer for alignment */}
      </header>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-6 p-5">
        <div className="flex flex-col items-center justify-center gap-4 py-20">
          <div className="text-6xl">🚧</div>
          <h2 className="text-xl font-bold text-gray-800">상세 페이지 준비 중</h2>
          <p className="text-center text-gray-600">
            예약 ID: <span className="font-mono font-semibold">{reservationId}</span>
          </p>
          <p className="text-center text-sm text-gray-500">
            이 페이지는 곧 완성될 예정입니다.
          </p>
          
          {/* 테스트용 버튼들 */}
          <div className="mt-8 flex flex-col gap-3 w-full max-w-sm">
            <button
              onClick={() => router.push('/manager/reservations')}
              className="w-full rounded-xl bg-[#4DD0E1] py-3 text-white font-medium hover:bg-[#26C6DA] transition-colors"
            >
              업무 내역으로 돌아가기
            </button>
            
            <button
              onClick={() => {
                alert(`예약 ${reservationId}가 취소되었습니다.`);
                // cancelled 파라미터와 함께 업무 내역 페이지로 이동
                router.push(`/manager/reservations?cancelled=${reservationId}`);
              }}
              className="w-full rounded-xl border border-red-300 bg-red-50 py-3 text-red-600 font-medium hover:bg-red-100 transition-colors"
            >
              테스트: 예약 취소하기
            </button>
          </div>
        </div>
      </div>
    </main>
  );
} 