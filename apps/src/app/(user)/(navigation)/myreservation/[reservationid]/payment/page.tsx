// 예약 상세 -> 결제 페이지 이동
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, CreditCard, Smartphone, Building2, Check } from 'lucide-react';

interface PaymentPageProps {
  params: {
    id: string;
  };
}

// 결제 수단 타입
type PaymentMethod = 'card' | 'kakao' | 'bank';

// 결제 정보 타입
interface PaymentInfo {
  reservationId: string;
  dateTime: string;
  baseAmount: number;
  discount: number;
  totalAmount: number;
}

// 헤더 컴포넌트
const PaymentHeader = () => {
  const router = useRouter();

  return (
    <header className="bg-white px-5 py-4 border-b border-gray-100">
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="flex items-center justify-center w-6 h-6"
          aria-label="뒤로가기"
        >
          <ChevronLeft className="w-6 h-6 text-black" />
        </button>
        
        <h1 className="text-xl font-bold text-black">결제하기</h1>
      </div>
    </header>
  );
};

// 주문 요약 섹션
const OrderSummarySection = ({ paymentInfo }: { paymentInfo: PaymentInfo }) => {
  const formatCurrency = (amount: number) => {
    return `₩${amount.toLocaleString()}`;
  };

  return (
    <div className="bg-white px-5 py-6">
      <h2 className="text-lg font-bold text-black mb-4">주문 요약</h2>
      
      <div className="bg-gray-50 rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">서비스</span>
          {/* <span className="text-sm font-medium text-black">{paymentInfo.serviceType}</span> */}
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">일시</span>
          <span className="text-sm font-medium text-black">{paymentInfo.dateTime}</span>
        </div>
        
        <div className="w-full h-px bg-gray-200 my-3"></div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">기본 요금</span>
          <span className="text-sm font-medium text-black">{formatCurrency(paymentInfo.baseAmount)}</span>
        </div>
        
        {paymentInfo.discount > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">할인</span>
            <span className="text-sm font-medium text-red-500">-{formatCurrency(paymentInfo.discount)}</span>
          </div>
        )}
        
        <div className="w-full h-px bg-gray-200 my-3"></div>
        
        <div className="flex items-center justify-between">
          <span className="text-base font-bold text-black">총 결제 금액</span>
          <span className="text-lg font-bold text-[#4abed9]">{formatCurrency(paymentInfo.totalAmount)}</span>
        </div>
      </div>
    </div>
  );
};

// 결제 수단 선택 섹션
const PaymentMethodSection = ({ 
  selectedMethod, 
  onMethodChange 
}: { 
  selectedMethod: PaymentMethod;
  onMethodChange: (method: PaymentMethod) => void;
}) => {
  const paymentMethods = [
    {
      id: 'card' as PaymentMethod,
      name: '신용카드/체크카드',
      description: '모든 카드사 이용 가능',
      icon: CreditCard,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      id: 'kakao' as PaymentMethod,
      name: '카카오페이',
      description: '간편하고 안전한 결제',
      icon: Smartphone,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      id: 'bank' as PaymentMethod,
      name: '계좌이체',
      description: '실시간 계좌이체',
      icon: Building2,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    }
  ];

  return (
    <div className="bg-white px-5 py-6">
      <h2 className="text-lg font-bold text-black mb-4">결제 수단</h2>
      
      <div className="space-y-3">
        {paymentMethods.map((method) => {
          const Icon = method.icon;
          const isSelected = selectedMethod === method.id;
          
          return (
            <button
              key={method.id}
              onClick={() => onMethodChange(method.id)}
              className={`w-full flex items-center justify-between p-4 border rounded-xl transition-colors ${
                isSelected 
                  ? 'border-[#4abed9] bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
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
  );
};

// 결제 버튼 섹션
const PaymentButtonSection = ({ 
  paymentInfo, 
  selectedMethod, 
  onPayment 
}: { 
  paymentInfo: PaymentInfo;
  selectedMethod: PaymentMethod;
  onPayment: () => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const formatCurrency = (amount: number) => {
    return `₩${amount.toLocaleString()}`;
  };

  const handlePayment = async () => {
    setIsLoading(true);
    
    try {
      // TODO: 실제 결제 API 호출
      console.log('Payment processing:', {
        reservationId: paymentInfo.reservationId,
        method: selectedMethod,
        amount: paymentInfo.totalAmount
      });
      
      // 결제 처리 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      onPayment();
    } catch (error) {
      console.error('Payment failed:', error);
      alert('결제 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white border-t border-gray-100 px-5 py-6">
      <div className="space-y-4">
        {/* 결제 금액 요약 */}
        <div className="flex items-center justify-between">
          <span className="text-base font-medium text-gray-600">결제할 금액</span>
          <span className="text-xl font-bold text-black">{formatCurrency(paymentInfo.totalAmount)}</span>
        </div>
        
        {/* 결제 버튼 */}
        <button
          onClick={handlePayment}
          disabled={isLoading}
          className="w-full h-14 bg-[#4abed9] rounded-xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span className="text-base font-bold text-white">결제 처리 중...</span>
            </div>
          ) : (
            <span className="text-base font-bold text-white">
              {formatCurrency(paymentInfo.totalAmount)} 결제하기
            </span>
          )}
        </button>
        
        {/* 결제 안내 */}
        <p className="text-xs text-gray-500 text-center leading-relaxed">
          결제 시 <span className="font-medium">이용약관</span> 및 <span className="font-medium">개인정보처리방침</span>에 동의한 것으로 간주됩니다.
        </p>
      </div>
    </div>
  );
};

// 임시 결제 정보 데이터
const mockPaymentInfo: PaymentInfo = {
  reservationId: 'CL-20230510-1234',
  // serviceType: '정기 청소 (주 1회)',
  dateTime: '2023년 5월 15일 · 오전 10:00',
  baseAmount: 60000,
  discount: 6000,
  totalAmount: 54000
};

export default function PaymentPage({ params }: PaymentPageProps) {
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('card');
  const [paymentInfo] = useState<PaymentInfo>(mockPaymentInfo);

  const handlePaymentSuccess = () => {
    console.log('Payment successful for reservation:', params.id);
    
    // 결제 완료 후 예약 상세 페이지로 이동
    router.push(`/myreservation/${params.id}?payment=success`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[375px] mx-auto min-h-screen bg-white flex flex-col">
        <PaymentHeader />
        
        <div className="flex-1 divide-y divide-gray-100">
          <OrderSummarySection paymentInfo={paymentInfo} />
          <PaymentMethodSection 
            selectedMethod={selectedMethod}
            onMethodChange={setSelectedMethod}
          />
        </div>
        
        <PaymentButtonSection 
          paymentInfo={paymentInfo}
          selectedMethod={selectedMethod}
          onPayment={handlePaymentSuccess}
        />
      </div>
    </div>
  );
} 