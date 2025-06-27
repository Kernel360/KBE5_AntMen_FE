'use client';

import Image from 'next/image';
import type { RecommendedTime } from '@/shared/types/reservation';

interface TimeSelectorProps {
  selectedHours: number;
  standardHours: number;
  onResetTime: () => void;
  onTimeModalOpen: () => void;
  selectedVisitTime: string | null;
  onVisitTimeModalOpen: () => void;
  calculateEndTime: (startTime: string, duration: number) => string;
  recommendedTime: RecommendedTime | null;
  showTimeWarning: boolean;
}

export const TimeSelector = ({
  selectedHours,
  standardHours,
  onResetTime,
  onTimeModalOpen,
  selectedVisitTime,
  onVisitTimeModalOpen,
  calculateEndTime,
  recommendedTime,
  showTimeWarning,
}: TimeSelectorProps) => {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-bold mb-4">시간 선택</h2>
      <div className="space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5 pl-2">
            <p className="text-sm text-[#666666]">서비스 시간</p>
            {recommendedTime && (
              <div className="flex items-center">
                <span className="text-xs text-primary-500 font-medium">
                  알고리즘 기반 &middot; {Math.floor(recommendedTime.area)}평 {Math.floor(recommendedTime.minutes / 60)}시간 추천
                </span>
              </div>
            )}
          </div>
          {showTimeWarning && recommendedTime && (
            <div className="mb-2 pl-2">
              <p className="text-xs text-[#FF4444]">
                {Math.floor(recommendedTime.area)}평 기준 {Math.ceil(recommendedTime.minutes / 60)}시간이 추천됩니다.
              </p>
            </div>
          )}
          <div 
            className="flex justify-between items-center p-3.5 bg-[#F8F8F8] rounded-xl cursor-pointer"
            onClick={onTimeModalOpen}
          >
            <div>
              <p className="text-base font-medium text-[#333333]">{selectedHours}시간</p>
            </div>
            <div className="flex items-center gap-2">
              {selectedHours !== standardHours && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onResetTime();
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
            onClick={onVisitTimeModalOpen}
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
  );
}; 