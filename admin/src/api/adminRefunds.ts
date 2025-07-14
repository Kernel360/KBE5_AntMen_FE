import apiClient from '../lib/apiClient';
import { AdminRefundResponseDto, AdminRefundStatisticsResponseDto, AdminRefundReasonDto, AdminRefundCustomerTopDto, AdminRefundManagerTopDto } from './types';

export const adminRefundsService = {
    getRefundStatistics: async (): Promise<AdminRefundStatisticsResponseDto> => {
        const response = await apiClient.get('/admin/refunds/statistics');
        return response.data;
    },
    getAllRefunds: async (): Promise<AdminRefundResponseDto[]> => {
        const response = await apiClient.get('/admin/refunds');
        return response.data;
    },
    getWaitingRefunds: async (): Promise<AdminRefundResponseDto[]> => {
        const response = await apiClient.get('/admin/refunds/waiting');
        return response.data;
    },
    getRefundReasons: async (): Promise<AdminRefundReasonDto[]> => {
        const response = await apiClient.get('/admin/refunds/reasons');
        return response.data;
    },
    getRefundCustomerTop: async (): Promise<AdminRefundCustomerTopDto[]> => {
        const response = await apiClient.get('/admin/refunds/customers/top');
        return response.data;
    },
    getRefundManagerTop: async (): Promise<AdminRefundManagerTopDto[]> => {
        const response = await apiClient.get('/admin/refunds/managers/top');
        return response.data;
    },
    approveRefund: async (payId: number): Promise<void> => {
        await apiClient.put(`/admin/refunds/${payId}/approve`);
    },
    rejectRefund: async (payId: number): Promise<void> => {
        await apiClient.put(`/admin/refunds/${payId}/reject`);
    },
};