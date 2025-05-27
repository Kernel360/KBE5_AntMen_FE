'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
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

export default function ReservationForm() {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [isTimeModalOpen, setIsTimeModalOpen] = useState(false);
  const [isVisitTimeModalOpen, setIsVisitTimeModalOpen] = useState(false);
  const [selectedHours, setSelectedHours] = useState(4);
  const [selectedVisitTime, setSelectedVisitTime] = useState<string | null>(null);
  const standardHours = 4;
  const basePrice = 40000;
  const pricePerHour = 10000;

  // 방문 가능 시간대 (9시 ~ 18시)
  const visitTimeSlots: string[] = Array.from({ length: 19 }, (_, i) => {
    const hour = 9 + Math.floor(i / 2);
    const minute = i % 2 === 0 ? '00' : '30';
    return `${hour}:${minute}`;
  });

  const handleNext = () => {
    if (!selectedDate) {
      setShowWarning(true);
      setTimeout(() => setShowWarning(false), 3000);
      return;
    }
    // TODO: 다음 페이지로 이동
  };

  const formatDate = (date: Dayjs) => {
    return {
      full: date.format('YYYY년 M월 D일'),
      day: date.format('dddd')
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
      if (newHours < standardHours || newHours > standardHours * 2) {
        return prev;
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

      {/* Content */}
      <div className="px-4 py-6">
        <h1 className="text-lg font-bold text-[#333333]">날짜/시간을 선택해 주세요.</h1>
        {/* Manager Info */}
        <div className="flex items-start gap-4 mb-8">
          <div className="text-[#666666]">
            <p className="font-medium">교육받은 매니저님이 방문합니다.</p>
            <button className="text-sm text-[#999999] flex items-center">
              어떤 교육을 받나요?
              <Image 
                src="/icons/chevron-right.svg" 
                alt="More" 
                width={16} 
                height={16}
              />
            </button>
          </div>
          <div className="flex-shrink-0">
            <Image 
              src="/images/manager.png" 
              alt="Manager" 
              width={48} 
              height={48}
              className="rounded-full"
            />
          </div>
        </div>

        {/* Calendar Selection */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">날짜 선택</h2>
          </div>
          
          {/* Selected Date Display */}
          <div 
            className="flex justify-between items-center p-4 bg-[#F8F8F8] rounded-xl mb-4 cursor-pointer"
            onClick={() => setIsCalendarOpen(!isCalendarOpen)}
          >
            <div>
              <p className="text-lg font-bold text-[#333333]">
                {selectedDate ? formatDate(selectedDate).full : '날짜 선택'}
              </p>
              {selectedDate && (
                <p className="text-sm text-[#666666]">{formatDate(selectedDate).day}</p>
              )}
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
            <div 
              className="flex justify-between items-center p-4 bg-[#F8F8F8] rounded-xl cursor-pointer"
              onClick={() => setIsTimeModalOpen(true)}
            >
              <div>
                <p className="text-lg font-bold text-[#333333]">{selectedHours}시간</p>
                <p className="text-sm text-[#666666]">서비스 시간</p>
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
            <div 
              className="flex justify-between items-center p-4 bg-[#F8F8F8] rounded-xl cursor-pointer"
              onClick={() => setIsVisitTimeModalOpen(true)}
            >
              <div>
                {selectedVisitTime ? (
                  <>
                    <p className="text-lg font-bold text-[#333333]">
                      {selectedVisitTime} - {calculateEndTime(selectedVisitTime, selectedHours)}
                    </p>
                    <p className="text-sm text-[#666666]">방문 시간 · {selectedHours}시간</p>
                  </>
                ) : (
                  <>
                    <p className="text-lg font-bold text-[#333333]">방문 시간</p>
                    <p className="text-sm text-[#666666]">선택해주세요</p>
                  </>
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

        {/* Time Selection Bottom Modal */}
        {isTimeModalOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black bg-opacity-40 z-40"
              onClick={() => setIsTimeModalOpen(false)}
            />
            
            {/* Modal */}
            <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 pb-8">
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
              <div className="p-6">
                <div className="flex justify-center items-center gap-8 mb-8">
                  <button
                    onClick={() => handleTimeChange(false)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center
                      ${selectedHours <= standardHours 
                        ? 'bg-[#F8F8F8] text-[#CCCCCC]' 
                        : 'bg-white border-2 border-[#0fbcd6] text-[#0fbcd6]'
                      }`}
                    disabled={selectedHours <= standardHours}
                  >
                    -
                  </button>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-[#333333]">{selectedHours}시간</p>
                    <p className="text-sm text-[#666666] mt-1">표준 시간은 {standardHours}시간입니다.</p>
                  </div>
                  <button
                    onClick={() => handleTimeChange(true)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center
                      ${selectedHours >= standardHours * 2 
                        ? 'bg-[#F8F8F8] text-[#CCCCCC]' 
                        : 'bg-white border-2 border-[#0fbcd6] text-[#0fbcd6]'
                      }`}
                    disabled={selectedHours >= standardHours * 2}
                  >
                    +
                  </button>
                </div>

                {/* Price Information */}
                <div className="bg-[#F8F8F8] rounded-2xl p-6">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <p className="text-[#666666] mb-1">기본 요금 (4시간)</p>
                      <p className="text-[#666666]">추가 시간당</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-medium text-[#333333] mb-1">
                        {basePrice.toLocaleString()}원
                      </p>
                      <p className="text-lg font-medium text-[#333333]">
                        {pricePerHour.toLocaleString()}원
                      </p>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-[#EEEEEE]">
                    <div className="flex justify-between items-center">
                      <span className="text-[#666666]">
                        {selectedHours > standardHours 
                          ? `${standardHours}시간 + ${selectedHours - standardHours}시간` 
                          : `${selectedHours}시간`}
                      </span>
                      <span className="text-2xl font-bold text-[#333333]">
                        {calculatePrice(selectedHours).toLocaleString()}원
                      </span>
                    </div>
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
            <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 max-h-[80vh] overflow-auto">
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
                <div className="grid grid-cols-3 gap-3">
                  {visitTimeSlots.map((time) => (
                    <button
                      key={time}
                      onClick={() => {
                        setSelectedVisitTime(time);
                        setIsVisitTimeModalOpen(false);
                      }}
                      className={`py-3 rounded-xl text-center
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
      </div>

      {/* Warning Toast */}
      {showWarning && (
        <div className="fixed bottom-[100px] left-1/2 -translate-x-1/2 w-[328px] py-4 bg-[#333333] rounded-xl shadow-lg">
          <p className="text-center text-white font-medium">날짜를 먼저 선택해 주세요.</p>
        </div>
      )}

      {/* Price Info - Fixed at bottom */}
      <div className="fixed bottom-1 left-1/2 -translate-x-1/2 w-[328px] py-4 bg-white">
        <div className="flex justify-between items-end">
          <div>
            <p className="text-2xl font-bold text-[#333333]">
              {calculatePrice(selectedHours).toLocaleString()}원
            </p>
            <div className="flex items-center gap-1">
              <span className="text-sm text-[#666666]">
                {selectedHours > standardHours 
                  ? `기본 ${standardHours}시간 + ${selectedHours - standardHours}시간` 
                  : `${selectedHours}시간`}
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
            다음
          </button>
        </div>
      </div>
    </div>
  );
} 