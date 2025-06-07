/** 
 * 예약 폼 페이지
 *
 */
'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { calculateEndTime } from '@/shared/lib/utils';
import { 
  CategoryTabs, 
  DateSelector, 
  TimeSelector, 
  TimePickerModal,
  VisitTimePickerModal,
  AdditionalOptions,
  useReservationForm
} from '@/features/reservation';
import type { Category } from '@/shared/types/reservation';

// 임시 데이터 (실제로는 API에서 가져와야 함)
const categories: Category[] = [
  { id: 1, name: '대청소', description: '일반 가정집 청소' },
  { id: 2, name: '사무실 청소', description: '사무실, 상업공간 청소' },
  { id: 3, name: '부분 청소', description: '이사 후 또는 입주 전 청소' },
];

export default function ReservationForm() {
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
    selectedCategory,
    setSelectedCategory,
    selectedCategoryOptions,
    setSelectedCategoryOptions,
    memo,
    setMemo,
    recommendedTime,
    showTimeWarning,
    categoryOptions,
    isOptionsLoading,
    optionsError,
    standardHours,
    basePrice,
    pricePerHour,
    totalPrice,
    handleTimeChange,
    handleNext,
    handleResetTime,
    fetchCategoryOptions,
    visitTimeSlots,
  } = useReservationForm();

  // 아직 사용되지 않는 상태 및 함수들. 필요에 따라 UI에 연결할 수 있습니다.
  // const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  // const [isOptionsModalOpen, setIsOptionsModalOpen] = useState(false);

  return (
    <div className="bg-gray-50">
      <div className="relative mx-auto max-w-screen-sm bg-white min-h-screen pb-28">
        {/* Navigation Header */}
        <header className="sticky top-0 bg-white z-10 shadow-sm">
          <div className="h-14 flex items-center px-4">
            <Link href="/reservation" className="w-6 h-6 flex items-center justify-center">
              <Image 
                src="/icons/arrow-left.svg" 
                alt="Back" 
                width={24} 
                height={24}
              />
            </Link>
          </div>
        </header>

        {/* Category Tabs */}
        <CategoryTabs 
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* Selected Category Description */}
        {selectedCategory && (
          <div className="px-4 py-3 bg-gray-50 border-b">
            <p className="text-sm text-gray-600">
              {categories.find(category => category.id === selectedCategory)?.description}
            </p>
          </div>
        )}

        {/* Content */}
        <main className="px-4 py-6">
          <h1 className="text-xl font-bold text-gray-800 mb-8">예약 정보를 입력해 주세요.</h1>

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
          />

          <AdditionalOptions
            selectedCategory={selectedCategory}
            selectedCategoryOptions={selectedCategoryOptions}
            onCategoryOptionsChange={setSelectedCategoryOptions}
            categoryOptions={categoryOptions}
            isLoading={isOptionsLoading}
            error={optionsError}
            onRetry={fetchCategoryOptions}
          />

          {/* Memo Section */}
          <div className="mb-8">
              <h2 className="text-lg font-bold mb-4">요청사항</h2>
              <textarea
                  className="w-full h-28 p-4 bg-gray-100 rounded-xl text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-shadow"
                  placeholder="특별히 신경 써주길 바라는 점이나 요청사항을 입력해주세요. (선택사항)"
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
              />
          </div>
        </main>
      </div>
      
      {/* Modals */}
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
      <footer className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-screen-sm bg-white/80 backdrop-blur-sm shadow-[0_-2px_12px_rgba(0,0,0,0.08)]">
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
              className="w-32 h-12 bg-cyan-500 text-white rounded-xl font-bold text-lg hover:bg-cyan-600 active:scale-95 transition-all shadow-lg hover:shadow-cyan-500/30"
            >
              예약하기
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
} 