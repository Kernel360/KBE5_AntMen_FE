'use client'

import { StaticStarRating } from '@/shared/ui/StaticStarRating'
import { EllipsisVerticalIcon } from '@heroicons/react/24/solid'
import type { Review } from '../model/types'
import { useState } from 'react'

interface ReviewCardProps {
  review: Review
  // 'manager' = 매니저 프로필/이름, 'customer' = 고객 프로필/이름
  showProfileType?: 'manager' | 'customer'
  serviceType?: string
  serviceDate?: string
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
}

export const ReviewCard = ({
  review,
  showProfileType = 'manager',
  serviceType,
  serviceDate,
  onEdit,
  onDelete,
}: ReviewCardProps) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const profile = showProfileType === 'manager' ? review.managerProfile : review.customerProfile
  const name = showProfileType === 'manager' ? review.managerName : review.customerName

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="font-bold text-slate-800 text-lg">{name}</span>
          <div className="flex items-center gap-2">
            <StaticStarRating rating={review.rating} />
            {(onEdit || onDelete) && (
              <div className="relative">
                <button onClick={() => setMenuOpen(!menuOpen)} className="p-1">
                  <EllipsisVerticalIcon className="w-5 h-5 text-slate-500" />
                </button>
                {menuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-28 bg-white rounded-md shadow-lg z-10 border"
                    onMouseLeave={() => setMenuOpen(false)}
                  >
                    {onEdit && (
                      <button
                        onClick={() => { onEdit(review.id); setMenuOpen(false); }}
                        className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-gray-100"
                      >
                        수정
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => { onDelete(review.id); setMenuOpen(false); }}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        삭제
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="text-sm text-slate-500">
          {serviceType && serviceDate
            ? `${serviceType} · ${serviceDate}`
            : new Date(review.createdAt).toLocaleDateString('ko-KR')}
        </div>
      </div>
      <p className="text-slate-700 text-sm leading-relaxed">{review.comment}</p>
    </div>
  )
} 