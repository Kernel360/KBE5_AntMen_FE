import { customFetch } from '@/shared/api/base';
import type { CalculationHistoryItem } from '@/entities/calculation/types';

export const getCalculationHistory = async (): Promise<CalculationHistoryItem[]> => {
  return customFetch<CalculationHistoryItem[]>(
    '/api/v1/manager/calculation/history',
    {
      method: 'GET',
    }
  );
}; 