'use client'

import { useEffect, useState } from 'react'
import { NotificationList } from '@/features/notification/NotificationList'
import { CommonHeader } from '@/shared/ui/Header/CommonHeader'
import { alertApi } from '@/shared/api/alert'
import type { Notification } from '@/entities/notification'

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await alertApi.getAlerts()
        setNotifications(data)
      } catch (error) {
        console.error('Failed to fetch notifications:', error)
        setError('알림을 불러오는데 실패했습니다.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchNotifications()
  }, [])

  if (isLoading) {
    return (
      <main className="min-h-screen bg-white flex flex-col">
        <CommonHeader title="알림" showBackButton />
        <div className="flex-1 pt-[64px] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen bg-white flex flex-col">
        <CommonHeader title="알림" showBackButton />
        <div className="flex-1 pt-[64px] flex items-center justify-center text-red-500">
          {error}
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-white flex flex-col">
      <CommonHeader title="알림" showBackButton />
      <div className="flex-1 pt-[64px]">
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
            } catch (error) {
              console.error('Failed to mark notification as read:', error)
            }
          }}
        />
      </div>
    </main>
  )
}
