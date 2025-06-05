'use client';

import { useRouter } from 'next/navigation';
import { MAX_MANAGER_COUNT } from '@/constants/manager';
import { MANAGER_NAMES } from '@/constants/manager';

interface BottomSectionProps {
  selectedManagers: string[];
  reservationId: string;
}

export function BottomSection({ selectedManagers, reservationId }: BottomSectionProps) {
  const router = useRouter();

  const getSelectedManagerNames = () => {
    if (selectedManagers.length === 0) return '';
    const names = selectedManagers.map(id => MANAGER_NAMES[id as keyof typeof MANAGER_NAMES]);
    return `${names.join(', ')} 매니저가 선택되었습니다`;
  };

  const handleNext = async () => {
    if (selectedManagers.length === 0) {
      alert('최소 1명의 매니저를 선택해주세요.');
      return;
    }

    try {
      // 실제 API 호출 시:
      // const response = await fetch(`/api/reservations/${reservationId}/managers`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ selectedManagers })
      // });
      
      console.log('Selected managers:', selectedManagers);
      
      // 매칭 요청 페이지로 이동
      router.push(`/reservation/${reservationId}/matching/request`);
    } catch (error) {
      console.error('매니저 선택 제출 오류:', error);
      alert('매니저 선택 중 오류가 발생했습니다.');
    }
  };

  return (
    <div>
      <div className="px-4">
        {selectedManagers.length > 0 && (
          <div className="flex items-center gap-2 py-4">
            <div className="w-5 h-5 flex items-center justify-center rounded-full bg-primary/10">
              <span className="text-primary text-sm">i</span>
            </div>
            <p className="text-sm text-slate-600">{getSelectedManagerNames()}</p>
          </div>
        )}
        <div className="border-t border-slate-200">
          <div className="py-4">
            <button
              onClick={handleNext}
              disabled={selectedManagers.length === 0}
              className="w-full h-14 rounded-2xl font-semibold text-white text-lg bg-primary disabled:bg-slate-200 disabled:text-slate-400 transition-colors"
            >
              다음
              {selectedManagers.length > 0 && (
                <span className="ml-1">›</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 