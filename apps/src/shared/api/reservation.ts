import { customFetch } from './base'
import { Category, CategoryOption } from './category'
import type { ReservationRequest } from '.'

// Swagger의 ReservationResponseDto를 기반으로 타입을 정의합니다.
export interface ReservationResponse {
  reservationId: number
  customerId: number
  reservationCreatedAt: string
  reservationDate: string
  reservationTime: string // LocalTime이 string으로 변환되었다고 가정
  categoryId: number
  categoryName: string
  recommendDuration: number
  reservationDuration: number
  managerId: number | null
  matchedAt: string | null
  reservationStatus: string
  reservationCancelReason: string | null
  reservationMemo: string
  reservationAmount: number
  optionIds: number[]
  optionNames: string[]
  hasReview: boolean
}

/**
 * 신규 예약을 생성하는 API 함수 (매칭 대기 상태)
 * @param reservationData - 생성할 예약 정보
 * @returns ReservationResponse - 생성된 예약 상세 정보 (ID 포함)
 */
export const createReservation = async (
  reservationData: ReservationRequest,
): Promise<ReservationResponse> => {
  return customFetch<ReservationResponse>('https://api.antmen.site:9091/api/v1/customer/reservations', {
    method: 'POST',
    body: JSON.stringify(reservationData),
  })
}

/**
 * 특정 ID의 예약 정보를 조회하는 API 함수
 * @param reservationId - 조회할 예약의 ID
 * @returns ReservationResponse - 조회된 예약 상세 정보
 */
export const getReservationById = async (
  reservationId: number,
): Promise<ReservationResponse> => {
  return customFetch<ReservationResponse>(
    `https://api.antmen.site:9091/api/v1/customer/reservations/${reservationId}`,
  )
}

/**
 * 내 예약 목록 조회 API 함수
 */
export const getMyReservations = async (): Promise<ReservationResponse[]> => {
  return customFetch<ReservationResponse[]>('https://api.antmen.site:9091/api/v1/customer/reservations')
}

// TODO: 필요한 코드인가?
// /**
//  * 예약에 매니저를 배정(매칭)하는 API 함수
//  * @param reservationId - 매니저를 배정할 예약의 ID
//  * @param managerId - 배정할 매니저의 ID
//  * @returns ReservationResponse - 업데이트된 예약 정보
//  */
// export const updateReservationManager = async (
//   reservationId: number,
//   managerId: number,
// ): Promise<ReservationResponse> => {
//   return customFetch<ReservationResponse>(`/reservation/${reservationId}/match`, {
//     method: 'PATCH',
//     body: JSON.stringify({ managerId }),
//   });
// };

/**
 * 예약 상태를 변경하는 API 함수
 * @param reservationId - 상태를 변경할 예약의 ID
 * @param status - 변경할 새로운 상태
 * @returns ReservationResponse - 업데이트된 예약 정보
 */
export const updateReservationStatus = async (
  reservationId: number,
  status: string,
): Promise<ReservationResponse> => {
  return customFetch<ReservationResponse>(
    `/reservation/${reservationId}/status`,
    {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    },
  )
}

/**
 * 예약을 취소하는 API 함수
 * @param reservationId - 취소할 예약의 ID
 * @param reason - 취소 사유 (선택 사항)
 * @returns ReservationResponse - 업데이트된 예약 정보
 */
export const cancelReservation = async (
  reservationId: number,
  reason?: string,
): Promise<ReservationResponse> => {
  return customFetch<ReservationResponse>(
    `https://api.antmen.site:9091/api/v1/customer/reservations/${reservationId}/cancel`,
    {
      method: 'POST',
      body: JSON.stringify({ reason }),
    },
  )
}
