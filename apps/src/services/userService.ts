import { apiClient } from '@/lib/api';
import { User } from '@/types/user';

const BASE_URL = 'http://localhost:9081';

export const userService = {
    // 내 정보 조회
    getMyInfo: async (): Promise<User> => {
        const response = await apiClient.get(`${BASE_URL}/api/customers/me`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    },

    // 내 정보 수정
    updateMyInfo: async (userData: Partial<User>): Promise<User> => {
        const response = await apiClient.put(`${BASE_URL}/api/customers/me`, userData);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    }
};