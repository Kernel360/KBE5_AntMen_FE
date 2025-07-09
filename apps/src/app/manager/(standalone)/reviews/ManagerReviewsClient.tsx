'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ReviewCard } from '@/entities/review/ui/ReviewCard'
import { StaticStarRating } from '@/shared/ui/StaticStarRating'
import { mapReviewResponseToModel } from '@/entities/review/lib/mappers'
import type { ReviewResponse } from '@/shared/api/review'
import { managerApi } from '@/shared/api/review'
import { EditReviewModal, DeleteConfirmModal } from '@/shared/ui/modal/ReviewModals'
import { CommonHeader } from '@/shared/ui/Header/CommonHeader'
import { getManagerReviewSummary, type ReviewSummary } from '@/shared/api/review'
import { useAuthStore } from '@/shared/stores/authStore'

type ActiveTab = 'received' | 'written'

function EmptyState({ tab }: { tab: ActiveTab }) {
  const message = tab === 'received'
    ? '아직 받은 리뷰가 없습니다.'
    : '아직 작성한 리뷰가 없습니다.'
  return (
    <div className="text-center py-20">
      <p className="text-slate-500">{message}</p>
    </div>
  )
}

function ReviewStats({ summary }: { summary: ReviewSummary | null }) {
  if (!summary) return null
  return (
    <section className="p-5 border-b border-gray-100 bg-slate-50">
      <div className="flex items-center gap-4">
        <div className="flex-1 text-center">
          <h2 className="text-sm font-semibold text-slate-500 mb-1">리뷰 총 개수</h2>
          <p className="text-xl font-bold text-slate-800">{summary.totalReviews}개</p>
        </div>
        <div className="flex-1 text-center">
          <h2 className="text-sm font-semibold text-slate-500 mb-1">전체 평점</h2>
          <div className="flex items-center justify-center gap-2">
            <StaticStarRating rating={summary.avgRating} />
            <span className="text-xl font-bold text-slate-800">{summary.avgRating}</span>
          </div>
        </div>
      </div>
    </section>
  )
}

// 이름 마스킹 함수
function maskName(name: string) {
  if (!name) return ''
  if (name.length <= 2) return name
  return name[0] + '*'.repeat(name.length - 2) + name[name.length - 1]
}

