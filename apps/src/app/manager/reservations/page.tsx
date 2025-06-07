/**
 * 매니저 예약 내역 페이지
 * 
 * 평소(scheduled): "Check-in" 버튼 표시
 * 작업 시작 후(in-progress): "Check-out" 버튼 표시
 * 작업 완료 후(completed-pending-review): 보라색 "후기 작성" 버튼
 * 후기 작성 완료(completed): 회색 비활성화 "완료됨" 버튼
 * 
 * TODO
 * 1. 예약 상세보기 페이지 추가
 * 2. 피그마 매칭 요청 검토 페이지 사용 여부 결정
 */
"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { ReservationCard } from '@/entities/reservation/ui/ReservationCard';
import { ReviewModal } from '@/shared/ui/modal/ReviewModal';
import type { ManagerReservation, ReservationTab } from '@/entities/reservation/model/types';

// 매니저용 임시 데이터 - 다양한 상태 포함
const MOCK_MANAGER_RESERVATIONS: ManagerReservation[] = [
  {
    id: '1',
    serviceType: '정기 청소',
    location: '서울시 강남구 논현동',
    status: 'scheduled',
    dateTime: '2024년 3월 15일 · 오전 10:00',
    customer: {
      id: '1',
      name: '김수요',
    },
    amount: 54000,
  },
  {
    id: '2',
    serviceType: '이사 청소',
    location: '서울시 서초구 서초동',
    status: 'in-progress',
    dateTime: '2024년 3월 22일 · 오후 2:00',
    customer: {
      id: '2',
      name: '이고객',
    },
    amount: 120000,
    checkinTime: '2024-03-22T14:00:00',
  },
  {
    id: '3',
    serviceType: '정기 청소',
    location: '서울시 강남구 역삼동',
    status: 'completed',
    dateTime: '2024년 3월 8일 · 오전 9:00',
    customer: {
      id: '3',
      name: '박손님',
    },
    amount: 54000,
    checkinTime: '2024-03-08T09:00:00',
    checkoutTime: '2024-03-08T12:00:00',
    review: {
      rating: 5,
      content: '매우 친절하고 꼼꼼하게 청소해주셨습니다!',
      createdAt: '2024-03-08T12:30:00',
    },
  },
  {
    id: '4',
    serviceType: '입주 청소',
    location: '서울시 마포구 합정동',
    status: 'scheduled',
    dateTime: '2024년 3월 25일 · 오전 11:00',
    customer: {
      id: '4',
      name: '최고객',
    },
    amount: 80000,
  },
];

