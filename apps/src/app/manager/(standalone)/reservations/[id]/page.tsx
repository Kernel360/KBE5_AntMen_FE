'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { CommonHeader } from '@/shared/ui/Header/CommonHeader'
import type {
  ReservationHistory,
  ReservationStatus,
} from '@/entities/reservation/model/types'
import { getReservationDetail } from '@/entities/reservation/api/reservationApi'
import { getReservationComment, type ReservationComment } from '@/entities/reservation/api/reservationApi'
import { getAuthToken } from '@/features/auth/lib/auth'
import { CalendarIcon, ClockIcon, MapPinIcon, CurrencyDollarIcon, UserIcon, CheckCircleIcon, HomeIcon, StarIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline'
import { getCustomerReviewSummary } from '@/shared/api/review'
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid'

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

// 예약 헤더 섹션 - 매니저용
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
                <p className="text-xs font-semibold text-gray-600 mb-2">고객에게 전달한 서비스 코멘트</p>
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

// 고객 정보 섹션 (매니저용)
const CustomerSection = ({ customer }: { customer?: any }) => {
  return (
    <div className="bg-white rounded-2xl p-5 mb-4 shadow-md border border-gray-100">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-6 h-6 bg-indigo-100 rounded-lg flex items-center justify-center">
          <UserIcon className="w-4 h-4 text-indigo-600" />
        </div>
        <h3 className="text-lg font-bold text-gray-900">고객 정보</h3>
      </div>
      {customer ? (
        <div className="space-y-3">
          <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-200 rounded-xl flex items-center justify-center overflow-hidden">
                {customer.profileImage ? (
                  <img 
                    src={customer.profileImage} 
                    alt={customer.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <UserIcon className="w-6 h-6 text-indigo-700" />
                )}
              </div>
              <div className="flex-1">
                <h4 className="text-base font-bold text-gray-900 mb-1">{customer.name}</h4>
                <p className="text-sm text-gray-600 mb-2">
                  {customer.gender} · {customer.age >= 0 ? `${customer.age}세` : '나이 정보 없음'}
                </p>
                {/* 리뷰 요약 */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {[1,2,3,4,5].map(i => (
                      <StarIconSolid
                        key={i}
                        className={`w-4 h-4 ${i <= Math.round(customer.avgRating ?? customer.rating ?? 0) ? 'text-yellow-400' : 'text-gray-200'}`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-gray-700">
                    리뷰 {typeof customer.totalReviews === 'number' ? customer.totalReviews : '-'}개
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <UserIcon className="w-6 h-6 text-gray-400" />
          </div>
          <h4 className="text-base font-bold text-gray-700 mb-1">고객 정보 없음</h4>
          <p className="text-sm text-gray-500">고객 정보를 불러올 수 없습니다</p>
        </div>
      )}
    </div>
  )
}

export default function ManagerReservationDetailPage() {
  const router = useRouter()
  const params = useParams()
  const reservationId = params?.id as string
  const [reservation, setReservation] = useState<ReservationHistory | null>(null)
  const [reservationComment, setReservationComment] = useState<ReservationComment | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchReservation = async () => {
      if (!reservationId || reservationId === 'unknown') return
      setLoading(true)
      setError(null)
      try {
        const token = getAuthToken()
        if (!token) {
          setError('인증 정보가 없습니다. 다시 로그인 해주세요.')
          setLoading(false)
          return
        }
        const data = await getReservationDetail(Number(reservationId), token)
        setReservation(data)
      } catch (e: any) {
        setError(e?.message || '예약 정보를 불러오지 못했습니다.')
      } finally {
        setLoading(false)
      }
    }
    fetchReservation()
  }, [reservationId])

  // 예약 상태가 DONE일 때 코멘트 정보 가져오기
  useEffect(() => {
    const fetchReservationComment = async () => {
      if (reservation?.reservationStatus === 'DONE' && reservation?.reservationId) {
        try {
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
            {loading ? (
              <>
                <div className="text-4xl mb-4">⏳</div>
                <h3 className="text-lg font-bold text-gray-700 mb-1">예약 정보를 불러오는 중...</h3>
                <p className="text-sm text-gray-500">잠시만 기다려주세요</p>
              </>
            ) : error ? (
              <>
                <div className="text-4xl mb-4">😕</div>
                <h3 className="text-lg font-bold text-gray-700 mb-1">예약 정보를 찾을 수 없어요</h3>
                <p className="text-sm text-gray-500">{error}</p>
              </>
            ) : (
              <>
                <div className="text-4xl mb-4">😕</div>
                <h3 className="text-lg font-bold text-gray-700 mb-1">예약 정보를 찾을 수 없어요</h3>
                <p className="text-sm text-gray-500">잠시 후 다시 시도해주세요</p>
              </>
            )}
          </div>
        </div>
      </div>
    )
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
        <CustomerSection customer={reservation.customer} />
        <PaymentSection reservation={reservation} />
      </main>
    </div>
  )
} 