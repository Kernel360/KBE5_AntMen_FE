"use client";

import {useSearchParams} from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useSocialProfileStore } from "@/shared/stores/socialProfileStore";
import { useAuthStore } from "@/shared/stores/authStore";
import { jwtDecode } from "jwt-decode";
import { authApi } from '@/shared/api/auth';
import { ApiError } from '@/shared/api/base';

interface JwtPayload {
    sub: string;        // userId
    userRole: string;
    exp: number;        // 만료 시간
    iat: number;        // 발급 시간
}

type UserRole = 'CUSTOMER' | 'MANAGER' | 'ADMIN';

const isValidUserRole = (role: string): role is UserRole => {
    return ['CUSTOMER', 'MANAGER', 'ADMIN'].includes(role);
};

interface AuthResponse {
    success: boolean;
    token?: string;
    message?: string;
    user_email?: string;
    user_id?: string;
    user_type?: string;
}

export function LoginGateway() {
    const searchParams = useSearchParams();
    const code = searchParams?.get('code') ?? null;
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const { setSocialProfile } = useSocialProfileStore();
    const { login: loginToStore } = useAuthStore();

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

            const result = await authApi.googleLogin({
                code: authCode,
                timestamp: new Date().toISOString()
            });

            console.log('✅ 서버 응답:', result);
            
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
            console.error('❌ 로그인 요청 중 오류:', error);
            if (error instanceof ApiError) {
                setError(error.message);
            } else if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('로그인 중 오류가 발생했습니다.');
            }
        } finally {
            setIsLoading(false);
            isProcessing.current = false;
        }
    };

    const formatTokenForServer = (token: string): string => {
        // 기존 "Bearer " 접두사 제거 (공백 포함/미포함 모두 처리)
        const cleanToken = token.replace(/^Bearer\s*/i, '');
        // "Bearer " (공백 포함) + 토큰 형태로 반환
        return `Bearer ${cleanToken}`;
    };

    return null;
}