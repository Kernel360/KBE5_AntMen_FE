'use client';

import { useEffect } from 'react';

interface ErrorComponentProps {
  error: Error & { digest?: string };
  reset: () => void;
  title?: string;
  description?: string;
}

export const ErrorComponent = ({ 
  error, 
  reset,
  title = "문제가 발생했습니다",
  description = "잠시 후 다시 시도해주세요."
}: ErrorComponentProps) => {
  useEffect(() => {
    // 에러 로깅
    console.error('에러 발생:', error);
  }, [error]);

  return (
    <main className="min-h-screen bg-white">
      {/* 헤더 */}
      <header className="flex items-center justify-between p-5">
        <button onClick={() => window.history.back()} className="flex h-6 w-6 items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div className="h-6 w-6" />
      </header>

      {/* 에러 내용 */}
      <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
        <div className="mb-6">
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none" className="text-gray-400">
            <circle cx="32" cy="32" r="30" stroke="currentColor" strokeWidth="2"/>
            <path d="M32 16v16M32 40h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          {title}
        </h2>
        
        <p className="text-gray-600 mb-8 max-w-sm leading-relaxed">
          {description}
          {process.env.NODE_ENV === 'development' && (
            <span className="block mt-2 text-xs text-red-500">
              {error.message}
            </span>
          )}
        </p>

        <div className="flex gap-3 w-full max-w-xs">
          <button
            onClick={() => window.history.back()}
            className="flex-1 h-12 border border-gray-300 rounded-2xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            뒤로가기
          </button>
          <button
            onClick={reset}
            className="flex-1 h-12 bg-[#0fbcd6] rounded-2xl text-sm font-bold text-white hover:bg-[#0ca8c0] transition-colors"
          >
            다시 시도
          </button>
        </div>
        
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-4 text-left w-full max-w-xs">
            <summary className="cursor-pointer text-sm text-gray-500">
              에러 상세 정보
            </summary>
            <pre className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded border overflow-auto">
              {error.message}
              {error.stack}
            </pre>
          </details>
        )}
      </div>
    </main>
  );
}; 