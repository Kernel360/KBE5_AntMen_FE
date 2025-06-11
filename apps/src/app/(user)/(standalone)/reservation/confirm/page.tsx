'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { reservationApi, ReservationRequest } from '@/shared/api/reservation';
import { checkCustomerAuth } from '@/features/auth/lib/auth';

interface ReservationInfo {
  categoryId: number;
  categoryName: string;
  reservationDate: string;
  reservationTime: string;
  reservationDuration: number;
  optionIds: number[];
  optionNames: string[];
  totalAmount: number;
}

export default function ReservationConfirmPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reservationInfo, setReservationInfo] = useState<ReservationInfo | null>(null);

  useEffect(() => {
    // 고객 인증 체크
    if (!checkCustomerAuth()) {
      router.push('/login');
      return;
    }

    // localStorage에서 예약 정보 가져오기
    const savedData = localStorage.getItem('pendingReservation');
    if (!savedData) {
      setError('예약 정보를 찾을 수 없습니다.');
      router.push('/');
      return;
    }

    try {
      setReservationInfo(JSON.parse(savedData));
    } catch (err) {
      setError('예약 정보를 불러오는데 실패했습니다.');
      console.error('예약 정보 파싱 실패:', err);
    }
  }, [router]);

  const handleConfirm = async () => {
    if (!reservationInfo) {
      setError('예약 정보가 없습니다.');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const reservationData: ReservationRequest = {
        categoryId: reservationInfo.categoryId,
        reservationDate: reservationInfo.reservationDate,
        reservationTime: reservationInfo.reservationTime,
        reservationDuration: reservationInfo.reservationDuration,
        optionIds: reservationInfo.optionIds,
        reservationMemo: '', // 필요한 경우 추가
      };

      const result = await reservationApi.customer.create(reservationData);
      
      // localStorage 정리
      localStorage.removeItem('pendingReservation');
      
      // 예약 성공 시 예약 상세 페이지로 이동
      router.push(`/reservation/${result.reservationId}`);
    } catch (err) {
      setError('예약 생성에 실패했습니다. 다시 시도해주세요.');
      console.error('예약 생성 실패:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!reservationInfo) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">예약 정보를 불러오는 중...</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">예약 정보 확인</h3>
            
            {error && (
              <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div className="mt-6 space-y-6">
              <div>
                <h4 className="text-sm font-medium text-gray-500">서비스</h4>
                <p className="mt-1 text-sm text-gray-900">{reservationInfo.categoryName}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500">예약 날짜</h4>
                <p className="mt-1 text-sm text-gray-900">{reservationInfo.reservationDate}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500">예약 시간</h4>
                <p className="mt-1 text-sm text-gray-900">{reservationInfo.reservationTime}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500">소요 시간</h4>
                <p className="mt-1 text-sm text-gray-900">{reservationInfo.reservationDuration}분</p>
              </div>

              {reservationInfo.optionNames.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500">추가 옵션</h4>
                  <ul className="mt-1 text-sm text-gray-900">
                    {reservationInfo.optionNames.map((name, index) => (
                      <li key={index}>{name}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <h4 className="text-sm font-medium text-gray-500">총 금액</h4>
                <p className="mt-1 text-sm text-gray-900">{reservationInfo.totalAmount.toLocaleString()}원</p>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="button"
                onClick={handleConfirm}
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {isLoading ? '예약 처리 중...' : '예약 확정하기'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 