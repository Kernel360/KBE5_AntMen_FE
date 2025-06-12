'use client';

import { ErrorComponent } from '@/shared/components/ErrorComponent';

export default function ManagerMatchingError({
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
      title="매칭 요청을 불러올 수 없습니다"
      description="매칭 요청을 불러오는 중 오류가 발생했습니다."
    />
  );
} 