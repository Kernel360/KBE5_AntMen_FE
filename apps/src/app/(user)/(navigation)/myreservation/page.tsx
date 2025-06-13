'use client';

// 내 예약 페이지 (예약리스트)

/**
 * TODO
 * 1. 예약 폼 데이터 연동
 * 2. 지난 예약 연결
 */

import { Suspense } from 'react';
import MyReservationClientWithAuth from './MyReservationClient';

function PageSkeleton() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Header Skeleton */}
      <header className="sticky top-0 z-30 flex items-center justify-between p-5 bg-white">
        <div className="h-6 w-6 rounded bg-gray-200 animate-pulse" />
        <div className="h-7 w-32 rounded bg-gray-200 animate-pulse" />
        <div className="h-6 w-6" />
      </header>
      {/* Tab Skeleton */}
      <div className="sticky top-[72px] z-20 bg-white">
        <div className="flex flex-col gap-4 px-5">
            <div className="flex gap-10">
                <div className="h-7 w-24 rounded bg-gray-200 animate-pulse" />
                <div className="h-7 w-20 rounded bg-gray-200 animate-pulse" />
            </div>
        </div>
      </div>
      {/* Card List Skeleton */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        <div className="h-48 w-full rounded-xl bg-gray-200 animate-pulse" />
        <div className="h-48 w-full rounded-xl bg-gray-200 animate-pulse" />
        <div className="h-48 w-full rounded-xl bg-gray-200 animate-pulse" />
      </div>
    </div>
  );
}

export default function MyReservationPage() {
  return (
    <main className="flex min-h-screen flex-col bg-white">
      <Suspense fallback={<PageSkeleton />}>
        <MyReservationClientWithAuth />
      </Suspense>
    </main>
  );
} 