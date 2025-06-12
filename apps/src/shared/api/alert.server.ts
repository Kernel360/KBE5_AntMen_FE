import { Notification } from '@/entities/notification'
import { cookies } from 'next/headers'

export async function fetchAlerts(): Promise<Notification[]> {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get('auth-token')?.value

    const res = await fetch('/api/v1/common/alerts', {
      headers: {
        Authorization: token ?? '',
      },
      next: { revalidate: 10 },
      cache: 'no-store',
    })
    if (!res.ok) {
      throw new Error('알림 정보를 불러오지 못했습니다.')
    }
    return res.json()
  } catch (error) {
    console.error('알림 fetch 에러:', error)
    throw error
  }
}
