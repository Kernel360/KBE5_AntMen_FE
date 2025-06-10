import { useAuthStore } from '@/shared/stores/authStore';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export function useLogout() {
    const { logout } = useAuthStore();
    const router = useRouter();

    const handleLogout = () => {
        // Zustand 스토어 초기화
        logout();

        // 쿠키 삭제
        Cookies.remove('auth-token');
        Cookies.remove('auth-time');

        // 로그인 페이지로 리다이렉트
        router.push('/login');
    };

    return handleLogout;
} 