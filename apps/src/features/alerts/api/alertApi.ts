import { EventSourceMessage, fetchEventSource } from '@microsoft/fetch-event-source';
import { Alert, AlertResponse } from '@/entities/alert/model/types';
import { customFetch } from '@/shared/api/base';

const ALERT_API_BASE = 'https://api.antmen.site:9090/api/v1/common/alerts';

// auth-token 쿠키에서 토큰 추출
function getAuthTokenFromCookie() {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(/auth-token=([^;]+)/);
  if (!match) return null;
  return decodeURIComponent(match[1]); // Bearer 토큰이 이미 포함되어 있음
}

// 백엔드 응답을 프론트엔드 형식으로 변환
const transformAlert = (response: AlertResponse): Alert => ({
  id: response.alertId,
  content: response.alertContent,
  redirectUrl: response.redirectUrl,
  createdAt: response.createdAt,
  isRead: response.read
});

export const subscribeToAlerts = async (handlers: {
  onConnect?: () => void;
  onAlert?: (alert: Alert) => void;
  onError?: (error: Error) => void;
  signal?: AbortSignal;
}) => {
  try {
    // console.log('[AlertAPI] Initiating SSE connection...');
    
    const token = getAuthTokenFromCookie();
    if (!token) {
      throw new Error('No authentication token found');
    }

    await fetchEventSource(`${ALERT_API_BASE}/subscribe`, {
      method: 'GET',
      headers: {
        'Accept': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Authorization': token,
      },
      signal: handlers.signal,
      fetch: async (input: RequestInfo | URL, init?: RequestInit) => {
        // SSE 연결을 위해 native fetch 사용
        return fetch(input, {
          ...init,
          headers: {
            ...init?.headers,
          },
        });
      },
      async onopen(response) {
        // console.log('[AlertAPI] Connection response:', {
        //   status: response.status,
        //   statusText: response.statusText,
        //   headers: Object.fromEntries(response.headers.entries())
        // });

        if (response.ok && response.status === 200) {
          // console.log('[AlertAPI] SSE connection established successfully');
          handlers.onConnect?.();
        } else {
          throw new Error(`Failed to establish SSE connection: ${response.status} ${response.statusText}`);
        }
      },
      onmessage(event: EventSourceMessage) {
        // console.log('[AlertAPI] Received event:', {
        //   type: event.event,
        //   data: event.data,
        //   id: event.id
        // });
        
        if (handlers.signal?.aborted) {
          return;
        }

        if (event.event === 'connect') {
          // console.log('[AlertAPI] Received connect event:', event.data);
          return;
        }

        if (event.event === 'alert' && event.data) {
          try {
            const alertResponse: AlertResponse = JSON.parse(event.data);
            // console.log('[AlertAPI] Received alert response:', alertResponse);
            
            const alert = transformAlert(alertResponse);
            // console.log('[AlertAPI] Transformed alert:', alert);
            
            handlers.onAlert?.(alert);
          } catch (error) {
            // console.error('[AlertAPI] Failed to parse alert data:', error);
            // console.error('[AlertAPI] Raw event data:', event.data);
          }
        }
      },
      onclose() {
        if (!handlers.signal?.aborted) {
          // console.log('[AlertAPI] SSE connection closed unexpectedly');
        }
      },
      onerror(error) {
        // console.error('[AlertAPI] SSE connection error:', error);
        if (!handlers.signal?.aborted) {
          handlers.onError?.(error);
        }
      }
    });
  } catch (error) {
    // AbortError는 정상적인 중단이므로 에러로 처리하지 않음
    if (error instanceof Error && error.name === 'AbortError') {
      // console.log('[AlertAPI] Connection aborted by client');
      return;
    }
    // console.error('[AlertAPI] Failed to establish SSE connection:', error);
    handlers.onError?.(error as Error);
  }
}; 