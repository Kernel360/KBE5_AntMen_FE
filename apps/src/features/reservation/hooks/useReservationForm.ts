'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dayjs, { Dayjs } from 'dayjs';
import { Category, CategoryOption } from '@/shared/api/category';
import { createReservation } from '@/shared/api/reservation';
import { calculatePrice } from '@/shared/lib/utils';

export const useReservationForm = ({ initialCategory, initialOptions, addressId }: { initialCategory: Category; initialOptions: CategoryOption[]; addressId: number }) => {
  const router = useRouter();

  // State
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
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

  // localStorage 값으로 폼 상태 복원
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('pendingReservation');
      if (saved) {
        try {
          const data = JSON.parse(saved);
          if (data) {
            if (data.reservationDate) setSelectedDate(dayjs(data.reservationDate));
            if (data.reservationTime) setSelectedVisitTime(data.reservationTime);
            if (data.reservationDuration) setSelectedHours(data.reservationDuration);
            if (Array.isArray(data.optionIds)) setSelectedCategoryOptions(data.optionIds);
            if (data.reservationMemo) setMemo(data.reservationMemo);
          }
        } catch (e) {
          // 파싱 실패 시 무시
        }
      }
    }
  }, []);

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
      // customerId는 로그인 정보가 구현된 후 채워져야 합니다.
      customerId: 1, // 임시 ID
      addressId: addressId, // 반드시 props로 받은 값 사용
      categoryId: initialCategory.categoryId,
      categoryName: initialCategory.categoryName,
      reservationDate: selectedDate.format('YYYY-MM-DD'),
      reservationTime: formattedTime,
      reservationDuration: selectedHours,
      reservationMemo: memo,
      reservationAmount: totalPrice,
      additionalDuration: selectedHours - initialCategory.categoryTime,
      optionIds: selectedCategoryOptions,
    };

    try {
      // 예약 정보를 localStorage에 저장
      if (typeof window !== 'undefined') {
        localStorage.setItem('pendingReservation', JSON.stringify(reservationDetails));
      }

      // 매칭 페이지로 이동 (서버 컴포넌트에서 자동으로 매니저 리스트를 가져옵니다)
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