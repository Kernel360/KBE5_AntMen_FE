'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  ReservationHistoryDto,
  MatchingFilterTab,
  MatchingRequest,
  PaginatedMatchingResponse,
} from '@/entities/matching'
import {
  getMatchingRequests,
  acceptMatchingRequest,
  rejectMatchingRequest,
} from '@/entities/matching/api/matchingAPi'
import { MatchingRequestCard } from '@/features/matching'
import { RejectionModal } from '@/shared/ui/modal/RejectionModal'
import { useAuthStore } from '@/shared/stores/authStore'

const tabs: { id: MatchingFilterTab; label: string }[] = [
  { id: 'all', label: '전체' },
  // TODO: 기능 고도화시 활성화 할 것
  // { id: 'oneTime', label: '일회성' },
  // { id: 'regular', label: '정기' },
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
  const { setMatchingRequestCount } = useAuthStore()
  const [activeTab, setActiveTab] = useState<MatchingFilterTab>('all')
  const [requests, setRequests] = useState<ReservationHistoryDto[]>([])
  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
    hasNext: false,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [rejection, setRejection] = useState<{
    isOpen: boolean
    matchingId: number | null
  }>({ isOpen: false, matchingId: null })

  // Intersection Observer를 위한 ref
  const observerTarget = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const data: PaginatedMatchingResponse = await getMatchingRequests(0, 5)
        setRequests(data.content)
        setPagination({
          currentPage: data.number,
          totalPages: data.totalPages,
          totalElements: data.totalElements,
          hasNext: !data.last,
        })
        // 전역 상태 업데이트
        setMatchingRequestCount(data.totalElements)
      } catch (err) {
        setError('매칭 요청을 불러오는데 실패했습니다.')
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [setMatchingRequestCount])

  // 더 많은 데이터 로드 함수
  const loadMoreData = useCallback(async () => {
    if (!pagination.hasNext || isLoading || isLoadingMore) return

    try {
      setIsLoadingMore(true)
      const data: PaginatedMatchingResponse = await getMatchingRequests(
        pagination.currentPage + 1,
        5,
      )
      setRequests((prev) => [...prev, ...data.content])
      setPagination({
        currentPage: data.number,
        totalPages: data.totalPages,
        totalElements: data.totalElements,
        hasNext: !data.last,
      })
    } catch (err) {
      setError('추가 데이터를 불러오는데 실패했습니다.')
    } finally {
      setIsLoadingMore(false)
    }
  }, [pagination.hasNext, pagination.currentPage, isLoading, isLoadingMore])

  // Intersection Observer 설정
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && pagination.hasNext && !isLoadingMore) {
          loadMoreData()
        }
      },
      { threshold: 0.1 }
    )

    if (observerTarget.current) {
      observer.observe(observerTarget.current)
    }

    return () => observer.disconnect()
  }, [loadMoreData, pagination.hasNext, isLoadingMore])

  const filteredRequests = requests.filter((request) => {
    if (activeTab === 'all') return true
    // ReservationHistoryDto에 type 필드가 없으므로, 필요시 서버에서 type을 내려주거나, 프론트에서 분류 로직 추가 필요
    return true // 임시로 전체 반환
  })

  const handleAccept = async (matchingId: number) => {
    setIsProcessing(true)
    try {
      await acceptMatchingRequest(String(matchingId))
      setRequests((prev) =>
        prev.filter((r) => r.matchings[0].matchingId !== matchingId),
      )
      // 총 개수 업데이트
      const newCount = pagination.totalElements - 1
      setPagination((prev) => ({
        ...prev,
        totalElements: newCount,
      }))
      setMatchingRequestCount(newCount) // 전역 상태 업데이트
      alert('매칭을 수락했습니다.')
    } catch (e) {
      alert('수락 처리 중 오류가 발생했습니다.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleReject = async (reason: string) => {
    if (!rejection.matchingId) return
    setIsProcessing(true)
    try {
      await rejectMatchingRequest(String(rejection.matchingId), reason)
      setRequests((prev) =>
        prev.filter((r) => r.matchings[0].matchingId !== rejection.matchingId),
      )
      // 총 개수 업데이트
      const newCount = pagination.totalElements - 1
      setPagination((prev) => ({
        ...prev,
        totalElements: newCount,
      }))
      setMatchingRequestCount(newCount) // 전역 상태 업데이트
      alert('매칭을 거절했습니다.')
    } catch (e) {
      alert('거절 처리 중 오류가 발생했습니다.')
    } finally {
      setIsProcessing(false)
      setRejection({ isOpen: false, matchingId: null })
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

        {/* 총 개수 표시 */}
        {!isLoading && (
          <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <p className="text-sm font-medium text-gray-700">
                {pagination.totalElements > 0 
                  ? `총 ${pagination.totalElements}개의 매칭 요청이 있습니다`
                  : '새로운 매칭 요청이 없습니다'
                }
              </p>
            </div>
            {pagination.totalElements > 0 && (
              <p className="text-xs text-gray-500 mt-1 ml-4">
                요청을 확인하고 수락 또는 거절해주세요
              </p>
            )}
          </div>
        )}

        {/* 매칭 요청 목록 */}
        <section
          className="space-y-4"
          role="tabpanel"
          aria-labelledby={`tab-${activeTab}`}
          id={`panel-${activeTab}`}
        >
          {isLoading && requests.length === 0 ? (
            <div className="text-center py-8">로딩 중...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">{error}</div>
          ) : filteredRequests.length > 0 ? (
            <>
              {filteredRequests.map((request) =>
                request ? (
                  <MatchingRequestCard
                    key={request.reservationId}
                    request={toMatchingRequest(request)}
                    onAccept={() => handleAccept(request.matchings[0].matchingId)}
                    onReject={() =>
                      setRejection({
                        isOpen: true,
                        matchingId: request.matchings[0].matchingId,
                      })
                    }
                    isProcessing={isProcessing}
                  />
                ) : null,
              )}
              
              {/* 무한 스크롤 로딩 인디케이터 */}
              {pagination.hasNext && (
                <div 
                  ref={observerTarget}
                  className="flex justify-center py-4"
                >
                  {isLoadingMore && (
                    <div className="flex items-center gap-2 text-gray-500">
                      <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                      <span className="text-sm">더 많은 요청을 불러오는 중...</span>
                    </div>
                  )}
                </div>
              )}
              
              {/* 모든 데이터 로드 완료 표시 */}
              {!pagination.hasNext && filteredRequests.length > 0 && (
                <div className="text-center py-6">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <span className="text-sm text-gray-600">모든 매칭 요청을 확인했습니다</span>
                  </div>
                </div>
              )}
            </>
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
      <RejectionModal
        isOpen={rejection.isOpen}
        onClose={() => setRejection({ isOpen: false, matchingId: null })}
        onSubmit={handleReject}
        title="매칭 거절 사유"
        isProcessing={isProcessing}
      />
    </main>
  )
}

export default ManagerMatchingPage
