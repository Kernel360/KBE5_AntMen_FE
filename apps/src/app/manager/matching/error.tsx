'use client';

import { useEffect } from 'react';

interface ManagerMatchingErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

const ManagerMatchingError = ({ error, reset }: ManagerMatchingErrorProps) => {
  useEffect(() => {
    // 에러 로깅
    console.error('매칭 페이지 에러:', error);
  }, [error]);

  return (
    <main className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="mb-4">
          <h1 className="text-xl font-bold text-gray-900 mb-2">
            문제가 발생했습니다
          </h1>
          <p className="text-gray-600">
            매칭 요청을 불러오는 중 오류가 발생했습니다.
          </p>
        </div>
        
        <div className="space-y-3">
          <button
            onClick={reset}
            className="w-full px-4 py-2 bg-[#0fbcd6] text-white rounded-lg font-medium hover:bg-[#0ca8c0] transition-colors"
          >
            다시 시도
          </button>
          
          <button
            onClick={() => window.history.back()}
            className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            이전 페이지로
          </button>
        </div>
        
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-4 text-left">
            <summary className="cursor-pointer text-sm text-gray-500">
              에러 상세 정보
            </summary>
            <pre className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded border overflow-auto">
              {error.message}
            </pre>
          </details>
        )}
      </div>
    </main>
  );
};

export default ManagerMatchingError; 