import { ReviewRequest, ReviewResponse, UpdateReviewRequest } from '@/shared/api/review';
import { customFetch } from '@/shared/api/base';

const BASE_URL = 'http://localhost:9092/v1/manager/reviews';

export async function createReview(
  dto: ReviewRequest,
  token: string
): Promise<ReviewResponse> {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(dto),
  });
  if (!res.ok) {
    throw new Error('리뷰 등록에 실패했습니다.');
  }
  return res.json();
}

export async function updateReview(
  reviewId: number,
  dto: UpdateReviewRequest
): Promise<ReviewResponse> {
  return await customFetch<ReviewResponse>(`${BASE_URL}/${reviewId}`, {
    method: 'PUT',
    body: JSON.stringify(dto),
  });
}

export async function deleteReview(reviewId: number): Promise<void> {
  await customFetch<void>(`${BASE_URL}/${reviewId}`, {
    method: 'DELETE',
  });
} 