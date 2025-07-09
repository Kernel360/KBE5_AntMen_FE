import type { ReviewResponse } from '@/shared/api/review'

export function mapReviewResponseToModel(response: ReviewResponse): any {
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