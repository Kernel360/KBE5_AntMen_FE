import type { ReviewResponse } from '@/shared/api/review'

export function mapReviewResponseToModel(response: ReviewResponse): ReviewResponse {
  return {
    reviewId: response.reviewId,
    reviewCustomerId: response.reviewCustomerId,
    reviewCustomerName: response.reviewCustomerName,
    reviewCustomerProfile: response.reviewCustomerProfile,
    reviewManagerId: response.reviewManagerId,
    reviewManagerName: response.reviewManagerName,
    reviewManagerProfile: response.reviewManagerProfile,
    reservationId: response.reservationId,
    reviewRating: response.reviewRating,
    reviewComment: response.reviewComment,
    reviewAuthor: response.reviewAuthor,
    reviewDate: response.reviewDate,
  }
} 