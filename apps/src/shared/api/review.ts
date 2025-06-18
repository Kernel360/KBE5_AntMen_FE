import { customFetch } from './base'

export type ReviewAuthorType = 'CUSTOMER' | 'MANAGER'

export interface ReviewRequest {
  reservationId: number
  reviewRating: number
  reviewComment?: string
  reviewAuthor: ReviewAuthorType
}

export interface ReviewResponse {
  reviewId: number
  reviewCustomerId: number
  reviewCustomerName: string
  reviewCustomerProfile: string
  reviewManagerId: number
  reviewManagerName: string
  reviewManagerProfile: string
  reservationId: number
  reviewRating: number
  reviewComment: string
  reviewAuthor: ReviewAuthorType
  reviewDate: string
}

/**
 * 내가 작성한 리뷰 목록을 조회하는 API 함수
 * @returns ReviewResponse[] - 리뷰 목록
 */
export const getMyWrittenReviews = async (): Promise<ReviewResponse[]> => {
  const response = await customFetch<ReviewResponse[]>('https://api.antmen.site:9091/api/v1/customer/reviews/my/written')
  console.log('📦 [getMyWrittenReviews] response:', response)
  return response
}