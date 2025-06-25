'use client'

import { Button } from '@/shared/components/Button'
import { useLogout } from '@/features/auth/hooks/useLogout'
import { useRouter } from 'next/navigation'

interface ManagerPendingScreenProps {
  status?: 'WAITING' | 'REAPPLY'
}

export const ManagerPendingScreen = ({ status = 'WAITING' }: ManagerPendingScreenProps) => {
  const logout = useLogout()
  const router = useRouter()

  const handleGoToHome = () => {
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md text-center mt-6">
        {/* 아이콘 */}
        <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg 
            className="w-10 h-10 text-yellow-600" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
        </div>

        {/* 제목 */}
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          승인 검토 중
        </h1>

        {/* 내용 */}
        <div className="text-gray-600 mb-8 space-y-3">
          <p>
            매니저 신청이 접수되었습니다.
          </p>
          <p>
            관리자가 서류를 검토 중이며, 
            <br />
            결과는 <span className="font-semibold text-primary">1-3일 내</span>에 
            <br />
            알려드리겠습니다.
          </p>
        </div>

        {/* 안내사항 */}
        <div className="bg-primary/10 rounded-lg p-4 mb-6 text-left">
          <h3 className="font-semibold text-gray-900 mb-2">📋 검토 사항</h3>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• 신분증 확인</li>
            <li>• 경력 증명서 검토</li>
            <li>• 자격증 확인</li>
            <li>• 기본 정보 검증</li>
          </ul>
        </div>

        {/* 버튼 */}
        <div className="space-y-3">
          <Button
            onClick={handleGoToHome}
            className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            고객 홈으로 이동
          </Button>
          
          <Button
            onClick={logout}
            variant="outline"
            className="w-full border-gray-300 text-gray-700 py-3 rounded-lg font-medium"
          >
            로그아웃
          </Button>
        </div>
      </div>

      {/* 고객센터 정보 */}
      <div className="mt-8 text-center text-sm text-gray-500 mb-8">
        <p>문의사항이 있으시면</p>
        <p className="font-semibold">고객센터: 1588-0000</p>
        <p className="text-xs mt-1">평일 09:00 - 18:00</p>
      </div>
    </div>
  )
} 