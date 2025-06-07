// 내 예약 -> 예약 상세 페이지

/** 
 * TODO: 예약 상세 페이지 디자인 수정 필요
 * 
 * 1. 결제하면 결제 컴포넌트 불러오기 ✅
 * 2. 예약 취소 버튼 누르면 예약 취소 모달 띄우기 RejectReservationModal ✅
 * 3. 결제 페이지 이동 필요 ✅
 * 4. 예약 리스트 예약 상태 수정
 * 5. 매니저 리스트 추가 필요
 * 6. 환불 기능 구현 ✅
 * 7. 모달 컴포넌트 분리 ✅
 **/ 

"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, Star, CreditCard } from 'lucide-react';
import { CancellationModal, RefundModal, ReservationActionModal } from '@/shared/ui/modal';

interface ReservationDetailPageProps {
  params: {
    id: string;
  };
}

// 타입 정의
interface Worker {
  id: string;
  name: string;
  rating: number;
  experience: string;
  age: number;
  gender: string;
  avatar: string;
  phone: string;
}

interface ReservationDetail {
  id: string;
  reservationNumber: string;
  serviceType: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'refunded'; // 결제 상태 추가
  dateTime: string;
  duration: string;
  location: string;
  detailedAddress: string;
  worker: Worker;
  amount: number;
  baseAmount: number;
  discount: number;
  paymentMethod?: string; // 결제 전에는 없을 수 있음
  options: Array<{
    name: string;
    price: number;
  }>;
  createdAt: string;
}

// 헤더 컴포넌트
const ReservationHeader = () => {
  const router = useRouter();

  return (
    <header className="bg-white px-5 py-4">
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="flex items-center justify-center w-6 h-6"
          aria-label="뒤로가기"
        >
          <ChevronLeft className="w-6 h-6 text-black" />
        </button>
        
        <h1 className="text-2xl font-bold text-black">예약 상세</h1>
      </div>
    </header>
  );
};

