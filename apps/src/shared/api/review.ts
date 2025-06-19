import { customFetch } from './base'

export type ReviewAuthorType = 'CUSTOMER' | 'MANAGER'

const MANAGER_BASE_URL = 'http://localhost:9092/v1/manager/reviews'
const CUSTOMER_BASE_URL = 'http://localhost:9091/api/v1/customer/reviews'

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

// 매니저용 API 함수들
export const managerApi = {
  /**
   * 매니저가 리뷰를 작성하는 API 함수
   */
  createReview: async (dto: ReviewRequest): Promise<ReviewResponse> => {
    return await customFetch<ReviewResponse>(MANAGER_BASE_URL, {
      method: 'POST',
      body: JSON.stringify(dto),
    })
  },

  /**
   * 매니저가 작성한 리뷰 목록을 조회하는 API 함수
   */
  getMyWrittenReviews: async (): Promise<ReviewResponse[]> => {
    const response = await customFetch<ReviewResponse[]>(`${MANAGER_BASE_URL}/my/written`)
    console.log('📦 [getManagerWrittenReviews] response:', response)
    return response
  },

  /**
   * 매니저가 받은 리뷰 목록을 조회하는 API 함수
   */
  getMyReceivedReviews: async (): Promise<ReviewResponse[]> => {
    const response = await customFetch<ReviewResponse[]>(`${MANAGER_BASE_URL}/my/received`)
    console.log('📦 [getManagerReceivedReviews] response:', response)
    return response
  },

  /**
   * 매니저가 리뷰를 수정하는 API 함수
   */
  updateReview: async (
    reviewId: number,
    dto: UpdateReviewRequest
  ): Promise<ReviewResponse> => {
    return await customFetch<ReviewResponse>(
      `${MANAGER_BASE_URL}/${reviewId}`,
      {
        method: 'PUT',
        body: JSON.stringify(dto),
      }
    )
  },

  /**
   * 매니저가 리뷰를 삭제하는 API 함수
   */
  deleteReview: async (reviewId: number): Promise<void> => {
    await customFetch<void>(
      `${MANAGER_BASE_URL}/${reviewId}`,
      {
        method: 'DELETE',
      }
    )
  },
}

// 수요자용 API 함수들
export const customerApi = {
  /**
   * 수요자가 리뷰를 작성하는 API 함수
   */
  createReview: async (dto: ReviewRequest): Promise<ReviewResponse> => {
    return await customFetch<ReviewResponse>(CUSTOMER_BASE_URL, {
      method: 'POST',
      body: JSON.stringify(dto),
    })
  },

  /**
   * 수요자가 작성한 리뷰 목록을 조회하는 API 함수
   */
  getMyWrittenReviews: async (): Promise<ReviewResponse[]> => {
    const response = await customFetch<ReviewResponse[]>(`${CUSTOMER_BASE_URL}/my/written`)
    console.log('📦 [getCustomerWrittenReviews] response:', response)
    return response
  },

  /**
   * 수요자가 리뷰를 수정하는 API 함수
   */
  updateReview: async (
    reviewId: number,
    dto: UpdateReviewRequest
  ): Promise<ReviewResponse> => {
    return await customFetch<ReviewResponse>(
      `${CUSTOMER_BASE_URL}/${reviewId}`,
      {
        method: 'PUT',
        body: JSON.stringify(dto),
      }
    )
  },

  /**
   * 수요자가 리뷰를 삭제하는 API 함수
   */
  deleteReview: async (reviewId: number): Promise<void> => {
    await customFetch<void>(
      `${CUSTOMER_BASE_URL}/${reviewId}`,
      {
        method: 'DELETE',
      }
    )
  },
}