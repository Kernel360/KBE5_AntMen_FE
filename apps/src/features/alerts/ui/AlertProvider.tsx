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
    if (!('Notification' in window)) {
      console.log('[AlertProvider] Notifications not supported');
      return;
    }

    if (Notification.permission === 'default') {
      try {
        const permission = await Notification.requestPermission();
        console.log('[AlertProvider] Notification permission:', permission);
      } catch (error) {
        console.error('[AlertProvider] Failed to request notification permission:', error);
      }
    }
  };

  const cleanup = () => {
    if (connectionRef.current) {
      console.log('[AlertProvider] Cleaning up existing connection');
      connectionRef.current.abort();
      connectionRef.current = null;
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    isConnectingRef.current = false;
  };

  const connectToAlerts = async () => {
    const authResult = checkUserAuth();
    if (!authResult.isAuthenticated) {
      resetAlerts();
      return;
    }

    // 이미 연결 중이거나 마운트되지 않은 경우 중복 연결 방지
    if (!mountedRef.current || isConnectingRef.current || connectionRef.current) {
      console.log('[AlertProvider] Connection already exists or in progress, or component not mounted. Skipping...');
      return;
    }

    try {
      console.log('[AlertProvider] Initiating new connection...');
      isConnectingRef.current = true;
      const currentController = new AbortController();
      connectionRef.current = currentController;

      await subscribeToAlerts({
        onConnect: () => {
          if (mountedRef.current) {
            console.log('[AlertProvider] Connected to alert system');
            isConnectingRef.current = false;
            refreshUnreadCount();
          } else {
            console.log('[AlertProvider] Connected but component unmounted, cleaning up');
            cleanup();
          }
        },
        onAlert: (alert) => {
          if (mountedRef.current) {
            showAlertToast(alert);
            refreshUnreadCount();
          }
        },
        onError: (error) => {
          console.error('[AlertProvider] Alert system error:', error);
          cleanup();
          
          // 연결 에러 시 재연결 시도 (3초 후)
          if (mountedRef.current) {
            console.log('[AlertProvider] Scheduling reconnection attempt...');
            reconnectTimeoutRef.current = setTimeout(connectToAlerts, 3000);
          }
        },
        signal: currentController.signal
      });
    } catch (error) {
      console.error('[AlertProvider] Failed to connect:', error);
      cleanup();
      
      // 연결 실패 시 재연결 시도 (3초 후)
      if (mountedRef.current) {
        console.log('[AlertProvider] Scheduling reconnection attempt...');
        reconnectTimeoutRef.current = setTimeout(connectToAlerts, 3000);
      }
    }
  };

  // 인증 상태 변경 감지 및 처리
  useEffect(() => {
    const checkAuthChange = () => {
      const authResult = checkUserAuth();
      const currentAuth = authResult.isAuthenticated ? authResult.userRole : null;

      // 인증 상태가 변경되었을 때
      if (currentAuth !== prevAuthRef.current) {
        console.log('[AlertProvider] Auth state changed:', { prev: prevAuthRef.current, current: currentAuth });
        prevAuthRef.current = currentAuth;
        
        if (!currentAuth) {
          // 로그아웃 상태
          resetAlerts();
        } else {
          // 새로운 로그인 상태
          cleanup(); // 기존 연결 정리
          connectToAlerts(); // 새로운 연결 시작
        }
      }
    };

    // 주기적으로 인증 상태 확인 (2초마다)
    const intervalId = setInterval(checkAuthChange, 2000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    
    // 초기 인증 상태 저장
    const authResult = checkUserAuth();
    prevAuthRef.current = authResult.isAuthenticated ? authResult.userRole : null;

    // 알림 권한 요청 및 초기 연결 시도
    requestNotificationPermission();
    connectToAlerts();

    // 페이지 언로드 시에만 정리
    return () => {
      console.log('[AlertProvider] Component unmounting, cleaning up...');
      mountedRef.current = false;
      cleanup();
    };
  }, []); // 빈 의존성 배열로 마운트/언마운트 시에만 실행

  return (
    <AlertContext.Provider value={{ unreadCount, refreshUnreadCount, resetAlerts }}>
      {children}
      <Toaster {...TOASTER_CONFIG} />
    </AlertContext.Provider>
  );
}; 