/**
 * 최초 예약 폼 페이지
 * 
 * reservationid가 발급되지 않은 상태에서 매니저 선택 페이지
 * 매칭 매니저 선택 후 id 발급
 */
'use client';

import { useState, useEffect } from 'react';
import { MatchingHeader, ManagerList, BottomSection, ManagerListLoading } from '@/widgets/manager';
import { useManagerSelection } from '@/features/manager-selection';

export default function MatchingPage() {
  const { selectedManagers, handleManagerSelect } = useManagerSelection();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 매니저 데이터 로딩 시뮬레이션
    const loadManagers = async () => {
      try {
        // 실제 API 호출 시:
        // const response = await fetch('/api/managers/available');
        // const data = await response.json();
        
        // 현재는 상수 데이터 사용
        await new Promise(resolve => setTimeout(resolve, 800));
        setIsLoading(false);
      } catch (error) {
        console.error('매니저 목록 로딩 실패:', error);
        setIsLoading(false);
      }
    };

    loadManagers();
  }, []);

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
        />
      </div>
    </div>
  );
} 