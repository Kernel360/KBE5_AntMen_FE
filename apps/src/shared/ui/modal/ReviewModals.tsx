'use client'

import { useState, useEffect } from 'react'
import { XMarkIcon } from '@heroicons/react/24/solid'
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid'
import type { Review } from '@/entities/review'

interface EditReviewModalProps {
  isOpen: boolean
  onClose: () => void
  review: Review | null
  onSave: (id: string, newRating: number, newContent: string) => Promise<void>
}

export function EditReviewModal({
  isOpen,
  onClose,
  review,
  onSave,
}: EditReviewModalProps) {
  const [rating, setRating] = useState(0)
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (review) {
      setRating(review.rating)
      setContent(review.comment)
    }
  }, [review])

  if (!isOpen || !review) return null

  const handleSave = async () => {
    if (rating === 0) {
      alert('별점을 선택해주세요.')
      return
    }
    if (!content.trim()) {
      alert('리뷰 내용을 입력해주세요.')
      return
    }

    try {
      setIsSubmitting(true)
      await onSave(review.id, rating, content)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">리뷰 수정</h2>
          <button onClick={onClose} disabled={isSubmitting}>
            <XMarkIcon className="w-6 h-6"/>
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">별점</label>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <StarIconSolid
                  key={star}
                  className={`w-8 h-8 cursor-pointer ${
                    star <= rating ? 'text-yellow-400' : 'text-gray-300'
                  } ${isSubmitting ? 'opacity-50' : ''}`}
                  onClick={() => !isSubmitting && setRating(star)}
                />
              ))}
            </div>
          </div>
          <div>
            <label htmlFor="review-content" className="block text-sm font-medium text-gray-700 mb-1">
              내용
            </label>
            <textarea
              id="review-content"
              rows={4}
              className="w-full p-2 border border-gray-300 rounded-md"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={isSubmitting}
              maxLength={200}
            />
            <div className="text-right text-xs text-gray-500 mt-1">
              {content.length}/200
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-md text-sm font-medium disabled:opacity-50"
            disabled={isSubmitting}
          >
            취소
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-primary-500 text-white rounded-md text-sm font-medium disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? '저장 중...' : '저장'}
          </button>
        </div>
      </div>
    </div>
  )
}

interface DeleteConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => Promise<void>
  isDeleting: boolean
}

export function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
}: DeleteConfirmModalProps) {
  if (!isOpen) return null
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-sm text-center">
        <h2 className="text-lg font-bold mb-4">리뷰 삭제</h2>
        <p className="text-slate-600 mb-6">정말로 이 리뷰를 삭제하시겠습니까?</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-200 rounded-md text-sm font-medium disabled:opacity-50"
            disabled={isDeleting}
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-red-500 text-white rounded-md text-sm font-medium disabled:opacity-50"
            disabled={isDeleting}
          >
            {isDeleting ? '삭제 중...' : '삭제'}
          </button>
        </div>
      </div>
    </div>
  )
} 