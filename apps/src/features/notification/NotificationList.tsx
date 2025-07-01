'use client';
import { useState } from 'react';
import { NotificationCard } from './ui/NotificationCard';
import type { Notification } from '@/entities/notification';
import { alertApi } from '@/shared/api/alert';

interface NotificationListProps {
  notifications: Notification[]
  onRead?: (id: string) => Promise<void>
}

export function NotificationList({ 
  notifications: initialNotifications,
  onRead
}: NotificationListProps) {
  const [notifications, setNotifications] = useState(initialNotifications);

  // 읽지 않은 알림 개수
  const unreadCount = notifications.filter(n => !n.isRead).length;

  // 전체 읽음 처리 핸들러
  const handleMarkAllAsRead = async () => {
    try {
      await alertApi.markAllAsRead();
      setNotifications(prev =>
        prev.map(notification => ({
          ...notification,
          isRead: true
        }))
      );
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  return (
    <div className="flex-1 pt-[64px]">
      {notifications.length > 0 ? (
        <div>
          <div className="sticky top-[64px] z-10 bg-white flex justify-between items-center p-4 border-b border-gray-100">
            <h2 className="text-lg font-bold">
              알림 {unreadCount > 0 && `(${unreadCount})`}
            </h2>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-sm text-blue-500 hover:text-blue-700"
              >
                모두 읽음
              </button>
            )}
          </div>
          <div>
            {notifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                onRead={onRead}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="flex h-[400px] flex-col items-center justify-center gap-6 p-6">
          <div className="relative h-[80px] w-[80px]">
            <div className="absolute inset-0 rounded-full bg-[#F0F0F0]" />
            <div className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2">
              <svg viewBox="0 0 24 24" fill="none" className="h-full w-full text-[#CCCCCC]">
                <path
                  d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 10.5C21 11.3 20.3 12 19.5 12H4.5C3.7 12 3 11.3 3 10.5S3.7 9 4.5 9H19.5C20.3 9 21 9.7 21 10.5Z"
                  fill="currentColor"
                />
              </svg>
            </div>
          </div>
          <div className="flex flex-col items-center gap-3">
            <h2 className="text-lg font-bold text-[#333333]">알림이 없습니다</h2>
            <p className="text-center text-sm text-[#666666]">
              새로운 알림이 도착하면
              <br />
              여기에서 확인할 수 있습니다.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// 빨간 점+숫자 뱃지 컴포넌트도 export (상위에서 활용)
export function NotificationBadge({ count }: { count: number }) {
  if (count < 1) return null;
  return (
    <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 bg-red-500 rounded-full flex items-center justify-center text-[10px] text-white font-bold">
      {count}
    </span>
  );
} 