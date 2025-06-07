'use client';

import Image from 'next/image';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Dayjs } from 'dayjs';
import 'dayjs/locale/ko';
import { formatDate } from '@/shared/lib/utils';

// MUI 테마 커스터마이징
const theme = createTheme({
  palette: {
    primary: {
      main: '#0fbcd6',
    },
  },
});

interface DateSelectorProps {
  selectedDate: Dayjs | null;
  onDateChange: (date: Dayjs | null) => void;
  isCalendarOpen: boolean;
  onCalendarToggle: () => void;
  onCalendarClose: () => void;
}

export const DateSelector = ({
  selectedDate,
  onDateChange,
  isCalendarOpen,
  onCalendarToggle,
  onCalendarClose
}: DateSelectorProps) => {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">날짜 선택</h2>
      </div>
      
      <p className="text-sm text-[#666666] mb-1.5 pl-2">방문일</p>
      
      {/* Selected Date Display */}
      <div 
        className="flex justify-between items-center p-3.5 bg-[#F8F8F8] rounded-xl mb-4 cursor-pointer"
        onClick={onCalendarToggle}
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
                onDateChange(null);
              }}
              className="px-3 py-1.5 rounded-full bg-white text-sm font-medium text-[#666666] hover:bg-gray-50"
            >
              초기화
            </button>
          )}
          {/* @ts-ignore */}
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
                  onDateChange(newValue);
                  onCalendarClose();
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
  );
}; 