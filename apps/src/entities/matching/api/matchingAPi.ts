import { customFetch } from '@/shared/api/base'
import { ReservationHistoryDto } from '../model/types'

const BASE_URL = 'http://localhost:9092/v1/manager'

export const getMatchingRequests = async (): Promise<
  ReservationHistoryDto[]
> => {
  return customFetch<ReservationHistoryDto[]>(`${BASE_URL}/matching/list`)
}

export const acceptMatchingRequest = async (
  matchingId: string,
): Promise<void> => {
  return customFetch<void>(`${BASE_URL}/matching/${matchingId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      matchingManagerIsAccept: true,
      matchingRefuseReason: '',
    }),
  })
}

export const rejectMatchingRequest = async (
  matchingId: string,
  refuseReason: string = '',
): Promise<void> => {
  return customFetch<void>(`${BASE_URL}/matching/${matchingId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      matchingManagerIsAccept: false,
      matchingRefuseReason: refuseReason,
    }),
  })
}
