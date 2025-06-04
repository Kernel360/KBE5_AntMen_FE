// ./src/lib/api.ts - 수정된 버전
import {getAuthToken, removeAuthToken} from '../lib/auth';

export const apiClient = {
    get: async (url: string, options: RequestInit = {}) => {
        return fetchWithAuth(url, { ...options, method: 'GET' });
    },

    post: async (url: string, data?: any, options: RequestInit = {}) => {
        return fetchWithAuth(url, {
            ...options,
            method: 'POST',
            body: data ? JSON.stringify(data) : undefined,
        });
    },

    put: async (url: string, data?: any, options: RequestInit = {}) => {
        return fetchWithAuth(url, {
            ...options,
            method: 'PUT',
            body: data ? JSON.stringify(data) : undefined,
        });
    },

    delete: async (url: string, options: RequestInit = {}) => {
        return fetchWithAuth(url, { ...options, method: 'DELETE' });
    },
};

/**
 * 토큰을 서버 형식에 맞게 변환
 * 서버에서 token.substring(0, 7).equals("Bearer")로 체크하는 버그가 있음
 * 임시 해결책: "Bearer" + 공백 + 토큰으로 전송하되, 서버 로직 수정 권장
 */
const formatTokenForServer = (token: string): string => {
    // 기존 "Bearer " 접두사 제거 (공백 포함/미포함 모두 처리)
    const cleanToken = token.replace(/^Bearer\s*/i, '');
    // "Bearer " (공백 포함) + 토큰 형태로 반환
    return `Bearer ${cleanToken}`;
};

const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    const token = getAuthToken();

    const headers = new Headers(options.headers);

    if (!headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json');
    }

    if (token) {
        // 서버 요구사항에 맞는 토큰 형식으로 변환
        const formattedToken = formatTokenForServer(token);
        headers.set('Authorization', formattedToken);

        // 상세 디버깅 로그
        console.log('🔐 원본 토큰:', token);
        console.log('🔐 변환된 토큰:', formattedToken);
        console.log('🔐 토큰 길이:', formattedToken.length);
        console.log('🔐 첫 7글자:', formattedToken.substring(0, 7));
        console.log('🔐 startsWith "Bearer ":', formattedToken.startsWith('Bearer '));
    }

    try {
        const response = await fetch(url, {
            ...options,
            headers,
        });

        console.log(`📡 API 호출: ${options.method} ${url}`);
        console.log(`📊 응답 상태: ${response.status}`);

        // 401 오류 시 토큰 삭제 (운영 환경에서는 활성화)
        if (response.status === 401) {
            console.log('🚨 401 인증 오류');
            // removeAuthToken(); // 개발 중에는 주석 처리
            // if (typeof window !== 'undefined') {
            //     window.location.href = '/login';
            // }
        }

        return response;

    } catch (error) {
        console.error('🔥 네트워크 오류:', error);
        throw error;
    }
};