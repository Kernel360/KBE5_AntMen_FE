import { useEffect } from 'react';
import { useAuthStore, UserRole } from '@/shared/stores/authStore';
import { useSecureAuth } from '@/shared/hooks/useSecureAuth';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
    sub: string;
    userRole: UserRole;
    exp: number;
}

export function AuthInitializer({ children }: { children: React.ReactNode }) {
    // 🛡️ 안전한 JWT 기반 인증 시스템
    const { user: secureUser, isLoading: secureLoading } = useSecureAuth();
    // 🔄 기존 호환성: localStorage 기반 (동기화용)
    const { login, logout } = useAuthStore();

    useEffect(() => {
        const initializeAuth = async () => {
            if (secureLoading) return; // JWT 로딩 중에는 대기

            console.log('🔄 인증 초기화 시작');
            
            // 🛡️ JWT 기반 인증 상태 확인 (최우선)
            if (!secureUser) {
                console.log('❌ JWT 인증 실패, 로그아웃');
                logout();
                return;
            }

            console.log('✅ JWT 인증 성공:', secureUser);

            // 🔄 localStorage와 JWT 동기화 (호환성)
            const token = Cookies.get('auth-token');
            if (token) {
                try {
                    const user = {
                        userId: secureUser.userId,
                        userRole: secureUser.userRole,
                        // 🆕 매니저 상태는 로그인 시 이미 설정되어 있음
                        managerStatus: null // 복원 시에는 null로 설정 (실제 상태는 ManagerStatusGuard에서 처리)
                    };
                    console.log('🔄 localStorage 동기화:', user);
                    await login(user, token);
                    console.log('✅ 인증 상태 복원 완료');
                } catch (error) {
                    console.error('❌ localStorage 동기화 실패:', error);
                    logout();
                }
            }
        };

        initializeAuth();
    }, [secureUser, secureLoading, login, logout]);

    return <>{children}</>;
}