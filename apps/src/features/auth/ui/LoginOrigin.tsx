// components/LoginOrigin.tsx

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from "js-cookie";
import { useAuthStore } from '@/shared/stores/authStore';
import { jwtDecode } from "jwt-decode";
import { authApi } from '@/shared/api/auth';
import { ApiError } from '@/shared/api/base';

type UserRole = 'CUSTOMER' | 'MANAGER' | 'ADMIN';

interface LoginFormData {
    userLoginId: string;
    userPassword: string;
}

interface LoginResponse {
    success: boolean;
    token?: string;
    message?: string;
}

interface JwtPayload {
    sub: string;        // userId (JWT 표준은 'sub'를 subject/id로 사용)
    userRole: string;   // CUSTOMER | MANAGER | ADMIN
    exp: number;        // 만료 시간
    iat: number;        // 발급 시간
}

// 역할 값이 유효한지 검증하는 타입 가드
function isValidUserRole(role: string): role is UserRole {
    return ['CUSTOMER', 'MANAGER', 'ADMIN'].includes(role);
}

export function useLoginOrigin() {
    const [isLoading, setIsLoading] = useState(false);
    const [loginError, setLoginError] = useState<string | null>(null);
    const router = useRouter();
    const { login: loginToStore } = useAuthStore();

    const login = async (data: LoginFormData) => {
        console.log('Login attempt with:', data);

        // 이전 에러 메시지 초기화
        setLoginError(null);

        try {
            setIsLoading(true);

            const result = await authApi.login({
                userLoginId: data.userLoginId,
                userPassword: data.userPassword
            });

            console.log('서버 응답:', result);
            
            // JWT 토큰 디코딩
            const decodedToken = jwtDecode<JwtPayload>(result.accessToken);
            console.log('✅ 토큰 디코딩 결과:', decodedToken);

            // userRole 검증
            if (!isValidUserRole(decodedToken.userRole)) {
                throw new Error('토큰에 포함된 사용자 역할이 유효하지 않습니다.');
            }

            // JWT에서 추출한 정보로 Zustand 스토어에 저장할 사용자 객체 구성
            const user = {
                userId: parseInt(decodedToken.sub),
                userRole: decodedToken.userRole
            };

            // Zustand 스토어에 로그인 정보 저장
            loginToStore(user, result.accessToken);
            console.log('💾 authStore 저장 완료');
            
            // 쿠키에 토큰 저장 (7일 만료)
            Cookies.set('auth-token', result.accessToken, {
                expires: 7,
                secure: false,
                sameSite: 'strict',
                path: '/'
            });
            console.log('🍪 쿠키 저장 완료');

            Cookies.set('auth-time', new Date().toISOString(), {
                expires: 7,
                secure: false,
                sameSite: 'strict',
                path: '/'
            });

            // userRole에 따라 리다이렉트 경로 설정
            const redirectPath = user.userRole === 'MANAGER' ? '/manager' : '/';
            console.log(`🏠 ${user.userRole} 권한으로 ${redirectPath}로 이동`);
            router.push(redirectPath);

        } catch (error) {
            console.error('Login error:', error);
            if (error instanceof ApiError) {
                setLoginError(error.message);
            } else if (error instanceof Error) {
                setLoginError(error.message);
            } else {
                setLoginError('로그인에 실패했습니다.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const formatTokenForServer = (token: string): string => {
        // 기존 "Bearer " 접두사 제거 (공백 포함/미포함 모두 처리)
        const cleanToken = token.replace(/^Bearer\s*/i, '');
        // "Bearer " (공백 포함) + 토큰 형태로 반환
        return `Bearer ${cleanToken}`;
    };

    return {
        login,
        isLoading,
        loginError,
        setLoginError
    };
}