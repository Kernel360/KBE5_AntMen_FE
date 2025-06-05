'use client';

import { CommonHeader } from '@/shared/ui/CommonHeader';
import { MAX_MANAGER_COUNT } from '@/widgets/manager/model/manager';

interface MatchingHeaderProps {
  selectedCount: number;
}

export function MatchingHeader({ selectedCount }: MatchingHeaderProps) {
  const rightContent = (
    <div className="px-2.5 py-1.5 bg-primary/10 rounded-xl">
      <span className="text-xs font-semibold text-primary">
        {selectedCount}/{MAX_MANAGER_COUNT}
      </span>
    </div>
  );

  return (
    <header className="sticky top-0 z-10 bg-white">
      <CommonHeader
        title="매니저 선택"
        showBackButton
        rightContent={rightContent}
        subtitle={`최대 ${MAX_MANAGER_COUNT}명까지 선택 가능합니다`}
      />
    </header>
  );
} 