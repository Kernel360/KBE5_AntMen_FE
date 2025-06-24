'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dayjs, { Dayjs } from 'dayjs';
import { Category, CategoryOption } from '@/shared/api/category';
import { calculatePrice } from '@/shared/lib/utils';
import { ReservationStorage } from '@/shared/lib/reservationStorage';

export const useReservationForm = ({ initialCategory, initialOptions, addressId }: { initialCategory: Category; initialOptions: CategoryOption[]; addressId: number }) => {
  const router = useRouter();

  // State
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');
  const [isTimeModalOpen, setIsTimeModalOpen] = useState(false);
  const [isVisitTimeModalOpen, setIsVisitTimeModalOpen] = useState(false);
  const [selectedHours, setSelectedHours] = useState(initialCategory.categoryTime);
  const [selectedVisitTime, setSelectedVisitTime] = useState<string | null>(null);
  const [selectedCategoryOptions, setSelectedCategoryOptions] = useState<number[]>([]);
  const [memo, setMemo] = useState('');
  const [recommendedTime, setRecommendedTime] = useState({ minutes: 240, area: 50 });
  const [showTimeWarning, setShowTimeWarning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 수정 모드일 때 sessionStorage에서 기존 데이터 로드
  useEffect(() => {
    const loadSavedData = () => {
      if (typeof window !== 'undefined') {
        try {
          const savedStr = sessionStorage.getItem('currentReservation');
          if (savedStr) {
            const saved = JSON.parse(savedStr);
            
            // 같은 카테고리의 예약 정보면 폼에 채우기
            if (saved.categoryId === initialCategory.categoryId) {
              if (saved.reservationDate) setSelectedDate(dayjs(saved.reservationDate));
              if (saved.reservationTime) setSelectedVisitTime(saved.reservationTime);
              if (saved.reservationDuration) setSelectedHours(saved.reservationDuration);
              if (Array.isArray(saved.optionIds)) setSelectedCategoryOptions(saved.optionIds);
              if (saved.reservationMemo) setMemo(saved.reservationMemo);
              console.log('✏️ 수정 모드: 기존 예약 정보 로드됨');
            }
          }
        } catch (e) {
          console.error('예약 정보 복원 중 오류:', e);
        }
      }
    };

    loadSavedData();
  }, [initialCategory.categoryId]);

  // Computed Values
  const totalOptionsPrice = selectedCategoryOptions.reduce((total, optionId) => {
    const option = initialOptions.find((opt) => opt.coId === optionId);
    return total + (option?.coPrice || 0);
  }, 0);

  const totalOptionsTime = selectedCategoryOptions.reduce((total, optionId) => {
    const option = initialOptions.find((opt) => opt.coId === optionId);
    return total + (option?.coTime || 0);
  }, 0);

  const baseServicePrice = calculatePrice(selectedHours, initialCategory.categoryPrice, initialCategory.categoryPrice, initialCategory.categoryTime);
  const currentTotalPrice = baseServicePrice + totalOptionsPrice;
  const totalDuration = selectedHours * 60 + totalOptionsTime;

  // 실시간 자동 저장 기능 제거 - handleNext에서만 저장

  // Event Handlers
  const handleTimeChange = (increment: boolean) => {
    setSelectedHours(prev => {
      const newHours = increment ? prev + 1 : prev - 1;
      if (newHours < initialCategory.categoryTime || newHours > 8) return prev;
      
      if (recommendedTime && newHours < Math.ceil(recommendedTime.minutes / 60)) {
        setShowTimeWarning(true);
      } else {
        setShowTimeWarning(false);
      }
      return newHours;
    });
  };
  console.log('selectedVisitTime', selectedVisitTime);
  console.log('typeof selectedVisitTime:', typeof selectedVisitTime);
  
  const handleNext = async () => {
    if (!selectedDate || !selectedVisitTime || !initialCategory.categoryId) {
      setWarningMessage(
        !initialCategory.categoryId
          ? '서비스를 선택해주세요.'
          : !selectedDate
            ? '날짜를 선택해주세요.'
            : '방문 시간을 선택해주세요.',
      );
      setShowWarning(true);
      setTimeout(() => setShowWarning(false), 3000);
      return;
    }

    let formattedTime: string | null = null;

    if (typeof selectedVisitTime === 'string') {
      const visitTime = dayjs(`2000-01-01 ${selectedVisitTime}`, 'YYYY-MM-DD HH:mm');
      if (!visitTime.isValid()) {
        setWarningMessage('방문 시간이 올바르지 않습니다.');
        setShowWarning(true);
        setTimeout(() => setShowWarning(false), 3000);
        return;
      }
      formattedTime = visitTime.format('HH:mm');
    }

    // API 호출 대신, 사용자가 입력한 정보를 객체로 만듭니다.
    const reservationDetails = {
      // customerId는 ReservationStorage에서 자동으로 설정됩니다
      addressId: addressId, // 반드시 props로 받은 값 사용
      categoryId: initialCategory.categoryId,
      categoryName: initialCategory.categoryName,
      reservationDate: selectedDate.format('YYYY-MM-DD'),
      reservationTime: formattedTime,
      reservationDuration: selectedHours,
      reservationMemo: memo,
      reservationAmount: currentTotalPrice,
      additionalDuration: selectedHours - initialCategory.categoryTime,
      optionIds: selectedCategoryOptions,
    };

    try {
      // localStorage 저장 대신 sessionStorage에 임시 저장 (탭별로 분리)
      sessionStorage.setItem('currentReservation', JSON.stringify(reservationDetails));
      console.log('📝 예약 정보 세션에 저장:', reservationDetails);

      // 매칭 페이지로 이동
      router.push('/matching');
    } catch (error) {
      console.error('매니저 조회 중 오류 발생:', error);
      setWarningMessage('매니저 조회 중 오류가 발생했습니다.');
      setShowWarning(true);
      setTimeout(() => setShowWarning(false), 3000);
    }
  };

  const visitTimeSlots: string[] = Array.from({ length: 19 }, (_, i) => {
    const hour = 9 + Math.floor(i / 2);
    const minute = i % 2 === 0 ? '00' : '30';
    // dayjs를 사용하여 HH:mm 형식으로 포맷팅합니다.
    return dayjs().hour(hour).minute(Number(minute)).format('HH:mm');
  });

  return {
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
    categoryOptions: initialOptions,
    isOptionsLoading: false,
    optionsError: null,
    
    standardHours: initialCategory.categoryTime,
    basePrice: initialCategory.categoryPrice,
    pricePerHour: initialCategory.categoryPrice,
    
    totalPrice: currentTotalPrice,
    
    handleTimeChange,
    handleNext,
    handleResetTime: () => setSelectedHours(initialCategory.categoryTime),
    visitTimeSlots,
    isSubmitting,
    isLoading,
    error,
  };
}; 