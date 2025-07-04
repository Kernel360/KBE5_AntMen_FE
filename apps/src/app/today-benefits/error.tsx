'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
      <h2 className="text-xl font-bold mb-2">문제가 발생했습니다</h2>
      <p className="mb-4 text-gray-500">페이지를 불러오는 중 오류가 발생했습니다.</p>
      <button
        type="button"
        onClick={reset}
        className="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 focus:outline-none focus:ring"
        aria-label="다시 시도"
      >
        다시 시도
      </button>
    </div>
  );
} 