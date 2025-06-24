import { useEffect } from 'react';
import { useAuthStore, UserRole } from '@/shared/stores/authStore';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
    sub: string;
    userRole: UserRole;
    exp: number;
}

export function AuthInitializer({ children }: { children: React.ReactNode }) {
    const { login, logout } = useAuthStore();

    useEffect(() => {
        const initializeAuth = async () => {
            const token = Cookies.get('auth-token');
            console.log('🔄 인증 초기화 시작');
            console.log('🍪 저장된 토큰:', token);
            
            if (!token) {
                console.log('❌ 토큰 없음, 로그아웃');
                logout();
                return;
            }

            try {
                // 토큰 디코딩
                const decoded = jwtDecode<JwtPayload>(token);
                console.log('🔑 토큰 디코딩 결과:', decoded);
                
                // 토큰 만료 확인
                if (decoded.exp * 1000 < Date.now()) {
                    console.log('⚠️ 토큰 만료됨');
                    logout();
                    return;
                }

                // 상태 복원
                const user = {
                    userId: parseInt(decoded.sub),
                    userRole: decoded.userRole
                };
                console.log('👤 복원할 유저 정보:', user);

                await login(user, token);
                console.log('✅ 인증 상태 복원 완료');
            } catch (error) {
                console.error('❌ 토큰 검증 실패:', error);
                logout();
            }
        };

        initializeAuth();
    }, [login, logout]);

    return <>{children}</>;
}