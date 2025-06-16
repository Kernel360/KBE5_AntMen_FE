import { customFetch } from '@/shared/api/base'
import { ReservationHistoryDto } from '../model/types'

const BASE_URL = 'http://localhost:19092/v1/manager'

export const getMatchingRequests = async (): Promise<
  ReservationHistoryDto[]
> => {
  return customFetch<ReservationHistoryDto[]>(`${BASE_URL}/matching/list`)
}

export const acceptMatchingRequest = async (
  requestId: string,
): Promise<void> => {
  return customFetch<void>(`${BASE_URL}/matching/${requestId}/accept`, {
    method: 'PUT',
  })
}

export const rejectMatchingRequest = async (
  requestId: string,
): Promise<void> => {
  return customFetch<void>(`${BASE_URL}/matching/${requestId}/reject`, {
    method: 'PUT',
  })
}
