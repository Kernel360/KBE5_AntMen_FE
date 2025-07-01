import axios from 'axios';
import { AdminLoginRequest, AdminLoginResponse, AdminChangePasswordRequest, Admin, BoardRequestDto } from './types';
import { getCookie, ADMIN_TOKEN_COOKIE } from '../lib/cookie';

const API_BASE_URL = 'https://api.antmen.site:9093/api/v1';
// const API_BASE_URL = 'http://localhost:9093/api/v1';

// 관리자 API 인스턴스
const adminApi = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// JWT 토큰 디코드 유틸리티
const decodeJWT = (token: string) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (error) {
        return null;
    }
};

// 요청 인터셉터: 토큰 자동 추가
adminApi.interceptors.request.use(
    (config) => {
        // 쿠키와 localStorage 둘 다 확인
        let token = getCookie(ADMIN_TOKEN_COOKIE);
        if (!token) {
            token = localStorage.getItem('adminToken');
        }
        
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 응답 인터셉터: 401 에러 시 로그인 페이지로 리다이렉트
adminApi.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // 비밀번호 변경 API의 경우 자동 리다이렉트 하지 않음
            const isPasswordChangeRequest = error.config?.url?.includes('/change-password');
            
            if (!isPasswordChangeRequest) {
                // 토큰이 만료되었거나 유효하지 않은 경우
                alert('토큰이 만료되었습니다. 다시 로그인해주세요.');
                localStorage.removeItem('adminUser');
                localStorage.removeItem('adminToken');
                document.cookie = `${ADMIN_TOKEN_COOKIE}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
                window.location.href = '/admin/login';
            }
        }
        return Promise.reject(error);
    }
);

export const adminService = {
    // 관리자 로그인
    login: async (credentials: AdminLoginRequest): Promise<AdminLoginResponse> => {
        const response = await adminApi.post('/admin/auth/login', credentials);
        return response.data;
    },

    // 관리자 정보 조회
    getProfile: async (): Promise<Admin> => {
        try {
            const response = await adminApi.get('/admin/auth/profile');
            return response.data;
        } catch (error: any) {
            if (error.response?.status === 401) {
                throw new Error('토큰이 만료되었습니다. 다시 로그인해주세요.');
            }
            throw error;
        }
    },

    // 관리자 비밀번호 변경
    changePassword: async (data: AdminChangePasswordRequest): Promise<void> => {
        try {
            const response = await adminApi.post('/admin/auth/change-password', {
                currentPassword: data.currentPassword,
                newPassword: data.newPassword,
                confirmPassword: data.confirmPassword
            });
            
            return response.data;
        } catch (error: any) {
            if (error.response?.status === 401) {
                const errorMessage = error.response?.data?.message || error.response?.data || 'invalid token';
                
                if (errorMessage.includes('token') || errorMessage.includes('인증')) {
                    throw new Error('토큰이 만료되었습니다. 다시 로그인해주세요.');
                } else if (errorMessage.includes('비밀번호')) {
                    throw new Error('현재 비밀번호가 올바르지 않습니다.');
                } else {
                    throw new Error('토큰이 만료되었습니다. 다시 로그인해주세요.');
                }
            } else if (error.response?.status === 400) {
                const errorMessage = error.response?.data?.message || '잘못된 요청입니다.';
                throw new Error(errorMessage);
            } else {
                throw new Error('비밀번호 변경 중 오류가 발생했습니다.');
            }
        }
    },

    // 토큰 갱신
    refreshToken: async (refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> => {
        const response = await adminApi.post('/admin/auth/refresh', { refreshToken });
        return response.data;
    },

    // 로그아웃
    logout: async (): Promise<void> => {
        try {
            await adminApi.post('/admin/auth/logout');
        } catch (error) {
            // 로그아웃 요청이 실패해도 클라이언트에서는 로그아웃 처리
        } finally {
            // 로컬 스토리지와 쿠키 정리
            localStorage.removeItem('adminUser');
            localStorage.removeItem('adminToken');
            document.cookie = `${ADMIN_TOKEN_COOKIE}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        }
    },

    // 관리자 목록 조회 (시스템 관리자만 가능)
    getAdmins: async (): Promise<Admin[]> => {
        const response = await adminApi.get('/admin/auth/admins');
        return response.data;
    },

    // 통합 공지사항 생성 (카테고리에 따라 엔드포인트 변경) - 9090 포트
    createNotice: async (data: BoardRequestDto): Promise<void> => {
        // 별도의 axios 인스턴스로 9090 포트에 요청
        const boardApi = axios.create({
            baseURL: 'https://api.antmen.site:9090/api/v1',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // JWT 토큰 자동 추가 인터셉터
        boardApi.interceptors.request.use(
            (config) => {
                let token = getCookie(ADMIN_TOKEN_COOKIE);
                if (!token) {
                    token = localStorage.getItem('adminToken');
                }
                
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        // 401 에러 시 로그인 페이지로 리다이렉트 인터셉터
        boardApi.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.status === 401) {
                    // 토큰이 만료되었거나 유효하지 않은 경우
                    alert('토큰이 만료되었습니다. 다시 로그인해주세요.');
                    localStorage.removeItem('adminUser');
                    localStorage.removeItem('adminToken');
                    document.cookie = `${ADMIN_TOKEN_COOKIE}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
                    window.location.href = '/admin/login';
                }
                return Promise.reject(error);
            }
        );

        // boardType에 따라 엔드포인트 동적 설정
        const endpoint = `/board/${data.boardType}`;
        const response = await boardApi.post(endpoint, data);
        return response.data;
    },

    // 게시판 목록 조회 - 9093 포트
    getNotices: async (boardType: string): Promise<any[]> => {
        try {
            const endpoint = `/board/${boardType}`;
            const response = await adminApi.get(endpoint);
            return response.data;
        } catch (error: any) {
            if (error.response?.status === 401) {
                throw new Error('토큰이 만료되었습니다. 다시 로그인해주세요.');
            }
            throw error;
        }
    },

    // 특정 게시글 조회 - 9093 포트
    getNotice: async (boardType: string, boardId: number): Promise<any> => {
        try {
            const endpoint = `/board/${boardType}/${boardId}`;
            const response = await adminApi.get(endpoint);
            return response.data;
        } catch (error: any) {
            if (error.response?.status === 401) {
                throw new Error('토큰이 만료되었습니다. 다시 로그인해주세요.');
            }
            throw error;
        }
    },

    // 게시글 삭제 - 9093 포트
    deleteNotice: async (boardType: string, boardId: number): Promise<void> => {
        try {
            const endpoint = `/board/${boardType}/${boardId}`;
            const response = await adminApi.delete(endpoint);
            return response.data;
        } catch (error: any) {
            if (error.response?.status === 401) {
                throw new Error('토큰이 만료되었습니다. 다시 로그인해주세요.');
            }
            throw error;
        }
    },
}; 