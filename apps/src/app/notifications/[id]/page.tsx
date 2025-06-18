import React from 'react'
import { CommonHeader } from '@/shared/ui/Header/CommonHeader'

// TODO: 실제 API 연결 전 더미 데이터
const dummyNotification = {
  id: 1,
  title: '매칭이 완료되었습니다!',
  content: '홍길동 매니저와 매칭이 완료되었습니다. 예약 내역에서 확인해보세요.',
  createdAt: '2024-06-18T10:00:00Z',
  status: '읽지 않음',
  sender: {
    name: 'AntMen',
  },
}

const NotificationDetailPage = () => {
  const notification = dummyNotification

  return (
    <div className="min-h-screen bg-accent/5">
      <div className="fixed flex justify-center max-w-mobile w-full bg-white z-10">
        <CommonHeader title="알림" showBackButton />
      </div>
      {/* 헤더 높이만큼 여백 */}
      <div className="h-[56px]" />

      <div className="max-w-mobile mx-auto">
        <div className="bg-white shadow-sm">
          <div className="px-4 py-5">
            <h1 className="text-xl font-bold mb-2 text-accent-foreground">
              {notification.title}
            </h1>
            <div className="flex items-center text-sm text-accent-foreground/70 pb-4">
              <span className="font-medium text-primary/80">
                {notification.sender.name}
              </span>
              <span className="mx-2 text-accent/30">|</span>
              <span>
                {new Date(notification.createdAt).toLocaleString('ko-KR')}
              </span>
              {notification.status && (
                <span
                  className={`ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    notification.status === '읽음'
                      ? 'bg-primary/10 text-primary'
                      : 'bg-accent/10 text-accent-foreground/70'
                  }`}
                >
                  {notification.status}
                </span>
              )}
            </div>
            <div className="h-[1px] bg-gray-200" />
            <div className="px-2 pt-4 pb-1">
              <p className="text-accent-foreground whitespace-pre-wrap break-words leading-relaxed">
                {notification.content}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotificationDetailPage
