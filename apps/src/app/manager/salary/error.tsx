'use client';

import { CommonHeader } from '@/shared/ui/Header/CommonHeader';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <main className="min-h-screen bg-gray-50">
      <CommonHeader 
        title="급여 정산"
        showCloseButton
      />
      
      <div className="pt-16">
        {/* 탭 영역 (비활성화) */}
        <div className="sticky top-[64px] z-10 bg-white border-b border-gray-200">
          <div className="grid grid-cols-2">
            <div className="py-3.5 text-center">
              <span className="text-gray-400 text-sm font-medium">정산 요청</span>
            </div>
            <div className="py-3.5 text-center">
              <span className="text-gray-400 text-sm font-medium">정산 이력</span>
            </div>
          </div>
        </div>

        {/* 에러 내용 */}
        <div className="p-4">
          <div className="flex flex-col items-center justify-center py-16 space-y-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <ExclamationTriangleIcon className="w-8 h-8 text-red-500" />
            </div>
            
            <div className="text-center space-y-2">
              <h2 className="text-xl font-semibold text-gray-900">
                오류가 발생했습니다
              </h2>
              <p className="text-sm text-gray-600 max-w-sm">
                {error.message || '페이지를 불러오는 중 문제가 발생했습니다.'}
              </p>
            </div>

            <div className="flex flex-col gap-2 w-full max-w-xs">
              <button
                onClick={reset}
                className="w-full bg-primary text-white py-3 px-6 rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                다시 시도
              </button>
              
              <button
                onClick={() => window.location.href = '/manager'}
                className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                메인으로 돌아가기
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 