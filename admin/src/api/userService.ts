import axios from 'axios';
import { User } from './types';

const API_BASE_URL = 'https://api.antmen.site:9093/api/v1';
// const API_BASE_URL = 'http://localhost:9093/api/v1';

const userApi = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const userService = {
    // 회원 목록 조회
    getUsers: async (name?: string, userId?: number, role?: string): Promise<User[]> => {
        const response = await userApi.get('/admin/users', {
            params: { name, userId, role }
        });
        return response.data;
    },

    // 회원 단건 조회
    getUser: async (userId: number): Promise<User> => {
        const response = await userApi.get(`/admin/users/${userId}`);
        return response.data;
    },

    // 승인 대기 중인 매니저 목록 조회
    getWaitingManagers: async (): Promise<any[]> => {
        const response = await userApi.get('/admin/users/waiting-managers');
        return response.data;
    },

    // 매니저 상세 정보 조회 (승인 대기 중인 매니저용)
    getWaitingManagerDetail: async (userId: number): Promise<any> => {
        const response = await userApi.get(`/admin/users/waiting-managers/${userId}`);
        return response.data;
    },

    // 매니저 승인
    approveManager: async (userId: number): Promise<void> => {
        await userApi.post(`/admin/users/${userId}/approve`);
    },

    // 매니저 거절
    rejectManager: async (userId: number, reason: string): Promise<void> => {
        console.log('rejectManager 호출:', { userId, reason });
        await userApi.post(`/admin/users/${userId}/reject`, null, {
            params: { reason }
        });
    },

    // // 사용자 생성
    // createUser: async (userData: UserRequest): Promise<User> => {
    //     const response = await userApi.post('/admin/users', userData);
    //     return response.data;
    // },

    // // 사용자 수정
    // updateUser: async (id: number, userData: Partial<UserRequest>): Promise<User> => {
    //     const response = await userApi.put(`/admin/users/${id}`, userData);
    //     return response.data;
    // },

    // 사용자 삭제
    deleteUser: async (id: number): Promise<void> => {
        await userApi.delete(`/admin/users/${id}`);
    },

    // 사용자 상태 변경
    updateUserStatus: async (id: number, status: 'active' | 'inactive' | 'suspended'): Promise<User> => {
        const response = await userApi.patch(`/admin/users/${id}/status`, { status });
        return response.data;
    },

}; 