/**
 * 매칭 거절/취소 후 다시 매칭 요청 페이지
 * 
 * /reservation/[reservationId]/matching/managers 페이지로 이동 (예약 ID 있는 URL)
 * 
 * TODO 
 * http://localhost:3000/reservation/undefined/matching/managers
 * undefined 처리 필요
 */

'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MatchingHeader, ManagerList, BottomSection, ManagerListLoading } from '@/widgets/manager';
import { useManagerSelection } from '@/features/manager-selection';

export default function ManagerListPage() {
  const params = useParams();
  const router = useRouter();
  const reservationId = params?.reservationId as string;
  
  const { selectedManagers, handleManagerSelect } = useManagerSelection({ strategy: 'slide-on-max' });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // `reservationId`가 없거나 'undefined' 문자열인 경우, 초기 매칭 페이지로 리디렉션
    if (!reservationId || reservationId === 'undefined') {
      router.replace('/matching');
      return;
    }

    // 매니저 데이터 로딩 시뮬레이션
    const loadManagers = async () => {
      try {
        // 실제 API 호출 시:
        // const response = await fetch(`/api/reservations/${reservationId}/managers`);
        // const data = await response.json();
        
        // 현재는 상수 데이터 사용
        await new Promise(resolve => setTimeout(resolve, 500));
        setIsLoading(false);
      } catch (error) {
        console.error('매니저 목록 로딩 실패:', error);
        setIsLoading(false);
      }
    };

    loadManagers();
  }, [reservationId, router]);

  if (isLoading) {
    return <ManagerListLoading />;
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] max-w-[420px] mx-auto">
      <MatchingHeader selectedCount={selectedManagers.length} />
      <ManagerList 
        selectedManagers={selectedManagers}
        onManagerSelect={handleManagerSelect}
      />
      <div className="sticky bottom-0 bg-white border-t border-slate-200">
        <BottomSection 
          selectedManagers={selectedManagers} 
          reservationId={reservationId}
        />
      </div>
    </div>
  );
} 