import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Dayjs } from 'dayjs';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDate = (date: Dayjs) => {
  const koreanDays = ['일', '월', '화', '수', '목', '금', '토'];
  return {
    full: date.format('YYYY.MM.DD'),
    day: `(${koreanDays[date.day()]})`
  };
};

export const calculatePrice = (hours: number, basePrice: number, pricePerHour: number, standardHours: number) => {
  if (hours <= standardHours) {
    return basePrice;
  }
  const additionalHours = hours - standardHours;
  return basePrice + (pricePerHour * additionalHours);
};

export const calculateEndTime = (startTime: string, duration: number) => {
  const [hours, minutes] = startTime.split(':').map(Number);
  let endHours = hours + duration;
  const endMinutes = minutes;
  
  if (endHours >= 24) {
    endHours = endHours - 24;
  }
  
  return `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;
}; 