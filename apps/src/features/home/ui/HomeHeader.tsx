'use client'

import { BellIcon, UserCircleIcon } from '@heroicons/react/24/solid'
import { useRouter } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import LoginRequiredModal from '@/shared/ui/modal/LoginRequiredModal'
import { checkUserAuth } from '@/features/auth/lib/auth'
import { CalendarIcon } from '@heroicons/react/24/outline'
import { useAlerts } from '@/features/alerts/ui/AlertProvider'

interface HomeHeaderProps {
  title?: string
  subtitle?: string
  buttonText?: string
  onButtonClick?: () => void
  buttonIcon?: React.ReactNode
  requireAuth?: 'CUSTOMER' | 'MANAGER'
}

// 권한별 라우팅 맵
const ROLE_ROUTES = {
  CUSTOMER: '/',
  MANAGER: '/manager'
} as const

// 커스텀 훅: 실시간 인증 상태 관리
function useAuthStatus() {
  const { refreshUnreadCount } = useAlerts()
  const [authState, setAuthState] = useState(() => {
    const result = checkUserAuth()
    return {
      isAuthenticated: result.isAuthenticated,
      userRole: result.userRole
    }
  })
  const [prevAuthState, setPrevAuthState] = useState<string | null>(null)

  useEffect(() => {
    const checkAuthChange = () => {
      const authResult = checkUserAuth()
      const currentAuth = authResult.isAuthenticated ? authResult.userRole : null

      setAuthState({
        isAuthenticated: authResult.isAuthenticated,
        userRole: authResult.userRole
      })

      // 인증 상태가 변경되었을 때 알림 개수 갱신
      if (currentAuth !== prevAuthState) {
        setPrevAuthState(currentAuth)
        if (currentAuth) {
          refreshUnreadCount()
        }
      }
    }

    // 초기 인증 상태 설정
    checkAuthChange()

    // 주기적으로 인증 상태 확인 (실시간 감지)
    const intervalId = setInterval(checkAuthChange, 2000)

    return () => {
      clearInterval(intervalId)
    }
  }, [prevAuthState, refreshUnreadCount])

  return authState
}

// 커스텀 훅: 인증 관련 핸들러들
function useAuthHandlers(requireAuth: 'CUSTOMER' | 'MANAGER') {
  const router = useRouter()
  const [loginModalOpen, setLoginModalOpen] = useState(false)

  const handleAuthRequired = (callback?: () => void) => {
    const authResult = checkUserAuth()

    if (!authResult.isAuthenticated) {
      setLoginModalOpen(true)
      return
    }

    if (requireAuth !== authResult.userRole) {
      alert('해당 접근 권한이 없습니다.')
      router.push(ROLE_ROUTES[authResult.userRole as keyof typeof ROLE_ROUTES])
      return
    }

    callback?.() || router.push('/reservation')
  }

  const handleProfileClick = () => {
    const authResult = checkUserAuth()
    router.push(authResult.isAuthenticated ? '/more' : '/login')
  }

  const handleNotificationClick = () => {
    const authResult = checkUserAuth()
    
    if (!authResult.isAuthenticated) {
      setLoginModalOpen(true)
      return
    }
    
    router.push('/notifications')
  }

  return {
    loginModalOpen,
    setLoginModalOpen,
    handleAuthRequired,
    handleProfileClick,
    handleNotificationClick
  }
}

// 알림 배지 컴포넌트
function NotificationBadge({ count }: { count: number }) {
  if (count === 0) return null

  return (
    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[10px] text-white font-bold">
      {count > 99 ? '99+' : count}
    </span>
  )
}

export function HomeHeader({
  title = '앤트워크로 매주 10시간을 절약해요',
  subtitle,
  buttonText = '예약하기',
  onButtonClick,
  buttonIcon,
  requireAuth = 'CUSTOMER',
}: HomeHeaderProps) {
  const { unreadCount } = useAlerts()
  const { isAuthenticated } = useAuthStatus()
  const {
    loginModalOpen,
    setLoginModalOpen,
    handleAuthRequired,
    handleProfileClick,
    handleNotificationClick
  } = useAuthHandlers(requireAuth)

  const handleButtonClick = () => {
    handleAuthRequired(onButtonClick)
  }

  return (
    <section className="relative w-full bg-primary pb-6 overflow-hidden z-10">
      {/* <BubbleBackground /> */}
      <div className="relative z-20 pt-4 container">
        <div className="flex justify-end mb-6">
          <div className="flex gap-[10px]">
            <button
              className="relative"
              onClick={handleProfileClick}
              aria-label="프로필"
            >
              <UserCircleIcon className="w-6 h-6 text-white" />
            </button>
            <button
              className="relative"
              onClick={handleNotificationClick}
              aria-label="알림 보기"
            >
              <BellIcon className="w-6 h-6 text-white" />
              {isAuthenticated && <NotificationBadge count={unreadCount} />}
            </button>
          </div>
        </div>

        <h1 className="text-2xl font-semibold mb-2 text-gray-900">
          {title}
        </h1>
        {subtitle && (
          <p className="text-base text-gray-800 mb-4">{subtitle}</p>
        )}
        <button
          onClick={handleButtonClick}
          className="w-full h-[58px] bg-white rounded-xl flex items-center mb-4 justify-center gap-2"
        >
          {buttonIcon ?? <CalendarIcon className="w-[18px] h-[18px] text-black" />}
          <span className="font-semibold">{buttonText}</span>
        </button>
      </div>
      <LoginRequiredModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
      />
    </section>
  )
}