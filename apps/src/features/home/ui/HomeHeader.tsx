'use client'

import { BellIcon, UserCircleIcon } from '@heroicons/react/24/solid'
import { useRouter } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import LoginRequiredModal from '@/shared/ui/modal/LoginRequiredModal'
import { checkUserAuth } from '@/features/auth/lib/auth'
import Link from 'next/link'
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

export function HomeHeader({
  title = '앤트워크로 매주 10시간을 절약해요',
  subtitle,
  buttonText = '예약하기',
  onButtonClick,
  buttonIcon,
  requireAuth = 'CUSTOMER',
}: HomeHeaderProps) {
  const router = useRouter()
  const [loginModalOpen, setLoginModalOpen] = useState(false)
  const { unreadCount, refreshUnreadCount } = useAlerts()
  const [prevAuthState, setPrevAuthState] = useState<string | null>(null)

  // 인증 상태 변경 감지
  useEffect(() => {
    const checkAuthChange = () => {
      const authResult = checkUserAuth()
      const currentAuth = authResult.isAuthenticated ? authResult.userRole : null

      // 인증 상태가 변경되었을 때
      if (currentAuth !== prevAuthState) {
        setPrevAuthState(currentAuth)
        if (currentAuth) {
          refreshUnreadCount()
        }
      }
    }

    // 초기 인증 상태 설정
    checkAuthChange()

    // 주기적으로 인증 상태 확인
    const intervalId = setInterval(checkAuthChange, 2000)

    return () => {
      clearInterval(intervalId)
    }
  }, [prevAuthState, refreshUnreadCount])

  const handleNotificationClick = () => {
    const authResult = checkUserAuth()

    if (!authResult.isAuthenticated) {
      setLoginModalOpen(true)
      return
    }
    router.push('/notifications')
    return
  }

  const handleRequireLogin = () => {
    const authResult = checkUserAuth()

    // 로그인 필요
    if (!authResult.isAuthenticated) {
      setLoginModalOpen(true)
      return
    }

    // 잘못된 접근
    if (requireAuth != authResult.userRole) {
      authResult.message = '해당 접근 권한이 없습니다.'
      switch (authResult.userRole) {
        case 'CUSTOMER':
          alert(authResult.message)
          router.push('/')
          return
        case 'MANAGER':
          alert(authResult.message)
          router.push('/manager')
          return
        default:
          alert(authResult.message)
          return
      }
    }

    // 정상 접근: 무조건 /reservation으로 이동
    router.push('/reservation')
  }

  return (
    <section className="relative w-full bg-primary pb-6 overflow-hidden z-10">
      {/* <BubbleBackground /> */}
      <div className="relative z-20 pt-4 container">
        <div className="flex justify-end mb-6">
          <div className="flex gap-[10px]">
            <Link className="relative" href="/login" aria-label="로그인">
              <UserCircleIcon className="w-6 h-6 text-white" />
            </Link>
            <button
              className="relative"
              onClick={handleNotificationClick}
              aria-label="알림 보기"
            >
              <BellIcon className="w-6 h-6 text-white" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[10px] text-white font-bold">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
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
          onClick={onButtonClick ?? handleRequireLogin}
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
