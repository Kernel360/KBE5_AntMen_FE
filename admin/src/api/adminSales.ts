import apiClient from '../lib/apiClient';
import { AdminSalesSummaryResponseDto } from './types';

export const adminSalesService = {
    // 매출 요약 정보 조회
    getSalesSummary: async (): Promise<AdminSalesSummaryResponseDto> => {
        try {
            const response = await apiClient.get('/admin/sales');
            return response.data;
        } catch (error: any) {
            if (error.response?.status === 401) {
                throw new Error('토큰이 만료되었습니다. 다시 로그인해주세요.');
            }
            throw error;
        }
    },
};