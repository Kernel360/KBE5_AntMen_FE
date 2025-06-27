'use client'

import { useRouter } from 'next/navigation'
import type { Notification } from '@/entities/notification'
import { formatDistanceToNow } from 'date-fns'
import { ko } from 'date-fns/locale'

interface NotificationCardProps {
  notification: Notification
  onRead?: (id: string) => Promise<void>
}

export function NotificationCard({ notification, onRead }: NotificationCardProps) {
  const router = useRouter()

  const handleClick = async () => {
    if (!notification.isRead && onRead) {
      await onRead(notification.id)
    }

    // redirectUrl이 있고 빈 문자열이 아닌 경우에만 해당 URL로 이동
    if (notification.redirectUrl && notification.redirectUrl.trim() !== '') {
      router.push(notification.redirectUrl)
    } else if (!notification.redirectUrl || notification.redirectUrl.trim() === '') {
      router.push(`/notifications/${notification.id}`)
    }
  }

  return (
    <div
      onClick={handleClick}
      className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
        !notification.isRead ? 'bg-blue-50/50' : ''
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <p className={`text-gray-900 break-words ${!notification.isRead ? 'font-medium' : ''}`}>
              {notification.content}
            </p>
            {!notification.isRead && (
              <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 ml-2 mt-1" />
            )}
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {formatDistanceToNow(new Date(notification.createdAt), {
              addSuffix: true,
              locale: ko,
            })}
          </p>
        </div>
      </div>
    </div>
  )
}
