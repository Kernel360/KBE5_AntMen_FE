/**
 * 매니저 예약 내역 페이지
 * 업무 내역 페이지
 * 
 * 평소(scheduled): "Check-in" 버튼 표시
 * 작업 시작 후(in-progress): "Check-out" 버튼 표시
 * 작업 완료 후(completed-pending-review): 보라색 "후기 작성" 버튼
 * 후기 작성 완료(completed): 회색 비활성화 "완료됨" 버튼
 * 
 * TODO
 * 1. 예약 상세보기 페이지 추가
 * 2. 피그마 매칭 요청 검토 페이지 사용 여부 결정
 */
import { Suspense } from 'react';
import type { Reservation } from '@/entities/reservation/model/types';
import { ManagerReservationsClient } from './ManagerReservationsClient';

async function getReservations(): Promise<Reservation[]> {
  try {
    const res = await fetch('http://localhost:3000/api/reservations', {
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error('Failed to fetch reservations');
    }
    return res.json();
  } catch (error) {
    console.error('Error fetching reservations:', error);
    return [];
  }
}

function PageSkeleton() {
  return (
    <div className="flex min-h-screen flex-col bg-white animate-pulse">
      {/* Header Skeleton */}
      <header className="flex items-center justify-between p-5">
        <div className="h-6 w-6 rounded bg-gray-200" />
        <div className="h-7 w-32 rounded bg-gray-200" />
        <div className="h-6 w-6" />
      </header>
      {/* Tab Skeleton */}
      <div className="flex flex-col gap-4 px-5">
        <div className="flex gap-10">
          <div className="h-7 w-24 rounded bg-gray-200" />
          <div className="h-7 w-20 rounded bg-gray-200" />
        </div>
      </div>
      {/* Card List Skeleton */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        <div className="h-48 w-full rounded-xl bg-gray-200" />
        <div className="h-48 w-full rounded-xl bg-gray-200" />
      </div>
    </div>
  );
}

export default async function ManagerReservationsPage() {
  const initialReservations = await getReservations();

  return (
    <Suspense fallback={<PageSkeleton />}>
      <ManagerReservationsClient initialReservations={initialReservations} />
    </Suspense>
  );
} 