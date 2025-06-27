import { customFetch } from './base'

const API_URL = 'http://localhost:9090/api/v1'

export interface Alert {
  alertId: number
  alertContent: string
  redirectUrl: string
  createdAt: string
  read: boolean
}

// 백엔드 응답을 프론트엔드 타입으로 변환
const transformToNotification = (alert: Alert) => ({
  id: String(alert.alertId),
  title: '',  // 알림 타입에 따라 다르게 설정할 수 있음
  message: alert.alertContent,
  type: 'system' as const,  // 기본값으로 system 설정
  isRead: alert.read,
  createdAt: alert.createdAt,
  redirectUrl: alert.redirectUrl
})

export const alertApi = {
  // 알림 목록 조회
  getAlerts: async () => {
    const alerts = await customFetch<Alert[]>(`${API_URL}/common/alerts`)
    return alerts.map(transformToNotification)
  },

  // 단일 알림 읽음 처리
  markAsRead: async (alertId: string) => {
    await customFetch<void>(`${API_URL}/common/alerts/${alertId}/read`, {
      method: 'PATCH'
    })
  },

  // 전체 알림 읽음 처리
  markAllAsRead: async () => {
    const alerts = await customFetch<Alert[]>(`${API_URL}/common/alerts`, {
      method: 'PATCH'
    })
    return alerts.map(transformToNotification)
  }
} 