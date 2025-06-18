'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  ReservationHistoryDto,
  MatchingFilterTab,
  MatchingRequest,
} from '@/entities/matching'
import {
  getMatchingRequests,
  acceptMatchingRequest,
  rejectMatchingRequest,
} from '@/entities/matching/api/matchingAPi'
import { MatchingRequestCard } from '@/features/matching'

const tabs: { id: MatchingFilterTab; label: string }[] = [
  { id: 'all', label: '전체' },
  { id: 'oneTime', label: '일회성' },
  { id: 'regular', label: '정기' },
]

// address에서 '구'만 추출하는 함수 (예: "서울시 강남구 역삼동 ..." → "강남구")
function extractDistrict(address: string): string {
  const match = address.match(/([가-힣]+구)/)
  return match ? match[1] : address
}

function toMatchingRequest(dto: ReservationHistoryDto): MatchingRequest {
  return {
    id: String(dto.reservationId),
    categoryName: dto.categoryName,
    reservationDate: dto.reservationDate,
    reservationTime: '', // 필요시 dto에서 추출
    reservationDuration: dto.totalDuration,
    additionalDuration: 0, // 필요시 dto에서 추출
    reservationAmount: dto.totalAmount,
    location: {
      district: extractDistrict(dto.address),
    },
    type: 'oneTime', // 실제 값 필요시 dto에서 추출
    status: 'pending', // 실제 값 필요시 dto에서 추출
  }
}

const ManagerMatchingPage = () => {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<MatchingFilterTab>('all')
  const [requests, setRequests] = useState<ReservationHistoryDto[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const data = await getMatchingRequests()
        setRequests(data)
      } catch (err) {
        setError('매칭 요청을 불러오는데 실패했습니다.')
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const filteredRequests = requests.filter((request) => {
    if (activeTab === 'all') return true
    // ReservationHistoryDto에 type 필드가 없으므로, 필요시 서버에서 type을 내려주거나, 프론트에서 분류 로직 추가 필요
    return true // 임시로 전체 반환
  })

  const handleAccept = async (requestId: number) => {
    try {
      await acceptMatchingRequest(String(requestId))
      // TODO: setRequests로 상태 갱신 (API 재호출 또는 optimistic update)
      alert(`매칭 요청 ${requestId} 수락됨`)
    } catch (e) {
      alert('수락 처리 중 오류가 발생했습니다.')
    }
  }

  const handleReject = async (requestId: number) => {
    try {
      await rejectMatchingRequest(String(requestId))
      // TODO: setRequests로 상태 갱신 (API 재호출 또는 optimistic update)
      alert(`매칭 요청 ${requestId} 거절됨`)
    } catch (e) {
      alert('거절 처리 중 오류가 발생했습니다.')
    }
  }

  const handleBack = () => {
    router.back()
  }

  return (
    <main className="min-h-screen bg-gray-100">
      {/* 헤더 */}
      <header className="flex items-center justify-between p-5 bg-white">
        <button
          onClick={handleBack}
          className="flex h-6 w-6 items-center justify-center"
        >
          <Image
            src="/icons/arrow-left.svg"
            alt="뒤로가기"
            width={24}
            height={24}
          />
        </button>
        <h1 className="flex-1 text-center text-2xl font-bold">매칭 요청</h1>
        <div className="h-6 w-6" /> {/* 정렬을 위한 공간 */}
      </header>

      {/* 콘텐츠 */}
      <div className="p-4">
        {/* 필터 탭 */}
        <section
          className="flex gap-2 mb-4"
          role="tablist"
          aria-label="매칭 요청 필터"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`panel-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 h-9 rounded-2xl text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-[#E8F0FE] text-[#0fbcd6]'
                  : 'border border-gray-300 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </section>

        {/* 매칭 요청 목록 */}
        <section
          className="space-y-4"
          role="tabpanel"
          aria-labelledby={`tab-${activeTab}`}
          id={`panel-${activeTab}`}
        >
          {isLoading ? (
            <div className="text-center py-8">로딩 중...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">{error}</div>
          ) : filteredRequests.length > 0 ? (
            filteredRequests.map((request) =>
              request ? (
                <MatchingRequestCard
                  key={request.reservationId}
                  request={toMatchingRequest(request)}
                  onAccept={() => handleAccept(request.reservationId)}
                  onReject={() => handleReject(request.reservationId)}
                />
              ) : null,
            )
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">
                {activeTab === 'all'
                  ? '매칭 요청이 없습니다'
                  : `${tabs.find((t) => t.id === activeTab)?.label} 매칭 요청이 없습니다`}
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}

export default ManagerMatchingPage
