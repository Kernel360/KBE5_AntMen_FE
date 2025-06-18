'use client'

import React from 'react'
import type { Notification } from '@/entities/notification'
import { useRouter } from 'next/navigation'

interface NotificationCardProps {
  notification: Notification
  onRead?: (id: string) => void
  onClick?: (notification: Notification) => void
}

export const NotificationCard = ({
  notification,
  onRead,
  onClick,
}: NotificationCardProps) => {
  const { id, title, message, type, isRead, createdAt } = notification
  const router = useRouter()

  const handleClick = () => {
    if (!isRead && onRead) {
      onRead(id)
    }
    onClick?.(notification)
    router.push(`/notifications/${id}`)
  }

  const getTypeIcon = () => {
    switch (type) {
      case 'reservation':
        return (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0fbcd6] bg-opacity-10">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              className="text-[#0fbcd6]"
            >
              <path
                d="M2.5 4.16667H17.5V17.3333H2.5V4.16667Z"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
              />
              <path
                d="M2.5 8.33333H17.5"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M6.66675 2.5V5.83333"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M13.3333 2.5V5.83333"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
          </div>
        )
      case 'review':
        return (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#4ABED9] bg-opacity-10">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              className="text-[#4ABED9]"
            >
              <path
                d="M10 15L4 18L5.5 11.5L1 7.5L8 6.5L10 0L12 6.5L19 7.5L14.5 11.5L16 18L10 15Z"
                fill="currentColor"
              />
            </svg>
          </div>
        )
      case 'promotion':
        return (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FF6B35] bg-opacity-10">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              className="text-[#FF6B35]"
            >
              <path
                d="M8.5 2.5L10 5L12.5 2.5L15 5L17.5 2.5L15 8.75L17.5 15L12.5 12.5L10 15L7.5 12.5L2.5 15L5 8.75L2.5 2.5L7.5 5L8.5 2.5Z"
                fill="currentColor"
              />
            </svg>
          </div>
        )
      case 'payment':
        return (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#10B981] bg-opacity-10">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              className="text-[#10B981]"
            >
              <path
                d="M2.5 5H17.5V15H2.5V5Z"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
              />
              <path
                d="M2.5 8.33333H17.5"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
          </div>
        )
      default:
        return (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#666666] bg-opacity-10">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              className="text-[#666666]"
            >
              <circle
                cx="10"
                cy="10"
                r="8"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
              />
              <path
                d="M10 6V10L13 13"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
          </div>
        )
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
    const diffInDays = Math.floor(diffInHours / 24)

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
      return `${diffInMinutes}분 전`
    } else if (diffInHours < 24) {
      return `${diffInHours}시간 전`
    } else if (diffInDays < 7) {
      return `${diffInDays}일 전`
    } else {
      return date.toLocaleDateString('ko-KR', {
        month: 'short',
        day: 'numeric',
      })
    }
  }

  return (
    <article
      className={`flex items-start gap-3 p-4 border-b border-[#F0F0F0] cursor-pointer transition-colors hover:bg-[#F8F8F8] ${
        !isRead ? 'bg-[#F0F9FF]' : 'bg-white'
      }`}
      onClick={handleClick}
    >
      {getTypeIcon()}

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between mb-1">
          <h3
            className={`text-sm font-medium text-[#333333] leading-5 ${!isRead ? 'font-semibold' : ''}`}
          >
            {title}
          </h3>
          {!isRead && (
            <div className="flex-shrink-0 w-2 h-2 bg-[#0fbcd6] rounded-full ml-2 mt-1" />
          )}
        </div>

        <p className="text-sm text-[#666666] leading-5 mb-2">{message}</p>

        <time className="text-xs text-[#999999]">{formatDate(createdAt)}</time>
      </div>
    </article>
  )
}
