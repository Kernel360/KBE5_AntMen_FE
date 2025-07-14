import { AdminMatchingStatisticsResponseDto } from './types';
import apiClient from '../lib/apiClient';

export const adminMatchingService = {
    // 매칭 통계 조회 등 기존 함수들에서 matchingApi 대신 apiClient 사용
    // 예시:
    getMatchingStatistics: async (): Promise<AdminMatchingStatisticsResponseDto> => {
        try {
            const response = await apiClient.get('/admin/matchings/statistics');
            return response.data;
        } catch (error: any) {
            if (error.response?.status === 401) {
                throw new Error('토큰이 만료되었습니다. 다시 로그인해주세요.');
            }
            throw error;
        }
    },
    // 기타 함수들도 동일하게 apiClient 사용
};
