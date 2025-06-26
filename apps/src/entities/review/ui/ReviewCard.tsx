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
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            {profile && (
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100">
                <img
                  src={profile}
                  alt={`${name} 프로필`}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div>
              <span className="font-bold text-gray-900">{name}</span>
              <div className="text-sm text-gray-500 mt-0.5">
                {serviceType && serviceDate
                  ? `${serviceType} · ${serviceDate}`
                  : new Date(review.createdAt).toLocaleDateString('ko-KR')}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StaticStarRating rating={review.rating} />
            {(onEdit || onDelete) && (
              <div className="relative">
                <button onClick={() => setMenuOpen(!menuOpen)} className="p-1">
                  <EllipsisVerticalIcon className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                </button>
                {menuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-28 bg-white rounded-lg shadow-lg z-10 border border-gray-100 overflow-hidden"
                    onMouseLeave={() => setMenuOpen(false)}
                  >
                    {onEdit && (
                      <button
                        onClick={() => { onEdit(review.id); setMenuOpen(false); }}
                        className="block w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        수정
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => { onDelete(review.id); setMenuOpen(false); }}
                        className="block w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
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
      </div>
      <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">{review.comment}</p>
    </div>
  )
} 