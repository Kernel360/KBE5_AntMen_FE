// 내 예약 -> 예약 상세 페이지

/**
 * TODO: 예약 상세 페이지 디자인 수정 필요
 *
 * 1. 결제하면 결제 컴포넌트 불러오기 ✅
 * 2. 예약 취소 버튼 누르면 예약 취소 모달 띄우기 RejectReservationModal ✅
 * 3. 결제 페이지 이동 필요 ✅
 * 4. 예약 리스트 예약 상태 수정 ✅
 * 5. 매니저 리스트 추가 필요 
 * 6. 환불 기능 구현 ✅
 * 7. 모달 컴포넌트 분리 ✅
 **/

import { Suspense } from 'react';
import type { Reservation } from '@/entities/reservation/model/types';
import { ReservationDetailPageClient } from './ReservationDetailPageClient';
import { notFound } from 'next/navigation';

interface PageProps {
  params: {
    reservationid: string;
  };
}

// --- 데이터 페칭 함수 ---
async function getReservationDetail(id: string): Promise<Reservation | null> {
  try {
    // API URL을 환경 변수로 관리하는 것이 좋습니다.
    const res = await fetch(`http://localhost:3000/api/reservation/${id}`, {
      cache: 'no-store', // 항상 최신 데이터를 가져옴
    });

    if (!res.ok) {
      if (res.status === 404) {
        return null; // 404의 경우 null을 반환하여 페이지에서 처리
      }
      throw new Error(`Failed to fetch reservation: ${res.statusText}`);
    }

    const data = await res.json();
    return data as Reservation;

  } catch (error) {
    console.error('Failed to fetch reservation detail:', error);
    // 에러 발생 시에도 null 반환
    return null;
  }
}

// --- 스켈레톤 UI ---
function PageSkeleton() {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50 animate-pulse">
            {/* Header Skeleton */}
            <header className="bg-white px-5 py-4">
                <div className="flex items-center gap-4">
                    <div className="w-6 h-6 bg-gray-200 rounded"></div>
                    <div className="w-32 h-8 bg-gray-200 rounded"></div>
                </div>
            </header>

            <main className="flex-grow pb-24">
                <div className="space-y-2">
                    {/* Reservation Status Skeleton */}
                    <div className="bg-white px-5 py-6">
                        <div className="h-6 w-24 bg-gray-200 rounded mb-6"></div>
                        <div className="space-y-4">
                            <div className="flex justify-between"><div className="w-20 h-5 bg-gray-200 rounded"></div><div className="w-28 h-5 bg-gray-200 rounded"></div></div>
                            <div className="flex justify-between"><div className="w-16 h-5 bg-gray-200 rounded"></div><div className="w-24 h-5 bg-gray-200 rounded"></div></div>
                        </div>
                    </div>
                    {/* Service Info Skeleton */}
                    <div className="bg-white px-5 py-6">
                         <div className="h-6 w-24 bg-gray-200 rounded mb-6"></div>
                        <div className="space-y-4">
                            <div className="flex justify-between"><div className="w-20 h-5 bg-gray-200 rounded"></div><div className="w-28 h-5 bg-gray-200 rounded"></div></div>
                            <div className="flex justify-between"><div className="w-16 h-5 bg-gray-200 rounded"></div><div className="w-24 h-5 bg-gray-200 rounded"></div></div>
                        </div>
                    </div>
                     {/* Cleaner Info Skeleton */}
                    <div className="bg-white px-5 py-6">
                         <div className="h-6 w-24 bg-gray-200 rounded mb-6"></div>
                        <div className="flex items-start gap-4">
                            <div className="w-15 h-15 bg-gray-200 rounded-full"></div>
                            <div className="flex-1 space-y-2">
                                <div className="h-6 w-20 bg-gray-200 rounded"></div>
                                <div className="h-5 w-32 bg-gray-200 rounded"></div>
                            </div>
                        </div>
                    </div>
                     {/* Payment Skeleton */}
                    <div className="bg-white px-5 py-6">
                        <div className="h-6 w-32 bg-gray-200 rounded mb-6"></div>
                        <div className="space-y-4">
                             <div className="flex justify-between"><div className="w-24 h-5 bg-gray-200 rounded"></div><div className="w-20 h-5 bg-gray-200 rounded"></div></div>
                             <div className="flex justify-between pt-2 border-t"><div className="w-28 h-6 bg-gray-200 rounded"></div><div className="w-24 h-6 bg-gray-200 rounded"></div></div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Action Button Skeleton */}
            <div className="sticky bottom-0 bg-white p-5 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
                <div className="w-full h-12 bg-gray-200 rounded-xl"></div>
            </div>
        </div>
    );
}

export default async function ReservationDetailPage({ params }: PageProps) {
  const reservationDetail = await getReservationDetail(params.reservationid);

  if (!reservationDetail) {
    notFound();
  }

  return (
    <Suspense fallback={<PageSkeleton />}>
      <ReservationDetailPageClient initialReservation={reservationDetail} />
    </Suspense>
  );
} 