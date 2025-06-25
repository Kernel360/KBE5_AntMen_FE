import { customFetch } from '@/shared/api/base';
import type { CalculationRequestParams, CalculationRequestResponse } from '@/entities/calculation/types';

export const requestCalculation = async (
  params: CalculationRequestParams
): Promise<CalculationRequestResponse> => {
  return customFetch<CalculationRequestResponse>(
    '/api/v1/manager/calculation/request',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }
  );
}; 