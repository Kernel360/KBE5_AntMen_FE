import { customFetch } from './base';
import { API_CONFIG } from './config';

export interface ReservationRequest {
  categoryId: number;
  reservationDate: string;
  reservationTime: string;
  reservationDuration: number;
  optionIds: number[];
  reservationMemo?: string;
}

export interface ReservationResponse {
  reservationId: number;
  customerId: number;
  reservationCreatedAt: string;
  reservationDate: string;
  reservationTime: string;
  categoryId: number;
  categoryName: string;
  recommendDuration: number;
  reservationDuration: number;
  managerId: number | null;
  matchedAt: string | null;
  reservationStatus: string;
  reservationCancelReason: string | null;
  reservationMemo: string;
  reservationAmount: number;
  optionIds: number[];
  optionNames: string[];
}

export const reservationApi = {
  // 고객용 API
  customer: {
    create: async (data: ReservationRequest): Promise<ReservationResponse> => {
      return customFetch<ReservationResponse>(
        `${API_CONFIG.LOCAL.ENDPOINTS.RESERVATION}`,
        {
          method: 'POST',
          body: JSON.stringify(data),
          serverType: 'LOCAL',
        }
      );
    },

    getById: async (reservationId: number): Promise<ReservationResponse> => {
      return customFetch<ReservationResponse>(
        `${API_CONFIG.LOCAL.ENDPOINTS.RESERVATION}/${reservationId}`,
        {
          serverType: 'LOCAL',
        }
      );
    },

    getAll: async (): Promise<ReservationResponse[]> => {
      return customFetch<ReservationResponse[]>(
        API_CONFIG.LOCAL.ENDPOINTS.RESERVATION,
        {
          serverType: 'LOCAL',
        }
      );
    },

    cancel: async (
      reservationId: number,
      reason?: string
    ): Promise<ReservationResponse> => {
      return customFetch<ReservationResponse>(
        `${API_CONFIG.LOCAL.ENDPOINTS.RESERVATION}/${reservationId}/cancel`,
        {
          method: 'POST',
          body: JSON.stringify({ reason }),
          serverType: 'LOCAL',
        }
      );
    },
  },

  // 매니저용 API
  manager: {
    getAssigned: async (): Promise<ReservationResponse[]> => {
      return customFetch<ReservationResponse[]>(
        `${API_CONFIG.REMOTE.ENDPOINTS.RESERVATION}/assigned`,
        {
          serverType: 'REMOTE',
        }
      );
    },

    accept: async (reservationId: number): Promise<ReservationResponse> => {
      return customFetch<ReservationResponse>(
        `${API_CONFIG.REMOTE.ENDPOINTS.RESERVATION}/${reservationId}/accept`,
        {
          method: 'POST',
          serverType: 'REMOTE',
        }
      );
    },

    reject: async (
      reservationId: number,
      reason: string
    ): Promise<ReservationResponse> => {
      return customFetch<ReservationResponse>(
        `${API_CONFIG.REMOTE.ENDPOINTS.RESERVATION}/${reservationId}/reject`,
        {
          method: 'POST',
          body: JSON.stringify({ reason }),
          serverType: 'REMOTE',
        }
      );
    },
  },
}; 