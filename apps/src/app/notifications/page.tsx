"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { NotificationCard } from '@/features/notification';
import type { Notification } from '@/entities/notification';

// 임시 알림 데이터
const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    title: '예약 확정',
    message: '3월 15일 정기 청소 예약이 확정되었습니다. 김민준 매니저가 오전 10시에 방문예정입니다.',
    type: 'reservation',
    isRead: false,
    createdAt: '2024-03-13T10:30:00Z',
    relatedId: '1',
  },
  {
    id: '2',
    title: '리뷰 요청',
    message: '대청소 서비스가 완료되었습니다. 서비스에 대한 리뷰를 남겨주세요.',
    type: 'review',
    isRead: false,
    createdAt: '2024-03-12T16:45:00Z',
    relatedId: '3',
  },
  {
    id: '3',
    title: '특별 할인 이벤트',
    message: '신규 고객 대상 20% 할인 이벤트가 시작되었습니다. 지금 예약하고 혜택을 받아보세요!',
    type: 'promotion',
    isRead: true,
    createdAt: '2024-03-11T09:00:00Z',
  },
  {
    id: '4',
    title: '결제 완료',
    message: '부분 청소 서비스 결제가 완료되었습니다. 결제 금액: 45,000원',
    type: 'payment',
    isRead: true,
    createdAt: '2024-03-10T14:20:00Z',
    relatedId: '4',
  },
  {
    id: '5',
    title: '시스템 점검 안내',
    message: '서비스 개선을 위한 시스템 점검이 3월 16일 새벽 2시부터 4시까지 진행됩니다.',
    type: 'system',
    isRead: true,
    createdAt: '2024-03-09T18:30:00Z',
  },
];

export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);

  const handleBack = () => {
    router.back();
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const handleNotificationClick = (notification: Notification) => {
    // 알림 타입에 따라 다른 페이지로 이동
    switch (notification.type) {
      case 'reservation':
        if (notification.relatedId) {
          router.push(`/reservations/${notification.relatedId}`);
        }
        break;
      case 'review':
        if (notification.relatedId) {
          router.push(`/reservations/${notification.relatedId}`);
        }
        break;
      case 'promotion':
        router.push('/');
        break;
      case 'payment':
        if (notification.relatedId) {
          router.push(`/reservations/${notification.relatedId}`);
        }
        break;
      default:
        break;
    }
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <main className="flex min-h-screen flex-col bg-white">
      {/* Header */}
      <header className="flex items-center justify-between p-5 border-b border-[#F0F0F0]">
        <button 
          onClick={handleBack} 
          className="flex h-6 w-6 items-center justify-center"
          aria-label="뒤로가기"
        >
          <Image src="/icons/arrow-left.svg" alt="뒤로가기" width={24} height={24} />
        </button>
        <h1 className="flex-1 text-center text-xl font-bold text-[#333333]">알림</h1>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="text-sm font-medium text-[#0fbcd6]"
          >
            모두 읽음
          </button>
        )}
        {unreadCount === 0 && <div className="h-6 w-6" />}
      </header>

      {/* Notification Count */}
      {unreadCount > 0 && (
        <div className="px-5 py-3 bg-[#F8F9FA] border-b border-[#F0F0F0]">
          <p className="text-sm text-[#666666]">
            읽지 않은 알림 <span className="font-semibold text-[#0fbcd6]">{unreadCount}개</span>가 있습니다.
          </p>
        </div>
      )}

      {/* Notification List */}
      <div className="flex-1">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              onRead={handleMarkAsRead}
              onClick={handleNotificationClick}
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
    </main>
  );
} 