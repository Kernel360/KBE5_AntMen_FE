'use client';

import { useState } from 'react';
import { MatchingHeader } from '@/widgets/manager/MatchingHeader';
import { ManagerList } from '@/widgets/manager/ManagerList';
import { BottomSection } from '@/widgets/manager/BottomSection';
import { MAX_MANAGER_COUNT } from '@/widgets/manager/model/manager';

export default function MatchingPage() {
  const [selectedManagers, setSelectedManagers] = useState<string[]>([]);

  const handleManagerSelect = (managerId: string) => {
    setSelectedManagers(prev => {
      const index = prev.indexOf(managerId);
      
      // 이미 선택된 매니저인 경우 제거
      if (index !== -1) {
        return prev.filter(id => id !== managerId);
      }
      
      // 최대 선택 가능 개수를 초과하는 경우
      if (prev.length >= MAX_MANAGER_COUNT) {
        return prev;
      }
      
      // 새로운 매니저 추가
      return [...prev, managerId];
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center">
      <div className="w-full max-w-[370px] min-h-screen flex flex-col relative">
        <MatchingHeader selectedCount={selectedManagers.length} />
        <div className="flex-1 overflow-y-auto pb-[140px]">
          <ManagerList 
            selectedManagers={selectedManagers}
            onManagerSelect={handleManagerSelect}
          />
        </div>
        <div className="fixed bottom-0 w-full max-w-[370px] bg-white">
          <BottomSection selectedManagers={selectedManagers} />
        </div>
      </div>
    </div>
  );
} 