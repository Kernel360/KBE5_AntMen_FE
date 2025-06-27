export interface Notification {
  id: string;
  content: string;
  redirectUrl: string | null;
  isRead: boolean;
  createdAt: string;
}

export type NotificationType = 
  | 'reservation' 
  | 'review' 
  | 'promotion' 
  | 'system' 
  | 'payment';

export interface NotificationCounts {
  total: number;
  unread: number;
}

// API 응답 타입 (Alert 타입과 동일)
export interface NotificationResponse {
  alertId: number;
  alertContent: string;
  redirectUrl: string;
  createdAt: string;
  read: boolean;
} 