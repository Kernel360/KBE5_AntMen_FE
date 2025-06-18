import { ReviewRequest, ReviewResponse } from '@/shared/api/review';

export async function createReview(
  dto: ReviewRequest,
  token: string
): Promise<ReviewResponse> {
  const res = await fetch('http://localhost:9092/v1/manager/reviews', {
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