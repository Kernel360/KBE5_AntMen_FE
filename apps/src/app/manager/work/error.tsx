'use client';

import { ErrorComponent } from '@/shared/components/ErrorComponent';

export default function ManagerWorkError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorComponent 
      error={error} 
      reset={reset}
      title="업무 내역을 불러올 수 없습니다"
      description="네트워크 연결을 확인하고 다시 시도해주세요."
    />
  );
} 