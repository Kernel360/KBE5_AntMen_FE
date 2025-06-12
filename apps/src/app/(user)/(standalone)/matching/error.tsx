'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter()
  
  useEffect(() => {
    // 에러 로깅
    console.error('매칭 페이지 에러:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          매니저 목록을 불러올 수 없습니다
        </h2>
        <p className="text-gray-600 mb-8">
          {error.message || '일시적인 오류가 발생했습니다. 다시 시도해 주세요.'}
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200"
          >
            이전 페이지로 이동
          </button>
          <button
            onClick={() => reset()}
            className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90"
          >
            다시 시도
          </button>
        </div>
      </div>
    </div>
  )
} 