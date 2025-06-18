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

export interface UpdateReviewRequest {
  reviewRating: number
  reviewComment: string
}

/**
 * 내가 작성한 리뷰 목록을 조회하는 API 함수
 * @returns ReviewResponse[] - 리뷰 목록
 */
export const getMyWrittenReviews = async (): Promise<ReviewResponse[]> => {
  const response = await customFetch<ReviewResponse[]>('http://localhost:9092/v1/manager/reviews/my/written')
  console.log('📦 [getMyWrittenReviews] response:', response)
  return response
}

/**
 * 리뷰를 수정하는 API 함수
 * @param reviewId - 수정할 리뷰 ID
 * @param dto - 수정할 리뷰 데이터
 * @returns ReviewResponse - 수정된 리뷰 정보
 */
export const updateReview = async (
  reviewId: number,
  dto: UpdateReviewRequest
): Promise<ReviewResponse> => {
  return await customFetch<ReviewResponse>(
    `http://localhost:9092/v1/manager/reviews/${reviewId}`,
    {
      method: 'PUT',
      body: JSON.stringify(dto),
    }
  )
}