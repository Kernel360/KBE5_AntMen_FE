import { fetchAlerts } from '@/shared/api/alert.server'
import { NotificationList } from '@/features/notification/NotificationList'
import { CommonHeader } from '@/shared/ui/Header/CommonHeader'
import React from 'react'

export const dynamic = 'force-dynamic'

async function readAllAlerts() {
  'use server'
  const res = await fetch('https://api.antmen.site:9090/api/v1/common/alerts', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  })
  // 성공/실패 여부는 무시 (실패해도 무시)
}

export default async function NotificationsPage() {
  const notifications = await fetchAlerts()

  return (
    <>
      <div className="flex items-center justify-between">
        <CommonHeader title="알림" showBackButton />
      </div>
      <NotificationList notifications={notifications} />
    </>
  )
}
