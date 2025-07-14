import apiClient from '../lib/apiClient';
import { AdminReservationStatisticsResponseDto } from './types';

export const adminReservationService = {
    getReservationStatistics: async (): Promise<AdminReservationStatisticsResponseDto> => {
        const response = await apiClient.get('/admin/reservations/statistics');
        return response.data;
    },
    // 필요한 추가 API 함수들도 동일하게 apiClient 사용
};