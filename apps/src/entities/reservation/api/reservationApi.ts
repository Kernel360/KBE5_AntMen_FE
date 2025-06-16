import { Reservation, ReservationHistory, ReservationStatus } from '../model/types';
import { customFetch } from '@/shared/api/base';

const BASE_URL = 'https://api.antmen.site:9092/v1/manager/reservations';

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public statusText: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function getMyReservations(token: string): Promise<Reservation[]> {
  try {
    const data = await customFetch<Reservation[]>(BASE_URL, {
      headers: {
        Authorization: token,
      },
      cache: 'no-store',
    });
    return data;
  } catch (error: any) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      '서버와 통신하는데 실패했습니다',
      500,
      'Internal Server Error'
    );
  }
}

export async function getReservationDetail(id: number, token: string): Promise<ReservationHistory> {
  try {
    const data = await customFetch<ReservationHistory>(`${BASE_URL}/${id}/history`, {
      headers: {
        Authorization: token,
      },
    });
    return data;
  } catch (error: any) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      '서버와 통신하는데 실패했습니다',
      500,
      'Internal Server Error'
    );
  }
}

export async function changeReservationStatus(
  id: number,
  status: ReservationStatus,
  token: string
): Promise<void> {
  try {
    await customFetch<void>(`${BASE_URL}/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify({ status }),
    });
  } catch (error: any) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      '서버와 통신하는데 실패했습니다',
      500,
      'Internal Server Error'
    );
  }
} 