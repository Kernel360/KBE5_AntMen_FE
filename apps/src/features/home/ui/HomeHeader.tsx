'use client'

import { BellIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'
import React from 'react'

interface HomeHeaderProps {
  title?: string
  subtitle?: string
  buttonText?: string
  onButtonClick?: () => void
  buttonIcon?: React.ReactNode
}

export function HomeHeader({
  title = '제목입니다.',
  subtitle = '소제목입니다.',
  buttonText = '버튼입니다.',
  onButtonClick,
  buttonIcon,
}: HomeHeaderProps) {
  const router = useRouter()

  const handleNotificationClick = () => {
    router.push('/notifications')
  }

  return (
    <div className="bg-[#0fbcd6] p-4 pb-6">
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
            <h1 className="text-2xl font-bold mb-1 text-white">{title}</h1>
          )}
          {subtitle && <p className="text-base text-white">{subtitle}</p>}
        </div>
      )}
      {buttonText && (
        <button
          onClick={onButtonClick}
          className="w-full h-14 bg-white rounded-xl flex items-center justify-center gap-2 mb-6"
        >
          {buttonIcon}
          <span className="font-semibold">{buttonText}</span>
        </button>
      )}
    </div>
  )
}
