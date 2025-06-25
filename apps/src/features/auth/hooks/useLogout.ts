import { useAuthStore } from '@/shared/stores/authStore';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { ReservationStorage } from '@/shared/lib/reservationStorage';
import { clearManagerStatusStore } from '@/features/manager-status';

export function useLogout() {
    const { logout, user } = useAuthStore();
    const router = useRouter();

    const handleLogout = () => {
        const userId = user?.userId || null;

        // 현재 사용자의 매니저 선택 관련 localStorage 데이터 정리
        if (userId) {
            localStorage.removeItem(`manager-selection-storage-${userId}`);
        }
        // 익명 사용자 데이터도 정리
        localStorage.removeItem('manager-selection-storage-anonymous');

        // 현재 사용자의 예약 관련 localStorage 데이터 정리
        ReservationStorage.clearUserReservation(userId);

        // 매니저 상태 스토어 정리
        clearManagerStatusStore(userId?.toString() || null);

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