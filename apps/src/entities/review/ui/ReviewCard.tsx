'use client'

import { Star } from 'lucide-react'
import type { Review } from '../model/types'

interface ReviewCardProps {
  review: Review
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
}

export const ReviewCard = ({ review, onEdit, onDelete }: ReviewCardProps) => {
  return (
    <div className="bg-white p-5 rounded-xl space-y-4">
      {/* 리뷰 헤더: 매니저 프로필 이미지, 이름, 별점 */}
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
          {review.managerProfile ? (
            <img
              src={review.managerProfile}
              alt={review.managerName}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <span className="text-base font-black text-white">
              {review.managerName[0] || '👤'}
            </span>
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-lg font-black text-black">
              {review.managerName}
            </h3>
            <div className="flex items-center gap-1">
              <span className="text-sm font-medium text-black">
                {review.rating}
              </span>
              <Star className="w-4 h-4 text-orange-500 fill-orange-500" />
            </div>
          </div>
          <p className="text-sm text-gray-600">
            {new Date(review.createdAt).toLocaleDateString('ko-KR')}
          </p>
        </div>
      </div>

      {/* 리뷰 내용 */}
      <p className="text-base text-gray-800">{review.comment}</p>

      {/* 액션 버튼 */}
      {(onEdit || onDelete) && (
        <div className="flex justify-end gap-2 pt-2">
          {onEdit && (
            <button
              onClick={() => onEdit(review.id)}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              수정
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(review.id)}
              className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-900"
            >
              삭제
            </button>
          )}
        </div>
      )}
    </div>
  )
} 