// 수요자 매칭 결과 페이지: 매니저의 매칭 수락 후 사용자가 최종 수락/거절을 선택하는 페이지

'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import RejectionModal from '../../../components/RejectionModal'

interface ManagerInfo {
  id: string
  name: string
  profileImage: string
  age: number
  experience: string
  rating: number
  message: string
}

interface ReservationInfo {
  id: string
  date: string
  time: string
  location: string
  floor: string
  duration: string
}

interface PriceOption {
  name: string
  price: number
}

interface MatchingInfo {
  manager: ManagerInfo
  reservation: ReservationInfo
  options: PriceOption[]
  totalPrice: number
}

async function getMatchingInfo(reservationId: string): Promise<MatchingInfo> {
  // TODO: Implement actual API call
  return {
    manager: {
      id: 'manager-1',
      name: '김민지',
      profileImage: '/images/profile-placeholder.jpg',
      age: 28,
      experience: '5년 경력',
      rating: 4.8,
      message:
        '안녕하세요! 정성껏 청소해드리겠습니다. 반려동물이 있다고 하셨는데, 청소 전에 안전한 곳으로 이동시켜주시면 감사하겠습니다.',
    },
    reservation: {
      id: reservationId,
      date: '2024.02.15 (목)',
      time: '10:00 ~ 14:00',
      location: '서울시 강남구 역삼동',
      floor: '3층',
      duration: '4시간',
    },
    options: [
      { name: '냉장고 청소', price: 15000 },
      { name: '오븐 청소', price: 10000 },
    ],
    totalPrice: 85000,
  }
}

