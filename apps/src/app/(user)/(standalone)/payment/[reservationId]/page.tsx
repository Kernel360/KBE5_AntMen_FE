'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Payment, PaymentRequestDto } from '@/entities/payment/model/types';
import { requestPayment } from '@/entities/payment/api/paymentApi';
import Cookies from 'js-cookie';

interface PaymentPageProps {
  params: {
    reservationId: string;
  };
}

export default function PaymentPage({ params }: PaymentPageProps) {
  const router = useRouter();
  const [paymentInfo, setPaymentInfo] = useState<Payment | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [isPaying, setIsPaying] = useState(false);
  const [reservationData, setReservationData] = useState<any | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get('auth-token');
        if (!token) {
          throw new Error('로그인이 필요합니다.');
        }
        let cleanToken = token.replace(/^Bearer\s+/i, '').replace(/\s+/g, '');
        // 예약 정보 조회
        const reservationResponse = await fetch(`https://api.antmen.site:9091/api/v1/customer/reservations/${params.reservationId}`, {
          headers: {
            'Authorization': `Bearer ${cleanToken}`
          }
        });
        console.log('token:', cleanToken);
        
        if (!reservationResponse.ok) {
          throw new Error('예약 정보를 불러오는데 실패했습니다.');
        }

        const reservationData = await reservationResponse.json();
        setReservationData(reservationData);
      } catch (error) {
        console.error('데이터 조회 오류:', error);
        setError(error instanceof Error ? error.message : '데이터를 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [params.reservationId]);

  // 결제 요청 함수 분리
  const handlePayment = async () => {
    setIsPaying(true);
    setMessage(null);
    try {
      const token = Cookies.get('auth-token');
      if (!token) {
        throw new Error('로그인이 필요합니다.');
      }
      let cleanToken = token.replace(/^Bearer\s+/i, '').replace(/\s+/g, '');
      // 결제 요청
      await requestPayment({
        reservationId: Number(params.reservationId),
        payMethod: 'CARD',
        payAmount: reservationData?.reservationAmount || 0
      }, cleanToken);
      setMessage('결제가 성공적으로 완료되었습니다!');
      setTimeout(() => {
        router.push(`/reservation/${params.reservationId}/confirmation`);
      }, 1200);
    } catch (e) {
      setMessage('결제에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsPaying(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-500">결제 정보를 불러오는 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-6 max-w-[375px] w-full mx-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2">오류가 발생했습니다</h2>
            <p className="text-slate-500 mb-6">{error}</p>
            <button
              onClick={() => router.push('/')}
              className="w-full h-14 rounded-2xl font-semibold text-white text-lg bg-primary"
            >
              홈으로 이동
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-6 max-w-[375px] w-full mx-4">
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-center">결제 정보</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-600">예약 번호</span>
              <span className="font-medium">{params.reservationId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">결제 금액</span>
              <span className="font-medium">{reservationData?.reservationAmount?.toLocaleString()}원</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">결제 수단</span>
              <span className="font-medium">카드</span>
            </div>
          </div>
          {message && (
            <div className="text-center text-base text-primary font-semibold py-2">{message}</div>
          )}
          <div className="pt-4">
            <button
              onClick={handlePayment}
              className="w-full h-14 rounded-2xl font-semibold text-white text-lg bg-primary disabled:opacity-50"
              disabled={isPaying}
            >
              {isPaying ? '결제 중...' : '결제하기'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 