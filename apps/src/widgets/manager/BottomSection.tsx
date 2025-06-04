'use client';

import { useRouter } from 'next/navigation';
import { MAX_MANAGER_COUNT } from '@/constants/manager';
import { MANAGER_NAMES } from '@/constants/manager';

interface BottomSectionProps {
  selectedManagers: string[];
}

export function BottomSection({ selectedManagers }: BottomSectionProps) {
  const router = useRouter();

  const getSelectedManagerNames = () => {
    if (selectedManagers.length === 0) return '';
    const names = selectedManagers.map(id => MANAGER_NAMES[id as keyof typeof MANAGER_NAMES]);
    return `${names.join(', ')} 매니저가 선택되었습니다`;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white w-full max-w-[420px] mx-auto">
      <div className="px-5">
        {selectedManagers.length > 0 && (
          <div className="flex items-center gap-2 py-4">
            <div className="w-5 h-5 flex items-center justify-center rounded-full bg-primary/10">
              <span className="text-primary text-sm">i</span>
            </div>
            <p className="text-sm text-slate-600">{getSelectedManagerNames()}</p>
          </div>
        )}
        <div className="border-t border-slate-200">
          <div className="py-4">
            <button
              onClick={() => {
                console.log('Selected managers:', selectedManagers);
              }}
              disabled={selectedManagers.length === 0}
              className="w-full h-14 rounded-2xl font-semibold text-white text-lg bg-primary disabled:bg-slate-200 disabled:text-slate-400 transition-colors"
            >
              다음
              {selectedManagers.length > 0 && (
                <span className="ml-1">›</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 