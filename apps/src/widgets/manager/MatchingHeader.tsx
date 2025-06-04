'use client';

import { ChevronLeftIcon as ChevronLeftIconOutline } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { MAX_MANAGER_COUNT } from '@/widgets/manager/model/manager';

interface MatchingHeaderProps {
  selectedCount: number;
}

export function MatchingHeader({ selectedCount }: MatchingHeaderProps) {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-slate-200">
      <div className="max-w-[420px] mx-auto flex justify-between items-center gap-4 px-5 py-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-1 -m-1 text-slate-500 hover:text-slate-700"
          >
            <ChevronLeftIconOutline className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-800">매니저 선택</h1>
            <p className="text-sm text-slate-500 mt-0.5">최대 {MAX_MANAGER_COUNT}명까지 선택 가능합니다</p>
          </div>
        </div>
        <div className="px-2.5 py-1.5 bg-primary/10 rounded-xl">
          <span className="text-xs font-semibold text-primary">{selectedCount}/{MAX_MANAGER_COUNT}</span>
        </div>
      </div>
    </header>
  );
} 