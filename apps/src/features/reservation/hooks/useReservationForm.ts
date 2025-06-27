'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dayjs, { Dayjs } from 'dayjs';
import { Category, CategoryOption } from '@/shared/api/category';
import { calculatePrice } from '@/shared/lib/utils';
import { getRecommendDuration } from '@/entities/reservation/api/reservationApi';
import { fetchAddresses } from '@/shared/api/address';

export const useReservationForm = ({ initialCategory, initialOptions, addressId }: { initialCategory: Category; initialOptions: CategoryOption[]; addressId: number }) => {
  const router = useRouter();

  // State
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');
  const [isTimeModalOpen, setIsTimeModalOpen] = useState(false);
  const [isVisitTimeModalOpen, setIsVisitTimeModalOpen] = useState(false);
  const [selectedHours, setSelectedHours] = useState(2); // 기본 시간 2시간 고정
  const [selectedVisitTime, setSelectedVisitTime] = useState<string | null>(null);
  const [selectedCategoryOptions, setSelectedCategoryOptions] = useState<number[]>([]);
  const [memo, setMemo] = useState('');
  const [recommendedTime, setRecommendedTime] = useState<{ time: number; area: number } | null>(null);
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
            }
          }
        } catch (e) {
          console.error('예약 정보 복원 중 오류:', e);
        }
      }
    };

    loadSavedData();
  }, [initialCategory.categoryId]);

  // 추천 시간 및 주소 정보 API 호출
  useEffect(() => {
    const fetchRecommendedTimeAndAddress = async () => {
      try {
        setIsLoading(true);
        
        // 병렬로 API 호출
        const [recommendedHours, addresses] = await Promise.all([
          getRecommendDuration(addressId),
          fetchAddresses()
        ]);
        
        // 현재 addressId에 해당하는 주소 정보 찾기
        const currentAddress = addresses.find(addr => addr.addressId === addressId);
        const addressArea = currentAddress?.addressArea || 50; // 기본값 50평
        
        // 백엔드에서 받은 시간 정보를 그대로 사용 (분 단위 변환 X)
        setRecommendedTime({
          time: recommendedHours,
          area: addressArea
        });
      } catch (error) {
        console.error('추천 시간 및 주소 정보 조회 실패:', error);
        // 오류 시 기본값 설정
        setRecommendedTime({
          time: 4, 
          area: 50
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (addressId) {
      fetchRecommendedTimeAndAddress();
    }
  }, [addressId]);

  // Computed Values
  const totalOptionsPrice = selectedCategoryOptions.reduce((total, optionId) => {
    const option = initialOptions.find((opt) => opt.coId === optionId);
    return total + (option?.coPrice || 0);
  }, 0);

  const totalOptionsTime = selectedCategoryOptions.reduce((total, optionId) => {
    const option = initialOptions.find((opt) => opt.coId === optionId);
    return total + (option?.coTime || 0);
  }, 0);

  // 백엔드 로직과 동일하게 수정
  // 총가격 = categoryPrice + (선택시간 - 2) * 20000 + 옵션가격
  const HOURLY_AMOUNT = 20000; // 시간당 가격 고정
  const BASE_DURATION = 2; // 기본 시간 고정
  const additionalHours = Math.max(0, selectedHours - BASE_DURATION);
  const baseServicePrice = initialCategory.categoryPrice + (additionalHours * HOURLY_AMOUNT);
  const totalPrice = baseServicePrice + totalOptionsPrice;
  const totalDuration = selectedHours * 60 + totalOptionsTime;

  // 실시간 자동 저장 기능 제거 - handleNext에서만 저장

  // Event Handlers
  const handleTimeChange = (increment: boolean) => {
    setSelectedHours(prev => {
      const newHours = increment ? prev + 1 : prev - 1;
      if (newHours < BASE_DURATION || newHours > 12) return prev;
      
      if (recommendedTime && newHours < recommendedTime.time) {
        setShowTimeWarning(true);
      } else {
        setShowTimeWarning(false);
      }
      return newHours;
    });
  };
  
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
      reservationAmount: totalPrice,
      additionalDuration: selectedHours - BASE_DURATION,
      optionIds: selectedCategoryOptions,
    };

    try {
      // localStorage 저장 대신 sessionStorage에 임시 저장 (탭별로 분리)
      sessionStorage.setItem('currentReservation', JSON.stringify(reservationDetails));

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
    
    standardHours: BASE_DURATION, // 기본 시간 2시간 고정
    basePrice: initialCategory.categoryPrice,
    pricePerHour: HOURLY_AMOUNT, // 시간당 가격 20,000원 고정
    
    totalPrice: totalPrice,
    
    handleTimeChange,
    handleNext,
    handleResetTime: () => setSelectedHours(BASE_DURATION),
    visitTimeSlots,
    isSubmitting,
    isLoading,
    error,
    isRecommendedTimeLoading: isLoading && !recommendedTime,
  };
}; 