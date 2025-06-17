'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Payment } from '@/entities/payment/model/types';
import { Reservation } from '@/entities/reservation/model/types';
import Cookies from 'js-cookie';

interface PaymentSuccessPageProps {
  params: {
    reservationId: string;
  };
}

export default function PaymentSuccessPage({ params }: PaymentSuccessPageProps) {
  const router = useRouter();
  const [paymentInfo, setPaymentInfo] = useState<Payment | null>(null);
  const [reservationInfo, setReservationInfo] = useState<Reservation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get('auth-token');
        if (!token) {
          throw new Error('로그인이 필요합니다.');
        }

        // 결제 정보 조회
        const paymentResponse = await fetch(`/api/v1/payments/${params.reservationId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!paymentResponse.ok) {
          const errorData = await paymentResponse.json().catch(() => null);
          throw new Error(errorData?.message || '결제 정보를 불러오는데 실패했습니다.');
        }

        const paymentData = await paymentResponse.json();
        setPaymentInfo(paymentData);

        // 예약 정보 조회
        const reservationResponse = await fetch(`/api/v1/reservations/${params.reservationId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!reservationResponse.ok) {
          const errorData = await reservationResponse.json().catch(() => null);
          throw new Error(errorData?.message || '예약 정보를 불러오는데 실패했습니다.');
        }

        const reservationData = await reservationResponse.json();
        setReservationInfo(reservationData);
      } catch (error) {
        console.error('데이터 조회 오류:', error);
        setError(error instanceof Error ? error.message : '데이터를 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [params.reservationId]);

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
    <div className="min-h-screen bg-slate-50 flex justify-center">
      <div className="w-full max-w-[375px] min-h-screen flex flex-col bg-slate-50">
        <header className="sticky top-0 z-10 bg-white border-b border-slate-200">
          <div className="px-4 h-14 flex items-center justify-between">
            <h1 className="text-lg font-semibold">결제 완료</h1>
          </div>
        </header>

        <div className="flex-1 p-4">
          <div className="bg-white rounded-2xl p-5 space-y-6">
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold mb-2">결제가 완료되었습니다</h2>
              <p className="text-slate-500">예약이 성공적으로 확정되었습니다.</p>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">결제 정보</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-600">예약 번호</span>
                  <span className="font-medium">{params.reservationId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">결제 금액</span>
                  <span className="font-medium">{paymentInfo?.payAmount.toLocaleString()}원</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">결제 수단</span>
                  <span className="font-medium">{paymentInfo?.payMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">결제 상태</span>
                  <span className="font-medium text-primary">{paymentInfo?.payStatus}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-slate-200">
          <div className="px-4 py-4">
            <button
              onClick={() => router.push('/')}
              className="w-full h-14 rounded-2xl font-semibold text-white text-lg bg-primary"
            >
              홈으로 이동
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 