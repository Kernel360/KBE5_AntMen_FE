// 1. src/lib/token.ts - 토큰 관리 유틸리티
export const getAuthToken = (): string | null => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('auth-token');
        if (token){
            const formattedToken = formatTokenForServer(token);
            return formattedToken;
        }
    }
    return null;
};

export const setAuthToken = (token: string): void => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('auth-token', token);
    }
};

export const removeAuthToken = (): void => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('auth-token');
    }
};

export const formatTokenForServer = (token: string): string => {
    // 기존 "Bearer " 접두사 제거 (공백 포함/미포함 모두 처리)
    const cleanToken = token.replace(/^Bearer\s*/i, '');
    // "Bearer " (공백 포함) + 토큰 형태로 반환
    return `Bearer ${cleanToken}`;
};

