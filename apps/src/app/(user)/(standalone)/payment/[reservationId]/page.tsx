'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { requestPayment } from '@/entities/payment/api/paymentApi';
import Cookies from 'js-cookie';
import { ChevronLeft, CreditCard, Smartphone, Building2, Check } from 'lucide-react';

interface PaymentPageProps {
  params: {
    reservationId: string;
  };
}

// 결제 수단 타입
const paymentMethods = [
  {
    id: 'card',
    name: '신용카드/체크카드',
    description: '모든 카드사 이용 가능',
    icon: CreditCard,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50'
  },
  {
    id: 'kakao',
    name: '카카오페이',
    description: '간편하고 안전한 결제',
    icon: Smartphone,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50'
  },
  {
    id: 'bank',
    name: '계좌이체',
    description: '실시간 계좌이체',
    icon: Building2,
    color: 'text-green-600',
    bgColor: 'bg-green-50'
  }
];

export default function PaymentPage({ params }: PaymentPageProps) {
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState('card');
  const [reservationData, setReservationData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaying, setIsPaying] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get('auth-token');
        if (!token) throw new Error('로그인이 필요합니다.');
        let cleanToken = token.replace(/^Bearer\s+/i, '').replace(/\s+/g, '');
        const reservationResponse = await fetch(`https://api.antmen.site:9091/api/v1/customer/reservations/${params.reservationId}`, {
          headers: { 'Authorization': `Bearer ${cleanToken}` }
        });
        if (!reservationResponse.ok) throw new Error('예약 정보를 불러오는데 실패했습니다.');
        const reservationData = await reservationResponse.json();
        setReservationData(reservationData);
      } catch (error) {
        setError(error instanceof Error ? error.message : '데이터를 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [params.reservationId]);

  const handlePayment = async () => {
    setIsPaying(true);
    setMessage(null);
    try {
      const token = Cookies.get('auth-token');
      if (!token) throw new Error('로그인이 필요합니다.');
      let cleanToken = token.replace(/^Bearer\s+/i, '').replace(/\s+/g, '');
      // 결제 요청
      await requestPayment({
        reservationId: Number(params.reservationId),
        payMethod: selectedMethod.toUpperCase(),
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
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2">오류가 발생했습니다</h2>
            <p className="text-slate-500 mb-6">{error}</p>
            <button onClick={() => router.push('/')} className="w-full h-14 rounded-2xl font-semibold text-white text-lg bg-primary">홈으로 이동</button>
          </div>
        </div>
      </div>
    );
  }

  // 예약 정보가 없으면 렌더링 X
  if (!reservationData) return null;

  // 금액 포맷 함수
  const formatCurrency = (amount: number) => `₩${amount?.toLocaleString()}`;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[375px] mx-auto min-h-screen bg-white flex flex-col">
        {/* 헤더 */}
        <header className="bg-white px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="flex items-center justify-center w-6 h-6" aria-label="뒤로가기">
              <ChevronLeft className="w-6 h-6 text-black" />
            </button>
            <h1 className="text-xl font-bold text-black">결제하기</h1>
          </div>
        </header>

        {/* 주문 요약 */}
        <div className="flex-1 divide-y divide-gray-100">
          <div className="bg-white px-5 py-6">
            <h2 className="text-lg font-bold text-black mb-4">주문 요약</h2>
            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">예약 번호</span>
                <span className="text-sm font-medium text-black">{reservationData.reservationId || params.reservationId}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">일시</span>
                <span className="text-sm font-medium text-black">{reservationData.reservationDateTime || '-'}</span>
              </div>
              <div className="w-full h-px bg-gray-200 my-3"></div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">결제 금액</span>
                <span className="text-sm font-medium text-black">{formatCurrency(reservationData.reservationAmount)}</span>
              </div>
            </div>
          </div>

          {/* 결제 수단 선택 */}
          <div className="bg-white px-5 py-6">
            <h2 className="text-lg font-bold text-black mb-4">결제 수단</h2>
            <div className="space-y-3">
              {paymentMethods.map((method) => {
                const Icon = method.icon;
                const isSelected = selectedMethod === method.id;
                return (
                  <button
                    key={method.id}
                    onClick={() => setSelectedMethod(method.id)}
                    className={`w-full flex items-center justify-between p-4 border rounded-xl transition-colors ${isSelected ? 'border-[#4abed9] bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${method.bgColor}`}>
                        <Icon className={`w-5 h-5 ${method.color}`} />
                      </div>
                      <div className="text-left">
                        <h3 className="text-sm font-semibold text-black">{method.name}</h3>
                        <p className="text-xs text-gray-500">{method.description}</p>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="w-5 h-5 bg-[#4abed9] rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 결제 버튼 */}
        <div className="bg-white border-t border-gray-100 px-5 py-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-base font-medium text-gray-600">결제할 금액</span>
              <span className="text-xl font-bold text-black">{formatCurrency(reservationData.reservationAmount)}</span>
            </div>
            <button
              onClick={handlePayment}
              disabled={isPaying}
              className="w-full h-14 bg-[#4abed9] rounded-xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPaying ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-base font-bold text-white">결제 처리 중...</span>
                </div>
              ) : (
                <span className="text-base font-bold text-white">
                  {formatCurrency(reservationData.reservationAmount)} 결제하기
                </span>
              )}
            </button>
            <p className="text-xs text-gray-500 text-center leading-relaxed">
              결제 시 <span className="font-medium">이용약관</span> 및 <span className="font-medium">개인정보처리방침</span>에 동의한 것으로 간주됩니다.
            </p>
            {message && (
              <div className="text-center text-base text-primary font-semibold py-2">{message}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 