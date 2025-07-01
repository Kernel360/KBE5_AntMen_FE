'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CommonHeader } from '@/shared/ui/Header/CommonHeader'
import type {
  ReservationHistory,
  ReservationStatus,
} from '@/entities/reservation/model/types'
import { respondToMatching } from '@/entities/matching/api/matchingAPi'
import { RejectionModal } from '@/shared/ui/modal/RejectionModal'
import CancellationModal from '@/shared/ui/modal/CancellationModal'
import { cancelReservation } from '@/shared/api/reservation'
import { getReservationComment, type ReservationComment } from '@/entities/reservation/api/reservationApi'
import { CalendarIcon, ClockIcon, MapPinIcon, CurrencyDollarIcon, UserIcon, CheckCircleIcon, HomeIcon, StarIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline'
import { getAuthToken } from '@/features/auth/lib/auth'

interface ReservationDetailPageClientProps {
  initialReservation: ReservationHistory | null
}

// 상태 배지 컴포넌트
const StatusBadge = ({ status }: { status: string }) => {
  const getStatusConfig = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'WAITING':
        return { 
          bg: 'bg-amber-100', 
          text: 'text-amber-800', 
          border: 'border-amber-200',
          label: '매칭 대기중',
          icon: '⏳'
        }
      case 'MATCHING':
        return { 
          bg: 'bg-blue-100', 
          text: 'text-blue-800', 
          border: 'border-blue-200',
          label: '매칭 완료',
          icon: '🤝'
        }
      case 'SCHEDULED':
        return { 
          bg: 'bg-green-100', 
          text: 'text-green-800', 
          border: 'border-green-200',
          label: '예약 확정',
          icon: '✅'
        }
      case 'DONE':
        return { 
          bg: 'bg-purple-100', 
          text: 'text-purple-800', 
          border: 'border-purple-200',
          label: '완료',
          icon: '✨'
        }
      case 'CANCEL':
        return { 
          bg: 'bg-red-100', 
          text: 'text-red-800', 
          border: 'border-red-200',
          label: '취소됨',
          icon: '❌'
        }
      default:
        return { 
          bg: 'bg-gray-100', 
          text: 'text-gray-800', 
          border: 'border-gray-200',
          label: status,
          icon: '📋'
        }
    }
  }

  const config = getStatusConfig(status)
  
  return (
    <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl ${config.bg} ${config.text} ${config.border} border font-semibold text-sm shadow-sm`}>
      <span>{config.icon}</span>
      <span>{config.label}</span>
    </div>
  )
}

// 정보 아이템 컴포넌트
const InfoItem = ({ icon, label, value, highlight = false }: { 
  icon: React.ReactNode
  label: string
  value: string
  highlight?: boolean
}) => (
  <div className="flex items-center gap-3 py-3">
    <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm text-gray-600 font-medium">{label}</p>
      <p className={`text-base font-semibold ${highlight ? 'text-primary' : 'text-gray-900'} truncate`}>
        {value}
      </p>
    </div>
  </div>
)

// 예약 헤더 섹션 - 모바일 최적화
const ReservationHeaderSection = ({ reservation }: { reservation: ReservationHistory }) => {
  return (
    <div className="bg-white rounded-2xl p-5 mb-4 shadow-md border border-gray-100">
      {/* 서비스 타입과 상태 표시 */}
      <div className="mb-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-xs font-medium text-gray-500 mb-1">예약 카테고리</p>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-gray-900">{reservation.categoryName}</h2>
              <span className="text-xs text-gray-500">#{reservation.reservationId}</span>
            </div>
          </div>
          <div className="flex-shrink-0">
            <StatusBadge status={reservation.reservationStatus} />
          </div>
        </div>
      </div>

      {/* 날짜와 시간 정보 */}
      <div className="grid grid-cols-1 gap-3">
        <div className="bg-gray-100 rounded-xl p-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <CalendarIcon className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-600">예약일</p>
              <p className="text-sm font-bold text-gray-900">{reservation.reservationDate}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-100 rounded-xl p-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <ClockIcon className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-600">예약 시간</p>
              <p className="text-sm font-bold text-gray-900">{reservation.reservationTime || '협의 후 결정'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// 서비스 상세 정보 섹션
const ServiceDetailsSection = ({ reservation }: { reservation: ReservationHistory }) => {
  return (
    <div className="bg-white rounded-2xl p-5 mb-4 shadow-md border border-gray-100">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center">
          <CheckCircleIcon className="w-4 h-4 text-green-600" />
        </div>
        <h3 className="text-lg font-bold text-gray-900">서비스 상세 정보</h3>
      </div>
      
      <div className="space-y-3">
        {/* 서비스 정보 통합 */}
        <div className="bg-gray-50 rounded-xl p-4 space-y-3">
          {/* 주소 정보 */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
              <MapPinIcon className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-600 mb-1">서비스 주소</p>
              <p className="text-sm font-semibold text-gray-900 leading-relaxed break-all">
                {reservation.address}
              </p>
            </div>
          </div>
          
          {/* 기타 서비스 정보들 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <ClockIcon className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-600">예상 소요시간</p>
                <p className="text-sm font-bold text-gray-900">{reservation.totalDuration}시간</p>
              </div>
            </div>
            

          </div>
        </div>
        
        {/* 수요자 메모 */}
        {reservation.reservationMemo && (
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <ChatBubbleLeftRightIcon className="w-4 h-4 text-gray-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-600 mb-2">고객 특이사항</p>
                <p className="text-sm text-gray-900 leading-relaxed">
                  {reservation.reservationMemo}
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* 선택 옵션 */}
        <div className="bg-blue-50 rounded-xl p-4">
          <h4 className="text-sm font-bold text-gray-900 mb-3">선택한 서비스 옵션</h4>
          <div className="flex flex-wrap gap-2">
            {reservation.selectedOptions && reservation.selectedOptions.length > 0 ? (
              reservation.selectedOptions.map((option, index) => (
                <span
                  key={index}
                  className="bg-white px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-700 border border-blue-200"
                >
                  ✓ {option}
                </span>
              ))
            ) : (
              <span className="bg-white px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-700 border border-blue-200">
                ✓ 기본 청소 서비스
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// 결제 정보 섹션
const PaymentSection = ({ reservation }: { reservation: ReservationHistory }) => {
  return (
    <div className="bg-green-50 rounded-2xl p-5 mb-4 shadow-md border border-green-200">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-6 h-6 bg-green-500 rounded-lg flex items-center justify-center">
          <CurrencyDollarIcon className="w-4 h-4 text-white" />
        </div>
        <h3 className="text-lg font-bold text-gray-900">결제 정보</h3>
      </div>
      
      <div className="bg-white rounded-xl p-4 border border-green-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-0.5">총 결제 금액</p>
            <p className="text-xs text-gray-500">VAT 포함</p>
          </div>
          <div className="text-right">
            <p className="text-xl font-black text-green-600">
              {reservation.totalAmount?.toLocaleString()}원
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// 서비스 완료 정보 섹션
const ServiceCompletionSection = ({ comment }: { comment: ReservationComment }) => {
  return (
    <div className="bg-white rounded-2xl p-5 mb-4 shadow-md border border-gray-100">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center">
          <ChatBubbleLeftRightIcon className="w-4 h-4 text-green-600" />
        </div>
        <h3 className="text-lg font-bold text-gray-900">서비스 완료 정보</h3>
      </div>
      
      <div className="space-y-4">
        {/* 체크인/체크아웃 시간 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-blue-50 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <ClockIcon className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-600">체크인 시간</p>
                <p className="text-sm font-bold text-gray-900">
                  {comment.checkinAt ? new Date(comment.checkinAt).toLocaleString('ko-KR') : '기록 없음'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-purple-50 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <ClockIcon className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-600">체크아웃 시간</p>
                <p className="text-sm font-bold text-gray-900">
                  {comment.checkoutAt ? new Date(comment.checkoutAt).toLocaleString('ko-KR') : '기록 없음'}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* 서비스 코멘트 */}
        {comment.comment && (
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <ChatBubbleLeftRightIcon className="w-4 h-4 text-gray-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-600 mb-2">매니저가 전달한 서비스 코멘트</p>
                <p className="text-sm text-gray-900 leading-relaxed">
                  {comment.comment}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// 매니저 정보 섹션
const ManagerSection = ({ matchings }: { matchings?: any[] }) => {
  const hasMatchings = matchings && matchings.length > 0

  return (
    <div className="bg-white rounded-2xl p-5 mb-4 shadow-md border border-gray-100">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-6 h-6 bg-indigo-100 rounded-lg flex items-center justify-center">
          <UserIcon className="w-4 h-4 text-indigo-600" />
        </div>
        <h3 className="text-lg font-bold text-gray-900">
          매칭 매니저 {hasMatchings && `(${matchings.length}명)`}
        </h3>
      </div>
      
      {hasMatchings ? (
        <div className="space-y-3">
          {matchings.map((matching, index) => {
            const manager = matching.manager
            const isRequested = matching.isRequested
            const isAccepted = matching.isAccepted
            const priority = matching.priority
            
            return (
              <div 
                key={matching.matchingId} 
                className={`rounded-xl p-4 border-2 ${
                  isRequested 
                    ? 'bg-blue-50 border-blue-200' 
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                                 {/* 우선순위 배지 */}
                 <div className="flex items-center justify-between mb-3">
                   <div className="flex items-center gap-2">
                     <span className={`px-2 py-1 rounded-lg text-xs font-bold ${
                       priority === 1 
                         ? 'bg-yellow-100 text-yellow-800' 
                         : priority === 2 
                         ? 'bg-blue-100 text-blue-800'
                         : 'bg-gray-100 text-gray-800'
                     }`}>
                       {priority === 1 ? '1순위' : priority === 2 ? '2순위' : `${priority}순위`}
                     </span>
                     {isRequested && !isAccepted && (
                       <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-lg text-xs font-bold">
                         매칭 요청됨
                       </span>
                     )}
                     {isAccepted && matching.isFinal === null && (
                       <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded-lg text-xs font-bold">
                         🎉 매니저 수락됨
                       </span>
                     )}
                     {matching.isFinal === true && (
                       <span className="bg-green-100 text-green-800 px-2 py-1 rounded-lg text-xs font-bold">
                         최종 매칭
                       </span>
                     )}
                     {matching.isFinal === false && (
                       <span className="bg-red-100 text-red-800 px-2 py-1 rounded-lg text-xs font-bold">
                          매칭 거절
                       </span>
                     )}
                     {!isAccepted && isRequested && matching.refuseReason && (
                       <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-lg text-xs font-bold">
                         매니저 거절됨
                       </span>
                     )}
                   </div>
                 </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-200 rounded-xl flex items-center justify-center overflow-hidden">
                    {manager.profileImage ? (
                      <img 
                        src={manager.profileImage} 
                        alt={manager.name}
                        className="w-full h-full object-cover"
                      />
                                          ) : (
                      <UserIcon className="w-6 h-6 text-indigo-700" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-base font-bold text-gray-900 mb-1">{manager.name}</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      {manager.gender} · {manager.age >= 0 ? `${manager.age}세` : '나이 정보 없음'}
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 bg-white/70 px-2 py-1 rounded-lg">
                        <StarIcon className="w-3 h-3 text-yellow-500 fill-current" />
                        <span className="text-xs font-bold text-gray-700">4.8</span>
                      </div>
                      <div className="bg-white/70 px-2 py-1 rounded-lg">
                        <span className="text-xs font-semibold text-gray-700">리뷰 127개</span> {/* TODO: 예림님 여기에 리뷰 연동 부탁드려용~ */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <UserIcon className="w-6 h-6 text-gray-400" />
          </div>
          <h4 className="text-base font-bold text-gray-700 mb-1">매칭 대기중</h4>
          <p className="text-sm text-gray-500 mb-1">최적의 도우미를 찾고 있어요</p>
          <p className="text-xs text-gray-400">곧 연락드릴게요! 조금만 기다려주세요 😊</p>
        </div>
      )}
    </div>
  )
}

// 매니저 수락 상태에서 수요자 응답 액션 섹션
const CustomerResponseActionSection = ({
  acceptedMatching,
  onAccept,
  onReject,
  isProcessing,
}: {
  acceptedMatching: any
  onAccept: (matchingId: number) => void
  onReject: (matchingId: number, reason: string) => void
  isProcessing: boolean
}) => {
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false)

  const handleReject = (reason: string) => {
    onReject(acceptedMatching.matchingId, reason)
    setIsRejectModalOpen(false)
  }

  return (
    <>
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-mobile bg-white/95 backdrop-blur-xl border-t border-gray-200 p-4 shadow-2xl">
        <div className="mb-3 text-center">
          <p className="text-sm font-medium text-gray-700">
            <span className="font-bold text-primary-600">{acceptedMatching.manager.name} 매니저</span>가 수락했어요! 
          </p>
          <p className="text-xs text-gray-500">최종 결정을 내려주세요</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setIsRejectModalOpen(true)}
            disabled={isProcessing}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl py-3 px-4 font-semibold text-sm disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
          >
            다른 매니저 찾기
          </button>
          <button
            onClick={() => onAccept(acceptedMatching.matchingId)}
            disabled={isProcessing}
            className="flex-[2] bg-primary-600 hover:bg-primary-700 text-white rounded-xl py-3 px-4 font-semibold text-sm disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
          >
            {isProcessing ? '처리 중...' : '🎉 매칭 확정하기'}
          </button>
        </div>
      </div>

             <RejectionModal
         isOpen={isRejectModalOpen}
         onClose={() => setIsRejectModalOpen(false)}
         onSubmit={handleReject}
         title="매칭 거절 사유"
         isProcessing={isProcessing}
       />
    </>
  )
}

