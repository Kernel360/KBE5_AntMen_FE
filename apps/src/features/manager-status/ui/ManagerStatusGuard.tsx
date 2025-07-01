'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'
import { usePathname } from 'next/navigation'
import { useAuthStore } from '@/shared/stores/authStore'
import { useSecureAuth } from '@/shared/hooks/useSecureAuth'
import { ManagerPendingScreen } from './ManagerPendingScreen'
import { ManagerRejectedScreen } from './ManagerRejectedScreen'
import { ManagerApprovedScreen } from './ManagerApprovedScreen'
import { UnauthorizedAccessScreen } from './UnauthorizedAccessScreen'
import { mapManagerStatusToDisplay } from '@/entities/manager/lib/statusMapper'
import { getManagerRejectionReason } from '@/shared/api/manager'
import { validateAuthConsistency, handleAuthTampering } from '@/shared/lib/auth-validator'

interface ManagerStatusGuardProps {
  children: React.ReactNode
}

export const ManagerStatusGuard = ({ children }: ManagerStatusGuardProps) => {
  // 🔄 Hydration 오류 방지: 클라이언트에서만 실행
  const [isMounted, setIsMounted] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // zustand selector로 필요한 값만 구독
  const userId = useAuthStore(state => state.user?.userId)
  const userRole = useAuthStore(state => state.user?.userRole)
  const managerStatus = useAuthStore(state => state.user?.managerStatus)
  const updateRejectionReason = useAuthStore(state => state.updateRejectionReason)

  // 🛡️ 보안 강화: JWT 기반 인증 (조작 불가능)
  const { user: secureUser, isManager, isLoading: authLoading } = useSecureAuth()

  // 승인 알림 관리: 세션 + localStorage 기반
  const [hasSeenApprovalNotificationInSession, setHasSeenApprovalNotificationInSession] = useState(false)
  useEffect(() => {
    if (typeof window !== 'undefined' && userId) {
      const storageKey = `approval-notification-seen-${userId}`
      const hasSeenInStorage = localStorage.getItem(storageKey) === 'true'
      setHasSeenApprovalNotificationInSession(hasSeenInStorage)
    }
  }, [userId])

  const [isLoading, setIsLoading] = useState(true)
  const [showApprovalNotification, setShowApprovalNotification] = useState(false)

  // 🕒 승인 알림 표시 여부를 결정하는 함수 (useCallback으로 최적화)
  const shouldShowApprovalNotification = useCallback((managerStatus: string | null | undefined) => {
    if (managerStatus !== 'APPROVED') return false
    if (hasSeenApprovalNotificationInSession) return false
    return true
  }, [hasSeenApprovalNotificationInSession])

  // 🛡️ 보안 검증: JWT vs localStorage 일관성 확인
  useEffect(() => {
    if (typeof window !== 'undefined' && secureUser && userId && userRole) {
      if (secureUser.userId !== userId || secureUser.userRole !== userRole) {
        handleAuthTampering()
        return
      }
      const validation = validateAuthConsistency()
      if (!validation.isValid && validation.error?.includes('일치하지 않습니다')) {
        handleAuthTampering()
        return
      }
    }
  }, [secureUser?.userId, secureUser?.userRole, userId, userRole])

  // 거절 사유 조회 (거절 상태인 경우에만)
  useEffect(() => {
    const loadRejectionReason = async () => {
      if (!userId || userRole !== 'MANAGER') {
        setIsLoading(false)
        return
      }
      if (managerStatus === 'REJECTED') {
        try {
          const rejectionReason = await getManagerRejectionReason(userId)
          if (rejectionReason) {
            updateRejectionReason(rejectionReason)
          }
        } catch {}
      }
      setIsLoading(false)
    }
    loadRejectionReason()
  }, [userId, userRole, managerStatus, updateRejectionReason])

  // 승인 완료 알림 표시 여부 확인 (시간 기반)
  useEffect(() => {
    if (!isLoading && managerStatus === 'APPROVED') {
      const shouldShow = shouldShowApprovalNotification(managerStatus)
      setShowApprovalNotification(shouldShow)
    }
  }, [isLoading, managerStatus, shouldShowApprovalNotification])

  // 승인 완료 알림 확인 처리 (세션에서만 기록)
  const handleApprovalNotificationContinue = () => {
    if (userId) {
      const storageKey = `approval-notification-seen-${userId}`
      localStorage.setItem(storageKey, 'true')
    }
    setHasSeenApprovalNotificationInSession(true)
    setShowApprovalNotification(false)
  }

  // 렌더링 추적용 로그 (1회만)
  useEffect(() => {
    console.log('[ManagerStatusGuard] 렌더링됨');
  }, []);

  // SSR 중에는 로딩 표시
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

  if (!secureUser || !isManager) {
    return <UnauthorizedAccessScreen />
  }

  if (!userId || userRole !== 'MANAGER') {
    return <UnauthorizedAccessScreen />
  }

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
  if (isReapplyRelatedPage) {
    return <>{children}</>
  }

  // 매니저 상태별 화면 표시
  switch (managerStatus) {
    case 'WAITING':
      return <ManagerPendingScreen status="WAITING" />
    case 'REAPPLY':
      return <ManagerPendingScreen status="REAPPLY" />
    case 'REJECTED':
      return <ManagerRejectedScreen />
    case 'APPROVED':
      return <>{children}</>
    default:
      return <ManagerPendingScreen status="WAITING" />
  }
}

 