import React from 'react';

export const CalculationListSkeleton = () => {
  return (
    <section aria-label="정산 이력 로딩 중" aria-busy="true" className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="w-full rounded-xl border border-gray-100 bg-gray-50 px-5 py-4 shadow-sm animate-pulse"
        >
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="h-4 w-16 bg-gray-200 rounded" />
              <div className="ml-auto h-3 w-20 bg-gray-200 rounded" />
            </div>
            <div className="flex items-center gap-4 mt-1">
              <div className="h-5 w-24 bg-gray-200 rounded" />
              <div className="h-4 w-32 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}; 