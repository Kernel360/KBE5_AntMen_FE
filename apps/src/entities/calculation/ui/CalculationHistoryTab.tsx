'use client'

import React, { useState } from 'react';
import { 
  ChevronLeftIcon,
  ChevronRightIcon,
  DocumentTextIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import { CalculationHistoryItem } from '@/entities/calculation/model/types';

interface CalculationHistoryTabProps {
  history: CalculationHistoryItem[];
}

interface CalculationSummary {
  calculationId: number;
  totalAmount: number;
  startDate: string;
  endDate: string;
  requestedAt: string;
  reservationCount: number;
}

export const CalculationHistoryTab = ({ history }: CalculationHistoryTabProps) => {
  const [selectedCalculation, setSelectedCalculation] = useState<number | null>(null);

  // calculationId로 그룹화하여 주급 요약 생성
  const weeklySummaries: CalculationSummary[] = React.useMemo(() => {
    const grouped = history.reduce((acc, item) => {
      if (!acc[item.calculationId]) {
        acc[item.calculationId] = {
          calculationId: item.calculationId,
          totalAmount: item.amount, // amount는 이미 계산된 총 지급액이므로 첫 번째 항목의 값 사용
          startDate: item.startDate,
          endDate: item.endDate,
          requestedAt: item.requestedAt,
          reservationCount: 0,
        };
      }
      acc[item.calculationId].reservationCount += 1;
      return acc;
    }, {} as Record<number, CalculationSummary>);

    return Object.values(grouped).sort(
      (a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime()
    );
  }, [history]);

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('ko-KR').format(amount);
  };

  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const startMonth = start.getMonth() + 1;
    const startDay = start.getDate();
    const endMonth = end.getMonth() + 1;
    const endDay = end.getDate();
    
    if (startMonth === endMonth) {
      return `${startMonth}월 ${startDay}일 ~ ${endDay}일`;
    }
    return `${startMonth}월 ${startDay}일 ~ ${endMonth}월 ${endDay}일`;
  };

  const getWeekNumber = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const month = start.getMonth() + 1;
    const weekOfMonth = Math.ceil(start.getDate() / 7);
    return `${month}월 ${weekOfMonth}주차`;
  };

  const getDetailsByCalculationId = (calculationId: number) => {
    return history.filter(item => item.calculationId === calculationId);
  };

  if (weeklySummaries.length === 0) {
    return (
      <div className="p-4">
        <div className="flex flex-col items-center justify-center py-16 space-y-4">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
            <DocumentTextIcon className="w-8 h-8 text-gray-400" />
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              정산 이력이 없습니다
            </h3>
            <p className="text-sm text-gray-600">
              정산 요청을 하시면 이력이 여기에 표시됩니다
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {/* 주급 명세서 리스트 */}
      {weeklySummaries.map((summary) => (
        <div key={summary.calculationId} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* 주급 카드 헤더 */}
          <div className="bg-gradient-to-r from-primary to-primary/90 p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5" />
                <span className="text-sm font-medium opacity-90">
                  {getWeekNumber(summary.startDate, summary.endDate)}
                </span>
              </div>
              <button
                onClick={() => setSelectedCalculation(
                  selectedCalculation === summary.calculationId ? null : summary.calculationId
                )}
                className="p-1 hover:bg-white/20 rounded-full transition-colors"
              >
                <ChevronRightIcon 
                  className={`w-5 h-5 transition-transform ${
                    selectedCalculation === summary.calculationId ? 'rotate-90' : ''
                  }`} 
                />
              </button>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm opacity-90">
                {formatDateRange(summary.startDate, summary.endDate)}
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold">
                  {formatAmount(summary.totalAmount)}
                </span>
                <span className="text-sm opacity-90">원</span>
              </div>
              <p className="text-xs opacity-75">
                {summary.reservationCount}건의 업무 완료
              </p>
            </div>
          </div>

          {/* 상세 내역 (펼쳐지는 부분) */}
          {selectedCalculation === summary.calculationId && (
            <div className="bg-gray-50 border-t border-gray-100">
              <div className="p-4">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <DocumentTextIcon className="w-4 h-4" />
                  업무 상세 내역
                </h4>
                
                <div className="space-y-3">
                  {getDetailsByCalculationId(summary.calculationId).map((detail, index) => (
                    <div key={index} className="bg-white rounded-lg p-4 border border-gray-100">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 mb-1">
                            {detail.categoryName}
                          </p>
                          <p className="text-sm text-gray-600">
                            {new Date(detail.reservationDate).toLocaleDateString('ko-KR', {
                              month: 'long',
                              day: 'numeric',
                              weekday: 'short'
                            })}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            {formatAmount(detail.reservationAmount)}원
                          </p>
                          <p className="text-xs text-gray-500">
                            예약 번호 : #{detail.reservationId}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 합계 */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-900">총 지급액</span>
                    <span className="text-lg font-bold text-primary">
                      {formatAmount(summary.totalAmount)}원
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}; 