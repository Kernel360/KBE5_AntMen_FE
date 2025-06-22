import { customFetch } from '@/shared/api/base'
import {
  ReservationHistoryDto,
  MatchingResponseRequestDto,
  PaginatedMatchingResponse,
} from '../model/types'

const BASE_URL = 'http://localhost:9092/v1/manager'
const MATCHING_API_URL = 'https://api.antmen.site:9091/api/v1/matchings'

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public statusText: string,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export const getMatchingRequests = async (
  page: number = 0,
  size: number = 5,
): Promise<PaginatedMatchingResponse> => {
  return customFetch<PaginatedMatchingResponse>(
    `${BASE_URL}/matching/list?page=${page}&size=${size}`,
  )
}

export const acceptMatchingRequest = async (
  matchingId: string,
): Promise<void> => {
  return customFetch<void>(`${BASE_URL}/matching/${matchingId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      matchingManagerIsAccept: true,
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

export const respondToMatching = async (
  matchingId: number,
  requestDto: MatchingResponseRequestDto,
): Promise<void> => {
  try {
    const response = await fetch(`${MATCHING_API_URL}/${matchingId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestDto),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      console.error('Matching Response Error:', {
        status: response.status,
        statusText: response.statusText,
        errorData,
      })
      throw new ApiError(
        errorData?.errorMessage || '매칭 응답에 실패했습니다.',
        response.status,
        response.statusText,
      )
    }

    console.log('Matching Response Success')
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    console.error('Matching response error:', error)
    throw new ApiError(
      '서버와 통신하는데 실패했습니다',
      500,
      'Internal Server Error',
    )
  }
}
// 수요자 매칭 응답
