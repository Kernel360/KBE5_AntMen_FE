"use client";

import { BellIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { checkCustomerAuth } from '@/features/auth/lib/auth';

export function HomeHeader() {
  const router = useRouter();
  const { data: session } = useSession();

  const handleReservationClick = () => {
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

    // 인증 통과 시 예약 페이지로 이동
    router.push('/reservation');
  };

  const handleNotificationClick = () => {
    router.push('/notifications');
  };

  return (
    <div className="bg-[#0fbcd6] p-4 pb-6">
      <div className="flex justify-end mb-6">
        <button 
          className="relative"
          onClick={handleNotificationClick}
          aria-label="알림 보기"
        >
          <BellIcon className="w-6 h-6 text-white" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[10px] text-white font-bold">
            1
          </span>
        </button>
      </div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1 text-white">집청소로 달라지는 일상</h1>
        <p className="text-base text-white">바쁜 일상에서 손쉽게 맡겨보세요</p>
      </div>
      <button
        onClick={handleReservationClick}
        className="w-full h-14 bg-white rounded-xl flex items-center justify-center gap-2 mb-6"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          className="stroke-2"
        >
          <path d="M2.5 4.16667H17.5V17.3333H2.5V4.16667Z" />
          <path d="M2.5 8.33333H17.5" />
          <path d="M6.66675 2.5V5.83333" />
          <path d="M13.3333 2.5V5.83333" />
        </svg>
        <span className="font-semibold">예약하기</span>
      </button>
    </div>
  );
} 