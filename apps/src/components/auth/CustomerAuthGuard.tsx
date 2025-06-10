'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface CustomerAuthGuardProps {
  children: React.ReactNode;
}

export const CustomerAuthGuard = ({ children }: CustomerAuthGuardProps) => {
  const router = useRouter();

  useEffect(() => {
    // localStorage에서 사용자 정보 확인
    const userInfo = localStorage.getItem('userInfo');
    
    if (!userInfo) {
      alert('로그인이 필요한 서비스입니다.');
      router.push('/login');
      return;
    }

    const user = JSON.parse(userInfo);
    
    if (user.role !== 'CUSTOMER') {
      alert('잘못된 접근입니다.');
      if (user.role === 'MANAGER') {
        router.push('/manager');
      } else {
        router.push('/');
      }
      return;
    }

    // customerId를 예약 정보에 추가
    const pendingReservation = localStorage.getItem('pendingReservation');
    if (pendingReservation) {
      const reservationData = JSON.parse(pendingReservation);
      if (!reservationData.customerId) {
        reservationData.customerId = user.id;
        localStorage.setItem('pendingReservation', JSON.stringify(reservationData));
      }
    }
  }, [router]);

  return <>{children}</>;
}; 