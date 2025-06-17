'use client'
import ReviewsPageClient from './ReviewsPageClient'
import { getMyWrittenReviews } from '@/shared/api/review'
import { mapReviewResponseToModel } from '@/entities/review/lib/mappers'

// export const metadata = {
//   title: '내가 쓴 리뷰 | AntMen',
//   description: '내가 작성한 리뷰 목록을 확인하세요.',
// }

export default async function Page() {
  try {
    const reviewResponses = await getMyWrittenReviews()
    const reviews = reviewResponses.map(mapReviewResponseToModel)
    return <ReviewsPageClient initialReviews={reviews} />
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return <ReviewsPageClient initialReviews={[]} />
  }
} 