import { CalculationListSkeleton } from '@/entities/calculation/ui/CalculationListSkeleton';
import React from 'react';
import { CommonHeader } from '@/shared/ui/Header/CommonHeader';

const Loading = () => {
  return (
    <main className="min-h-screen bg-gray-50">
      <CommonHeader 
        title="급여 정산"
        showCloseButton
      />
      
      <div className="pt-16">
        {/* 탭 스켈레톤 */}
        <div className="sticky top-[64px] z-10 bg-white border-b border-gray-200">
          <div className="grid grid-cols-2">
            <div className="py-3.5 px-4">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-16 mx-auto"></div>
            </div>
            <div className="py-3.5 px-4">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-16 mx-auto"></div>
            </div>
          </div>
        </div>

        {/* 콘텐츠 스켈레톤 */}
        <div className="p-4 space-y-6">
          {/* 헤더 스켈레톤 */}
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded animate-pulse w-32 mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-48 mx-auto"></div>
          </div>

          {/* 폼 스켈레톤 */}
          <div className="space-y-4">
            <div className="h-6 bg-gray-200 rounded animate-pulse w-40"></div>
            <div className="space-y-3">
              <div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-16 mb-2"></div>
                <div className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
              <div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-16 mb-2"></div>
                <div className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* 버튼 스켈레톤 */}
          <div className="h-14 bg-gray-200 rounded-lg animate-pulse"></div>

          {/* 안내 문구 스켈레톤 */}
          <div className="bg-gray-100 rounded-lg p-4 space-y-2">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-32"></div>
            <div className="space-y-1">
              <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Loading; 