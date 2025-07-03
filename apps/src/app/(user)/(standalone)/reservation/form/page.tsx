/**
 * 예약 폼 페이지
 *
 */
'use client'

import React, { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { calculateEndTime } from '@/shared/lib/utils'
import { CommonHeader } from '@/shared/ui/Header/CommonHeader'
import {
  DateSelector,
  TimeSelector,
  TimePickerModal,
  VisitTimePickerModal,
  AdditionalOptions,
  useReservationForm,
} from '@/features/reservation'
import {
  getCategoryById,
  getCategoryOptionsByCategoryId,
  Category,
  CategoryOption,
} from '@/shared/api/category'

// ReservationForm 컴포넌트: 실제 UI를 렌더링합니다.
const ReservationForm = ({
  initialCategory,
  initialOptions,
  addressId,
}: {
  initialCategory: Category
  initialOptions: CategoryOption[]
  addressId: number
}) => {
  // 다른 카테고리 예약 시작 시 기존 예약 정보 정리 (수정 모드에서는 실행 안함)
  useEffect(() => {
    const checkAndClearExistingReservation = () => {
      try {
        const existingReservationStr = sessionStorage.getItem('currentReservation')
        
        if (existingReservationStr) {
          const existingReservation = JSON.parse(existingReservationStr)
          
          if (existingReservation && existingReservation.categoryId !== initialCategory.categoryId) {
            // 다른 카테고리의 예약 정보가 있으면 정리
            sessionStorage.removeItem('currentReservation')
          }
        }
      } catch (error) {
        console.error('예약 정보 확인 중 오류:', error)
      }
    }

    checkAndClearExistingReservation()
  }, [initialCategory.categoryId, initialCategory.categoryName])

  const {
    selectedDate,
    setSelectedDate,
    isCalendarOpen,
    setIsCalendarOpen,
    showWarning,
    warningMessage,
    isTimeModalOpen,
    setIsTimeModalOpen,
    isVisitTimeModalOpen,
    setIsVisitTimeModalOpen,
    selectedHours,
    selectedVisitTime,
    setSelectedVisitTime,
    selectedCategoryOptions,
    setSelectedCategoryOptions,
    memo,
    setMemo,
    recommendedTime,
    showTimeWarning,
    isOptionsLoading,
    optionsError,
    standardHours,
    basePrice,
    pricePerHour,
    totalPrice,
    handleTimeChange,
    handleNext,
    handleResetTime,
    visitTimeSlots,
    isSubmitting,
    isRecommendedTimeLoading,
  } = useReservationForm({ initialCategory, initialOptions, addressId })

  // 필수값 체크: 실제 필수값에 맞게 수정하세요
  const isFormValid = !!selectedDate && !!selectedHours && !!selectedVisitTime
  // ... 기타 필수값 체크 필요시 추가

  return (
    <div className="bg-gray-50">
      <div className="relative mx-auto max-w-screen-sm bg-white min-h-screen pb-28">
        {/* Navigation Header */}
        <CommonHeader 
          title="  "
          showBackButton
        />

        {/* 선택된 카테고리 정보 표시 */}
        <div className="px-4 py-3 bg-gray-50 border-b pt-20">
          <h2 className="text-lg font-bold">{initialCategory.categoryName}</h2>
        </div>

        {/* Content */}
        <main className="px-4 py-6">
          <DateSelector
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            isCalendarOpen={isCalendarOpen}
            onCalendarToggle={() => setIsCalendarOpen(!isCalendarOpen)}
            onCalendarClose={() => setIsCalendarOpen(false)}
          />

          <TimeSelector
            selectedHours={selectedHours}
            standardHours={standardHours}
            onResetTime={handleResetTime}
            onTimeModalOpen={() => setIsTimeModalOpen(true)}
            selectedVisitTime={selectedVisitTime}
            onVisitTimeModalOpen={() => setIsVisitTimeModalOpen(true)}
            calculateEndTime={calculateEndTime}
            recommendedTime={recommendedTime}
            showTimeWarning={showTimeWarning}
            isRecommendedTimeLoading={isRecommendedTimeLoading}
          />

          <AdditionalOptions
            selectedCategory={initialCategory.categoryId}
            selectedCategoryOptions={selectedCategoryOptions}
            onCategoryOptionsChange={setSelectedCategoryOptions}
            categoryOptions={initialOptions}
            isLoading={isOptionsLoading}
            error={optionsError}
            onRetry={() => {}}
          />

          {/* Memo Section */}
          <div className="mb-8">
            <h2 className="text-lg font-bold mb-4">요청사항</h2>
            <textarea
              className="w-full h-28 p-4 bg-gray-100 rounded-xl text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-shadow"
              placeholder="특별히 신경 써주길 바라는 점이나 요청사항을 입력해주세요. (선택사항)"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              maxLength={100}
            />
            <div className="text-right text-xs text-gray-400 mt-1">{memo.length}/100</div>
          </div>
        </main>
      </div>

      {/* 임시저장 모달 제거됨 */}

      <TimePickerModal
        isOpen={isTimeModalOpen}
        onClose={() => setIsTimeModalOpen(false)}
        selectedHours={selectedHours}
        standardHours={standardHours}
        recommendedTime={recommendedTime}
        onTimeChange={handleTimeChange}
        basePrice={basePrice}
        pricePerHour={pricePerHour}
        showTimeWarning={showTimeWarning}
      />

      <VisitTimePickerModal
        isOpen={isVisitTimeModalOpen}
        onClose={() => setIsVisitTimeModalOpen(false)}
        visitTimeSlots={visitTimeSlots}
        selectedVisitTime={selectedVisitTime}
        onSelectVisitTime={setSelectedVisitTime}
      />

      {/* Warning Toast */}
      {showWarning && (
        <div className="fixed bottom-28 left-1/2 -translate-x-1/2 w-full max-w-sm px-4 z-50">
          <div className="w-full text-center py-3 px-4 bg-red-500 text-white rounded-xl shadow-lg animate-bounce">
            <p className="font-semibold">{warningMessage}</p>
          </div>
        </div>
      )}

      {/* Price Info - Fixed at bottom */}
      <section className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-mobile bg-white/80 backdrop-blur-sm shadow-[0_-2px_12px_rgba(0,0,0,0.08)]">
        <div className="px-4 py-3">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-gray-600 mb-0.5">예상 금액</p>
              <p className="text-2xl font-bold text-gray-800">
                {totalPrice.toLocaleString()}원
              </p>
            </div>
            <button
              onClick={handleNext}
              disabled={!isFormValid || isSubmitting}
              className={`w-36 h-12 rounded-xl font-bold text-base active:scale-95 transition-all shadow-lg
                ${isFormValid && !isSubmitting ? 'bg-primary hover:bg-primary-500 text-[#222]' : 'bg-gray-400 text-white cursor-not-allowed'}
              `}
            >
              {isSubmitting ? '처리 중...' : '매니저 찾기'}
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

// Wrapper 컴포넌트: URL 파라미터를 읽고 데이터를 fetch합니다.
const ReservationFormWrapper = () => {
  const searchParams = useSearchParams()
  const categoryId = searchParams?.get('categoryId')
  const addressId = searchParams?.get('addressId')
  const addressIdNum = Number(addressId)

  const [category, setCategory] = useState<Category | null>(null)
  const [options, setOptions] = useState<CategoryOption[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!categoryId || !addressId || isNaN(addressIdNum) || addressIdNum <= 0) {
      setError('카테고리 또는 주소 정보가 올바르지 않습니다.')
      setLoading(false)
      return
    }

    // localStorage에 pendingReservation 값이 있으면 복원
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('pendingReservation')
      if (saved) {
        try {
          const data = JSON.parse(saved)
          if (
            data.categoryId &&
            (!categoryId || String(data.categoryId) === String(categoryId))
          ) {
            // 카테고리 정보와 옵션을 fetch해서 복원
            Promise.all([
              getCategoryById(data.categoryId),
              getCategoryOptionsByCategoryId(data.categoryId),
            ])
              .then(([categoryData, optionsData]) => {
                setCategory(categoryData)
                setOptions(optionsData)
                setLoading(false)
              })
              .catch((err) => {
                setError('예약 정보를 불러오는 데 실패했습니다.')
                setLoading(false)
              })
            return
          }
        } catch (e) {
          // JSON 파싱 실패 시 무시하고 새로 입력
        }
      }
    }

    if (!categoryId) {
      setError('카테고리 정보가 없습니다.')
      setLoading(false)
      return
    }

    const fetchData = async () => {
      try {
        setLoading(true)
        const [categoryData, optionsData] = await Promise.all([
          getCategoryById(categoryId),
          getCategoryOptionsByCategoryId(categoryId),
        ])
        setCategory(categoryData)
        setOptions(optionsData)
      } catch (err) {
        setError('예약 정보를 불러오는 데 실패했습니다.')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [categoryId, addressId, addressIdNum])

  if (loading) return <div>예약 정보 로딩 중...</div>
  if (error || !category)
    return <div>{error || '예약 정보를 찾을 수 없습니다.'}</div>

  return (
    <ReservationForm
      initialCategory={category}
      initialOptions={options}
      addressId={addressIdNum}
    />
  )
}

// 최종 export되는 페이지 컴포넌트
export default function ReservationPage() {
  return (
    <Suspense fallback={<div>로딩...</div>}>
      <ReservationFormWrapper />
    </Suspense>
  )
}
