'use client'

import React, { useState, useEffect } from 'react';
import { CommonHeader } from '@/shared/ui/Header/CommonHeader';
import { CalculationRequestTab } from '@/entities/calculation/ui/CalculationRequestTab';
import { CalculationHistoryTab } from '@/entities/calculation/ui/CalculationHistoryTab';
import { getCalculationHistory } from '@/entities/calculation/api/getCalculationHistory';
import { CalculationHistoryItem } from '@/entities/calculation/model/types';

interface SalaryPageClientProps {
  initialHistory: CalculationHistoryItem[]
  token: string
}

type TabType = 'request' | 'history'

export const SalaryPageClient = ({ initialHistory, token }: SalaryPageClientProps) => {
  const [activeTab, setActiveTab] = useState<TabType>('request');
  const [history, setHistory] = useState<CalculationHistoryItem[]>(initialHistory);
  const [isLoading, setIsLoading] = useState(false);

  const tabs = [
    { id: 'request' as TabType, label: '정산 요청' },
    { id: 'history' as TabType, label: '정산 이력' },
  ];

  const refreshHistory = async () => {
    if (!token) return;
    
    setIsLoading(true);
    try {
      const newHistory = await getCalculationHistory(token);
      setHistory(newHistory);
    } catch (error) {
      console.error('Failed to refresh history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestSuccess = async () => {
    // 정산 요청 성공 후 이력 탭으로 이동하고 데이터 새로고침
    setActiveTab('history');
    await refreshHistory();
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <CommonHeader 
        title="급여 정산"
        showCloseButton
      />
      
      {/* 헤더 아래 적절한 여백 확보 */}
      <div className="pt-16">
        {/* 탭 - 예약 페이지와 동일한 스타일 */}
        <div className="sticky top-[64px] z-10 bg-white border-b border-gray-200">
          <div className="grid grid-cols-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={async () => {
                  setActiveTab(tab.id);
                  // 정산 이력 탭 클릭 시 최신 데이터 가져오기
                  if (tab.id === 'history') {
                    await refreshHistory();
                  }
                }}
                className={`relative py-3.5 text-sm font-medium transition-colors ${
                  activeTab === tab.id ? 'bg-primary/10' : ''
                }`}
              >
                <span className={activeTab === tab.id ? 'text-primary' : 'text-gray-600'}>
                  {tab.label}
                </span>
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* 탭 콘텐츠 */}
        <div className="pb-20">
          {activeTab === 'request' && (
            <CalculationRequestTab 
              token={token}
              onRequestSuccess={handleRequestSuccess}
            />
          )}
          
          {activeTab === 'history' && (
            <CalculationHistoryTab 
              history={history}
            />
          )}
        </div>
      </div>
    </main>
  );
}; 