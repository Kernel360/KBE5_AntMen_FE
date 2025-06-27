'use client'

import { Button } from '@/shared/components/Button'
import { useRouter } from 'next/navigation'

export const UnauthorizedAccessScreen = () => {
  const router = useRouter()

  const handleGoToHome = () => {
    router.push('/')
  }

  const handleGoToLogin = () => {
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md text-center">
        {/* 경고 아이콘 */}
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg 
            className="w-10 h-10 text-red-600" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" 
            />
          </svg>
        </div>

        {/* 제목 */}
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          접근 권한이 없습니다
        </h1>

        {/* 내용 */}
        <div className="text-gray-600 mb-8 space-y-3">
          <p>
            매니저 전용 페이지입니다.
          </p>
          <p>
            매니저로 로그인하거나 
            <br />
            홈페이지를 이용해주세요.
          </p>
        </div>

        {/* 안내사항 */}
        <div className="bg-blue-50 rounded-lg p-4 mb-6 text-left">
          <h3 className="font-semibold text-blue-900 mb-2">💡 안내</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• 매니저 가입은 별도 심사가 필요합니다</li>
            <li>• 고객으로 서비스를 먼저 이용해보세요</li>
            <li>• 매니저 가입 문의: 고객센터</li>
          </ul>
        </div>

        {/* 버튼 */}
        <div className="space-y-3">
          <Button
            onClick={handleGoToHome}
            className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            홈페이지로 이동
          </Button>
          
          <Button
            onClick={handleGoToLogin}
            variant="outline"
            className="w-full border-gray-300 text-gray-700 py-3 rounded-lg font-medium"
          >
            로그인
          </Button>
        </div>
      </div>

      {/* 고객센터 정보 */}
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>매니저 가입 문의</p>
        <p className="font-semibold">고객센터: 1588-0000</p>
      </div>
    </div>
  )
} 