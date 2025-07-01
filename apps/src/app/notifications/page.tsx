'use client'

import { useEffect, useState } from 'react'
import { NotificationList } from '@/features/notification/NotificationList'
import { CommonHeader } from '@/shared/ui/Header/CommonHeader'
import { alertApi } from '@/shared/api/alert'
import type { Notification } from '@/entities/notification'
import { transformNotifications } from '@/entities/notification/lib/transform'
import { useAlerts } from '@/features/alerts/ui/AlertProvider'

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { refreshUnreadCount } = useAlerts()

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await alertApi.getAlerts()
        setNotifications(transformNotifications(data))
      } catch (error) {
        console.error('Failed to fetch notifications:', error)
        setError('알림을 불러오는데 실패했습니다.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchNotifications()
  }, [])

  return (
    <main className="flex min-h-screen flex-col bg-white">
      <CommonHeader title="알림" showBackButton />
      
      <div className="flex-1 flex flex-col">
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="flex-1 flex items-center justify-center text-red-500">
            {error}
          </div>
        ) : (
          <div className="flex-1">
            <NotificationList 
              notifications={notifications}
              onRead={async (id) => {
                try {
                  await alertApi.markAsRead(id)
                  setNotifications(prev =>
                    prev.map(n =>
                      n.id === id ? { ...n, isRead: true } : n
                    )
                  )
                  await refreshUnreadCount()
                } catch (error) {
                  console.error('Failed to mark notification as read:', error)
                }
              }}
            />
          </div>
        )}
      </div>
    </main>
  )
}
