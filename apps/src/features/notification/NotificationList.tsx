'use client';
import { useState } from 'react';
import { NotificationCard } from './ui/NotificationCard';
import type { Notification } from '@/entities/notification';

export function NotificationList({ notifications: initialNotifications }: { notifications: Notification[] }) {
  const [notifications, setNotifications] = useState(initialNotifications);

  // 읽지 않은 알림 개수
  const unreadCount = notifications.filter(n => !n.isRead).length;

  // 읽음 처리 등 이벤트 핸들러 필요시 여기에 추가

  return (
    <div className="flex-1">
      {/* 상위에서 unreadCount로 빨간 점+숫자 표시 가능 */}
      {notifications.length > 0 ? (
        notifications.map((notification) => (
          <NotificationCard
            key={notification.id}
            notification={notification}
          />
        ))
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