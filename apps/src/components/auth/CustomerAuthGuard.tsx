'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSecureAuth } from '@/shared/hooks/useSecureAuth';

interface CustomerAuthGuardProps {
  children: React.ReactNode;
}

// 🛡️ useSecureAuth 사용으로 인해 더 이상 필요 없음

export const CustomerAuthGuard = ({ children }: CustomerAuthGuardProps) => {
  const router = useRouter();
  const alerted = useRef(false);
  // 🛡️ 안전한 JWT 기반 인증 사용
  const { user, isCustomer, isLoading } = useSecureAuth();

  useEffect(() => {
    if (isLoading) return; // 로딩 중에는 체크하지 않음

    // JWT 기반 권한 체크 (조작 불가능)
    if (!user || !isCustomer) {
      if (!alerted.current) {
        alerted.current = true;
        alert('고객 로그인이 필요한 서비스입니다.');
        router.push('/login');
      }
      return;
    }
  }, [user, isCustomer, isLoading, router]);

  // 로딩 중 표시
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#9CDAFB] mx-auto mb-2"></div>
          <p className="text-gray-600">인증 확인 중...</p>
        </div>
      </div>
    );
  }

  // 인증 실패 시 아무것도 렌더링하지 않음
  if (!user || !isCustomer) {
    return null;
  }

  return <>{children}</>;
}; 