import { customFetch } from './base';

/**
 * 예약에 추가된 옵션의 정보를 나타내는 타입
 * (Swagger의 ReservationOptionResponseDto 등을 기반으로 정의)
 */
export interface ReservationOption {
  reservationOptionId: number;
  reservationId: number;
  optionId: number;
  optionName: string;
  optionPrice: number;
}

/**
 * 특정 예약에 대한 모든 옵션 목록을 조회하는 API 함수
 * @param reservationId - 옵션을 조회할 예약의 ID
 * @returns ReservationOption[] - 해당 예약에 추가된 옵션 목록
 */
export const getOptionsForReservation = async (
  reservationId: number,
): Promise<ReservationOption[]> => {
  return customFetch<ReservationOption[]>(`/reservation-option/${reservationId}`);
};

/**
 * 특정 예약에 새로운 옵션을 추가하는 API 함수
 * @param reservationId - 옵션을 추가할 예약의 ID
 * @param optionId - 추가할 옵션의 ID
 * @returns ReservationOption - 추가된 옵션 정보
 */
export const addOptionToReservation = async (
  reservationId: number,
  optionId: number,
): Promise<ReservationOption> => {
  return customFetch<ReservationOption>(`/reservation-option/${reservationId}`, {
    method: 'POST',
    body: JSON.stringify({ optionId }),
  });
}; 