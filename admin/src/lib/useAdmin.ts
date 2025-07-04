import { useState, useEffect } from 'react';
import { adminService } from '../api/adminService';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Admin } from '../api/types';

interface AdminUser {
    id: number;
}

export const useAdmin = () => {
    const [admin, setAdmin] = useState<AdminUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadAdminInfo();
    }, []);

    const loadAdminInfo = () => {
        try {
            // localStorage에서 관리자 정보 로드
            const adminUserStr = localStorage.getItem('adminUser');
            if (adminUserStr) {
                const adminUser = JSON.parse(adminUserStr);
                setAdmin(adminUser);
            }
        } catch (err) {
            setError('관리자 정보를 불러올 수 없습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    const refreshAdminProfile = async () => {
        try {
            setIsLoading(true);
            const profile = await adminService.getProfile();
            
            const adminUser: AdminUser = {
                id: profile.id,
            };
            
            setAdmin(adminUser);
            localStorage.setItem('adminUser', JSON.stringify(adminUser));
            setError(null);
        } catch (err: any) {
            setError('관리자 프로필을 새로고침할 수 없습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            await adminService.logout();
        } catch (err) {
            // 로그아웃 실패해도 클라이언트 측 로그아웃 처리
        } finally {
            setAdmin(null);
            localStorage.removeItem('adminUser');
        }
    };

    return {
        admin,
        isLoading,
        error,
        refreshAdminProfile,
        logout,
        // 편의 메서드
        isLoggedIn: !!admin,
        adminId: admin?.id,
    };
}; 