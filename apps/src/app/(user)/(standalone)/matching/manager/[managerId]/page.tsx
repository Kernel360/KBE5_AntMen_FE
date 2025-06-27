// 매니저 상세 페이지

'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { StarIcon as StarIconOutline } from '@heroicons/react/24/outline'
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid'
import {
  ChevronLeftIcon,
  EllipsisHorizontalIcon,
} from '@heroicons/react/24/outline'
import { type Manager } from '@/widgets/manager/model/manager'
import { ManagerDetailLoading } from '@/widgets/manager'
import { CommonHeader } from '@/shared/ui/Header/CommonHeader'

export default function ManagerDetailPage() {
  const params = useParams()
  const router = useRouter()
  const managerId = params?.managerId as string

  const [manager, setManager] = useState<Manager | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // 매니저 상세 데이터 로딩 시뮬레이션
    const loadManagerDetail = async () => {
      try {
        // 실제 API 호출
        const response = await fetch(
          `https://api.antmen.site:9091/api/v1/customer/reservations/manager/${managerId}`,
        )
        
        if (!response.ok) {
          throw new Error(`매니저 정보를 불러올 수 없습니다. (${response.status})`)
        }
        
        const data = await response.json()

        // 목업 characteristics 추가
        const mockCharacteristics = [
          { id: '1', label: '친절해요', type: 'kind' },
          { id: '2', label: '시간 엄수', type: 'punctual' },
          { id: '3', label: '꼼꼼해요', type: 'thorough' },
        ]

        const managerWithMock = {
          ...data,
          characteristics: mockCharacteristics,
          // 프로필 이미지가 없으면 기본 이미지 사용
          profileImage: data.profileImage || '/icons/profile.png',
          // 기본값들 설정
          introduction: data.introduction || '안녕하세요! 성실하고 친절한 매니저입니다.',
          reviews: data.reviews || [],
        }
        setManager(managerWithMock)
        setIsLoading(false)
      } catch (error) {
        console.error('매니저 정보 로딩 실패:', error)
        setError(error instanceof Error ? error.message : '매니저 정보를 불러오는 중 오류가 발생했습니다.')
        setIsLoading(false)
      }
    }

    if (managerId) {
      loadManagerDetail()
    }
  }, [managerId])

  if (isLoading) {
    return <ManagerDetailLoading />
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <span className="text-2xl">⚠️</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            오류가 발생했습니다
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="w-full px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90"
            >
              다시 시도
            </button>
            <button
              onClick={() => router.back()}
              className="w-full px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300"
            >
              이전 페이지로
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!manager) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-slate-800 mb-2">
            매니저를 찾을 수 없습니다
          </h2>
          <button
            onClick={() => router.back()}
            className="text-primary hover:underline"
          >
            매니저 목록으로 이동
          </button>
        </div>
      </div>
    )
  }

  const renderStars = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <StarIconSolid key={i} className="w-5 h-5 text-yellow-400" />,
        )
      } else {
        stars.push(
          <StarIconOutline key={i} className="w-5 h-5 text-gray-300" />,
        )
      }
    }
    return stars
  }

  const getCharacteristicColor = (type: string) => {
    switch (type) {
      case 'kind':
        return 'bg-blue-100 text-blue-600'
      case 'punctual':
        return 'bg-green-100 text-green-600'
      case 'thorough':
        return 'bg-red-100 text-red-600'
      default:
        return 'bg-gray-100 text-gray-600'
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <CommonHeader 
        title="매니저 상세"
        showBackButton
      />
      
      {/* 콘텐츠 */}
      <div className="pt-16 p-0 pb-20 min-h-[calc(100vh-64px)]">
        <div className="max-w-[420px] mx-auto bg-white">
          {/* 프로필 섹션 */}
          <section className="px-5 py-8 text-center border-b border-gray-100">
            <div className="w-24 h-24 mx-auto mb-6 bg-slate-200 rounded-full flex items-center justify-center overflow-hidden">
              <img
                src={manager.profileImage}
                alt="프로필 이미지"
                className="w-full h-full object-cover"
                onError={(e) => {
                  // 이미지 로드 실패 시 기본 텍스트 표시
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = `<span class="text-2xl font-bold text-slate-600">${manager.name[0]}</span>`;
                  }
                }}
              />
            </div>

            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              {manager.name} 매니저
            </h1>
            <p className="text-slate-500 mb-4">
              {manager.gender} · {manager.age}세
            </p>

            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="flex items-center gap-1">
                {renderStars(manager.rating)}
              </div>
              <span className="text-lg font-semibold text-slate-800">
                {manager.rating}점
              </span>
            </div>
            <p className="text-sm text-slate-500">
              (리뷰 {manager.reviewCount}개)
            </p>
          </section>

          {/* 자기소개 */}
          <section className="px-5 py-6 border-b border-gray-100">
            <h2 className="text-lg font-bold text-slate-900 mb-4">자기소개</h2>
            <p className="text-slate-700 leading-relaxed">
              {manager.introduction}
            </p>
          </section>

          {/* 성격 특징 */}
          <section className="px-5 py-6 border-b border-gray-100">
            <h2 className="text-lg font-bold text-slate-900 mb-4">성격 특징</h2>
            <div className="flex flex-wrap gap-3">
              {manager.characteristics.map((char) => (
                <span
                  key={char.id}
                  className={`px-4 py-2 rounded-full text-sm font-medium ${getCharacteristicColor(char.type)}`}
                >
                  {char.label}
                </span>
              ))}
            </div>
          </section>

          {/* 고객 리뷰 */}
          <section className="px-5 py-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900">고객 리뷰</h2>
              <button
                onClick={() =>
                  router.push(`/matching/manager/${managerId}/reviews`)
                }
                className="text-primary text-sm font-medium"
              >
                전체보기 &gt;
              </button>
            </div>

            <div className="space-y-4">
              {manager.reviews?.map((review) => (
                <div key={review.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-slate-800">
                      {review.customerName}
                    </span>
                    <div className="flex items-center gap-1">
                      {renderStars(review.rating)}
                    </div>
                  </div>
                  <p className="text-slate-700 text-sm leading-relaxed mb-2">
                    {review.comment}
                  </p>
                  <p className="text-xs text-slate-500">{review.createdAt}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
