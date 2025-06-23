import { useAuthStore } from '@/shared/stores/authStore'

export function useAuth() {
    const { user, isLoggedIn } = useAuthStore();

    // 현재 사용자가 특정 역할을 가지고 있는지 확인
    const hasRole = (role: string) => {
        return user?.userRole === role;
    };

    // 현재 사용자가 특정 리소스에 접근할 권한이 있는지 확인
    const canAccess = (resourceUserId?: number) => {
        if (!isLoggedIn || !user) return false;
        if (user.userRole === 'ADMIN') return true;
        return user?.userId === resourceUserId;
    };

    const isAuthenticated = () => {
        return isLoggedIn;
    };

    const userRole = user?.userRole ?? null;

    return {
        user,
        isLoggedIn,
        userRole,
        isAuthenticated,
        hasRole,
        canAccess,
    };
} 