'use client';

import React, { useEffect, useRef, createContext, useContext, useState } from 'react';
import { Toaster, ToasterProps } from 'react-hot-toast';
import { subscribeToAlerts } from '@/features/alerts/api/alertApi';
import { showAlertToast } from './AlertToast';
import { alertApi } from '@/shared/api/alert';
import { useSecureAuth } from '@/shared/hooks/useSecureAuth';
import { useAuthStore } from '@/shared/stores/authStore';

interface AlertContextType {
  unreadCount: number;
  refreshUnreadCount: () => Promise<void>;
  resetAlerts: () => void;
}

const AlertContext = createContext<AlertContextType>({
  unreadCount: 0,
  refreshUnreadCount: async () => {},
  resetAlerts: () => {},
});

export const useAlerts = () => useContext(AlertContext);

// Toaster 설정
const TOASTER_CONFIG: ToasterProps = {
  position: 'top-right' as const,
  toastOptions: {
    duration: 5000,
    style: {
      background: '#fff',
      color: '#363636',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      padding: '16px',
      borderRadius: '12px',
      fontSize: '14px',
    },
  },
  containerStyle: {
    top: 20,
    right: 20,
    zIndex: 9999,
  },
  containerClassName: 'react-hot-toast-container',
};

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const connectionRef = useRef<AbortController | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isConnectingRef = useRef(false);
  const mountedRef = useRef(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { isLoggedIn, isLoading } = useSecureAuth();
  const incrementMatchingRequestCount = useAuthStore((s) => s.incrementMatchingRequestCount);

  const resetAlerts = () => {
    cleanup();
    setUnreadCount(0);
  };

  const refreshUnreadCount = async () => {
    try {
      if (!isLoggedIn || isLoading) {
        resetAlerts();
        return;
      }

      if (mountedRef.current) {
        const count = await alertApi.getUnreadCount();
        setUnreadCount(count);
      }
    } catch (error) {
      console.error('[AlertProvider] Failed to refresh unread count:', error);
    }
  };

  // 알림 권한 요청
  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) return;
    if (Notification.permission === 'default') {
      try {
        await Notification.requestPermission();
      } catch {}
    }
  };

  const cleanup = () => {
    if (connectionRef.current) {
      connectionRef.current.abort();
      connectionRef.current = null;
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    isConnectingRef.current = false;
  };

  // JWT 인증 상태 변화에 따라 SSE 연결/해제
  useEffect(() => {
    mountedRef.current = true;
    requestNotificationPermission();
    if (!isLoading && isLoggedIn) {
      connectToAlerts();
    } else if (!isLoading && !isLoggedIn) {
      cleanup();
      setUnreadCount(0);
    }
    return () => {
      mountedRef.current = false;
      cleanup();
    };
    // isLoggedIn, isLoading이 바뀔 때마다 실행
  }, [isLoggedIn, isLoading]);

  // storage 이벤트로 여러 탭 동기화 (로그인/로그아웃)
  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === 'auth-event') {
        const data = event.newValue ? JSON.parse(event.newValue) : null;
        if (!data) return;
        if (data.type === 'logout') {
          // 다른 탭에서 로그아웃 → zustand store에 로그아웃 반영
        } else if (data.type === 'login') {
          // 다른 탭에서 로그인 → 인증 상태 동기화(새로고침)
          window.location.reload();
        }
      }
    };
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, []);

  // SSE 연결 실패(401 등) 시 자동 로그아웃 처리
  const connectToAlerts = async () => {
    if (!isLoggedIn || isLoading) {
      resetAlerts()
      return
    }
    if (!mountedRef.current || isConnectingRef.current || connectionRef.current) return
    try {
      isConnectingRef.current = true;
      const currentController = new AbortController();
      connectionRef.current = currentController;
      await subscribeToAlerts({
        onConnect: () => {
          if (mountedRef.current) {
            isConnectingRef.current = false;
            refreshUnreadCount()
          } else {
            cleanup()
          }
        },
        onAlert: (alert) => {
          if (mountedRef.current) {
            // 매칭요청 알림이면 매칭요청수 +1
            if (alert.trigger === 'MATCHING_REQUEST_TO_MANAGER') {
              incrementMatchingRequestCount();
            }
            showAlertToast(alert)
            refreshUnreadCount()
          }
        },
        onError: (error: Error) => {
          console.error('[AlertProvider] Alert system error:', error);
          cleanup();
          // 401 등 인증 오류 시 자동 로그아웃
          if (error.message?.includes('401') || error.message?.toLowerCase().includes('unauthorized')) {
            resetAlerts()
          } else if (mountedRef.current) {
            reconnectTimeoutRef.current = setTimeout(connectToAlerts, 3000)
          }
        },
        signal: currentController.signal
      })
    } catch (error) {
      cleanup();
      const err = error as Error;
      if (err.message?.includes('401') || err.message?.toLowerCase().includes('unauthorized')) {
        resetAlerts();
      } else if (mountedRef.current) {
        reconnectTimeoutRef.current = setTimeout(connectToAlerts, 3000)
      }
    }
  }

  return (
    <AlertContext.Provider value={{ unreadCount, refreshUnreadCount, resetAlerts }}>
      {children}
      <Toaster {...TOASTER_CONFIG} />
    </AlertContext.Provider>
  )
}