// 예약 상태 섹션
const ReservationStatusSection = ({ reservation }: { reservation: ReservationDetail }) => {
  const getStatusInfo = (status: string, paymentStatus: string) => {
    if (paymentStatus === 'refunded') {
      return { text: '환불 완료', bgColor: 'bg-gray-50', textColor: 'text-gray-600' };
    }
    
    if (paymentStatus === 'pending') {
      return { text: '결제 대기', bgColor: 'bg-orange-50', textColor: 'text-orange-600' };
    }
    
    switch (status) {
      case 'scheduled':
        return { text: '예정됨', bgColor: 'bg-blue-50', textColor: 'text-blue-600' };
      case 'completed':
        return { text: '완료', bgColor: 'bg-green-50', textColor: 'text-green-600' };
      case 'cancelled':
        return { text: '취소', bgColor: 'bg-gray-50', textColor: 'text-gray-600' };
      default:
        return { text: '확인 중', bgColor: 'bg-yellow-50', textColor: 'text-yellow-600' };
    }
  };

  const statusInfo = getStatusInfo(reservation.status, reservation.paymentStatus);

  return (
    <div className="bg-white px-5 py-6">
      {/* 상태 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-black">예약 상태</h2>
        <div className={`inline-flex items-center px-3 py-1.5 rounded-xl ${statusInfo.bgColor}`}>
          <span className={`text-xs font-medium ${statusInfo.textColor}`}>
            {statusInfo.text}
          </span>
        </div>
      </div>
      
      {/* 예약 정보 */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">예약 번호</span>
          <span className="text-sm font-medium text-black">{reservation.reservationNumber}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">예약일</span>
          <span className="text-sm font-medium text-black">{new Date(reservation.createdAt).toLocaleDateString('ko-KR')}</span>
        </div>

        {/* 환불 완료 시 환불 정보 추가 표시 */}
        {reservation.paymentStatus === 'refunded' && (
          <>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">취소일</span>
              <span className="text-sm font-medium text-black">{new Date().toLocaleDateString('ko-KR')}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">환불 금액</span>
              <span className="text-sm font-medium text-red-600">₩{reservation.amount.toLocaleString()}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// 서비스 정보 섹션
const ServiceInfoSection = ({ reservation }: { reservation: ReservationDetail }) => {
  return (
    <div className="bg-white px-5 py-6">
      <h2 className="text-lg font-bold text-black mb-6">서비스 정보</h2>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">서비스 유형</span>
          <span className="text-sm font-medium text-black">{reservation.serviceType}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">날짜 및 시간</span>
          <span className="text-sm font-medium text-black">{reservation.dateTime}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">소요 시간</span>
          <span className="text-sm font-medium text-black">{reservation.duration}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">주소</span>
          <span className="text-sm font-medium text-black text-right max-w-[200px]">{reservation.detailedAddress}</span>
        </div>
      </div>
    </div>
  );
};

// 매칭 매니저 정보 섹션
const CleanerInfoSection = ({ worker }: { worker: Worker }) => {
  return (
    <div className="bg-white px-5 py-6">
      <h2 className="text-lg font-bold text-black mb-6">매칭 매니저</h2>
      
      <div className="flex items-start gap-4">
        {/* 프로필 이미지 */}
        <div className="w-15 h-15 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-base font-black text-white">{worker.avatar}</span>
        </div>
        
        {/* 매니저 정보 */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-lg font-black text-black">{worker.name}</h3>
            <div className="flex items-center gap-1">
              <span className="text-sm font-medium text-black">{worker.rating}</span>
              <Star className="w-4 h-4 text-orange-500 fill-orange-500" />
            </div>
          </div>
          
          <p className="text-sm text-gray-600">
            {worker.experience}
          </p>
        </div>
      </div>
    </div>
  );
};

// 결제 예정 금액 섹션 (결제 전)
const PaymentPreviewSection = ({ reservation }: { reservation: ReservationDetail }) => {
  const formatCurrency = (amount: number) => {
    return `₩${amount.toLocaleString()}`;
  };

  return (
    <div className="bg-white px-5 py-6">
      <h2 className="text-lg font-bold text-black mb-6">결제 예정 금액</h2>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">기본 요금 ({reservation.duration})</span>
          <span className="text-sm font-medium text-black">{formatCurrency(reservation.baseAmount)}</span>
        </div>
        
        {reservation.discount > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">정기 할인</span>
            <span className="text-sm font-medium text-orange-500">-{formatCurrency(reservation.discount)}</span>
          </div>
        )}
        
        <div className="flex items-center justify-between py-2 border-t border-gray-100">
          <span className="text-base font-black text-black">총 결제 금액</span>
          <span className="text-base font-bold text-[#4abed9]">{formatCurrency(reservation.amount)}</span>
        </div>
      </div>
    </div>
  );
};

// 결제 정보 섹션 (결제 후)
const PaymentInfoSection = ({ reservation }: { reservation: ReservationDetail }) => {
  const formatCurrency = (amount: number) => {
    return `₩${amount.toLocaleString()}`;
  };

  return (
    <div className="bg-white px-5 py-6">
      <h2 className="text-lg font-bold text-black mb-6">결제 정보</h2>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">기본 요금 ({reservation.duration})</span>
          <span className="text-sm font-medium text-black">{formatCurrency(reservation.baseAmount)}</span>
        </div>
        
        {reservation.discount > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">정기 할인</span>
            <span className="text-sm font-medium text-orange-500">-{formatCurrency(reservation.discount)}</span>
          </div>
        )}
        
        <div className="flex items-center justify-between py-2 border-t border-gray-100">
          <span className="text-base font-black text-black">총 결제 금액</span>
          <span className="text-base font-bold text-black">{formatCurrency(reservation.amount)}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">결제 수단</span>
          <span className="text-sm font-medium text-black">{reservation.paymentMethod}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">결제 완료일</span>
          <span className="text-sm font-medium text-black">{new Date().toLocaleDateString('ko-KR')}</span>
        </div>
      </div>
    </div>
  );
};

// 액션 버튼 섹션 (수정)
const ActionButtonsSection = ({ reservation, onCancel, onPayment, onRefund, reservationId }: { 
  reservation: ReservationDetail; 
  onCancel: (reason: string) => void;
  onPayment: () => void;
  onRefund: (reason: string) => void;
  reservationId: string;
}) => {
  const router = useRouter();
  const [showActionModal, setShowActionModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);

  const handleContactWorker = () => {
    console.log('Contact worker:', reservation.worker.id);
  };

  const handleActionConfirm = (option: 'cancel' | 'reschedule') => {
    console.log('Action option selected:', option);
    
    if (option === 'cancel') {
      setShowActionModal(false);
      
      // 결제 완료 상태면 환불 모달, 아니면 취소 사유 모달
      if (reservation.paymentStatus === 'paid') {
        setShowRefundModal(true);
      } else {
        setShowCancelModal(true);
      }
    } else if (option === 'reschedule') {
      // 일정 변경 로직 - 재매칭 페이지로 이동 (예약 ID 포함)
      console.log('Reschedule reservation with ID:', reservationId);
      setShowActionModal(false);
      router.push(`/reservation/${reservationId}/matching/managers`);
    }
  };

  const handleCancelConfirm = (reason: string) => {
    console.log('Cancel requested with reason:', reason);
    onCancel(reason);
    setShowCancelModal(false);
  };

  const handleRefundConfirm = (reason: string) => {
    console.log('Refund requested with reason:', reason);
    onRefund(reason);
    setShowRefundModal(false);
  };

  if (reservation.status === 'cancelled') {
    return null;
  }

  // 결제 전 상태
  if (reservation.paymentStatus === 'pending') {
    return (
      <>
        <div className="bg-white px-5 py-6 space-y-3">
          {/* 예약 취소 버튼 */}
          <button
            onClick={() => setShowActionModal(true)}
            className="w-full h-14 bg-white border border-gray-300 rounded-xl flex items-center justify-center"
          >
            <span className="text-base font-black text-gray-600">예약 취소</span>
          </button>
          
          {/* 결제하기 버튼 */}
          <button
            onClick={onPayment}
            className="w-full h-14 bg-[#4abed9] rounded-xl flex items-center justify-center"
          >
            <CreditCard className="w-5 h-5 text-white mr-2" />
            <span className="text-base font-black text-white">결제하기</span>
          </button>
        </div>
        
        {/* 모달 컴포넌트 */}
        <ReservationActionModal
          isOpen={showActionModal}
          onClose={() => setShowActionModal(false)}
          onConfirm={handleActionConfirm}
          isPaid={false}
        />

        <CancellationModal
          isOpen={showCancelModal}
          onClose={() => setShowCancelModal(false)}
          onConfirm={handleCancelConfirm}
        />
      </>
    );
  }

  // 환불 상태
  if (reservation.paymentStatus === 'refunded') {
    return (
      <div className="bg-white px-5 py-6">
        <div className="bg-gray-50 rounded-xl p-4 text-center">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h3 className="text-sm font-semibold text-gray-600 mb-2">환불 완료</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            예약이 취소되고 환불이 완료되었습니다.<br />
            환불 금액은 영업일 기준 3-5일 내에 입금됩니다.
          </p>
        </div>
      </div>
    );
  }

  // 결제 완료 후 상태
  return (
    <>
      <div className="bg-white px-5 py-6 space-y-3">
        {/* 예약 취소 버튼 */}
        <button
          onClick={() => setShowActionModal(true)}
          className="w-full h-14 bg-white border border-gray-300 rounded-xl flex items-center justify-center"
        >
          <span className="text-base font-black text-gray-600">예약 취소</span>
        </button>
      </div>
      
      <ReservationActionModal
        isOpen={showActionModal}
        onClose={() => setShowActionModal(false)}
        onConfirm={handleActionConfirm}
        isPaid={true}
      />

      <RefundModal
        isOpen={showRefundModal}
        onClose={() => setShowRefundModal(false)}
        onConfirm={handleRefundConfirm}
      />
    </>
  );
};

// 임시 데이터
const mockReservationDetail: ReservationDetail = {
  id: '1',
  reservationNumber: 'CL-20230510-1234',
  serviceType: '정기 청소 (주 1회)',
  status: 'scheduled',
  paymentStatus: 'pending', // 'pending' | 'paid' | 'refunded'
  dateTime: '2023년 5월 15일 · 오전 10:00',
  duration: '3시간',
  location: '서울시 강남구',
  detailedAddress: '서울특별시 강남구 테헤란로 152',
  worker: {
    id: '1',
    name: '김민준',
    rating: 4.9,
    experience: '경력 3년',
    age: 32,
    gender: '남성',
    avatar: '민준',
    phone: '010-1234-5678'
  },
  amount: 54000,
  baseAmount: 60000,
  discount: 6000,
  paymentMethod: '신한카드 (1234-56XX-XXXX-7890)', // 결제 전에는 undefined일 수 있음
  options: [],
  createdAt: '2023-05-10'
};

export default function ReservationDetailPage({ params }: ReservationDetailPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [reservation, setReservation] = useState<ReservationDetail>(mockReservationDetail);

  // 결제 성공 시 처리
  useEffect(() => {
    if (searchParams) {
      const paymentSuccess = searchParams.get('payment');
      if (paymentSuccess === 'success') {
        setReservation(prev => ({
          ...prev,
          paymentStatus: 'paid',
          paymentMethod: '신한카드 (1234-56XX-XXXX-7890)'
        }));
      }
    }
  }, [searchParams]);

  const handleCancel = (reason: string) => {
    console.log('Cancel reservation:', params.id, 'Reason:', reason);
    
    // 취소 처리 및 상태 업데이트
    setReservation(prev => ({
      ...prev,
      status: 'cancelled',
      paymentStatus: prev.paymentStatus === 'paid' ? 'refunded' : 'pending'
    }));

    // TODO: 실제 취소 API 호출
    // API를 통해 취소 사유와 함께 취소 요청을 서버에 전송
  };

  const handlePayment = () => {
    console.log('Navigate to payment page for reservation:', params.id);
    // 결제 페이지로 이동
    router.push(`/myreservation/${params.id}/payment`);
  };

  const handleRefund = (reason: string) => {
    console.log('Process refund for reservation:', params.id, 'Reason:', reason);
    
    // 환불 처리 및 상태 업데이트
    setReservation(prev => ({
      ...prev,
      status: 'cancelled',
      paymentStatus: 'refunded'
    }));

    // TODO: 실제 환불 API 호출
    // API를 통해 환불 사유와 함께 환불 요청을 서버에 전송
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[375px] mx-auto min-h-screen bg-white flex flex-col">
        <div className="sticky top-0 z-30 bg-white">
          <ReservationHeader />
        </div>
        
        <div className="flex-1 overflow-y-auto pb-[140px]">
          <div className="divide-y divide-gray-100">
            <ReservationStatusSection reservation={reservation} />
            <ServiceInfoSection reservation={reservation} />
            <CleanerInfoSection worker={reservation.worker} />
            
            {/* 결제 상태에 따라 다른 컴포넌트 표시 */}
            {reservation.paymentStatus === 'pending' ? (
              <PaymentPreviewSection reservation={reservation} />
            ) : (
              <PaymentInfoSection reservation={reservation} />
            )}
          </div>
        </div>
        
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[375px] bg-white border-t border-gray-100">
          <ActionButtonsSection 
            reservation={reservation} 
            onCancel={handleCancel}
            onPayment={handlePayment}
            onRefund={handleRefund}
            reservationId={params.id}
          />
        </div>
      </div>
    </div>
  );
} 