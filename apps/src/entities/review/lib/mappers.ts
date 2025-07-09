import type { ReviewResponse } from '@/shared/api/review'

export interface MappedReview {
  id: string | number
  rating: number
  comment: string
  createdAt: string
  customerProfile?: string
  customerName?: string
  managerProfile?: string
  managerName?: string
  reviewId: number
  reviewRating: number
  reviewComment: string
  reviewDate: string
  reviewCustomerProfile?: string
  reviewCustomerName?: string
  reviewManagerProfile?: string
  reviewManagerName?: string
}

export function mapReviewResponseToModel(response: ReviewResponse): MappedReview {
  // 마이크로초 제거 및 Z 보정
  let safeDate = response.reviewDate.replace(/\.\d{3,6}$/, '');
  if (!safeDate.endsWith('Z')) safeDate += 'Z';
  return {
    ...response,
    id: response.reviewId,
    createdAt: safeDate,
    rating: response.reviewRating,
    comment: response.reviewComment,
    customerProfile: response.reviewCustomerProfile,
    customerName: response.reviewCustomerName,
    managerProfile: response.reviewManagerProfile,
    managerName: response.reviewManagerName,
  };
} 