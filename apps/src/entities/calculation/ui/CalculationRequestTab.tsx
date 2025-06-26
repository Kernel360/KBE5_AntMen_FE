'use client'

import React, { useState } from 'react';
import { CalendarIcon, CurrencyDollarIcon, ExclamationTriangleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { requestCalculation } from '@/entities/calculation/api/requestCalculation';
import { getCalculationSummary, CalculationSummaryResponse } from '@/entities/calculation/api/getCalculationSummary';
import { CalculationRequestParams } from '@/entities/calculation/model/types';

interface CalculationRequestTabProps {
  token: string;
  onRequestSuccess: () => void;
}

export const CalculationRequestTab = ({ token, onRequestSuccess }: CalculationRequestTabProps) => {
  const [selectedWeek, setSelectedWeek] = useState<{
    startDate: string | null;
    endDate: string | null;
  }>({
    startDate: null,
    endDate: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [summaryData, setSummaryData] = useState<CalculationSummaryResponse | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);

  // 이번 주의 시작일과 종료일 계산
  const getThisWeek = () => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0: 일요일, 1: 월요일, ...
    const monday = new Date(today);
    monday.setDate(today.getDate() - dayOfWeek + 1); // 월요일로 설정
    
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6); // 일요일로 설정
    
    return {
      start: monday.toISOString().split('T')[0],
      end: sunday.toISOString().split('T')[0]
    };
  };

  // 지난 주들 생성 (최근 4주)
  const getAvailableWeeks = () => {
    const thisWeek = getThisWeek();
    const weeks = [];
    
    for (let i = 1; i <= 4; i++) {
      const startDate = new Date(thisWeek.start);
      startDate.setDate(startDate.getDate() - (7 * i));
      
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
      
      weeks.push({
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        label: `${startDate.getMonth() + 1}월 ${Math.ceil(startDate.getDate() / 7)}주차 (${startDate.getDate()}일~${endDate.getDate()}일)`
      });
    }
    
    return weeks;
  };

  const availableWeeks = getAvailableWeeks();

  const handleWeekSelect = async (startDate: string, endDate: string) => {
    setSelectedWeek({ startDate, endDate });
    setError(null);
    
    // /my/summary API 호출하여 해당 주차의 정산 가능한 내역 미리보기
    setLoadingSummary(true);
    try {
      const summary = await getCalculationSummary(token, { startDate, EndDate: endDate });
      setSummaryData(summary);
      setShowModal(true);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('해당 주차의 정산 내역을 불러오는데 실패했습니다.');
      }
    } finally {
      setLoadingSummary(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedWeek.startDate || !selectedWeek.endDate) {
      setError('정산할 주를 선택해주세요.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const params: CalculationRequestParams = {
        startDate: selectedWeek.startDate,
        endDate: selectedWeek.endDate,
      };

      await requestCalculation(token, params);
      onRequestSuccess();
      setSelectedWeek({ startDate: null, endDate: null });
      setShowModal(false);
      setSummaryData(null);
    } catch (err) {
      if (err instanceof Error) {
        if (err.message.includes('정산 가능한 예약이 없습니다')) {
          setError('해당 주에 정산 가능한 업무가 없습니다.');
        } else if (err.message.includes('이번 주는 정산할 수 없습니다')) {
          setError('이번 주는 정산할 수 없습니다. 다른 주를 선택해주세요.');
        } else {
          setError(err.message);
        }
      } else {
        setError('정산 요청에 실패했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  };

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

  return (
    <div className="p-4 space-y-6">
      {/* 헤더 */}
      <div className="text-center space-y-2">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-gradient-to-r from-primary to-primary/90 rounded-full flex items-center justify-center">
            <CurrencyDollarIcon className="w-8 h-8 text-white" />
          </div>
        </div>
        <h2 className="text-xl font-bold text-gray-900">주급 정산 요청</h2>
        <p className="text-sm text-gray-600">
          완료된 업무에 대한 주급을 정산받으세요
        </p>
      </div>

      {/* 이번 주 정산 불가 안내 */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-yellow-800">이번 주는 정산할 수 없습니다</p>
            <p className="text-xs text-yellow-700 mt-1">
              정산은 완료된 주에 대해서만 가능합니다
            </p>
          </div>
        </div>
      </div>

      {/* 주 선택 */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-primary" />
          정산할 주 선택
        </h3>
        
        <div className="space-y-3">
          {availableWeeks.map((week, index) => (
            <button
              key={index}
              onClick={() => handleWeekSelect(week.startDate, week.endDate)}
              disabled={loadingSummary}
              className={`w-full p-4 rounded-lg border-2 text-left transition-all disabled:opacity-50 ${
                selectedWeek.startDate === week.startDate
                  ? 'border-primary bg-primary/10'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{week.label}</p>
                  <p className="text-sm text-gray-600">
                    {week.startDate} ~ {week.endDate}
                  </p>
                </div>
                {selectedWeek.startDate === week.startDate && (
                  <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* 안내 문구 */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">정산 안내</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• 정산은 주 단위로 진행됩니다</li>
          <li>• 완료된 업무에 대해서만 정산이 가능합니다</li>
          <li>• 이미 정산된 업무는 중복 정산되지 않습니다</li>
          <li>• 정산 처리는 영업일 기준 1-2일 소요됩니다</li>
        </ul>
      </div>

      {/* 정산 상세 모달 */}
      {showModal && summaryData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 max-h-[80vh] overflow-hidden flex flex-col">
            {/* 모달 헤더 */}
            <div className="bg-gradient-to-r from-primary to-primary/90 p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">정산 상세 내역</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-1 hover:bg-white/20 rounded-full transition-colors"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
              
              {selectedWeek.startDate && selectedWeek.endDate && (
                <div className="space-y-2">
                  <p className="text-sm opacity-90">
                    {formatDateRange(selectedWeek.startDate, selectedWeek.endDate)}
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold">
                      {formatAmount(summaryData.totalAmount)}
                    </span>
                    <span className="text-sm opacity-90">원</span>
                  </div>
                  <p className="text-xs opacity-75">
                    {summaryData.list.length}건의 업무
                  </p>
                </div>
              )}
            </div>

            {/* 모달 내용 */}
            <div className="flex-1 overflow-y-auto p-4">
              {summaryData.list.length > 0 ? (
                <div className="space-y-3">
                  {summaryData.list.map((item, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 mb-1">
                            {item.categoryName}
                          </p>
                          <p className="text-sm text-gray-600">
                            {new Date(item.reservationDate).toLocaleDateString('ko-KR', {
                              month: 'long',
                              day: 'numeric',
                              weekday: 'short'
                            })}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            {formatAmount(item.reservationAmount)}원
                          </p>
                          <p className="text-xs text-gray-500">
                            예약 #{item.reservationId}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">해당 주차에 정산 가능한 업무가 없습니다.</p>
                </div>
              )}
            </div>

            {/* 모달 푸터 */}
            {summaryData.list.length > 0 && (
              <div className="border-t border-gray-200 p-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-semibold text-gray-900">총 지급액</span>
                  <span className="text-lg font-bold text-primary">
                    {formatAmount(summaryData.totalAmount)}원
                  </span>
                </div>
                
                                  <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-primary to-primary/90 text-white py-3 px-6 rounded-lg font-medium disabled:bg-gray-300 disabled:cursor-not-allowed hover:from-primary/90 hover:to-primary transition-all"
                  >
                  {isLoading ? '요청 중...' : '정산 요청하기'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}; 