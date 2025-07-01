'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  console.error('🚨 게시글 상세 페이지 에러:', error);

  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        게시글을 불러오는 중 오류가 발생했습니다
      </h2>
      <p className="text-gray-600 mb-4">
        잠시 후 다시 시도해주세요. 문제가 계속되면 관리자에게 문의해주세요.
      </p>
      
      {/* 개발 환경에서만 에러 정보 표시 */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 max-w-2xl">
          <h3 className="text-red-800 font-semibold mb-2">개발 에러 정보:</h3>
          <p className="text-red-700 text-sm mb-2">
            <strong>메시지:</strong> {error.message}
          </p>
          {error.digest && (
            <p className="text-red-700 text-sm">
              <strong>Digest:</strong> {error.digest}
            </p>
          )}
        </div>
      )}
      
      <div className="flex space-x-4">
        <button
          onClick={() => reset()}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
        >
          다시 시도
        </button>
        <button
          onClick={() => window.history.back()}
          className="px-4 py-2 text-gray-600 hover:text-gray-900"
        >
          이전 페이지
        </button>
      </div>
    </div>
  );
} 