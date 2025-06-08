'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dayjs, { Dayjs } from 'dayjs';
import { Category, CategoryOption } from '@/shared/api/category';
import { createReservation } from '@/shared/api/reservation';
import { calculatePrice } from '@/shared/lib/utils';

export const useReservationForm = ({ initialCategory, initialOptions }: { initialCategory: Category; initialOptions: CategoryOption[] }) => {
  const router = useRouter();

  // State
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');
  const [isTimeModalOpen, setIsTimeModalOpen] = useState(false);
  const [isVisitTimeModalOpen, setIsVisitTimeModalOpen] = useState(false);
  const [selectedHours, setSelectedHours] = useState(initialCategory.categoryTime);
  const [selectedVisitTime, setSelectedVisitTime] = useState<Dayjs | string | null>(null);
  const [selectedCategoryOptions, setSelectedCategoryOptions] = useState<number[]>([]);
  const [memo, setMemo] = useState('');
  const [recommendedTime, setRecommendedTime] = useState({ minutes: 240, area: 50 });
  const [showTimeWarning, setShowTimeWarning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
  const totalPrice = baseServicePrice + totalOptionsPrice;
  const totalDuration = selectedHours * 60 + totalOptionsTime;

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
      // customerId와 addressId는 로그인 정보와 주소 선택 로직이 구현된 후 채워져야 합니다.
      customerId: 1, // 임시 ID
      addressId: 1, // 임시 ID
      categoryId: initialCategory.categoryId,
      categoryName: initialCategory.categoryName, // 페이지 이동 시 필요할 수 있으므로 추가
      reservationDate: selectedDate.format('YYYY-MM-DD'),
      reservationTime: formattedTime,
      reservationDuration: selectedHours,
      reservationMemo: memo,
      reservationAmount: totalPrice, // 계산된 총액
      additionalDuration: selectedHours - initialCategory.categoryTime,
      optionIds: selectedCategoryOptions,
    };

    try {
      // 브라우저의 localStorage에 예약 정보를 임시 저장합니다.
      // /matching 페이지에서 이 데이터를 읽어 사용하게 됩니다.
      if (typeof window !== 'undefined') {
        localStorage.setItem('pendingReservation', JSON.stringify(reservationDetails));
      }
      
      // /matching 경로로 이동합니다.
      router.push('/matching');
      
    } catch (error) {
      console.error('Failed to save reservation details to localStorage:', error);
      setWarningMessage('다음 단계로 진행하는 중 오류가 발생했습니다.');
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
    
    totalPrice,
    
    handleTimeChange,
    handleNext,
    handleResetTime: () => setSelectedHours(initialCategory.categoryTime),
    visitTimeSlots,
    isSubmitting,
  };
}; 