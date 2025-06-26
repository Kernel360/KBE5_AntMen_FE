'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useAuthStore } from '@/shared/stores/authStore'
import { useSecureAuth } from '@/shared/hooks/useSecureAuth'
import { ManagerPendingScreen } from './ManagerPendingScreen'
import { ManagerRejectedScreen } from './ManagerRejectedScreen'
import { ManagerApprovedScreen } from './ManagerApprovedScreen'
import { UnauthorizedAccessScreen } from './UnauthorizedAccessScreen'
import { ManagerStatus } from '@/entities/manager/types'
import { mapManagerStatusToDisplay } from '@/entities/manager/lib/statusMapper'
import { getManagerRejectionReason } from '@/shared/api/manager'
import { validateAuthConsistency, handleAuthTampering } from '@/shared/lib/auth-validator'

interface ManagerStatusGuardProps {
  children: React.ReactNode
}

export const ManagerStatusGuard = ({ children }: ManagerStatusGuardProps) => {
  // 🔄 Hydration 오류 방지: 클라이언트에서만 실행
  const [isMounted, setIsMounted] = useState(false)
  
  // 현재 경로 확인
  const pathname = usePathname()
  
  useEffect(() => {
    setIsMounted(true)
  }, [])
  
  // 🛡️ 보안 강화: JWT 기반 인증 (조작 불가능)
  const { user: secureUser, isManager, isLoading: authLoading } = useSecureAuth()
  // 🔄 기존 호환성: localStorage 기반 (점진적 마이그레이션)
  const { user, updateRejectionReason } = useAuthStore()
  
  // 매니저 상태는 로그인 시 받은 상태만 사용 (추가 API 호출 불필요)
  const [hasSeenApprovalNotification, setHasSeenApprovalNotification] = useState(false)



  // 🛡️ 보안 검증: JWT vs localStorage 일관성 확인
  useEffect(() => {
    if (typeof window !== 'undefined' && secureUser && user) {
      // JWT와 localStorage 정보 비교
      if (secureUser.userId !== user.userId || secureUser.userRole !== user.userRole) {
        console.error('🚨 인증 정보 조작 감지!', {
          jwt: { userId: secureUser.userId, userRole: secureUser.userRole },
          localStorage: { userId: user.userId, userRole: user.userRole }
        })
        handleAuthTampering()
        return
      }

      // 추가 JWT 검증
      const validation = validateAuthConsistency()
      if (!validation.isValid && validation.error?.includes('일치하지 않습니다')) {
        handleAuthTampering()
        return
      }
    }
  }, [secureUser, user])
  
  const [isLoading, setIsLoading] = useState(true)
  const [showApprovalNotification, setShowApprovalNotification] = useState(false)
  
  // 현재 매니저 상태 (로그인 시 받은 상태 사용)
  const currentManagerStatus = user?.managerStatus

  // 거절 사유 조회 (거절 상태인 경우에만)
  useEffect(() => {
    const loadRejectionReason = async () => {
      if (!user?.userId || user.userRole !== 'MANAGER') {
        setIsLoading(false)
        return
      }

      // 거절 상태인 경우에만 거절 사유 조회
      if (user.managerStatus === 'REJECTED') {
        try {
          console.log('🔍 거절 사유 조회 시작...')
          const rejectionReason = await getManagerRejectionReason(user.userId)
          if (rejectionReason) {
            updateRejectionReason(rejectionReason)
          }
        } catch (error) {
          console.error('거절 사유 조회 실패:', error)
        }
      }

      setIsLoading(false)
    }

    loadRejectionReason()
  }, [user?.userId, user?.userRole, user?.managerStatus, updateRejectionReason])

  // 승인 완료 알림 표시 여부 확인
  useEffect(() => {
    if (!isLoading && currentManagerStatus === 'APPROVED') {
      // 직접 상태 체크하여 알림 표시 여부 결정 (승인 완료이고 아직 알림을 보지 않았다면)
      if (!hasSeenApprovalNotification) {
        setShowApprovalNotification(true)
      }
    }
  }, [isLoading, currentManagerStatus, hasSeenApprovalNotification])

  // 승인 완료 알림 확인 처리 (localStorage 저장 제거)
  const handleApprovalNotificationContinue = () => {
    setHasSeenApprovalNotification(true)
    setShowApprovalNotification(false)
  }

  // 🔄 서버사이드 렌더링 중에는 로딩 표시
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9CDAFB] mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    )
  }

  // 🛡️ 1차 보안 체크: JWT 기반 권한 확인 (최우선)
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9CDAFB] mx-auto mb-4"></div>
          <p className="text-gray-600">인증 확인 중...</p>
        </div>
      </div>
    )
  }

  // JWT에서 추출한 정보로 권한 체크 - 조작 불가능!
  if (!secureUser || !isManager) {
    console.warn('🚨 JWT 기반 매니저 권한 체크 실패')
    return <UnauthorizedAccessScreen />
  }

  // 🔄 2차 체크: localStorage 호환성 (점진적 마이그레이션)
  if (!user || user.userRole !== 'MANAGER') {
    console.warn('🚨 localStorage 기반 매니저 권한 체크 실패')
    return <UnauthorizedAccessScreen />
  }

  // 로딩 중
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">상태 확인 중...</p>
        </div>
      </div>
    )
  }

  // 승인 완료 알림 표시 (1회만)
  if (showApprovalNotification) {
    return (
      <ManagerApprovedScreen
        managerName="매니저"
        onContinue={handleApprovalNotificationContinue}
      />
    )
  }

  // 🚨 재신청 관련 페이지는 REJECTED 상태여도 접근 허용
  const isReapplyRelatedPage = pathname?.includes('/reapply')
  
  console.log('🔍 ManagerStatusGuard 체크:', {
    pathname,
    isReapplyRelatedPage,
    currentManagerStatus,
    userId: user?.userId
  })
  
  // 재신청 관련 페이지인 경우 상태 체크 우회 (재신청 폼 + 재신청 완료 페이지)
  if (isReapplyRelatedPage) {
    console.log('✅ 재신청 관련 페이지 접근 허용:', pathname)
    return <>{children}</>
  }
  
  // 🔄 백엔드 상태를 화면 표시용 상태로 변환
  const displayStatus = currentManagerStatus ? mapManagerStatusToDisplay(currentManagerStatus) : 'PENDING'
  
  // 매니저 상태별 화면 표시 (백엔드 상태 직접 사용)
  switch (currentManagerStatus) {
    case 'WAITING':
      return <ManagerPendingScreen status="WAITING" />
    
    case 'REAPPLY':
      return <ManagerPendingScreen status="REAPPLY" />
    
    case 'REJECTED':
      return <ManagerRejectedScreen />
    
    case 'APPROVED':
      // 승인 완료되었고 알림도 본 상태 - 정상 서비스 이용
      return <>{children}</>
    
    default:
      // 매니저인데 상태가 없는 경우 - 승인 대기로 처리
      return <ManagerPendingScreen status="WAITING" />
  }
}

 