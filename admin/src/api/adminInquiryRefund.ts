import { adminApi } from './adminService';
import { AdminInquiryRefundDailyDto } from './types';

export const adminInquiryRefundService = {
    // 일별 상담 및 환불 통계 조회
    getInquiryRefundStatistics: async (recentDays: number = 7): Promise<AdminInquiryRefundDailyDto[]> => {
        try {
            const response = await adminApi.get(`/admin/statistics/inquiry-refund?recentDays=${recentDays}`);
            return response.data;
        } catch (error: any) {
            if (error.response?.status === 401) {
                throw new Error('토큰이 만료되었습니다. 다시 로그인해주세요.');
            }
            throw error;
        }
    }
}; 