'use client';

import React, { useEffect, useRef, createContext, useContext, useState } from 'react';
import { Toaster, ToasterProps } from 'react-hot-toast';
import { subscribeToAlerts } from '@/features/alerts/api/alertApi';
import { showAlertToast } from './AlertToast';
import { alertApi } from '@/shared/api/alert';
import { checkUserAuth } from '@/features/auth/lib/auth';

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
  const prevAuthRef = useRef<string | null>(null);

  const resetAlerts = () => {
    cleanup();
    setUnreadCount(0);
  };

  const refreshUnreadCount = async () => {
    try {
      const authResult = checkUserAuth();
      if (!authResult.isAuthenticated) {
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

  // storage event로 로그인/로그아웃 동기화
  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === 'auth-event') {
        const data = event.newValue ? JSON.parse(event.newValue) : null;
        if (!data) return;
        if (data.type === 'login') {
          cleanup();
          connectToAlerts();
        } else if (data.type === 'logout') {
          resetAlerts();
        }
      }
    };
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, []);

  // 로그인/로그아웃 시점에만 연결/해제
  const handleAuthChange = () => {
    const authResult = checkUserAuth()
    const currentAuth = authResult.isAuthenticated ? authResult.userRole : null;
    if (currentAuth !== prevAuthRef.current) {
      prevAuthRef.current = currentAuth
      if (!currentAuth) {
        // 로그아웃
        resetAlerts()
        // 다른 탭 동기화
        localStorage.setItem('auth-event', JSON.stringify({ type: 'logout', ts: Date.now() }))
      } else {
        // 로그인
        cleanup()
        connectToAlerts()
        // 다른 탭 동기화
        localStorage.setItem('auth-event', JSON.stringify({ type: 'login', ts: Date.now() }));
      }
    }
  };

  // 마운트 시 1회만 실행
  useEffect(() => {
    mountedRef.current = true
    const authResult = checkUserAuth()
    prevAuthRef.current = authResult.isAuthenticated ? authResult.userRole : null
    requestNotificationPermission()
    if (authResult.isAuthenticated) {
      connectToAlerts()
    }
    return () => {
      mountedRef.current = false;
      cleanup();
    };
  }, []);

  // SSE 연결 실패(401 등) 시 자동 로그아웃 처리
  const connectToAlerts = async () => {
    const authResult = checkUserAuth();
    if (!authResult.isAuthenticated) {
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
            showAlertToast(alert)
            refreshUnreadCount()
          }
        },
        onError: (error: Error) => {
          console.error('[AlertProvider] Alert system error:', error);
          cleanup();
          // 401 등 인증 오류 시 자동 로그아웃
          if (error.message?.includes('401') || error.message?.toLowerCase().includes('unauthorized')) {
            localStorage.setItem('auth-event', JSON.stringify({ type: 'logout', ts: Date.now() }))
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
        localStorage.setItem('auth-event', JSON.stringify({ type: 'logout', ts: Date.now() }))
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