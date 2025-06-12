import Cookies from 'js-cookie';

// 1. src/lib/auth.ts - 토큰 관리 유틸리티
export const getAuthToken = (): string | null => {
    if (typeof window !== 'undefined') {
        const token = Cookies.get('auth-token');
        return token || null;
    }
    return null;
};

export const setAuthToken = (token: string): void => {
    if (typeof window !== 'undefined') {
        Cookies.set('auth-token', token, {
            expires: 7,
            secure: false,
            sameSite: 'strict',
            path: '/'
        });
        Cookies.set('auth-time', new Date().toISOString(), {
            expires: 7,
            secure: false,
            sameSite: 'strict',
            path: '/'
        });
    }
};

export const removeAuthToken = (): void => {
    if (typeof window !== 'undefined') {
        Cookies.remove('auth-token');
        Cookies.remove('auth-time');
    }
};

// 사용자 역할 체크 유틸리티
export type UserRole = 'CUSTOMER' | 'MANAGER';

export interface AuthCheckResult {
    isAuthenticated: boolean;
    userRole: UserRole | null;
    message?: string;
}

export const checkUserAuth = (): AuthCheckResult => {
    const token = getAuthToken();
    
    if (!token) {
        return {
            isAuthenticated: false,
            userRole: null,
            message: '로그인이 필요한 서비스입니다.'
        };
    }

    const userRole = getUserRoleFromToken(token);
    
    return {
        isAuthenticated: true,
        userRole,
    };
};

export const checkCustomerAuth = (): AuthCheckResult => {
    const result = checkUserAuth();
    
    if (!result.isAuthenticated) {
        return result;
    }

    if (result.userRole !== 'CUSTOMER') {
        return {
            isAuthenticated: true,
            userRole: result.userRole,
            message: '잘못된 접근입니다.'
        };
    }

    return result;
};

export const checkManagerAuth = (): AuthCheckResult => {
    const result = checkUserAuth();
    
    if (!result.isAuthenticated) {
        return result;
    }

    if (result.userRole !== 'MANAGER') {
        return {
            isAuthenticated: true,
            userRole: result.userRole,
            message: '잘못된 접근입니다.'
        };
    }

    return result;
};

// 실제 JWT 토큰에서 역할 추출 (테스트 문자열 체크 삭제)
const getUserRoleFromToken = (token: string): UserRole => {
    // Bearer 접두사 제거
    const cleanToken = token.replace(/^Bearer\s+/i, '');

    // JWT 형식일 경우 payload에서 userRole 추출
    try {
        const parts = cleanToken.split('.');
        if (parts.length === 3) {
            const payload = JSON.parse(atob(parts[1]));
            if (payload.userRole === 'CUSTOMER' || payload.userRole === 'MANAGER') {
                return payload.userRole;
            }
        }
    } catch (error) {
        // ignore
    }
    // 기본값
    return 'MANAGER';
};
