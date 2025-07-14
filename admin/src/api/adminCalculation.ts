import apiClient from '../lib/apiClient';
import { AdminCalculationResponseDto, AdminCalculationDetailDto } from './types';

export const adminCalculationService = {
    // 정산 데이터 조회
    getCalculation: async (): Promise<AdminCalculationResponseDto> => {
        try {
            const response = await apiClient.get('/admin/calculations');
            return response.data;
        } catch (error: any) {
            if (error.response?.status === 401) {
                throw new Error('토큰이 만료되었습니다. 다시 로그인해주세요.');
            }
            throw error;
        }
    },
    // 정산 상세 정보 조회
    getCalculationDetail: async (calculationId: number): Promise<AdminCalculationDetailDto> => {
        try {
            const response = await apiClient.get(`/admin/calculations/${calculationId}`);
            return response.data;
        } catch (error: any) {
            if (error.response?.status === 401) {
                throw new Error('토큰이 만료되었습니다. 다시 로그인해주세요.');
            }
            throw error;
        }
    },
};

// 기존 함수명과의 호환성을 위한 export (기존 코드에서 사용 중인 경우)
export const getAdminCalculation = adminCalculationService.getCalculation;