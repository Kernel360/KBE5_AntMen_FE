import { useAuthStore } from '@/shared/stores/authStore'
import { useSecureAuth } from '@/shared/hooks/useSecureAuth'

export function useAuth() {
    // 🛡️ 보안 강화: JWT 기반 인증 (최우선)
    const { user: secureUser, isLoggedIn: secureIsLoggedIn, hasRole: secureHasRole, isLoading } = useSecureAuth()
    // 🔄 기존 호환성: localStorage 기반
    const { user, isLoggedIn } = useAuthStore()
    
    // JWT 기반 정보 우선 사용
    const actualUser = secureUser || user
    const actualIsLoggedIn = isLoading ? false : secureIsLoggedIn

    // 현재 사용자가 특정 역할을 가지고 있는지 확인 (JWT 우선)
    const hasRole = (role: string) => {
        return secureHasRole ? secureHasRole(role) : actualUser?.userRole === role;
    };

    // 현재 사용자가 특정 리소스에 접근할 권한이 있는지 확인 (JWT 우선)
    const canAccess = (resourceUserId?: number) => {
        if (!actualIsLoggedIn || !actualUser) return false;
        if (actualUser.userRole === 'ADMIN') return true;
        return actualUser?.userId === resourceUserId;
    };

    const isAuthenticated = () => {
        return actualIsLoggedIn;
    };

    const userRole = actualUser?.userRole ?? null;

    return {
        user: actualUser,
        isLoggedIn: actualIsLoggedIn,
        userRole,
        isAuthenticated,
        hasRole,
        canAccess,
    };
} 