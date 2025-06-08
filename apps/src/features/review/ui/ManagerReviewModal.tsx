'use client'

import { useState } from 'react'
import { StarRating } from './StarRating'
import type { CreateReviewRequest } from '@/entities/review'

interface ManagerReviewModalProps {
  isOpen: boolean
  onClose: () => void
  workId: string
  onSubmit: (reviewData: CreateReviewRequest) => Promise<void>
}

export const ManagerReviewModal = ({
  isOpen,
  onClose,
  workId,
  onSubmit,
}: ManagerReviewModalProps) => {
  const [rating, setRating] = useState(0)
  const [serviceComment, setServiceComment] = useState('')
  const [customerFeedback, setCustomerFeedback] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (rating === 0) {
      alert('별점을 선택해주세요.')
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit({
        workId,
        rating,
        serviceCompletionComment: serviceComment || undefined,
        customerFeedback: customerFeedback || undefined,
      })

      // 초기화
      setRating(0)
      setServiceComment('')
      setCustomerFeedback('')
      onClose()
    } catch (error) {
      console.error('리뷰 등록 실패:', error)
      alert('리뷰 등록에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleServiceCommentChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const value = e.target.value
    if (value.length <= 500) {
      setServiceComment(value)
    }
  }

  const handleCustomerFeedbackChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const value = e.target.value
    if (value.length <= 500) {
      setCustomerFeedback(value)
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black bg-opacity-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
    >
      <div
        className="w-full max-w-mobile bg-white rounded-t-[20px] animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <header className="flex items-center justify-between px-6 pt-5">
          <h2 className="text-lg font-black text-[#333333]">리뷰</h2>
          <button
            onClick={onClose}
            className="w-6 h-6 flex items-center justify-center"
            aria-label="닫기"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18 6L6 18"
                stroke="#666666"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M6 6L18 18"
                stroke="#666666"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </header>

        {/* 콘텐츠 */}
        <main className="px-6 pt-6 pb-8 space-y-8">
          {/* 질문 섹션 */}
          <section className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-base font-medium text-[#333333] text-center">
                서비스 제공이 완료되었나요?
              </h3>
              <p className="text-sm text-[#666666] text-center">
                매니저님의 소중한 의견을 남겨주세요.
              </p>
            </div>

            {/* 별점 */}
            <StarRating rating={rating} onRatingChange={setRating} size={32} />
          </section>

          {/* 피드백 섹션 */}
          <section className="space-y-4">
            {/* 고객에게 전달할 내용 */}
            <div className="space-y-4">
              <div className="bg-[#F5F5F5] rounded-lg p-4 h-[120px] flex flex-col">
                <textarea
                  value={serviceComment}
                  onChange={handleServiceCommentChange}
                  placeholder={`고객님에게 전달하고싶은 내용을 남겨주세요.\n(선택사항, 비밀 주소 등 개인정보 입력 불가)`}
                  className="flex-1 bg-transparent resize-none outline-none text-sm text-[#333333] placeholder-[#999999] leading-relaxed"
                  aria-label="고객에게 전달할 내용"
                />
                <div className="flex justify-end">
                  <span className="text-xs text-[#CCCCCC]">
                    {serviceComment.length}/500
                  </span>
                </div>
              </div>

              {/* 고객님에 대한 평가 */}
              <p className="text-sm text-[#666666]">고객님에 대한 평가</p>

              <div className="bg-[#F5F5F5] rounded-lg p-4 h-[120px] flex flex-col">
                <textarea
                  value={customerFeedback}
                  onChange={handleCustomerFeedbackChange}
                  placeholder={`고객님에 대한 의견을 남겨주세요.\n(선택사항, 비밀 주소 등 개인정보 입력 불가)`}
                  className="flex-1 bg-transparent resize-none outline-none text-sm text-[#333333] placeholder-[#999999] leading-relaxed"
                  aria-label="고객에 대한 평가"
                />
                <div className="flex justify-end">
                  <span className="text-xs text-[#CCCCCC]">
                    {customerFeedback.length}/500
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* 등록 버튼 */}
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || rating === 0}
            className="w-full h-12 bg-[#4ABED9] rounded-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="text-base font-black text-white">
              {isSubmitting ? '등록 중...' : '등록'}
            </span>
          </button>
        </main>
      </div>
    </div>
  )
}
