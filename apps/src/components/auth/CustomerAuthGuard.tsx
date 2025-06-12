'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

interface CustomerAuthGuardProps {
  children: React.ReactNode;
}

export const CustomerAuthGuard = ({ children }: CustomerAuthGuardProps) => {
  const router = useRouter();
  const alerted = useRef(false);

  useEffect(() => {
    // 쿠키에서 JWT 토큰 확인
    const token = Cookies.get('auth-token');
    if (!token && !alerted.current) {
      alerted.current = true;
      alert('로그인이 필요한 서비스입니다.');
      router.push('/login');
      return;
    }

    let userRole = null;
    let userId = null;
    if (token) {
      try {
        // Bearer 접두사 제거
        const cleanToken = token.replace(/^Bearer\s*/i, '');
        const decoded: any = jwtDecode(cleanToken);
        userRole = decoded.userRole;
        userId = decoded.sub;
      } catch (e) {
        if (!alerted.current) {
          alerted.current = true;
          alert('로그인 정보가 올바르지 않습니다. 다시 로그인 해주세요.');
          router.push('/login');
        }
        return;
      }
    }

    if (userRole !== 'CUSTOMER' && !alerted.current) {
      alerted.current = true;
      alert('잘못된 접근입니다.');
      if (userRole === 'MANAGER') {
        router.push('/manager');
      } else {
        router.push('/');
      }
      return;
    }

    // customerId를 예약 정보에 추가 (localStorage 활용 시)
    const pendingReservation = localStorage.getItem('pendingReservation');
    if (pendingReservation && userId) {
      const reservationData = JSON.parse(pendingReservation);
      if (!reservationData.customerId) {
        reservationData.customerId = userId;
        localStorage.setItem('pendingReservation', JSON.stringify(reservationData));
      }
    }
  }, [router]);

  return <>{children}</>;
}; 