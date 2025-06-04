// components/LoginOrigin.tsx

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from "js-cookie";

interface LoginFormData {
    userLoginId: string;
    userPassword: string;
}

interface LoginResponse {
    success: boolean;
    token?: string;
    message?: string;
    user?: {
        id: string;
        name: string;
        email: string;
    };
}

export function useLoginOrigin() {
    const [isLoading, setIsLoading] = useState(false);
    const [loginError, setLoginError] = useState<string | null>(null);
    const router = useRouter();

    const login = async (data: LoginFormData) => {
        console.log('Login attempt with:', data);

        // 이전 에러 메시지 초기화
        setLoginError(null);

        try {
            setIsLoading(true);

            const response = await fetch('http://localhost:9080/api/v1/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userLoginId: data.userLoginId,
                    userPassword: data.userPassword
                })
            });

            if (!response.ok) {
                // HTTP 상태별 에러 처리
                switch (response.status) {
                    case 401:
                        throw new Error('아이디 또는 비밀번호가 올바르지 않습니다.');
                    case 403:
                        throw new Error('계정이 비활성화되었습니다.');
                    case 404:
                        throw new Error('존재하지 않는 계정입니다.');
                    case 500:
                        throw new Error('서버 오류가 발생했습니다.');
                    default:
                        throw new Error('로그인에 실패했습니다.');
                }
            }

            const result: LoginResponse = await response.json();
            console.log('서버 응답:', result);

            if (result.success && result.token) {
                // 쿠키에 토큰 저장 (7일 만료)
                Cookies.set('auth-token', formatTokenForServer(result.token), {
                    expires: 7,           // 7일 후 만료
                    secure: false,         // HTTPS에서만 전송
                    sameSite: 'strict',   // CSRF 공격 방지
                    path: '/'            // 모든 경로에서 접근 가능
                });

                Cookies.set('auth-time', new Date().toISOString(), {
                    expires: 7,
                    secure: false,
                    sameSite: 'strict',
                    path: '/'
                });

                console.log('✅ 로그인 성공, 메인 페이지로 이동');
                router.push('/');

                return { success: true };

            } else {
                // 서버에서 success: false 응답
                const errorMessage = result.message || '로그인에 실패했습니다.';
                setLoginError(errorMessage);

                return { success: false, error: errorMessage };
            }

        } catch (error) {
            console.error('❌ 로그인 요청 중 오류:', error);

            const errorMessage = error instanceof Error
                ? error.message
                : '로그인 중 오류가 발생했습니다.';

            setLoginError(errorMessage);

            return { success: false, error: errorMessage };

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