// 매칭 완료 후 취소 액션 섹션
const CancelActionSection = ({
  onCancel,
  isProcessing,
}: {
  onCancel: (reason: string) => void
  isProcessing: boolean
}) => {
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false)

  const handleCancel = (reason: string) => {
    onCancel(reason)
    setIsCancelModalOpen(false)
  }

  return (
    <>
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-mobile bg-white/95 backdrop-blur-xl border-t border-gray-200 p-4 shadow-2xl">
        <button
          onClick={() => setIsCancelModalOpen(true)}
          disabled={isProcessing}
          className="w-full bg-primary text-white rounded-xl py-3.5 px-4 font-semibold text-base disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
        >
          {isProcessing ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>처리 중...</span>
            </div>
          ) : (
            '예약 취소하기'
          )}
        </button>
      </div>

      {/* 취소 모달 */}
      <CancellationModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={handleCancel}
        title="예약 취소"
        description="취소 사유를 선택해주세요"
      />
    </>
  )
}

// 메인 컴포넌트
export const ReservationDetailPageClient = ({
  initialReservation,
}: ReservationDetailPageClientProps) => {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [reservation, setReservation] = useState<ReservationHistory | null>(
    initialReservation,
  )
  const [isProcessing, setIsProcessing] = useState(false)
  const [reservationComment, setReservationComment] = useState<ReservationComment | null>(null)

  // 예약 상태가 DONE일 때 코멘트 정보 가져오기
  useEffect(() => {
    const fetchReservationComment = async () => {
      if (reservation?.reservationStatus === 'DONE' && reservation?.reservationId) {
        try {
          // TODO: 실제 토큰을 여기에 추가해야 합니다
          const token = getAuthToken()
          if (!token) {
            setError('인증 정보가 없습니다. 다시 로그인 해주세요.')
            setLoading(false)
            return
          }
          const comment = await getReservationComment(reservation.reservationId, token)
          setReservationComment(comment)
        } catch (error) {
          console.error('Failed to fetch reservation comment:', error)
        }
      }
    }

    fetchReservationComment()
  }, [reservation?.reservationStatus, reservation?.reservationId])

  if (!reservation) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <CommonHeader 
          title="예약 상세"
          showBackButton
        />
        <div className="flex-grow flex items-center justify-center pt-24">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-200 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">😕</span>
            </div>
            <h3 className="text-lg font-bold text-gray-700 mb-1">예약 정보를 찾을 수 없어요</h3>
            <p className="text-sm text-gray-500">잠시 후 다시 시도해주세요</p>
          </div>
        </div>
      </div>
    )
  }

  const handleAcceptMatching = async () => {
    if (isProcessing || !reservation?.matchings[0]?.matchingId) return
    setIsProcessing(true)
    try {
      await respondToMatching(reservation.matchings[0].matchingId, {
        matchingIsFinal: true,
      })
      setReservation((prev) =>
        prev ? { ...prev, reservationStatus: 'MATCHING' } : null,
      )
      alert('매칭이 수락되었습니다.')
    } catch (error) {
      console.error('Failed to accept matching:', error)
      alert('매칭 수락에 실패했습니다.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleRejectMatching = async (reason: string) => {
    if (isProcessing || !reservation?.matchings[0]?.matchingId) return
    setIsProcessing(true)
    try {
      await respondToMatching(reservation.matchings[0].matchingId, {
        matchingIsFinal: false,
        matchingRefuseReason: reason,
      })
      setReservation((prev) =>
        prev ? { ...prev, reservationStatus: 'CANCEL' } : null,
      )
      alert('매칭이 거절되어 예약이 취소되었습니다.')
    } catch (error) {
      console.error('Failed to reject matching:', error)
      alert('매칭 거절에 실패했습니다.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCancelReservation = async (reason: string) => {
    if (isProcessing || !reservation?.reservationId) return
    setIsProcessing(true)
    
    try {
      // cancelReservation API 호출
      await cancelReservation(reservation.reservationId, reason)
      
      // 성공시 예약 상태를 CANCEL로 변경
      setReservation((prev) =>
        prev ? { ...prev, reservationStatus: 'CANCEL' } : null,
      )
      alert('예약이 성공적으로 취소되었습니다.')
    } catch (error) {
      console.error('Failed to cancel reservation:', error)
      alert('예약 취소에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setIsProcessing(false)
    }
  }

  // 수요자 매칭 응답 (매니저가 수락한 상태에서)
  const handleCustomerMatchingResponse = async (matchingId: number, accept: boolean, reason?: string) => {
    if (isProcessing) return
    setIsProcessing(true)
    
    try {
      await respondToMatching(matchingId, {
        matchingIsFinal: accept,
        matchingRefuseReason: reason,
      })
      
      if (accept) {
        // 수락 시 MATCHING 상태로 변경
        setReservation((prev) => {
          if (!prev) return null
          return {
            ...prev,
            reservationStatus: 'MATCHING',
            matchings: prev.matchings?.map(m => 
              m.matchingId === matchingId 
                ? { ...m, isFinal: true }
                : m
            )
          }
        })
        alert('🎉 매칭이 확정되었습니다!')
      } else {
        // 거절 시 해당 매칭을 거절 상태로 변경
        setReservation((prev) => {
          if (!prev) return null
          return {
            ...prev,
            matchings: prev.matchings?.map(m => 
              m.matchingId === matchingId 
                ? { ...m, isFinal: false, matchingRefuseReason: reason }
                : m
            )
          }
        })
        alert('매칭을 거절했습니다. 다른 매니저를 찾아드릴게요.')
      }
    } catch (error) {
      console.error('Failed to respond to matching:', error)
      alert('매칭 응답에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setIsProcessing(false)
    }
  }

  // 매니저가 수락한 매칭이 있는지 확인
  const getAcceptedMatching = () => {
    return reservation?.matchings?.find(m => 
      m.isAccepted === true && m.isFinal === null
    )
  }

  // 모든 매니저가 거절했는지 확인
  const allManagersRejected = () => {
    return reservation?.matchings?.length > 0 && 
           reservation.matchings.every(m => m.isAccepted === false || m.isFinal === false)
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <CommonHeader 
        title="예약 상세"
        showBackButton
      />

      <main className="flex-grow pt-24 pb-24 px-4">
        <ReservationHeaderSection reservation={reservation} />
        {/* 서비스 완료시에만 코멘트 섹션 표시 */}
        {reservation.reservationStatus === 'DONE' && reservationComment && (
          <ServiceCompletionSection comment={reservationComment} />
        )}
        <ServiceDetailsSection reservation={reservation} />
        <ManagerSection matchings={reservation.matchings} />
        <PaymentSection reservation={reservation} />
      </main>
      
      {/* 조건별 액션 버튼 표시 */}
      {(() => {
        const acceptedMatching = getAcceptedMatching()
        
        // 매니저가 수락한 상태 → 수요자 응답 대기
        if (acceptedMatching) {
          return (
            <CustomerResponseActionSection
              acceptedMatching={acceptedMatching}
              onAccept={(matchingId) => handleCustomerMatchingResponse(matchingId, true)}
              onReject={(matchingId, reason) => handleCustomerMatchingResponse(matchingId, false, reason)}
              isProcessing={isProcessing}
            />
          )
        }
        
        // 매칭 완료 후: 취소 버튼
        if (reservation.reservationStatus === 'MATCHING') {
          return (
            <CancelActionSection
              onCancel={handleCancelReservation}
              isProcessing={isProcessing}
            />
          )
        }
        
        // 모든 매니저가 거절한 경우
        if (allManagersRejected()) {
          return (
            <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-mobile bg-white/95 backdrop-blur-xl border-t border-gray-200 p-4 shadow-2xl">
              <div className="text-center mb-4">
                <p className="text-sm font-medium text-gray-700 mb-1">
                  😔 모든 매니저가 거절했어요
                </p>
                <p className="text-xs text-gray-500">새로운 매니저를 찾아드릴게요</p>
              </div>
              <button
                disabled
                className="w-full bg-gray-200 text-gray-500 rounded-xl py-3 px-4 font-semibold text-sm cursor-not-allowed"
              >
                재매칭 중...
              </button>
            </div>
          )
        }
        
        return null
      })()}
    </div>
  )
} 