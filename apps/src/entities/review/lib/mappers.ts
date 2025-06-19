import type { Review } from '../model/types'
import type { ReviewResponse } from '@/shared/api/review'

export function mapReviewResponseToModel(response: ReviewResponse): Review {
  return {
    id: String(response.reviewId),
    customerId: String(response.reviewCustomerId),
    customerName: response.reviewCustomerName,
    customerProfile: response.reviewCustomerProfile,
    managerId: String(response.reviewManagerId),
    managerName: response.reviewManagerName,
    managerProfile: response.reviewManagerProfile,
    reservationId: String(response.reservationId),
    rating: response.reviewRating,
    comment: response.reviewComment,
    authorType: response.reviewAuthor,
    createdAt: response.reviewDate,
  }
} 