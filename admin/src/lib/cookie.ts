// 쿠키 관련 유틸리티 함수들

/**
 * 쿠키 설정
 */
export const setCookie = (name: string, value: string, days?: number, options?: {
    secure?: boolean;
    sameSite?: 'strict' | 'lax' | 'none';
    domain?: string;
    path?: string;
}) => {
    let expires = '';

    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = `; expires=${date.toUTCString()}`;
    }

    const secure = options?.secure ? '; secure' : '';
    const sameSite = options?.sameSite ? `; samesite=${options.sameSite}` : '';
    const domain = options?.domain ? `; domain=${options.domain}` : '';
    const path = options?.path ? `; path=${options.path}` : '; path=/';

    document.cookie = `${name}=${value}${expires}${path}${domain}${secure}${sameSite}`;
};

/**
 * 쿠키 가져오기
 */
export const getCookie = (name: string): string | null => {
    const nameEQ = `${name}=`;
    const ca = document.cookie.split(';');

    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1, c.length);
        }
        if (c.indexOf(nameEQ) === 0) {
            return c.substring(nameEQ.length, c.length);
        }
    }

    return null;
};

/**
 * 쿠키 삭제
 */
export const deleteCookie = (name: string, options?: {
    domain?: string;
    path?: string;
}) => {
    const domain = options?.domain ? `; domain=${options.domain}` : '';
    const path = options?.path ? `; path=${options.path}` : '; path=/';

    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC${path}${domain}`;
};

/**
 * 모든 쿠키 가져오기
 */
export const getAllCookies = (): Record<string, string> => {
    const cookies: Record<string, string> = {};

    document.cookie.split(';').forEach(cookie => {
        const [name, value] = cookie.trim().split('=');
        if (name && value) {
            cookies[name] = value;
        }
    });

    return cookies;
};

/**
 * 관리자 토큰 관련 상수
 */
export const ADMIN_TOKEN_COOKIE = 'adminToken';
export const ADMIN_REFRESH_TOKEN_COOKIE = 'adminRefreshToken';