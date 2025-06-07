'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dayjs, { Dayjs } from 'dayjs';
import type { CategoryOption, RecommendedTime } from '@/shared/types/reservation';
import { calculatePrice } from '@/shared/lib/utils';

const STANDARD_HOURS = 2;
const BASE_PRICE = 40000;
const PRICE_PER_HOUR = 20000;

export const useReservationForm = () => {
  const router = useRouter();

  // State
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');
  const [isTimeModalOpen, setIsTimeModalOpen] = useState(false);
  const [isVisitTimeModalOpen, setIsVisitTimeModalOpen] = useState(false);
  const [selectedHours, setSelectedHours] = useState(STANDARD_HOURS);
  const [selectedVisitTime, setSelectedVisitTime] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(1); // Default to first category
  const [selectedCategoryOptions, setSelectedCategoryOptions] = useState<number[]>([]);
  const [memo, setMemo] = useState('');
  const [recommendedTime, setRecommendedTime] = useState<RecommendedTime>({ minutes: 240, area: 50 });
  const [showTimeWarning, setShowTimeWarning] = useState(false);

  const [categoryOptions, setCategoryOptions] = useState<CategoryOption[]>([]);
  const [isOptionsLoading, setIsOptionsLoading] = useState(false);
  const [optionsError, setOptionsError] = useState<string | null>(null);

  // Data Fetching
  const fetchCategoryOptions = async () => {
    if (!selectedCategory) {
      setCategoryOptions([]);
      return;
    }
    setIsOptionsLoading(true);
    setOptionsError(null);
    try {
      // NOTE: Using a placeholder API. Replace with your actual API endpoint.
      const response = await fetch(`/api/categories/${selectedCategory}/options`);
      if (!response.ok) throw new Error('옵션을 불러오는데 실패했습니다.');
      const data = await response.json();
      setCategoryOptions(data as CategoryOption[]);
    } catch (err) {
      setOptionsError(err instanceof Error ? err.message : '옵션을 불러오는데 실패했습니다.');
      setCategoryOptions([]);
    } finally {
      setIsOptionsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoryOptions();
  }, [selectedCategory]);
  

  // Computed Values
  const totalOptionsPrice = selectedCategoryOptions.reduce((total, optionId) => {
    const option = categoryOptions.find((opt) => opt.id === optionId);
    return total + (option?.price || 0);
  }, 0);

  const totalOptionsTime = selectedCategoryOptions.reduce((total, optionId) => {
    const option = categoryOptions.find((opt) => opt.id === optionId);
    return total + (option?.time || 0);
  }, 0);

  const baseServicePrice = calculatePrice(selectedHours, BASE_PRICE, PRICE_PER_HOUR, STANDARD_HOURS);
  const totalPrice = baseServicePrice + totalOptionsPrice;
  const totalDuration = selectedHours * 60 + totalOptionsTime;

  // Event Handlers
  const handleTimeChange = (increment: boolean) => {
    setSelectedHours(prev => {
      const newHours = increment ? prev + 1 : prev - 1;
      if (newHours < STANDARD_HOURS || newHours > 8) return prev;
      
      if (recommendedTime && newHours < Math.ceil(recommendedTime.minutes / 60)) {
        setShowTimeWarning(true);
      } else {
        setShowTimeWarning(false);
      }
      return newHours;
    });
  };

  const handleNext = async () => {
    if (!selectedDate || !selectedVisitTime || !selectedCategory) {
      setWarningMessage(
        !selectedCategory ? '서비스를 선택해주세요.' :
        !selectedDate ? '날짜를 선택해주세요.' : '방문 시간을 선택해주세요.'
      );
      setShowWarning(true);
      setTimeout(() => setShowWarning(false), 3000);
      return;
    }

    if (recommendedTime && selectedHours < Math.ceil(recommendedTime.minutes / 60)) {
      setShowTimeWarning(true);
      setTimeout(() => setShowTimeWarning(false), 3000);
    }

    try {
      const requestData = {
        customerId: 1, // TODO: Replace with actual logged-in user ID
        reservationCreatedAt: dayjs().format('YYYY-MM-DD'),
        reservationDate: selectedDate.format('YYYY-MM-DD'),
        reservationTime: selectedVisitTime,
        categoryId: selectedCategory,
        reservationDuration: Math.ceil(totalDuration / 60),
        reservationMemo: memo,
        reservationAmount: totalPrice,
        additionalDuration: selectedHours - STANDARD_HOURS,
        optionIds: selectedCategoryOptions
      };

      console.log('Reservation Request Data:', requestData);
      
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const result = await response.json();
      if (!result.success) throw new Error(result.message || '예약 생성 실패');
      
      const reservationId = result.data?.reservationId;
      if (!reservationId) throw new Error('예약 ID를 받지 못했습니다.');
      
      localStorage.setItem('currentReservationId', reservationId);
      router.push('/matching');
      
    } catch (error) {
      console.error('Reservation creation failed:', error);
      setWarningMessage(error instanceof Error ? error.message : '예약 생성 중 오류가 발생했습니다.');
      setShowWarning(true);
      setTimeout(() => setShowWarning(false), 3000);
    }
  };

  const visitTimeSlots: string[] = Array.from({ length: 19 }, (_, i) => {
    const hour = 9 + Math.floor(i / 2);
    const minute = i % 2 === 0 ? '00' : '30';
    return `${hour}:${minute}`;
  });

  return {
    // State
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
    
    // Constants
    standardHours: STANDARD_HOURS,
    basePrice: BASE_PRICE,
    pricePerHour: PRICE_PER_HOUR,
    
    // Computed
    totalPrice,
    
    // Handlers & Data
    handleTimeChange,
    handleNext,
    handleResetTime: () => setSelectedHours(STANDARD_HOURS),
    fetchCategoryOptions,
    visitTimeSlots,
  };
}; 