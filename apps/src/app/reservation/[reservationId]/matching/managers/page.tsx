'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MatchingHeader } from '@/widgets/manager/MatchingHeader';
import { ManagerList } from '@/widgets/manager/ManagerList';
import { BottomSection } from '@/widgets/manager/BottomSection';
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
    return (
      <div className="min-h-screen bg-[#f8fafc] animate-pulse">
        <div className="bg-white border-b border-[#e2e8f0] px-5 py-4">
          <div className="flex items-center justify-between mb-3">
            <div className="w-6 h-6 bg-gray-200 rounded"></div>
          </div>
          <div className="flex justify-between items-start">
            <div>
              <div className="w-24 h-6 bg-gray-200 rounded mb-2"></div>
              <div className="w-40 h-4 bg-gray-200 rounded"></div>
            </div>
            <div className="w-12 h-6 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
        <div className="p-5 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-5 border-2 border-gray-200">
              <div className="flex gap-4">
                <div className="w-[72px] h-[72px] bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="w-32 h-5 bg-gray-200 rounded"></div>
                  <div className="w-24 h-4 bg-gray-200 rounded"></div>
                  <div className="w-full h-4 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
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