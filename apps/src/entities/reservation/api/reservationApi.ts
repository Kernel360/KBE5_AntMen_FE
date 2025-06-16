import { Reservation, ReservationHistory, ReservationStatus } from '../model/types';

const BASE_URL = 'http://localhost:9092/api/v1/manager/reservations';

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
    const response = await fetch(BASE_URL, {
      headers: {
        Authorization: token,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new ApiError(
        '예약 목록을 불러오는데 실패했습니다',
        response.status,
        response.statusText
      );
    }

    return response.json();
  } catch (error) {
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

export async function getReservationById(id: number, token: string): Promise<Reservation> {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      headers: {
        Authorization: token,
      },
    });

    if (!response.ok) {
      throw new ApiError(
        '예약 정보를 불러오는데 실패했습니다',
        response.status,
        response.statusText
      );
    }

    return response.json();
  } catch (error) {
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

export async function getReservationHistory(id: number, token: string): Promise<ReservationHistory> {
  try {
    const response = await fetch(`${BASE_URL}/${id}/history`, {
      headers: {
        Authorization: token,
      },
    });

    if (!response.ok) {
      throw new ApiError(
        '예약 상세 정보를 불러오는데 실패했습니다',
        response.status,
        response.statusText
      );
    }

    return response.json();
  } catch (error) {
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
    const response = await fetch(`${BASE_URL}/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      throw new ApiError(
        '예약 상태 변경에 실패했습니다',
        response.status,
        response.statusText
      );
    }
  } catch (error) {
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