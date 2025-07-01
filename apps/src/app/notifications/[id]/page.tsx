'use client'

import { useEffect, useState } from 'react'
import { CommonHeader } from '@/shared/ui/Header/CommonHeader'
import { alertApi } from '@/shared/api/alert'
import type { Notification } from '@/entities/notification'
import { transformNotification } from '@/entities/notification/lib/transform'

interface NotificationDetailPageProps {
  params: {
    id: string
  }
}

export default function NotificationDetailPage({ params }: NotificationDetailPageProps) {
  const [notification, setNotification] = useState<Notification | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchNotification = async () => {
      try {
        const data = await alertApi.getAlert(params.id)
        setNotification(transformNotification(data))
        // 읽음 처리
        await alertApi.markAsRead(params.id)
      } catch (error) {
        console.error('Failed to fetch notification:', error)
        setError('알림을 불러오는데 실패했습니다.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchNotification()
  }, [params.id])

  return (
    <div className="min-h-screen bg-accent/5">
      <div className="fixed flex justify-center max-w-mobile w-full bg-white z-10">
        <CommonHeader title="알림" showBackButton />
      </div>
      {/* 헤더 높이만큼 여백 */}
      <div className="h-[56px]" />

      <div className="max-w-mobile mx-auto">
        {isLoading ? (
          <div className="flex justify-center items-center h-[200px]">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-[200px] text-red-500">
            {error}
          </div>
        ) : notification ? (
          <div className="bg-white shadow-sm">
            <div className="px-4 py-5">
              <h1 className="text-xl font-bold mb-2 text-accent-foreground">
                {notification.content}
              </h1>
              <div className="flex items-center text-sm text-accent-foreground/70 pb-4">
                <span className="font-medium text-primary/80">
                  AntMen
                </span>
                <span className="mx-2 text-accent/30">|</span>
                <span>
                  {new Date(notification.createdAt).toLocaleString('ko-KR')}
                </span>
                <span
                  className={`ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    notification.isRead
                      ? 'bg-primary/10 text-primary'
                      : 'bg-accent/10 text-accent-foreground/70'
                  }`}
                >
                  {notification.isRead ? '읽음' : '읽지 않음'}
                </span>
              </div>
              <div className="h-[1px] bg-gray-200" />
              <div className="px-2 pt-4 pb-1">
                <p className="text-accent-foreground whitespace-pre-wrap break-words leading-relaxed">
                  {notification.content}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center h-[200px] text-gray-500">
            알림을 찾을 수 없습니다.
          </div>
        )}
      </div>
    </div>
  )
}
