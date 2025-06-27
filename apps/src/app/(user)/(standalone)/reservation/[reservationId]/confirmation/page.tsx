'use client'

import Link from 'next/link';
import { useEffect } from 'react';
import { CheckCircleIcon, HomeIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/solid';
import { useManagerSelection } from '@/features/manager-selection';
import { ReservationStorage } from '@/shared/lib/reservationStorage';

const Page = () => {
  
  const { clearSelection } = useManagerSelection();

  // 예약 완료 시 매니저 선택 상태 및 예약 정보 초기화 (한 번만 실행)
  useEffect(() => {
    const cleanup = async () => {
      try {
        
        // 매니저 선택 상태 초기화
        if (clearSelection) {
          clearSelection();
        }
        
        // 예약 정보 초기화
        try {
          ReservationStorage.clearPendingReservation();
        } catch (storageError) {
        }
        
        // 세션 정리
        try {
          sessionStorage.removeItem('currentReservation');
        } catch (sessionError) {
        }
        
      } catch (error) {
        console.error('데이터 정리 중 오류:', error);
        // 에러가 발생해도 페이지는 정상적으로 표시되어야 함
      }
    };
    
    cleanup();
  }, []); // 빈 dependency array로 변경하여 컴포넌트 마운트 시 한 번만 실행

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="bg-white rounded-2xl p-6 max-w-md mx-auto shadow-lg text-center">
        {/* 성공 아이콘 */}
        <div className="w-16 h-16 mx-auto mb-4 bg-emerald-100 rounded-full flex items-center justify-center">
          <CheckCircleIcon className="w-10 h-10 text-emerald-600" />
        </div>

        {/* 메인 메시지 */}
        <h1 className="text-xl font-bold text-gray-900 mb-2">
          예약이 완료되었습니다! 🎉
        </h1>
        <p className="text-gray-600 mb-5 text-sm leading-relaxed">
          전문 매니저가 배정되면 알림을 보내드릴게요.<br/>
          예약 내역은 내 예약에서 확인하실 수 있어요.
        </p>

        {/* 다음 단계 안내 */}
        <div className="mb-6 p-4 bg-gray-50 rounded-xl">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">다음 단계</h3>
          <div className="space-y-2 text-xs text-gray-600">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-[10px] leading-none">1</div>
              <span>매니저 배정 및 알림 발송</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-[10px] leading-none">2</div>
              <span>예약 시간 30분 전 확인 연락</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-[10px] leading-none">3</div>
              <span>전문적이고 친절한 서비스 제공</span>
            </div>
          </div>
        </div>

        {/* 액션 버튼들 */}
        <div className="space-y-3">
          <button
            onClick={() => {
              window.location.href = '/myreservation';
            }}
            className="w-full py-3 px-6 bg-primary-500 text-white font-semibold rounded-xl hover:bg-primary-600 transition-colors flex items-center justify-center gap-2"
          >
            <ClipboardDocumentListIcon className="w-4 h-4" />
            내 예약 확인하기
          </button>
          
          <button
            onClick={() => {
              window.location.href = '/';
            }}
            className="w-full py-2.5 px-6 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
          >
            <HomeIcon className="w-4 h-4" />
            홈으로 돌아가기
          </button>
        </div>
      </div>
    </main>
  );
};

export default Page; 