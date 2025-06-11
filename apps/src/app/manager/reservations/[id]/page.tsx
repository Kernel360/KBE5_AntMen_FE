'use client';

import React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ErrorState } from '@/components/common/ErrorState';
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
        <div className="h-6 w-6" />
      </header>

      <ErrorState
        title="상세 페이지 준비 중"
        description={`예약 ID: ${reservationId}`}
        details="이 페이지는 곧 완성될 예정입니다."
        actions={[
          {
            label: '업무 내역으로 돌아가기',
            onClick: () => router.push('/manager/reservations'),
            variant: 'primary'
          }
        ]}
      />
    </main>
  );
} 