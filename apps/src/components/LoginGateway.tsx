"use client";

import {useSearchParams} from "next/navigation";
import { useEffect, useState } from "react";
import {router} from "next/client";

interface AuthResponse {
    success: boolean;
    token?: string;
    message?: string;
}

export function LoginGateway() {
    const searchParams = useSearchParams();
    const code = searchParams?.get('code') ?? null;
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    console.log(code);

    useEffect(() => {
        if (code) {
            handleGoogleLogin(code);
        }
    }, [code]);

    const handleGoogleLogin = async (authCode: string) => {
        setIsLoading(true);
        setError(null);

        try {

            const response = await fetch('http://localhost:9080/api/v1/auth/google/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    code: authCode,
                    timestamp: new Date().toISOString()
                })
            });

            console.log('response : '+response);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result: AuthResponse = await response.json();
            console.log('서버 응답:', result);

            if (result.success && result.token) {
                // 로그인 성공 - 토큰을 로컬스토리지에 저장
                console.log('로그인 성공, 토큰:', result.token);

                // 로컬스토리지에 토큰 저장
                localStorage.setItem('auth-token', result.token);

                // 추가로 사용자 정보나 로그인 시간도 저장 가능
                localStorage.setItem('login-time', new Date().toISOString());

                // 대시보드나 메인 페이지로 리다이렉트
                router.push('/');

            } else {
                // 토큰을 받지 못함 = 회원이 아님 → 회원가입 페이지로 이동
                console.log('회원이 아님 - 회원가입 페이지로 이동');
                router.push('/signup?from=google&message=회원가입이 필요합니다');
            }

        } catch (err) {
            console.error('구글 로그인 처리 중 오류:', err);
            setError(err instanceof Error ? err.message : '로그인 중 오류가 발생했습니다.');

            // 에러 발생 시에도 회원가입 페이지로 안내할 수 있음
            setTimeout(() => {
                router.push('/signup?from=google&error=login-failed');
            }, 3000);

        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p>구글 로그인 처리 중...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center text-red-600">
                    <p>오류: {error}</p>
                    <p className="text-sm mt-2">잠시 후 회원가입 페이지로 이동합니다...</p>
                </div>
            </div>
        );
    }
    return null;
}