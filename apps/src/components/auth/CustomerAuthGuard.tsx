'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

interface CustomerAuthGuardProps {
  children: React.ReactNode;
}

interface JwtPayload {
  userRole?: string;
  // 필요한 경우 id 등 추가
}

function getCookie(name: string) {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()!.split(';').shift()!;
  return null;
}

export const CustomerAuthGuard = ({ children }: CustomerAuthGuardProps) => {
  const router = useRouter();
  const alerted = useRef(false);

  useEffect(() => {
    const tokenWithBearer = getCookie('auth-token');
    // "Bearer ..." 접두사 제거
    const token = tokenWithBearer?.replace(/^Bearer\s/, '');

    if (!token && !alerted.current) {
      alerted.current = true;
      alert('로그인이 필요한 서비스입니다.');
      router.push('/login');
      return;
    }

    // JWT 디코딩하여 role 확인
    try {
      if (typeof token === 'string') {
        const decoded = jwtDecode<JwtPayload>(token);
        if (decoded.userRole !== 'CUSTOMER' && !alerted.current) {
          alerted.current = true;
          alert('로그인이 필요한 서비스입니다.');
          router.push('/login');
          return;
        }
      } else {
        throw new Error('토큰이 올바르지 않습니다.');
      }
    } catch (e) {
      if (!alerted.current) {
        alerted.current = true;
        alert('로그인이 필요한 서비스입니다.');
        router.push('/login');
      }
      return;
    }
  }, [router]);

  return <>{children}</>;
}; 