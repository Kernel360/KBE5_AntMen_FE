'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  createReservation,
  updateReservationManager,
  ReservationRequest,
} from '@/shared/api';
import { MANAGER_NAMES } from '@/widgets/manager/model/manager';

interface BottomSectionProps {
  selectedManagers: string[];
  reservationId?: string;
}

export function BottomSection({
  selectedManagers,
  reservationId,
}: BottomSectionProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const getSelectedManagerNames = () => {
    if (selectedManagers.length === 0) return '';
    const names = selectedManagers.map(id => MANAGER_NAMES[id as keyof typeof MANAGER_NAMES] || '알 수 없는 매니저');
    return `${names.join(', ')} 매니저가 선택되었습니다`;
  };

  const handleNext = async () => {
    if (selectedManagers.length === 0) {
      alert('최소 1명의 매니저를 선택해주세요.');
      return;
    }

    setIsLoading(true);

    try {
      if (reservationId) {
        const managerId = parseInt(selectedManagers[0], 10);
        if (isNaN(managerId)) {
          throw new Error('유효하지 않은 매니저 ID입니다.');
        }
        const updatedReservation = await updateReservationManager(
          parseInt(reservationId, 10),
          managerId,
        );
        router.push(`/reservation/${updatedReservation.reservationId}/confirmation`);
      } else {
        const pendingReservationJSON =
          typeof window !== 'undefined'
            ? localStorage.getItem('pendingReservation')
            : null;
        if (!pendingReservationJSON) {
          throw new Error(
            '예약 정보를 찾을 수 없습니다. 예약 과정을 다시 시작해 주세요.',
          );
        }
        const reservationDetails = JSON.parse(
          pendingReservationJSON,
        ) as Omit<ReservationRequest, 'optionIds'> & { optionIds: number[] };

        const finalPayload: ReservationRequest = {
          ...reservationDetails,
        };

        console.log('백엔드로 전송하는 예약 정보:', finalPayload);

        const newReservation = await createReservation(finalPayload);

        if (typeof window !== 'undefined') {
          localStorage.removeItem('pendingReservation');
        }

        router.push(`/reservation/${newReservation.reservationId}/confirmation`);
      }
    } catch (error) {
      console.error('매니저 선택 및 예약 생성 제출 오류:', error);
      alert(error instanceof Error ? error.message : '오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
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
              disabled={selectedManagers.length === 0 || isLoading}
              className="w-full h-14 rounded-2xl font-semibold text-white text-lg bg-primary disabled:bg-slate-200 disabled:text-slate-400 transition-colors"
            >
              {isLoading ? '처리 중...' : '다음'}
              {selectedManagers.length > 0 && !isLoading && (
                <span className="ml-1">›</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 