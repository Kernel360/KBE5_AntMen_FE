'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createReservation } from '@/shared/api/reservation';
import { ReservationStorage } from '@/shared/lib/reservationStorage';
import { CommonHeader } from '@/shared/ui/Header/CommonHeader';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';

export default function ReservationConfirmPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [reservationInfo, setReservationInfo] = useState<any | null>(null);
  const [selectedManagers, setSelectedManagers] = useState<any[]>([]);
  const [isDataReady, setIsDataReady] = useState(false);

  useEffect(() => {
    const loadReservationData = () => {
      try {
        // 세션에서 예약 정보 가져오기
        const savedDataStr = sessionStorage.getItem('currentReservation');
        
        if (!savedDataStr) {
          console.log('예약 정보가 없습니다.');
          // 예약 폼으로 리다이렉트
          router.push('/reservation/form');
          return;
        }

        const savedData = JSON.parse(savedDataStr);
        console.log('확인 페이지에서 로드된 예약 정보:', savedData);

        // 선택된 매니저들 처리
        if (savedData.selectedManagers && Array.isArray(savedData.selectedManagers)) {
          setSelectedManagers(savedData.selectedManagers);
        }

        setReservationInfo(savedData);
        setIsDataReady(true);
      } catch (error) {
        console.error('예약 정보 로드 실패:', error);
        router.push('/reservation/form');
      }
    };

    loadReservationData();
  }, [router]);

  const handleConfirm = async () => {
    if (!reservationInfo) {
      console.error('예약 정보가 없습니다.');
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
      // develop 브랜치와 동일한 구조로 예약 생성 API 호출
      const reservationRequest = {
        customerId: Number(userId),
        categoryId: reservationInfo.categoryId,
        addressId: parseInt(reservationInfo.addressId),
        reservationCreatedAt: new Date().toISOString(),
        reservationDate: reservationInfo.reservationDate,
        reservationTime: reservationInfo.reservationTime,
        reservationDuration: Number(reservationInfo.reservationDuration),
        reservationMemo: reservationInfo.reservationMemo || '',
        reservationAmount: Number(reservationInfo.reservationAmount),
        additionalDuration: Number(reservationInfo.additionalDuration || 0),
        optionIds: (reservationInfo.optionIds || []).map(Number),
        managerIds: selectedManagers.map(manager => Number(manager.id))
      };
      
      const newReservation = await createReservation(reservationRequest);
      
      console.log('예약 생성 성공:', newReservation);

      // 예약 생성 후 결제 페이지로 이동 (세션 정리는 결제 완료 후)
      router.push(`/payment/${newReservation.reservationId}`);
    } catch (error) {
      console.error('예약 생성 실패:', error);
      alert('예약 생성 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };



  if (!isDataReady) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">예약 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!reservationInfo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">예약 정보를 찾을 수 없습니다</h2>
          <button
            onClick={() => router.push('/reservation/form')}
            className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90"
          >
            새로 예약하기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex justify-center">
      <div className="w-full max-w-[375px] min-h-screen flex flex-col bg-slate-50">
        {/* 헤더 */}
        <CommonHeader 
          title="예약 확인"
          showBackButton
        />

        <div className="flex-1 p-4 pt-20">
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
                  <span className="text-slate-600">예약 금액</span>
                  <span className="font-medium">{reservationInfo.reservationAmount?.toLocaleString()}원</span>
                </div>
              </div>
            </div>

            {/* 선택한 매니저 */}
            {selectedManagers.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-3">선택한 매니저</h2>
                <div className="space-y-4">
                  {selectedManagers.map((manager, index) => (
                    <div key={manager.id} className="bg-slate-50 rounded-xl p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center">
                          <span className="text-lg font-medium text-slate-600">
                            {manager.name.charAt(0)}
                          </span>
                        </div>
                        <div className="flex-1">
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

            {/* 요청사항 */}
            {reservationInfo.reservationMemo && (
              <div>
                <h2 className="text-lg font-semibold mb-3">요청사항</h2>
                <p className="text-slate-700">{reservationInfo.reservationMemo}</p>
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