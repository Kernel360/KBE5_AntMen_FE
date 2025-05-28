"use client";

import {useSearchParams} from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

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
    const router = useRouter();

    // 🔥 중복 실행 방지를 위한 ref
    const isProcessing = useRef(false);
    const processedCode = useRef<string | null>(null);

    useEffect(() => {
        // 코드가 있고, 아직 처리 중이 아니고, 이전에 처리한 코드와 다를 때만 실행
        if (code &&
            !isProcessing.current &&
            processedCode.current !== code) {

            console.log('🚀 Google 로그인 처리 시작:', code);
            processedCode.current = code; // 현재 코드 저장
            handleGoogleLogin(code);
        }
    }, [code]);

    const handleGoogleLogin = async (authCode: string) => {
        // 이미 처리 중이면 리턴
        if (isProcessing.current) {
            console.log('⚠️ 이미 처리 중입니다. 중복 실행 방지');
            return;
        }

        isProcessing.current = true; // 처리 시작 플래그
        setIsLoading(true);
        setError(null);

        try {
            console.log('📡 서버 요청 시작');

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

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result: AuthResponse = await response.json();
            console.log('✅ 서버 응답:', result);

            if (result.success && result.token) {
                console.log('✅ 로그인 성공, 토큰:', result.token);

                localStorage.setItem('auth-token', result.token);
                localStorage.setItem('login-time', new Date().toISOString());

                console.log('🏠 메인 페이지로 이동');
                router.push('/');

            } else {
                console.log('❌ 회원이 아님 - 메인 페이지로 이동');
                router.push('/');
            }

        } catch (err) {
            console.error('❌ 구글 로그인 처리 중 오류:', err);
            setError(err instanceof Error ? err.message : '로그인 중 오류가 발생했습니다.');

            setTimeout(() => {
                console.log('⏰ 3초 후 로그인으로 재이동');
                router.push('/login');
            }, 3000);

        } finally {
            setIsLoading(false);
            // 주의: 여기서 isProcessing을 false로 하지 말 것!
            // 한 번 처리된 코드는 다시 처리하지 않도록 함
        }
    };

    return null;
}