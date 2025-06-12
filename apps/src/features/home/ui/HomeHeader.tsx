'use client'

import { BellIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { BubbleBackground } from './BubbleBackground'
import LoginRequiredModal from '@/shared/ui/modal/LoginRequiredModal'
import Cookies from 'js-cookie'
import { checkCustomerAuth, checkManagerAuth, checkUserAuth } from '@/features/auth/lib/auth'

interface HomeHeaderProps {
  title?: string
  subtitle?: string
  buttonText?: string
  onButtonClick?: () => void
  buttonIcon?: React.ReactNode
  requireAuth?: 'CUSTOMER' | 'MANAGER'
}

export function HomeHeader({
  title = '제목입니다.',
  subtitle = '소제목입니다.',
  buttonText = '버튼입니다.',
  onButtonClick,
  buttonIcon,
  requireAuth
}: HomeHeaderProps) {
  const router = useRouter()
  const [loginModalOpen, setLoginModalOpen] = useState(false)

  const handleNotificationClick = () => {
    const authResult = checkUserAuth();
    
    if (!authResult.isAuthenticated) {
      alert(authResult.message);
      router.push('/login');
      return;
    }
    router.push('/notifications');
    return;
  }

  const handleRequireLogin = () => {
    const authResult = checkUserAuth();
    if (!authResult.isAuthenticated) {
      setLoginModalOpen(true);
      return;
    }
    if (onButtonClick) {
      onButtonClick();
    }

  }

  return (
    <section className="relative bg-primary p-4 pb-6 overflow-hidden">
      <BubbleBackground />
      <div className="relative z-10">
        <div className="flex justify-end mb-6">
          <button
            className="relative"
            onClick={handleNotificationClick}
            aria-label="알림 보기"
          >
            <BellIcon className="w-6 h-6 text-white" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[10px] text-white font-bold">
              1
            </span>
          </button>
        </div>
        {(title || subtitle) && (
          <div className="mb-6">
            {title && (
              <h1 className="text-2xl font-bold mb-1 text-gray-900">
                앤트워커로 매주
                <br />
                10시간을 절약해요
              </h1>
            )}
            {subtitle && <p className="text-base text-gray-900">{subtitle}</p>}
          </div>
        )}
        {buttonText && (
          <div className="flex gap-2 h-[190px] mb-6">
            <div className="w-1/2 flex flex-col h-full gap-2">
              <button className="w-full h-full bg-white rounded-xl relative flex items-center justify-center">
                <span className="font-semibold">에어컨 청소</span>
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[10px] z-10 text-white font-bold">
                  N
                </span>
              </button>
              <button className="w-full h-full bg-white rounded-xl flex items-center relative justify-center">
                <span className="font-semibold">가사 청소</span>
              </button>
            </div>
            <button
              onClick={handleRequireLogin}
              className="w-1/2 h-full bg-white rounded-xl flex items-center justify-center gap-2 mb-6"
            >
              {buttonIcon}
              <span className="font-semibold">{buttonText}</span>
            </button>
          </div>
        )}
      </div>
      <LoginRequiredModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
      />
    </section>
  )
}
