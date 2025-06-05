'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/ko';

// MUI 테마 커스터마이징
const theme = createTheme({
  palette: {
    primary: {
      main: '#0fbcd6',
    },
  },
});

interface TimeSlot {
  hour: number;
  minute: string;
  formatted: string;
}

interface Category {
  id: number;
  name: string;
  description: string;
}

interface Option {
  id: number;
  name: string;
  price: number;
}

interface CategoryOption {
  id: number;
  name: string;
  price: number;
  time: number;
  description: string;
  notice?: string;
}

interface RecommendedTime {
  minutes: number;
  area: number;
}

interface ReservationRequest {
  customerId: number;
  reservationCreatedAt: string;
  reservationDate: string;
  reservationTime: string;
  categoryId: number;
  reservationDuration: number;
  reservationMemo: string;
  reservationAmount: number;
  additionalDuration: number;
  optionIds: number[];
}

// 임시 데이터 (실제로는 API에서 가져와야 함)
const categories: Category[] = [
  { id: 1, name: '대청소', description: '일반 가정집 청소' },
  { id: 2, name: '사무실 청소', description: '사무실, 상업공간 청소' },
  { id: 3, name: '부분 청소', description: '이사 후 또는 입주 전 청소' },
];

const options: Option[] = [
  { id: 1, name: '냉장고 청소', price: 20000 },
  { id: 2, name: '베란다 청소', price: 15000 },
  { id: 3, name: '화장실 청소', price: 10000 },
];

