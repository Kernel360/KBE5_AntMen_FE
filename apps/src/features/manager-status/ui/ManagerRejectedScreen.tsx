'use client'

import { Button } from '@/shared/components/Button'
import { useLogout } from '@/features/auth/hooks/useLogout'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/shared/stores/authStore'
import { useSecureAuth } from '@/shared/hooks/useSecureAuth'

export const ManagerRejectedScreen = () => {
  const logout = useLogout()
  const router = useRouter()
  // 🛡️ 보안 강화: JWT 기반 사용자 정보 (최우선)
  const { user: secureUser } = useSecureAuth()
  // 🔄 기존 호환성: localStorage 기반 (거절 사유용)
  const { user } = useAuthStore()
  
  // JWT 기반 사용자 정보 우선 사용
  const actualUser = secureUser || user

  const handleReapply = () => {
    // 재신청 로직 - 실제로는 회원가입 페이지로 리다이렉트하거나 재신청 프로세스 시작
    alert('재신청 기능은 준비 중입니다. 고객센터로 문의해주세요.')
  }

  const handleGoToHome = () => {
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md text-center mt-6">
        {/* 아이콘 */}
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
          승인이 거절되었습니다
        </h1>

        {/* 내용 */}
        <div className="text-gray-600 mb-8 space-y-3">
          <p>
            안타깝게도 매니저 가입 신청이 
            <br />
            승인되지 않았습니다.
          </p>
          <p>
            보완이 필요한 사항을 확인하신 후 
            <br />
            <span className="font-semibold text-primary-600">재신청</span>하실 수 있습니다.
          </p>
        </div>

        {/* 거절 사유 */}
        <div className="bg-red-50 rounded-lg p-4 mb-6 text-left">
          <h3 className="font-semibold text-red-900 mb-2">❌ 거절 사유</h3>
          {user?.rejectionReason ? (
            <div className="text-sm text-red-700 leading-relaxed whitespace-pre-wrap">
              {user.rejectionReason}
            </div>
          ) : (
            <ul className="text-sm text-red-700 space-y-1">
              <li>• 서류 불일치 또는 불완전</li>
              <li>• 경력 증명 미흡</li>
              <li>• 자격 요건 미달</li>
              <li>• 기타 검증 실패</li>
            </ul>
          )}
        </div>

        {/* 버튼 */}
        <div className="space-y-3">
          <Button
            onClick={() => router.push('/manager/reapply')}
            className="w-full bg-primary-500 text-white py-3 rounded-lg font-medium hover:bg-primary-600 transition-colors"
          >
            재신청하기
          </Button>

          <Button
            onClick={handleGoToHome}
            variant="outline"
            className="w-full border-primary-500 text-primary-500 py-3 rounded-lg font-medium hover:bg-primary-200/50 transition-colors"
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
        <p>자세한 거절 사유나 재신청 문의</p>
        <p className="font-semibold">고객센터: 1588-0000</p>
        <p className="text-xs mt-1">평일 09:00 - 18:00</p>
      </div>
    </div>
  )
} 