import { useAuthStore } from '@/shared/stores/authStore';

export function useAuth() {
    const { user, isLoggedIn } = useAuthStore();

    // 현재 사용자가 특정 역할을 가지고 있는지 확인
    const hasRole = (role: 'CUSTOMER' | 'MANAGER' | 'ADMIN') => {
        return user?.userRole === role;
    };

    // 현재 사용자가 로그인했는지 확인
    const isAuthenticated = () => {
        return isLoggedIn && user?.userId != null;
    };

    // 현재 사용자가 특정 리소스의 소유자인지 확인
    const isOwner = (resourceUserId: number) => {
        return user?.userId === resourceUserId;
    };

    return {
        userId: user?.userId,
        userRole: user?.userRole,
        isLoggedIn,
        hasRole,
        isAuthenticated,
        isOwner,
    };
} 