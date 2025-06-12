import { customFetch } from './base'
import { API_ENDPOINTS } from './config'

/**
 * 예약에 추가된 옵션의 정보를 나타내는 타입
 * (Swagger의 ReservationOptionResponseDto 등을 기반으로 정의)
 */
export interface ReservationOption {
  reservationOptionId: number
  reservationId: number
  optionId: number
  optionName: string
  optionPrice: number
}

/**
 * 특정 예약에 대한 모든 옵션 목록을 조회하는 API 함수
 * @param reservationId - 옵션을 조회할 예약의 ID
 * @returns ReservationOption[] - 해당 예약에 추가된 옵션 목록
 */
export const getOptionsForReservation = async (
  reservationId: number,
): Promise<ReservationOption[]> => {
  return customFetch<ReservationOption[]>(
    `${API_ENDPOINTS.RESERVATION_OPTION}/${reservationId}`,
  )
}

/**
 * 특정 예약에 선택된 옵션 목록 전체를 저장하는 API 함수
 * @param reservationId - 옵션을 추가할 예약의 ID
 * @param optionIds - 저장할 옵션들의 ID 배열
 * @returns void
 */
export const saveOptionsForReservation = async (
  reservationId: number,
  optionIds: number[],
): Promise<void> => {
  return customFetch<void>(
    `${API_ENDPOINTS.RESERVATION_OPTION}/${reservationId}`,
    {
      method: 'POST',
      body: JSON.stringify(optionIds),
    },
  )
}
