import type { Notification } from '../model/types';
import type { Alert } from '@/shared/api/alert';

export function transformNotification(alert: Alert): Notification {
  return {
    id: String(alert.alertId),
    content: alert.alertContent,
    redirectUrl: alert.redirectUrl || null,
    isRead: alert.read,
    createdAt: alert.createdAt
  };
}

export function transformNotifications(alerts: Alert[]): Notification[] {
  return alerts.map(transformNotification);
} 