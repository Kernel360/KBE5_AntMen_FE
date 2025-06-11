/**
 * 예약 폼 페이지
 *
 */
'use client'

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { calculateEndTime } from '@/shared/lib/utils';
import { 
  DateSelector, 
  TimeSelector, 
  TimePickerModal,
  VisitTimePickerModal,
  AdditionalOptions,
  useReservationForm
} from '@/features/reservation';
import { getCategoryById, getCategoryOptionsByCategoryId, Category, CategoryOption } from '@/shared/api/category';

// ReservationForm 컴포넌트: 실제 UI를 렌더링합니다.
const ReservationForm = ({ initialCategory, initialOptions, addressId }: { initialCategory: Category; initialOptions: CategoryOption[]; addressId: number }) => {
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
    setSelectedHours,
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
  } = useReservationForm({ initialCategory, initialOptions, addressId });

  return (
    <div className="bg-gray-50">
      <div className="relative mx-auto max-w-screen-sm bg-white min-h-screen pb-28">
        {/* Navigation Header */}
        <header className="sticky top-0 bg-white z-10 shadow-sm">
          <div className="h-14 flex items-center px-4">
            <Link
              href="/reservation"
              className="w-6 h-6 flex items-center justify-center"
            >
              <Image
                src="/icons/arrow-left.svg"
                alt="Back"
                width={24}
                height={24}
              />
            </Link>
          </div>
        </header>

        {/* 선택된 카테고리 정보 표시 */}
        <div className="px-4 py-3 bg-gray-50 border-b">
            <h2 className="text-lg font-bold">{initialCategory.categoryName}</h2>
            <p className="text-sm text-gray-600">
                시간당 {initialCategory.categoryPrice.toLocaleString()}원 (기본 {initialCategory.categoryTime}시간)
            </p>
        </div>
        
        {/* Content */}
        <main className="px-4 py-6">
          <h1 className="text-xl font-bold text-gray-800 mb-8">
            예약 정보를 입력해 주세요.
          </h1>

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
            categoryOptions={initialOptions}
            selectedCategoryOptions={selectedCategoryOptions}
            onOptionChange={setSelectedCategoryOptions}
            onDurationChange={setSelectedHours}
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
              disabled={isSubmitting}
              className="w-36 h-12 bg-cyan-500 text-white rounded-xl font-bold text-lg hover:bg-cyan-600 active:scale-95 transition-all shadow-lg hover:shadow-cyan-500/30 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? '처리 중...' : '매칭 매니저 찾기'}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

// Wrapper 컴포넌트: URL 파라미터를 읽고 데이터를 fetch합니다.
const ReservationFormWrapper = () => {
  const searchParams = useSearchParams();
  const categoryId = searchParams.get('categoryId');
  const addressId = searchParams.get('addressId');
  const addressIdNum = Number(addressId);

  const [category, setCategory] = useState<Category | null>(null);
  const [options, setOptions] = useState<CategoryOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!categoryId || !addressId || isNaN(addressIdNum) || addressIdNum <= 0) {
      setError('카테고리 또는 주소 정보가 올바르지 않습니다.');
      setLoading(false);
      return;
    }

    // localStorage에 pendingReservation 값이 있으면 복원
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('pendingReservation');
      if (saved) {
        try {
          const data = JSON.parse(saved);
          if (data.categoryId && (!categoryId || String(data.categoryId) === String(categoryId))) {
            // 카테고리 정보와 옵션을 fetch해서 복원
            Promise.all([
              getCategoryById(data.categoryId),
              getCategoryOptionsByCategoryId(data.categoryId)
            ]).then(([categoryData, optionsData]) => {
              setCategory(categoryData);
              setOptions(optionsData);
              setLoading(false);
            }).catch((err) => {
              setError('예약 정보를 불러오는 데 실패했습니다.');
              setLoading(false);
            });
            return;
          }
        } catch (e) {
          // JSON 파싱 실패 시 무시하고 새로 입력
        }
      }
    }

    if (!categoryId) {
      setError('카테고리 정보가 없습니다.');
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const [categoryData, optionsData] = await Promise.all([
          getCategoryById(Number(categoryId)),
          getCategoryOptionsByCategoryId(Number(categoryId))
        ]);
        setCategory(categoryData);
        setOptions(optionsData);
      } catch (error) {
        console.error('데이터를 불러오는데 실패했습니다:', error);
        setError('데이터를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) {
      fetchData();
    }
  }, [categoryId]);

  if (loading) return <div>예약 정보 로딩 중...</div>;
  if (error || !category) return <div>{error || '예약 정보를 찾을 수 없습니다.'}</div>;

  return <ReservationForm initialCategory={category} initialOptions={options} addressId={addressIdNum} />;
};

// 최종 export되는 페이지 컴포넌트
export default function ReservationPage() {
  return (
    <Suspense fallback={<div>로딩...</div>}>
      <ReservationFormWrapper />
    </Suspense>
  );
} 