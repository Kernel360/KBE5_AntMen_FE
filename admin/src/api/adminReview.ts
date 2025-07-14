import apiClient from '../lib/apiClient';
import { AdminReviewStatisticsResponseDto } from './types';

export const adminReviewService = {
    // 만족도 통계 조회 등 기존 함수들에서 reviewApi 대신 apiClient 사용
    // 예시:
    getReviewStatistics: async (): Promise<AdminReviewStatisticsResponseDto> => {
        try {
            const response = await apiClient.get('/admin/reviews/statistics');
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
