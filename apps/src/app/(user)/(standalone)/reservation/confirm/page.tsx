'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createReservation, ReservationRequest } from '@/shared/api';
import { checkCustomerAuth } from '@/features/auth/lib/auth';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';

interface ReservationInfo {
  customerId: number;
  categoryId: number;
  addressId: string;
  reservationDate: string;
  reservationTime: string;
  reservationDuration: number;
  reservationMemo: string;
  reservationAmount: number;
  additionalDuration: number;
  optionIds: number[];
  selectedManagers: Array<{
    id: string;
    name: string;
    gender: string;
    age: number;
    rating: number;
    description: string;
  }>;
}

export default function ReservationConfirmPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [reservationInfo, setReservationInfo] = useState<ReservationInfo | null>(null);

  useEffect(() => {
    // localStorage에서 예약 정보 가져오기
    const savedData = localStorage.getItem('pendingReservation');
    if (!savedData) {
      alert('예약 정보를 찾을 수 없습니다.');
      router.push('/');
      return;
    }

    setReservationInfo(JSON.parse(savedData));
  }, [router]);

  const handleConfirm = async () => {
    if (!reservationInfo) return;
    
    // 인증 체크
    const authResult = checkCustomerAuth();
    if (!authResult.isAuthenticated || authResult.message) {
      alert(authResult.message);
      if (!authResult.isAuthenticated) {
        router.push('/login');
      } else if (authResult.userRole === 'MANAGER') {
        router.push('/manager');
      } else {
        router.push('/');
      }
      return;
    }

    // 토큰에서 userId(sub) 추출
    const token = Cookies.get('auth-token');
    let userId = null;
    if (token) {
      try {
        const cleanToken = token.replace(/^Bearer\s*/i, '');
        const decoded: any = jwtDecode(cleanToken);
        userId = decoded.sub;
      } catch (e) {
        alert('로그인 정보가 올바르지 않습니다. 다시 로그인 해주세요.');
        router.push('/login');
        return;
      }
    }
    if (!userId) {
      alert('로그인 정보가 없습니다.');
      router.push('/login');
      return;
    }
    setIsLoading(true);
    try {
      // 필수 필드 검증
      if (!reservationInfo.addressId) {
        throw new Error('주소 정보가 필요합니다.');
      }
      if (!reservationInfo.categoryId) {
        throw new Error('카테고리 정보가 필요합니다.');
      }

      // ReservationRequest 타입에 맞게 데이터 변환
      const finalPayload: ReservationRequest = {
        customerId: Number(userId), // 항상 로그인 유저 id로 세팅
        categoryId: reservationInfo.categoryId,
        addressId: parseInt(reservationInfo.addressId),
        reservationCreatedAt: new Date().toISOString(),  // 현재 시간을 ISO 문자열로
        reservationDate: reservationInfo.reservationDate,
        reservationTime: reservationInfo.reservationTime,
        reservationDuration: Number(reservationInfo.reservationDuration),
        reservationMemo: reservationInfo.reservationMemo || '',
        reservationAmount: Number(reservationInfo.reservationAmount),
        additionalDuration: Number(reservationInfo.additionalDuration || 0),
        optionIds: (reservationInfo.optionIds || []).map(Number),
        managerIds: reservationInfo.selectedManagers.map(manager => Number(manager.id))
      };

      console.log('백엔드로 전송되는 데이터:', finalPayload);
      const response = await createReservation(finalPayload);

      // 예약 완료 후 localStorage 정리
      localStorage.removeItem('pendingReservation');

      // 예약 완료 페이지로 이동
      router.push(`/reservation/${response.reservationId}/confirmation`);
    } catch (error) {
      console.error('예약 생성 오류:', error);
      alert(error instanceof Error ? error.message : '예약 생성 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!reservationInfo) {
    return (
      <div className="min-h-screen bg-slate-50 flex justify-center">
        <div className="w-full max-w-[375px] min-h-screen flex flex-col bg-slate-50">
          <div className="flex-1 flex items-center justify-center">
            <div className="text-slate-500">예약 정보를 불러오는 중...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex justify-center">
      <div className="w-full max-w-[375px] min-h-screen flex flex-col bg-slate-50">
        <header className="sticky top-0 z-10 bg-white border-b border-slate-200">
          <div className="px-4 h-14 flex items-center justify-between">
            <h1 className="text-lg font-semibold">예약 확인</h1>
          </div>
        </header>

        <div className="flex-1 p-4">
          <div className="bg-white rounded-2xl p-5 space-y-6">
            {/* 예약 정보 */}
            <div>
              <h2 className="text-lg font-semibold mb-3">예약 정보</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-600">날짜</span>
                  <span className="font-medium">{reservationInfo.reservationDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">시간</span>
                  <span className="font-medium">{reservationInfo.reservationTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">소요 시간</span>
                  <span className="font-medium">{reservationInfo.reservationDuration}시간</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">지역</span>
                  <span className="font-medium">{reservationInfo.addressId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">예약 금액</span>
                  <span className="font-medium">{reservationInfo.reservationAmount.toLocaleString()}원</span>
                </div>
              </div>
            </div>

            {/* 선택된 매니저 정보 */}
            {reservationInfo.selectedManagers.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-3">선택한 매니저</h2>
                <div className="space-y-4">
                  {reservationInfo.selectedManagers.map((manager, index) => (
                    <div key={manager.id} className="bg-slate-50 rounded-xl p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center">
                          <span className="text-lg font-medium text-slate-600">
                            {manager.name[0]}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-medium">{manager.name} 매니저</h3>
                          <p className="text-sm text-slate-500">
                            {manager.gender} · {manager.age}세
                          </p>
                        </div>
                        <div className="ml-auto">
                          <span className="px-2.5 py-1 bg-primary/10 rounded-lg text-sm font-medium text-primary">
                            {index + 1}순위
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="sticky bottom-0 bg-white border-t border-slate-200">
          <div className="px-4 py-4">
            <button
              onClick={handleConfirm}
              disabled={isLoading}
              className="w-full h-14 rounded-2xl font-semibold text-black text-base bg-primary disabled:bg-slate-200 disabled:text-slate-400"
            >
              {isLoading ? '예약 생성 중...' : '예약하기'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 