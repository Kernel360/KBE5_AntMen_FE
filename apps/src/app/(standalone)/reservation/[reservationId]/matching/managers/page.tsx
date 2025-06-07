/**
 * 매칭 거절/취소 후 다시 매칭 요청 페이지
 * 
 * /reservation/[reservationId]/matching/managers 페이지로 이동 (예약 ID 있는 URL)
 */

'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MatchingHeader, ManagerList, BottomSection, ManagerListLoading } from '@/widgets/manager';
import { MANAGER_LIST, MAX_MANAGER_COUNT } from '@/widgets/manager/model/manager';

export default function ManagerListPage() {
  const params = useParams();
  const router = useRouter();
  const reservationId = params?.reservationId as string;
  
  // 기본 선택: 아무것도 선택되지 않은 상태
  const [selectedManagers, setSelectedManagers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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

    if (reservationId) {
      loadManagers();
    }
  }, [reservationId]);

  const handleManagerSelect = (managerId: string) => {
    setSelectedManagers(prev => {
      if (prev.includes(managerId)) {
        // 이미 선택된 매니저 제거
        return prev.filter(id => id !== managerId);
      } else if (prev.length < MAX_MANAGER_COUNT) {
        // 최대 선택 수를 넘지 않으면 추가
        return [...prev, managerId];
      } else {
        // 최대 선택 수 도달 시 첫 번째를 제거하고 새로 추가
        return [...prev.slice(1), managerId];
      }
    });
  };

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