export default function ManagerReviewsClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tabQuery = searchParams.get('tab')
  const [isEditModalOpen, setEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedReview, setSelectedReview] = useState<ReviewResponse | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [reviewSummary, setReviewSummary] = useState<ReviewSummary | null>(null)
  const [receivedReviews, setReceivedReviews] = useState<ReviewResponse[]>([])
  const [writtenReviews, setWrittenReviews] = useState<ReviewResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuthStore()

  // 쿼리 기반 탭 상태
  const activeTab: ActiveTab = tabQuery === 'written' ? 'written' : 'received'

  // fetchSummary, fetchReviews를 useEffect 바깥에서 선언
  const fetchSummary = async () => {
    if (!user?.userId) return
    try {
      setLoading(true)
      setError(null)
      const summary = await getManagerReviewSummary(user.userId)
      setReviewSummary(summary)
    } catch (error) {
      setError('리뷰 요약 정보를 불러오는데 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }
  const fetchReviews = async () => {
    try {
      const [receivedResponses, writtenResponses] = await Promise.all([
        managerApi.getMyReceivedReviews(),
        managerApi.getMyWrittenReviews()
      ])
      setReceivedReviews(receivedResponses.map(mapReviewResponseToModel).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
      setWrittenReviews(writtenResponses.map(mapReviewResponseToModel).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
    } catch (error) {
      setError('리뷰를 불러오는데 실패했습니다.')
    }
  }
  const fetchAll = async () => {
    await fetchSummary()
    await fetchReviews()
  }

  useEffect(() => {
    fetchAll()
  }, [user?.userId])

  const handleOpenEditModal = (review: ReviewResponse) => {
    setSelectedReview(review)
    setEditModalOpen(true)
  }

  const handleOpenDeleteModal = (review: ReviewResponse) => {
    setSelectedReview(review)
    setDeleteModalOpen(true)
  }

  const handleCloseModals = () => {
    setSelectedReview(null)
    setEditModalOpen(false)
    setDeleteModalOpen(false)
  }

  const handleSaveReview = async (id: string, newRating: number, newContent: string) => {
    try {
      await managerApi.updateReview(Number(id), {
        reviewRating: newRating,
        reviewComment: newContent,
      })
      handleCloseModals()
      alert('리뷰가 성공적으로 수정되었습니다.')
      await fetchAll()
      router.replace(`?tab=written`)
    } catch (error) {
      console.error('리뷰 수정 실패:', error)
      alert('리뷰 수정에 실패했습니다.')
    }
  }

  const handleDeleteReview = async () => {
    if (!selectedReview) return
    try {
      setIsDeleting(true)
      await managerApi.deleteReview(Number(selectedReview.reviewId))
      handleCloseModals()
      alert('리뷰가 성공적으로 삭제되었습니다.')
      await fetchAll()
      router.replace(`?tab=written`)
    } catch (error) {
      console.error('리뷰 삭제 실패:', error)
      alert('리뷰 삭제에 실패했습니다.')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <main className="flex min-h-screen flex-col bg-white">
      <CommonHeader 
        title="리뷰 관리"
        showBackButton
      />
      <div className="flex-1 flex flex-col pt-[64px]">
        {/* Tab Navigation */}
        <div className="sticky top-[64px] z-10 bg-white border-b border-gray-200">
          <div className="grid grid-cols-2">
            <button
              onClick={() => router.replace(`?tab=received`)}
              className={`relative py-3.5 text-sm font-medium transition-colors ${
                activeTab === 'received' ? 'bg-primary/10' : ''
              }`}
            >
              <span className={activeTab === 'received' ? 'text-primary' : 'text-gray-600'}>
                받은 리뷰
              </span>
              {activeTab === 'received' && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary" />
              )}
            </button>
            <button
              onClick={() => router.replace(`?tab=written`)}
              className={`relative py-3.5 text-sm font-medium transition-colors ${
                activeTab === 'written' ? 'bg-primary/10' : ''
              }`}
            >
              <span className={activeTab === 'written' ? 'text-primary' : 'text-gray-600'}>
                작성한 리뷰
              </span>
              {activeTab === 'written' && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary" />
              )}
            </button>
          </div>
        </div>
        {/* 리뷰 통계 (받은 리뷰 탭 전용) */}
        {activeTab === 'received' && <ReviewStats summary={reviewSummary} />}
        {/* Content */}
        <div className="p-5 space-y-4">
          {loading ? (
            <div className="text-center py-20 text-slate-400">로딩 중...</div>
          ) : error ? (
            <div className="text-center py-20 text-red-500">{error}</div>
          ) : (
            <>
              {activeTab === 'received' && (
                receivedReviews.length > 0
                  ? receivedReviews.map(review => (
                      <ReviewCard
                        key={review.reviewId}
                        review={{
                          ...review,
                          reviewCustomerName: maskName(review.reviewCustomerName),
                        }}
                        showProfileType="customer"
                      />
                    ))
                  : <EmptyState tab="received" />
              )}
              {activeTab === 'written' && (
                writtenReviews.length > 0
                  ? writtenReviews.map(review => (
                      <ReviewCard
                        key={review.reviewId}
                        review={review}
                        showProfileType="customer"
                        onEdit={id => {
                          const r = writtenReviews.find(r => r.reviewId === Number(id))
                          if (r) handleOpenEditModal(r)
                        }}
                        onDelete={id => {
                          const r = writtenReviews.find(r => r.reviewId === Number(id))
                          if (r) handleOpenDeleteModal(r)
                        }}
                      />
                    ))
                  : <EmptyState tab="written" />
              )}
            </>
          )}
        </div>
      </div>
      {/* 모달 렌더링 */}
      <EditReviewModal
        isOpen={isEditModalOpen}
        onClose={handleCloseModals}
        review={selectedReview}
        onSave={handleSaveReview}
      />
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseModals}
        onConfirm={handleDeleteReview}
        isDeleting={isDeleting}
      />
    </main>
  )
} 