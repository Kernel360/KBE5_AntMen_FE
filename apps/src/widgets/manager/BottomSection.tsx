'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { MAX_MANAGER_COUNT } from '@/widgets/manager/model/manager';
import { MANAGER_NAMES } from '@/widgets/manager/model/manager';

interface BottomSectionProps {
  selectedManagers: string[];
  reservationId?: string;
}

export function BottomSection({ selectedManagers, reservationId }: BottomSectionProps) {
  const router = useRouter();
  const [currentReservationId, setCurrentReservationId] = useState<string | null>(null);

  useEffect(() => {
    // 처음 예약의 경우 localStorage에서 reservationId 가져오기
    if (!reservationId && typeof window !== 'undefined') {
      const storedId = localStorage.getItem('currentReservationId');
      setCurrentReservationId(storedId);
    } else {
      setCurrentReservationId(reservationId || null);
    }
  }, [reservationId]);

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
      // 매니저 선택 완료 후 새 예약 생성
      // const response = await fetch('/api/reservations', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ 
      //     selectedManagers,
      //     reservationId: currentReservationId // localStorage에서 가져온 ID 또는 prop으로 받은 ID
      //   })
      // });
      // const { reservationId: newReservationId } = await response.json();
      
      console.log('Creating reservation with managers:', selectedManagers);
      if (currentReservationId) {
        console.log('Using reservation ID:', currentReservationId);
      }
      
      // 실제 예약 ID 사용 (localStorage에서 가져온 것 또는 prop으로 받은 것)
      const finalReservationId = currentReservationId || 'CL-20230510-1234';
      
      // localStorage 정리 (처음 예약 완료 후)
      if (!reservationId && typeof window !== 'undefined') {
        localStorage.removeItem('currentReservationId');
      }
      
      // 예약 상세 페이지로 이동
      router.push(`/reservation/${finalReservationId}/confirmation`);
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