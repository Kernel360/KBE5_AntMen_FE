export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
  relatedId?: string; // 예약 ID, 이벤트 ID 등
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