'use client';

import React, { useEffect, useRef } from 'react';
import { Toaster, ToasterProps } from 'react-hot-toast';
import { subscribeToAlerts } from '@/features/alerts/api/alertApi';
import { showAlertToast } from './AlertToast';

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
          } else {
            console.log('[AlertProvider] Connected but component unmounted, cleaning up');
            cleanup();
          }
        },
        onAlert: (alert) => {
          if (mountedRef.current) {
            showAlertToast(alert);
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

  useEffect(() => {
    mountedRef.current = true;
    
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
    <>
      {children}
      <Toaster {...TOASTER_CONFIG} />
    </>
  );
}; 