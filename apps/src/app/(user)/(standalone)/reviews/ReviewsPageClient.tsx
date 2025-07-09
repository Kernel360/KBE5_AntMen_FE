'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import type { ReviewResponse } from '@/shared/api/review'
import { ReviewCard } from '@/entities/review/ui/ReviewCard'
import { EditReviewModal, DeleteConfirmModal } from '@/shared/ui/modal/ReviewModals'
import { customerApi } from '@/shared/api/review'
import { mapReviewResponseToModel } from '@/entities/review/lib/mappers'
import { CommonHeader } from '@/shared/ui/Header/CommonHeader'

function EmptyState() {
  return (
    <div className="text-center py-20">
      <p className="text-slate-500">아직 작성한 리뷰가 없습니다.</p>
    </div>
  )
}

export default function ReviewsPageClient() {
  const router = useRouter()
  const [reviews, setReviews] = useState<ReviewResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditModalOpen, setEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedReview, setSelectedReview] = useState<ReviewResponse | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setIsLoading(true)
        const reviewResponses = await customerApi.getMyWrittenReviews()
        const mappedReviews = reviewResponses.map(mapReviewResponseToModel).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setReviews(mappedReviews)
      } catch (error) {
        console.error('Error fetching reviews:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchReviews()
  }, [])

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
      // API 호출
      await customerApi.updateReview(Number(id), {
        reviewRating: newRating,
        reviewComment: newContent,
      })
      // 성공 시 로컬 상태 업데이트
      setReviews(prev => prev.map(r => 
        r.reviewId === Number(id)
          ? { ...r, rating: newRating, comment: newContent }
          : r
      ))
      // 모달 닫기
      handleCloseModals()
      // 성공 메시지
      alert('리뷰가 성공적으로 수정되었습니다.')
      router.refresh()
    } catch (error) {
      console.error('리뷰 수정 실패:', error)
      alert('리뷰 수정에 실패했습니다.')
    }
  }

  const handleDeleteReview = async () => {
    if (!selectedReview) return
    try {
      setIsDeleting(true)
      // API 호출
      await customerApi.deleteReview(Number(selectedReview.reviewId))
      // 성공 시 로컬 상태 업데이트
      setReviews(prev => prev.filter(r => r.reviewId !== selectedReview.reviewId))
      // 모달 닫기
      handleCloseModals()
      // 성공 메시지
      alert('리뷰가 성공적으로 삭제되었습니다.')
      router.refresh()
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
        {/* 내용 */}
        <div className="p-5 space-y-4">
          {isLoading ? (
            <div className="text-center py-20 text-gray-400">로딩 중...</div>
          ) : error ? (
            <div className="text-center py-20 text-red-500">{error}</div>
          ) : reviews.length > 0 ? (
            reviews.map(review => (
              <ReviewCard
                key={review.reviewId}
                review={review}
                onEdit={id => {
                  const r = reviews.find(r => r.reviewId === Number(id))
                  if (r) handleOpenEditModal(r)
                }}
                onDelete={id => {
                  const r = reviews.find(r => r.reviewId === Number(id))
                  if (r) handleOpenDeleteModal(r)
                }}
              />
            ))
          ) : (
            <EmptyState />
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