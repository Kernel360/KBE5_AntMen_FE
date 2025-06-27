import { useAuth } from '@/features/auth/hooks/useAuth';
import { useSecureAuth } from '@/shared/hooks/useSecureAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

type UserRole = 'CUSTOMER' | 'MANAGER' | 'ADMIN';

interface AuthGuardProps {
    children: React.ReactNode;
    allowedRoles?: UserRole[];
    requireAuth?: boolean;
}

export function AuthGuard({ 
    children, 
    allowedRoles = [], 
    requireAuth = true 
}: AuthGuardProps) {
    // 🛡️ 보안 강화: JWT 기반 인증 우선 사용
    const { user: secureUser, isLoggedIn: secureIsLoggedIn, isLoading, getUserRole } = useSecureAuth();
    // 🔄 기존 호환성: localStorage 기반 (점진적 마이그레이션)
    const { isAuthenticated, userRole } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (isLoading) return; // 로딩 중에는 체크하지 않음

        // 🛡️ JWT 기반 권한 체크 (최우선)
        const currentUserRole = getUserRole();
        const isCurrentlyAuthenticated = secureIsLoggedIn;

        // 인증이 필요한 페이지인데 로그인하지 않은 경우
        if (requireAuth && !isCurrentlyAuthenticated) {
            console.warn('🚨 JWT 기반 인증 실패 - 로그인 페이지로 이동');
            router.push('/login');
            return;
        }

        // 특정 역할만 접근 가능한 페이지인 경우
        if (allowedRoles.length > 0 && currentUserRole) {
            const hasAllowedRole = allowedRoles.includes(currentUserRole as UserRole);
            if (!hasAllowedRole) {
                console.warn(`🚨 권한 없음: ${currentUserRole}는 ${allowedRoles.join(', ')} 권한이 필요`);
                // 권한이 없는 경우 각 역할별 기본 페이지로 리다이렉트
                switch (currentUserRole) {
                    case 'CUSTOMER':
                        router.push('/');
                        break;
                    case 'MANAGER':
                        router.push('/manager');
                        break;
                    case 'ADMIN':
                        router.push('/admin/dashboard');
                        break;
                    default:
                        router.push('/');
                }
            }
        }
    }, [isLoading, secureIsLoggedIn, getUserRole, router, allowedRoles, requireAuth]);

    // 로딩 중 표시
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#9CDAFB] mx-auto mb-2"></div>
                    <p className="text-gray-600">권한 확인 중...</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
} 