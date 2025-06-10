import { useAuth } from '@/features/auth/hooks/useAuth';
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
    const { isAuthenticated, userRole } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // 인증이 필요한 페이지인데 로그인하지 않은 경우
        if (requireAuth && !isAuthenticated()) {
            router.push('/login');
            return;
        }

        // 특정 역할만 접근 가능한 페이지인 경우
        if (allowedRoles.length > 0 && userRole) {
            const hasAllowedRole = allowedRoles.includes(userRole as UserRole);
            if (!hasAllowedRole) {
                // 권한이 없는 경우 각 역할별 기본 페이지로 리다이렉트
                switch (userRole) {
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
    }, [isAuthenticated, userRole, router, allowedRoles, requireAuth]);

    return <>{children}</>;
} 