'use client'

import { CommonHeader } from '@/shared/ui/Header/CommonHeader'
import { ReviewCard } from './ReviewCard'
import { type ReviewResponse } from '@/shared/api/review'

// 날짜 포맷 함수 (마이크로초 제거)
function formatDate(dateString: string) {
  const safeString = dateString.replace(/\.\d{6}$/, '')
  const date = new Date(safeString)
  if (isNaN(date.getTime())) return ''
  return date.toLocaleDateString('ko-KR')
}

// 이름 마스킹 함수
function maskName(name: string) {
  if (!name) return ''
  if (name.length <= 2) return name
  return name[0] + '*'.repeat(name.length - 2) + name[name.length - 1]
}

interface ReviewListClientProps {
  reviews: ReviewResponse[]
}

export const ReviewListClient = ({ reviews }: ReviewListClientProps) => {
  return (
    <main className="min-h-screen bg-gray-50">
      <CommonHeader title="리뷰 목록" showBackButton />
      <div className="pt-16 p-0 pb-20 min-h-[calc(100vh-64px)]">
        <div className="max-w-xl mx-auto bg-white">
          <section className="px-5 py-8">
            <h2 className="text-lg font-bold text-slate-900 mb-4">전체 고객 리뷰</h2>
            <div className="space-y-4">
              {reviews.length === 0 ? (
                <div className="text-center text-gray-400 py-8">아직 작성된 리뷰가 없습니다.</div>
              ) : (
                reviews.map((review) => (
                  <ReviewCard
                    key={review.reviewId}
                    review={{
                      id: review.reviewId,
                      customerName: maskName(review.reviewCustomerName),
                      customerProfile: review.reviewCustomerProfile,
                      managerName: review.reviewManagerName,
                      managerProfile: review.reviewManagerProfile,
                      rating: review.reviewRating,
                      comment: review.reviewComment,
                      createdAt: formatDate(review.reviewDate)
                    }}
                    showProfileType="customer"
                  />
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}