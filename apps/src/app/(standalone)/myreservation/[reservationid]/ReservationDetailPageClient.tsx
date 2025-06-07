'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, Star, CreditCard } from 'lucide-react';
import { CancellationModal, RefundModal, ReservationActionModal } from '@/shared/ui/modal';
import type { Reservation, Worker } from '@/entities/reservation/model/types';

interface ReservationDetailPageClientProps {
  initialReservation: Reservation | null;
}

// --- 각 섹션 컴포넌트들 (기존 page.tsx에서 분리) ---

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
const ReservationStatusSection = ({ reservation }: { reservation: Reservation }) => {
    const getStatusInfo = (status: Reservation['status'], paymentStatus: Reservation['paymentStatus']) => {
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
          case 'in-progress':
            return { text: '진행중', bgColor: 'bg-blue-50', textColor: 'text-blue-600' };
          case 'completed-pending-review':
            return { text: '후기 작성 대기', bgColor: 'bg-blue-50', textColor: 'text-blue-600' };
          default:
            return { text: '확인 중', bgColor: 'bg-yellow-50', textColor: 'text-yellow-600' };
        }
      };
    
      const statusInfo = getStatusInfo(reservation.status, reservation.paymentStatus);
    
      return (
        <div className="bg-white px-5 py-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-black">예약 상태</h2>
            <div className={`inline-flex items-center px-3 py-1.5 rounded-xl ${statusInfo.bgColor}`}>
              <span className={`text-xs font-medium ${statusInfo.textColor}`}>
                {statusInfo.text}
              </span>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">예약 번호</span>
              <span className="text-sm font-medium text-black">{reservation.reservationNumber}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">예약 신청일</span>
              <span className="text-sm font-medium text-black">{new Date(reservation.createdAt).toLocaleDateString('ko-KR')}</span>
            </div>
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
const ServiceInfoSection = ({ reservation }: { reservation: Reservation }) => {
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
            <div className="w-15 h-15 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-base font-black text-white">{worker.avatar}</span>
            </div>
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
const PaymentPreviewSection = ({ reservation }: { reservation: Reservation }) => {
    const formatCurrency = (amount: number) => `₩${amount.toLocaleString()}`;
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
const PaymentInfoSection = ({ reservation }: { reservation: Reservation }) => {
    const formatCurrency = (amount: number) => `₩${amount.toLocaleString()}`;
    return (
        <div className="bg-white px-5 py-6">
          <h2 className="text-lg font-bold text-black mb-6">결제 정보</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">결제 수단</span>
              <span className="text-sm font-medium text-black">{reservation.paymentMethod}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">총 결제 금액</span>
              <span className="text-sm font-bold text-black">{formatCurrency(reservation.amount)}</span>
            </div>
          </div>
        </div>
      );
};

// 액션 버튼 섹션
const ActionButtonsSection = ({ reservation, onCancel, onPayment, onRefund }: { 
    reservation: Reservation; 
    onCancel: (reason: string) => void;
    onPayment: () => void;
    onRefund: (reason: string) => void;
  }) => {
    const [isActionModalOpen, setIsActionModalOpen] = useState(false);
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  
    const handleContactWorker = () => alert('담당자와 상담 기능은 구현 예정입니다.');
  
    const handleActionConfirm = (option: 'cancel' | 'reschedule') => {
      setIsActionModalOpen(false);
      if (option === 'cancel') {
        setIsCancelModalOpen(true);
      } else {
        alert('예약 변경 기능은 구현 예정입니다.');
      }
    };
  
    const handleCancelConfirm = (reason: string) => {
      onCancel(reason);
      setIsCancelModalOpen(false);
    };
  
    const handleRefundConfirm = (reason: string) => {
      onRefund(reason);
      setIsRefundModalOpen(false);
    };
  
    return (
      <div className="sticky bottom-0 bg-white p-5 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
        {/* 버튼 로직 */}
        {reservation.paymentStatus === 'pending' && (
            <button onClick={onPayment} className="w-full bg-[#4abed9] text-white rounded-xl py-4 font-bold text-base">
                결제하기
            </button>
        )}
        {reservation.paymentStatus === 'paid' && reservation.status === 'scheduled' && (
            <div className="flex gap-3">
                <button onClick={() => setIsActionModalOpen(true)} className="flex-1 bg-gray-200 text-gray-800 rounded-xl py-4 font-bold text-base">
                    예약 취소/변경
                </button>
                <button onClick={handleContactWorker} className="flex-1 bg-[#4abed9] text-white rounded-xl py-4 font-bold text-base">
                    담당자와 통화
                </button>
            </div>
        )}
        {reservation.status === 'completed' && (
            <button className="w-full bg-gray-200 text-gray-500 rounded-xl py-4 font-bold text-base cursor-not-allowed">
                완료된 예약입니다
            </button>
        )}
        {reservation.paymentStatus === 'refunded' && (
             <button onClick={() => setIsRefundModalOpen(true)} className="w-full bg-gray-200 text-gray-800 rounded-xl py-4 font-bold text-base">
                환불하기
            </button>
        )}
        
        {/* 모달 */}
        <ReservationActionModal 
            isOpen={isActionModalOpen}
            onClose={() => setIsActionModalOpen(false)}
            onConfirm={handleActionConfirm}
        />
        <CancellationModal 
            isOpen={isCancelModalOpen}
            onClose={() => setIsCancelModalOpen(false)}
            onConfirm={handleCancelConfirm}
        />
        <RefundModal
            isOpen={isRefundModalOpen}
            onClose={() => setIsRefundModalOpen(false)}
            onConfirm={handleRefundConfirm}
        />
      </div>
    );
};

// --- 메인 클라이언트 컴포넌트 ---
export const ReservationDetailPageClient = ({ initialReservation }: ReservationDetailPageClientProps) => {
    const router = useRouter();
    const [reservation, setReservation] = useState<Reservation | null>(initialReservation);
  
    // 결제 성공/실패 시 URL 쿼리 파라미터를 확인하여 상태 업데이트
    const searchParams = useSearchParams();
    useEffect(() => {
      const status = searchParams.get('status');
      if (status === 'success' && reservation) {
        setReservation(prev => prev ? { ...prev, paymentStatus: 'paid', status: 'scheduled' } : null);
        alert('결제가 성공적으로 완료되었습니다.');
        // 성공 후에는 URL에서 쿼리 파라미터 제거
        router.replace(`/myreservation/${reservation.id}`);
      } else if (status === 'fail') {
        alert('결제에 실패했습니다. 다시 시도해주세요.');
        router.replace(`/myreservation/${reservation!.id}`);
      }
    }, [searchParams, reservation, router]);
  
    if (!reservation) {
      return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <ReservationHeader />
            <div className="flex-grow flex items-center justify-center">
                <p>예약 정보를 불러오지 못했습니다.</p>
            </div>
        </div>
      );
    }
  
    const handleCancel = (reason: string) => {
      console.log('Cancellation reason:', reason);
      // TODO: 실제 취소 API 호출
      setReservation(prev => prev ? { ...prev, status: 'cancelled' } : null);
      alert('예약이 취소되었습니다.');
    };
  
    const handlePayment = () => {
      router.push(`/myreservation/${reservation.id}/payment`);
    };

    const handleRefund = (reason: string) => {
        console.log('Refund reason:', reason);
        setReservation(prev => prev ? { ...prev, paymentStatus: 'refunded' } : null);
        alert('환불 요청이 처리되었습니다.');
    };
  
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <ReservationHeader />
        
        <main className="flex-grow pb-24">
          <div className="space-y-2">
            <ReservationStatusSection reservation={reservation} />
            <ServiceInfoSection reservation={reservation} />
            <CleanerInfoSection worker={reservation.worker} />
            {reservation.paymentStatus === 'pending' ? (
                <PaymentPreviewSection reservation={reservation} />
            ) : (
                <PaymentInfoSection reservation={reservation} />
            )}
          </div>
        </main>
  
        <ActionButtonsSection 
            reservation={reservation}
            onCancel={handleCancel}
            onPayment={handlePayment}
            onRefund={handleRefund}
        />
      </div>
    );
  }; 