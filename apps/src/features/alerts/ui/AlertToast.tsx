'use client';

import { Alert } from '@/entities/alert/model/types';
import toast from 'react-hot-toast';
import { getRelativeTime } from '../utils/timeUtils';

// 알림 스타일 상수
const TOAST_STYLE = {
  background: 'white',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  borderRadius: '0.75rem',
  padding: '1rem',
  color: '#1a1a1a',
};

export const showAlertToast = (alert: Alert) => {
  toast.custom(
    (t) => (
      <div
        style={{
          ...TOAST_STYLE,
          opacity: t.visible ? 1 : 0,
          transform: `translateY(${t.visible ? 0 : -100}%)`,
        }}
        className="w-full max-w-md bg-white pointer-events-auto transition-all duration-300 ease-in-out hover:shadow-lg"
      >
        <div className="flex items-start space-x-4">
          {/* 알림 아이콘 */}
          <div className="flex-shrink-0">
            <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
              <svg
                className="h-6 w-6 text-blue-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </div>
          </div>

          {/* 알림 내용 */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900">
              {alert.content}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              {getRelativeTime(new Date(alert.createdAt))}
            </p>
            {alert.redirectUrl && (
              <button
                onClick={(e) => {
                  e.stopPropagation(); // 이벤트 버블링 방지
                  window.location.href = alert.redirectUrl;
                  toast.dismiss(t.id);
                }}
                className="mt-1 flex items-center text-xs text-blue-500 hover:text-blue-600 transition-colors"
              >
                <span>자세히 보기</span>
                <svg
                  className="ml-1 h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            )}
          </div>

          {/* 닫기 버튼 */}
          <button
            onClick={(e) => {
              e.stopPropagation(); // 이벤트 버블링 방지
              toast.dismiss(t.id);
            }}
            className="flex-shrink-0 ml-4 text-gray-400 hover:text-gray-500 transition-colors"
          >
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    ),
    {
      duration: 5000,
      position: 'top-right',
      style: {
        maxWidth: '100%',
        zIndex: 9999,
      },
    }
  );
}; 