export default function ReservationForm() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');
  const [isTimeModalOpen, setIsTimeModalOpen] = useState(false);
  const [isVisitTimeModalOpen, setIsVisitTimeModalOpen] = useState(false);
  const [selectedHours, setSelectedHours] = useState(2);
  const [selectedVisitTime, setSelectedVisitTime] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  const [memo, setMemo] = useState('');
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isOptionsModalOpen, setIsOptionsModalOpen] = useState(false);
  const standardHours = 2;
  const basePrice = 40000;
  const pricePerHour = 20000;
  const [selectedCategoryOptions, setSelectedCategoryOptions] = useState<number[]>([]);
  const [isCategoryOptionsModalOpen, setIsCategoryOptionsModalOpen] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState<CategoryOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recommendedTime, setRecommendedTime] = useState<RecommendedTime>({ minutes: 240, area: 50 });
  const [showTimeWarning, setShowTimeWarning] = useState(false);

  // 방문 가능 시간대 (9시 ~ 18시)
  const visitTimeSlots: string[] = Array.from({ length: 19 }, (_, i) => {
    const hour = 9 + Math.floor(i / 2);
    const minute = i % 2 === 0 ? '00' : '30';
    return `${hour}:${minute}`;
  });

  // 현재 선택된 카테고리의 추가 옵션 목록
  const currentCategoryOptions = selectedCategory ? categoryOptions[selectedCategory] : [];

  // 카테고리별 옵션 데이터 가져오기
  useEffect(() => {
    if (!selectedCategory) {
      setCategoryOptions([]);
      return;
    }

    const fetchCategoryOptions = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/categories/${selectedCategory}/options`);
        if (!response.ok) throw new Error('옵션을 불러오는데 실패했습니다.');
        const data = await response.json();
        setCategoryOptions(data as CategoryOption[]);
      } catch (err) {
        setError(err instanceof Error ? err.message : '옵션을 불러오는데 실패했습니다.');
        setCategoryOptions([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategoryOptions();
  }, [selectedCategory]);

  const handleNext = async () => {
    if (!selectedDate || !selectedVisitTime || !selectedCategory) {
      setWarningMessage(
        !selectedCategory 
          ? '서비스를 선택해주세요.'
          : !selectedDate 
            ? '날짜를 선택해주세요.'
            : '방문 시간을 선택해주세요.'
      );
      setShowWarning(true);
      setTimeout(() => setShowWarning(false), 3000);
      return;
    }

    // 추천 시간보다 적은 시간으로 예약 시도할 경우 경고 메시지만 표시하고 계속 진행
    if (recommendedTime && selectedHours < Math.ceil(recommendedTime.minutes / 60)) {
      setShowTimeWarning(true); // 경고 메시지 표시
      setTimeout(() => setShowTimeWarning(false), 3000);
    }

    try {
      const requestData = {
        customerId: 1, // TODO: 실제 로그인된 사용자 ID로 대체
        reservationCreatedAt: dayjs().format('YYYY-MM-DD'),
        reservationDate: selectedDate.format('YYYY-MM-DD'),
        reservationTime: selectedVisitTime,
        categoryId: selectedCategory,
        reservationDuration: Math.ceil(calculateTotalTime() / 60),
        reservationMemo: memo,
        reservationAmount: calculateTotalPrice(),
        additionalDuration: selectedHours - standardHours,
        optionIds: selectedCategoryOptions
      };

      console.log('예약 요청 데이터:', requestData);

      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('API 응답 데이터:', result);
      
      // API 응답 구조에 맞게 수정: { success: true, data: { reservationId, ... } }
      if (!result.success) {
        throw new Error(result.message || '예약 생성 실패');
      }
      
      const reservationId = result.data?.reservationId;
      
      if (!reservationId) {
        console.error('reservationId를 찾을 수 없습니다:', result);
        throw new Error('예약 ID를 받지 못했습니다.');
      }

      console.log('예약 ID:', reservationId);
      
      // 매칭 페이지로 이동
      router.push(`/reservation/${reservationId}/matching/managers`);
      
    } catch (error) {
      console.error('예약 생성 중 오류 발생:', error);
      setWarningMessage(error instanceof Error ? error.message : '예약 생성 중 오류가 발생했습니다.');
      setShowWarning(true);
      setTimeout(() => setShowWarning(false), 3000);
      return;
    }
  };

  const calculateTotalPrice = () => {
    const baseAmount = calculatePrice(selectedHours);
    const optionsAmount = selectedCategoryOptions.reduce((total, optionId) => {
      const option = categoryOptions.find((opt: CategoryOption) => opt.id === optionId);
      return total + (option?.price || 0);
    }, 0);
    return baseAmount + optionsAmount;
  };

  const calculateTotalTime = () => {
    const baseTime = selectedHours * 60;
    const optionsTime = selectedCategoryOptions.reduce((total, optionId) => {
      const option = categoryOptions.find((opt: CategoryOption) => opt.id === optionId);
      return total + (option?.time || 0);
    }, 0);
    return baseTime + optionsTime;
  };

  const formatDate = (date: Dayjs) => {
    const koreanDays = ['일', '월', '화', '수', '목', '금', '토'];
    return {
      full: date.format('YYYY.MM.DD'),
      day: `(${koreanDays[date.day()]})`
    };
  };

  const handleResetTime = () => {
    setSelectedHours(standardHours);
  };

  const calculatePrice = (hours: number) => {
    if (hours <= standardHours) {
      return basePrice;
    }
    const additionalHours = hours - standardHours;
    return basePrice + (pricePerHour * additionalHours);
  };

  const calculateEndTime = (startTime: string, duration: number) => {
    const [hours, minutes] = startTime.split(':').map(Number);
    let endHours = hours + duration;
    const endMinutes = minutes;
    
    // Handle times past midnight
    if (endHours >= 24) {
      endHours = endHours - 24;
    }
    
    // Format the end time
    return `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;
  };

  const handleTimeChange = (increment: boolean) => {
    setSelectedHours(prev => {
      const newHours = increment ? prev + 1 : prev - 1;
      if (newHours < standardHours || newHours > 8) {
        return prev;
      }
      
      // 추천 시간보다 적은 시간 선택 시 경고 표시
      if (recommendedTime && newHours < Math.ceil(recommendedTime.minutes / 60)) {
        setShowTimeWarning(true);
      } else {
        setShowTimeWarning(false);
      }
      
      return newHours;
    });
  };

  return (
    <div className="min-h-screen bg-white pb-[140px] relative">
      {/* Navigation Header */}
      <div className="h-14 flex items-center px-4 border-b border-[#EEEEEE]">
        <Link href="/reservation" className="w-6 h-6 flex items-center justify-center">
          <Image 
            src="/icons/arrow-left.svg" 
            alt="Back" 
            width={24} 
            height={24}
          />
        </Link>
      </div>

      {/* Category Tabs */}
      <div className="border-b border-[#EEEEEE]">
        <div className="px-4">
          <div className="flex items-center gap-4 overflow-x-auto scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`py-3 whitespace-nowrap relative ${
                  category.id === selectedCategory
                    ? 'text-[#0fbcd6] font-bold'
                    : 'text-[#666666]'
                }`}
              >
                {category.name}
                {category.id === selectedCategory && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0fbcd6]" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Selected Category Description */}
      {selectedCategory && (
        <div className="px-4 py-3 bg-[#F8F8F8]">
          <p className="text-sm text-[#666666]">
            {categories.find(category => category.id === selectedCategory)?.description}
          </p>
        </div>
      )}

      {/* Content */}
      <div className="px-4 py-6">
        <h1 className="text-lg font-bold text-[#333333] mb-8">예약 정보를 입력해 주세요.</h1>

        {/* Calendar Selection */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">날짜 선택</h2>
          </div>
          
          <p className="text-sm text-[#666666] mb-1.5 pl-2">방문일</p>
          
          {/* Selected Date Display */}
          <div 
            className="flex justify-between items-center p-3.5 bg-[#F8F8F8] rounded-xl mb-4 cursor-pointer"
            onClick={() => setIsCalendarOpen(!isCalendarOpen)}
          >
            <div>
              <div className="flex items-center gap-1.5">
                <p className="text-base font-medium text-[#333333]">
                  {selectedDate ? formatDate(selectedDate).full : '선택해주세요'}
                </p>
                {selectedDate && (
                  <p className="text-base text-[#666666]">{formatDate(selectedDate).day}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {selectedDate && (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedDate(null);
                  }}
                  className="px-3 py-1.5 rounded-full bg-white text-sm font-medium text-[#666666] hover:bg-gray-50"
                >
                  초기화
                </button>
              )}
              <Image 
                src="/icons/chevron-right.svg" 
                alt="Toggle Calendar" 
                width={24} 
                height={24}
                className={`transition-transform ${isCalendarOpen ? 'rotate-90' : ''}`}
              />
            </div>
          </div>

          {/* Calendar */}
          {isCalendarOpen && (
            <div className="bg-white rounded-xl shadow-lg mb-4">
              <ThemeProvider theme={theme}>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
                  <DateCalendar
                    value={selectedDate}
                    onChange={(newValue) => {
                      setSelectedDate(newValue);
                      setIsCalendarOpen(false);
                    }}
                    sx={{
                      width: '100%',
                      '& .MuiPickersDay-root': {
                        fontSize: '0.875rem',
                      },
                      '& .MuiDayCalendar-weekDayLabel': {
                        fontSize: '0.875rem',
                      },
                    }}
                  />
                </LocalizationProvider>
              </ThemeProvider>
            </div>
          )}
        </div>

        {/* Time Selection */}
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-4">시간 선택</h2>
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5 pl-2">
                <p className="text-sm text-[#666666]">서비스 시간</p>
                {recommendedTime && (
                  <div className="flex items-center">
                    <span className="text-xs text-[#0fbcd6] font-medium">
                      알고리즘 기반 &middot; {Math.floor(recommendedTime.area)}평 {Math.floor(recommendedTime.minutes / 60)}시간 추천
                    </span>
                  </div>
                )}
              </div>
              {showTimeWarning && (
                <div className="mb-2 pl-2">
                  <p className="text-xs text-[#FF4444]">
                    {Math.floor(recommendedTime.area)}평 기준 {Math.ceil(recommendedTime.minutes / 60)}시간이 추천됩니다.
                  </p>
                </div>
              )}
              <div 
                className="flex justify-between items-center p-3.5 bg-[#F8F8F8] rounded-xl cursor-pointer"
                onClick={() => setIsTimeModalOpen(true)}
              >
                <div>
                  <p className="text-base font-medium text-[#333333]">{selectedHours}시간</p>
                </div>
                <div className="flex items-center gap-2">
                  {selectedHours !== standardHours && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleResetTime();
                      }}
                      className="px-3 py-1.5 rounded-full bg-white text-sm font-medium text-[#666666] hover:bg-gray-50"
                    >
                      초기화
                    </button>
                  )}
                  <Image 
                    src="/icons/chevron-right.svg" 
                    alt="Open Time Selection" 
                    width={24} 
                    height={24}
                    className="rotate-90"
                  />
                </div>
              </div>
            </div>
            <div>
              <p className="text-sm text-[#666666] mb-1.5 pl-2">방문 시간</p>
              <div 
                className="flex justify-between items-center p-3.5 bg-[#F8F8F8] rounded-xl cursor-pointer"
                onClick={() => setIsVisitTimeModalOpen(true)}
              >
                <div>
                  {selectedVisitTime ? (
                    <div className="flex items-center gap-1.5">
                      <p className="text-base font-medium text-[#333333]">
                        {selectedVisitTime} - {calculateEndTime(selectedVisitTime, selectedHours)}
                      </p>
                      <p className="text-base text-[#666666]">{selectedHours}시간</p>
                    </div>
                  ) : (
                    <p className="text-base font-medium text-[#333333]">선택해주세요</p>
                  )}
                </div>
                <Image 
                  src="/icons/chevron-right.svg" 
                  alt="Select Visit Time" 
                  width={24} 
                  height={24}
                  className="rotate-90"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Additional Services Options */}
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-4">추가 서비스 옵션</h2>
          {isLoading ? (
            <div className="p-3.5 bg-[#F8F8F8] rounded-xl text-center">
              <p className="text-[#666666]">옵션을 불러오는 중...</p>
            </div>
          ) : error ? (
            <div className="p-3.5 bg-[#F8F8F8] rounded-xl text-center">
              <p className="text-[#FF4444]">{error}</p>
              <button 
                onClick={() => {
                  setCategoryOptions([]);
                  setError(null);
                }}
                className="mt-2 text-sm text-[#0fbcd6]"
              >
                다시 시도
              </button>
            </div>
          ) : categoryOptions.length > 0 ? (
            <div className="space-y-3">
              {categoryOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => {
                    setSelectedCategoryOptions(prev => 
                      prev.includes(option.id)
                        ? prev.filter(id => id !== option.id)
                        : [...prev, option.id]
                    );
                  }}
                  className={`w-full p-3.5 rounded-xl
                    ${selectedCategoryOptions.includes(option.id)
                      ? 'bg-[#0fbcd6] text-white'
                      : 'bg-[#F8F8F8] text-[#333333]'
                    }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-base font-medium">{option.name}</span>
                    <span className="text-base font-medium">
                      {option.price > 0 ? `+${option.price.toLocaleString()}원` : ''}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm opacity-80">{option.description}</span>
                    <span className="text-sm opacity-80">+{option.time}분</span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-3.5 bg-[#F8F8F8] rounded-xl text-center">
              <p className="text-[#666666]">이 서비스에 대한 추가 서비스 옵션이 없습니다.</p>
            </div>
          )}
        </div>

        {/* Selected Additional Services Summary */}
        {selectedCategoryOptions.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-bold mb-4">선택된 추가 서비스 옵션</h2>
            <div className="bg-[#F8F8F8] rounded-xl p-4">
              <div className="space-y-4">
                {categoryOptions
                  .filter(option => selectedCategoryOptions.includes(option.id))
                  .map(option => (
                    <div key={option.id} className="flex flex-col">
                      <div className="flex justify-between items-center">
                        <span className="font-bold">{option.name}</span>
                        <span className="font-medium text-[#0fbcd6]">
                          +{option.price.toLocaleString()}원
                        </span>
                      </div>
                      {option.notice && (
                        <p className="text-sm text-[#666666] mt-1">{option.notice}</p>
                      )}
                    </div>
                  ))
                }
              </div>
              <div className="mt-4 pt-4 border-t border-[#EEEEEE]">
                <div className="flex justify-between items-center">
                  <span className="text-[#666666]">총 추가 시간</span>
                  <span className="font-bold">
                    +{categoryOptions
                      .filter(option => selectedCategoryOptions.includes(option.id))
                      .reduce((total, option) => total + option.time, 0)}분
                  </span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-[#666666]">총 추가 금액</span>
                  <span className="font-bold text-[#0fbcd6]">
                    +{categoryOptions
                      .filter(option => selectedCategoryOptions.includes(option.id))
                      .reduce((total, option) => total + option.price, 0)
                      .toLocaleString()}원
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Time Selection Bottom Modal */}
        {isTimeModalOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black bg-opacity-40 z-40"
              onClick={() => setIsTimeModalOpen(false)}
            />
            
            {/* Modal */}
            <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[328px] bg-white rounded-t-2xl z-50 pb-8">
              {/* Header */}
              <div className="flex justify-between items-center p-4 border-b border-[#EEEEEE]">
                <button 
                  className="text-[#999999]"
                  onClick={() => setIsTimeModalOpen(false)}
                >
                  취소
                </button>
                <h3 className="text-lg font-bold">서비스 시간</h3>
                <button 
                  className="text-[#0fbcd6] font-medium"
                  onClick={() => setIsTimeModalOpen(false)}
                >
                  확인
                </button>
              </div>

              {/* Content */}
              <div className="p-4">
                {recommendedTime && (
                  <div className="mb-6 bg-[#0fbcd6] text-white p-4 rounded-xl">
                    <div className="mb-2">
                      <span className="text-sm font-medium">사용자 맞춤 알고리즘 기반</span>
                    </div>
                    <p className="text-sm opacity-90 break-keep">
                      고객님의 공간({Math.floor(recommendedTime.area)}평)에 최적화된 청소 시간은 {Math.floor(recommendedTime.minutes / 60)}시간입니다.
                      <br />실제 현장 상황에 따라 추가 시간이 필요할 수 있습니다.
                    </p>
                  </div>
                )}

                <div className="flex justify-center items-center gap-6 mb-6">
                  <button
                    onClick={() => handleTimeChange(false)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center
                      ${selectedHours <= standardHours 
                        ? 'bg-[#F8F8F8] text-[#CCCCCC]' 
                        : 'bg-white border-2 border-[#0fbcd6] text-[#0fbcd6]'
                      }`}
                    disabled={selectedHours <= standardHours}
                  >
                    -
                  </button>
                  <div className="text-center min-w-[80px]">
                    <p className="text-2xl font-bold text-[#333333]">{selectedHours}시간</p>
                    <p className="text-xs text-[#666666] mt-1">기본 시간은 {standardHours}시간입니다.</p>
                  </div>
                  <button
                    onClick={() => handleTimeChange(true)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center
                      ${selectedHours >= 8
                        ? 'bg-[#F8F8F8] text-[#CCCCCC]' 
                        : 'bg-white border-2 border-[#0fbcd6] text-[#0fbcd6]'
                      }`}
                    disabled={selectedHours >= 8}
                  >
                    +
                  </button>
                </div>

                {/* Price Information */}
                <div className="bg-[#F8F8F8] rounded-xl p-4">
                  <div className="flex flex-col gap-2 mb-4">
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-[#666666]">기본 요금 (2시간)</p>
                      <p className="text-base font-medium text-[#333333]">
                        {basePrice.toLocaleString()}원
                      </p>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-[#666666]">추가 시간당</p>
                      <p className="text-base font-bold text-[#333333]">
                        {pricePerHour.toLocaleString()}원
                      </p>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-[#EEEEEE]">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-[#666666]">
                        {selectedHours > standardHours 
                          ? `${standardHours}시간 + ${selectedHours - standardHours}시간` 
                          : `${selectedHours}시간`}
                      </span>
                      <span className="text-xl font-bold text-[#333333]">
                        {calculatePrice(selectedHours).toLocaleString()}원
                      </span>
                    </div>
                    {showTimeWarning && (
                      <p className="text-xs text-[#FF4444] mt-2 break-keep">
                        * {Math.floor(recommendedTime.area)}평 기준 {Math.ceil(recommendedTime.minutes / 60)}시간이 추천됩니다.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Visit Time Selection Bottom Modal */}
        {isVisitTimeModalOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black bg-opacity-40 z-40"
              onClick={() => setIsVisitTimeModalOpen(false)}
            />
            
            {/* Modal */}
            <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[328px] bg-white rounded-t-2xl z-50 max-h-[80vh] overflow-auto">
              {/* Header */}
              <div className="flex justify-between items-center p-4 border-b border-[#EEEEEE] sticky top-0 bg-white">
                <button 
                  className="text-[#999999]"
                  onClick={() => setIsVisitTimeModalOpen(false)}
                >
                  취소
                </button>
                <h3 className="text-lg font-bold">방문 시간 선택</h3>
                <button 
                  className="text-[#0fbcd6] font-medium"
                  onClick={() => setIsVisitTimeModalOpen(false)}
                >
                  확인
                </button>
              </div>

              {/* Time Slots */}
              <div className="p-4">
                <div className="grid grid-cols-3 gap-2">
                  {visitTimeSlots.map((time) => (
                    <button
                      key={time}
                      onClick={() => {
                        setSelectedVisitTime(time);
                        setIsVisitTimeModalOpen(false);
                      }}
                      className={`py-2.5 rounded-lg text-center text-sm
                        ${selectedVisitTime === time 
                          ? 'bg-[#0fbcd6] text-white' 
                          : 'bg-[#F8F8F8] text-[#333333]'
                        }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notice */}
              <div className="p-4 bg-[#F8F8F8] mt-4">
                <p className="text-sm text-[#666666] text-center">
                  방문 시간은 30분 단위로 선택 가능합니다.
                </p>
              </div>
            </div>
          </>
        )}

        {/* Category Selection Modal */}
        {isCategoryModalOpen && (
          <>
            <div 
              className="fixed inset-0 bg-black bg-opacity-40 z-40"
              onClick={() => setIsCategoryModalOpen(false)}
            />
            <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[328px] bg-white rounded-t-2xl z-50">
              <div className="flex justify-between items-center p-4 border-b border-[#EEEEEE]">
                <button 
                  className="text-[#999999]"
                  onClick={() => setIsCategoryModalOpen(false)}
                >
                  취소
                </button>
                <h3 className="text-lg font-bold">서비스 선택</h3>
                <button 
                  className="text-[#0fbcd6] font-medium"
                  onClick={() => setIsCategoryModalOpen(false)}
                >
                  확인
                </button>
              </div>
              <div className="p-4">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => {
                      setSelectedCategory(category.id);
                      setIsCategoryModalOpen(false);
                    }}
                    className={`w-full p-4 rounded-xl mb-2 text-left
                      ${selectedCategory === category.id 
                        ? 'bg-[#0fbcd6] text-white' 
                        : 'bg-[#F8F8F8] text-[#333333]'
                      }`}
                  >
                    <p className="font-bold">{category.name}</p>
                    <p className="text-sm opacity-80">{category.description}</p>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Options Selection Modal */}
        {isOptionsModalOpen && (
          <>
            <div 
              className="fixed inset-0 bg-black bg-opacity-40 z-40"
              onClick={() => setIsOptionsModalOpen(false)}
            />
            <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[328px] bg-white rounded-t-2xl z-50">
              <div className="flex justify-between items-center p-4 border-b border-[#EEEEEE]">
                <button 
                  className="text-[#999999]"
                  onClick={() => setIsOptionsModalOpen(false)}
                >
                  취소
                </button>
                <h3 className="text-lg font-bold">추가 서비스 옵션 선택</h3>
                <button 
                  className="text-[#0fbcd6] font-medium"
                  onClick={() => setIsOptionsModalOpen(false)}
                >
                  확인
                </button>
              </div>
              <div className="p-4">
                {options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => {
                      setSelectedOptions(prev => 
                        prev.includes(option.id)
                          ? prev.filter(id => id !== option.id)
                          : [...prev, option.id]
                      );
                    }}
                    className={`w-full p-4 rounded-xl mb-2 flex justify-between items-center
                      ${selectedOptions.includes(option.id)
                        ? 'bg-[#0fbcd6] text-white'
                        : 'bg-[#F8F8F8] text-[#333333]'
                      }`}
                  >
                    <span className="font-bold">{option.name}</span>
                    <span>{option.price.toLocaleString()}원</span>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Warning Toast */}
      {showWarning && (
        <div className="fixed bottom-[100px] left-1/2 -translate-x-1/2 w-[328px] py-4 bg-[#333333] rounded-xl shadow-lg">
          <p className="text-center text-white font-medium">
            {warningMessage}
          </p>
        </div>
      )}

      {/* Price Info - Fixed at bottom */}
      <div className="fixed bottom-1 left-1/2 -translate-x-1/2 w-[328px] py-4 bg-white">
        <div className="flex justify-between items-end">
          <div>
            <p className="text-2xl font-bold text-[#333333]">
              {calculateTotalPrice().toLocaleString()}원
            </p>
            <div className="flex items-center gap-1">
              <span className="text-sm text-[#666666]">
                {selectedHours > standardHours 
                  ? `기본 ${standardHours}시간 + ${selectedHours - standardHours}시간` 
                  : `${selectedHours}시간`}
                {selectedOptions.length > 0 && ` · 옵션 ${selectedOptions.length}개`}
              </span>
              <button 
                className="text-sm text-[#999999] flex items-center"
                onClick={() => setIsTimeModalOpen(true)}
              >
                상세보기
                <Image 
                  src="/icons/chevron-right.svg" 
                  alt="Detail" 
                  width={16} 
                  height={16}
                />
              </button>
            </div>
          </div>
          <button
            onClick={handleNext}
            className="w-[120px] h-12 bg-[#0fbcd6] text-white rounded-xl font-medium"
          >
            예약하기
          </button>
        </div>
      </div>
    </div>
  );
} 