export default function ManagerReservationsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<ReservationTab>('upcoming');
  const [reservations, setReservations] = useState<ManagerReservation[]>(MOCK_MANAGER_RESERVATIONS);
  const [reviewModal, setReviewModal] = useState<{
    isOpen: boolean;
    reservationId: string;
    customerName: string;
  }>({
    isOpen: false,
    reservationId: '',
    customerName: '',
  });

  // URL 파라미터에서 취소된 예약 ID 확인
  useEffect(() => {
    const cancelledId = searchParams?.get('cancelled');
    if (cancelledId) {
      setReservations(prev => 
        prev.map(reservation => 
          reservation.id === cancelledId 
            ? { ...reservation, status: 'cancelled' as const }
            : reservation
        )
      );
      // URL 파라미터 제거 (히스토리를 깔끔하게 유지)
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }
  }, [searchParams]);

  const handleCheckIn = (id: string) => {
    console.log('Check-in for reservation:', id);
    setReservations(prev => 
      prev.map(reservation => 
        reservation.id === id 
          ? { 
              ...reservation, 
              status: 'in-progress' as const,
              checkinTime: new Date().toISOString()
            }
          : reservation
      )
    );
  };

  const handleCheckOut = (id: string) => {
    console.log('Check-out for reservation:', id);
    
    // 해당 예약 정보 찾기
    const reservation = reservations.find(r => r.id === id);
    if (!reservation) return;

    // 예약 상태를 completed-pending-review로 변경
    setReservations(prev => 
      prev.map(r => 
        r.id === id 
          ? { 
              ...r, 
              status: 'completed-pending-review' as const,
              checkoutTime: new Date().toISOString()
            }
          : r
      )
    );

    // 후기 모달 열기
    setReviewModal({
      isOpen: true,
      reservationId: id,
      customerName: reservation.customer.name,
    });
  };

  const handleWriteReview = (id: string) => {
    const reservation = reservations.find(r => r.id === id);
    if (!reservation) return;

    setReviewModal({
      isOpen: true,
      reservationId: id,
      customerName: reservation.customer.name,
    });
  };

  const handleReviewSubmit = (rating: number, content: string) => {
    const reviewData = {
      rating,
      content,
      createdAt: new Date().toISOString(),
    };

    // 후기 데이터 저장 및 상태를 completed로 변경
    setReservations(prev => 
      prev.map(reservation => 
        reservation.id === reviewModal.reservationId 
          ? { 
              ...reservation, 
              status: 'completed' as const,
              review: reviewData
            }
          : reservation
      )
    );

    // 모달 닫기
    setReviewModal({
      isOpen: false,
      reservationId: '',
      customerName: '',
    });

    alert('후기가 성공적으로 등록되었습니다!');
  };

  const handleReviewModalClose = () => {
    // 후기를 작성하지 않고 모달을 닫았을 때
    setReviewModal({
      isOpen: false,
      reservationId: '',
      customerName: '',
    });
  };

  const handleCancel = (id: string) => {
    // 매니저의 경우 예약 취소가 아닌 업무 포기/변경 요청
    console.log('업무 포기/변경 요청:', id);
    // TODO: 매니저용 취소/변경 로직 구현
  };

  const handleViewDetails = (id: string) => {
    router.push(`/manager/reservations/${id}`); // 매니저용 예약 상세 페이지 경로
  };

  const handleNewWork = () => {
    // 새로운 업무 찾기 또는 매칭 요청
    router.push('/manager/matching'); 
  };

  const filteredReservations = reservations.filter((reservation) =>
    activeTab === 'upcoming' 
      ? reservation.status === 'scheduled' || reservation.status === 'in-progress'
      : reservation.status === 'completed' || reservation.status === 'completed-pending-review' || reservation.status === 'cancelled'
  );

  return (
    <main className="flex min-h-screen flex-col bg-white">
      {/* Header */}
      <header className="flex items-center justify-between p-5">
        <button onClick={() => router.back()} className="flex h-6 w-6 items-center justify-center">
          <Image src="/icons/arrow-left.svg" alt="뒤로가기" width={24} height={24} />
        </button>
        <h1 className="flex-1 text-center text-2xl font-bold">업무 내역</h1>
        <div className="h-6 w-6" /> {/* Spacer for alignment */}
      </header>

      {/* Tab Section */}
      <div className="flex flex-col gap-4 px-5">
        <div className="flex gap-10">
          <button
            onClick={() => setActiveTab('upcoming')}
            className="flex flex-col items-center gap-2"
          >
            <span
              className={`text-base ${
                activeTab === 'upcoming' ? 'font-extrabold text-[#4DD0E1]' : 'font-medium text-[#B0BEC5]'
              }`}
            >
              예정된 업무
            </span>
            {activeTab === 'upcoming' && (
              <div className="h-0.5 w-full bg-[#4DD0E1]" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className="flex flex-col items-center gap-2"
          >
            <span
              className={`text-base ${
                activeTab === 'past' ? 'font-extrabold text-[#4DD0E1]' : 'font-medium text-[#B0BEC5]'
              }`}
            >
              완료한 업무
            </span>
            {activeTab === 'past' && (
              <div className="h-0.5 w-full bg-[#4DD0E1]" />
            )}
          </button>
        </div>
      </div>

      {/* Reservation List or Empty State */}
      <div className="flex flex-1 flex-col gap-6 p-5">
        {filteredReservations.length > 0 ? (
          filteredReservations.map((reservation) => (
            <ReservationCard
              key={reservation.id}
              reservation={reservation}
              onCancel={handleCancel}
              onViewDetails={handleViewDetails}
              onCheckIn={handleCheckIn}
              onCheckOut={handleCheckOut}
              onWriteReview={handleWriteReview}
              isManager={true} // 매니저 모드 표시
            />
          ))
        ) : (
          <div className="flex h-[500px] flex-col items-center justify-center gap-6 p-6">
            <div className="relative h-[120px] w-[120px]">
              <div className="absolute left-[10px] top-[10px] h-[100px] w-[100px] bg-[#BBBBBB]" />
              <div className="absolute left-[60px] top-[40px] h-[20px] w-[20px] rounded-full border-[6px] border-[#BBBBBB]" />
            </div>
            <div className="flex flex-col items-center gap-3">
              <h2 className="text-xl font-bold text-[#222222]">
                {activeTab === 'upcoming' ? '예정된 업무가 없습니다' : '완료한 업무가 없습니다'}
              </h2>
              <p className="text-center text-base text-[#AAAAAA]">
                {activeTab === 'upcoming' 
                  ? '아직 배정된 청소 업무가 없습니다.\n새로운 업무를 찾아보세요.'
                  : '아직 완료한 업무가 없습니다.\n첫 업무를 시작해보세요.'
                }
              </p>
            </div>
            {activeTab === 'upcoming' && (
              <button
                onClick={handleNewWork}
                className="mt-3 w-[280px] rounded-xl bg-[#4DD0E1] py-4 text-base font-bold text-white hover:bg-[#26C6DA] transition-colors"
              >
                새로운 업무 찾기
              </button>
            )}
          </div>
        )}
      </div>

      {/* 후기 모달 */}
      <ReviewModal
        isOpen={reviewModal.isOpen}
        onClose={handleReviewModalClose}
        onSubmit={handleReviewSubmit}
        customerName={reviewModal.customerName}
      />
    </main>
  );
} 