export default function MatchingResultPage({
  params,
}: {
  params: { reservationId: string }
}) {
  const router = useRouter()
  const [isRejectionModalOpen, setIsRejectionModalOpen] = useState(false)
  const [matchingInfo, setMatchingInfo] = useState<MatchingInfo | null>(null)

  // 컴포넌트가 마운트될 때 데이터 가져오기
  useEffect(() => {
    const fetchData = async () => {
      const data = await getMatchingInfo(params.reservationId)
      setMatchingInfo(data)
    }
    fetchData()
  }, [params.reservationId])

  if (!matchingInfo) return null

  const handleRejection = (option: 'cancel' | 'rematch') => {
    setIsRejectionModalOpen(false)
    if (option === 'cancel') {
      // 예약 취소 처리
      router.push('/reservation/cancel')
    } else {
      // 재매칭 - 매니저 리스트 페이지로 이동
      router.push(`/reservation/${params.reservationId}/matching/managers`)
    }
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="w-full max-w-mobile mx-auto flex flex-col min-h-screen">
        {/* 헤더 */}
        <header className="border-b border-slate-200 px-4 pt-6 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/matching" className="text-slate-500">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    d="M15 19l-7-7 7-7"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
              <h1 className="text-xl font-semibold text-slate-900">
                매칭 확인
              </h1>
            </div>
            <button className="text-slate-500">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 13a1 1 0 100-2 1 1 0 000 2zm7 0a1 1 0 100-2 1 1 0 000 2zM5 13a1 1 0 100-2 1 1 0 000 2z" />
              </svg>
            </button>
          </div>
          <p className="pt-2 text-sm text-slate-500">
            매니저가 매칭을 수락했습니다
          </p>
        </header>

        {/* 메인 컨텐츠 */}
        <div className="px-4 py-6 flex-1">
          {/* 매니저 정보 카드 */}
          <div className="border-2 border-emerald-500 rounded-xl p-4 mb-6 bg-white">
            <div className="flex items-start gap-4">
              <div className="relative w-16 h-16 flex-shrink-0">
                <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center text-2xl text-slate-600">
                  {matchingInfo.manager.name.charAt(0)}
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">
                      {matchingInfo.manager.name} 매니저
                    </h2>
                    <p className="text-sm text-slate-500">
                      여성 · {matchingInfo.manager.age}세 ·{' '}
                      {matchingInfo.manager.experience}
                    </p>
                  </div>
                  <span className="inline-flex items-center px-3 py-1 bg-emerald-500 text-white text-xs font-semibold rounded-full">
                    <svg
                      className="w-3.5 h-3.5 mr-1"
                      viewBox="0 0 14 14"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        d="M11.6666 3.5L5.24992 9.91667L2.33325 7"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    매칭 수락
                  </span>
                </div>
                <div className="flex items-center mt-1">
                  <svg
                    className="w-4 h-4 text-yellow-400"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                  >
                    <path d="M8 0l2.5 5 5.5.8-4 3.9.9 5.3-4.9-2.6L3.1 15l.9-5.3-4-3.9L5.5 5z" />
                  </svg>
                  <span className="ml-1 text-sm text-slate-500">
                    {matchingInfo.manager.rating}
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-600">
                  고객 만족도가 높으며 세심한 서비스를 제공합니다.
                </p>
              </div>
            </div>
          </div>

          {/* 예약 정보 */}
          <div className="border border-slate-200 rounded-xl p-6 mb-6 bg-white">
            <div className="flex items-center gap-2 mb-4">
              <svg
                className="w-5 h-5 text-slate-500"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
              >
                <path
                  d="M6 2v2m8-2v2M3 6h14M5 4h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <h3 className="text-base font-semibold text-slate-900">
                예약 정보
              </h3>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-[15px] font-medium text-slate-600">
                  기본 청소
                </span>
                <span className="text-sm text-slate-500">
                  {matchingInfo.reservation.duration}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[15px] font-medium text-slate-600">
                  {matchingInfo.reservation.date}
                </span>
                <span className="text-sm text-slate-500">
                  {matchingInfo.reservation.time}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[15px] font-medium text-slate-600">
                  {matchingInfo.reservation.location}
                </span>
                <span className="text-sm text-slate-500">
                  {matchingInfo.reservation.floor}
                </span>
              </div>
            </div>
          </div>

          {/* 유료 옵션 */}
          <div className="border border-slate-200 rounded-xl p-6 mb-6 bg-white">
            <div className="flex items-center gap-2 mb-4">
              <svg
                className="w-5 h-5 text-slate-500"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
              >
                <path
                  d="M10 3v14m7-7H3"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <h3 className="text-base font-semibold text-slate-900">
                유료 옵션
              </h3>
            </div>
            <div className="space-y-4">
              {matchingInfo.options.map((option, index) => (
                <div key={index} className="flex justify-between">
                  <span className="text-[15px] font-medium text-slate-600">
                    {option.name}
                  </span>
                  <span className="text-sm font-semibold text-blue-500">
                    +{option.price.toLocaleString()}원
                  </span>
                </div>
              ))}
              <div className="pt-4 border-t border-slate-100">
                <div className="flex justify-between">
                  <span className="text-base font-semibold text-slate-900">
                    총 금액
                  </span>
                  <span className="text-base font-bold text-slate-900">
                    {matchingInfo.totalPrice.toLocaleString()}원
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 매니저 메시지 */}
          <div className="bg-emerald-50 rounded-lg border border-emerald-500 p-4">
            <div className="flex items-center gap-2 mb-2">
              <svg
                className="w-4 h-4 text-emerald-500"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
              >
                <path
                  d="M14 8.5c0 2.9-2.7 5.3-6 5.3-.7 0-1.4-.1-2-.3L2 15l1-3.5C2.4 10.6 2 9.6 2 8.5 2 5.6 4.7 3.2 8 3.2s6 2.4 6 5.3z"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-sm font-semibold text-emerald-800">
                매니저 메시지
              </span>
            </div>
            <p className="text-sm text-emerald-800 leading-relaxed">
              {matchingInfo.manager.message}
            </p>
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="border-t border-slate-200 px-4 py-4">
          <div className="flex gap-3">
            <button
              onClick={() => setIsRejectionModalOpen(true)}
              className="flex-1 py-3.5 rounded-lg bg-slate-50 text-slate-600 font-semibold text-base border border-slate-200"
            >
              거절
            </button>
            <button
              // TODO: 예약 확정 페이지로 이동 구현
              // 예: router.push('/reservation/[reservationId]/confirmed')
              onClick={() => router.push('/matching/accept')}
              className="flex-1 py-3.5 rounded-lg bg-[#4ABED9] text-white font-semibold text-base"
            >
              매칭 수락
            </button>
          </div>
        </div>

        {/* 거절 모달 */}
        <RejectionModal
          isOpen={isRejectionModalOpen}
          onClose={() => setIsRejectionModalOpen(false)}
          onConfirm={handleRejection}
        />
      </div>
    </main>
  )
}
