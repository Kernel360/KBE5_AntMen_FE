// 백엔드에서 받는 알림 데이터 구조
export interface AlertResponse {
  alertId: number;
  alertContent: string;
  alertTrigger: string;
  redirectUrl: string;
  createdAt: string;
}

// 프론트엔드에서 사용할 알림 데이터 구조
export interface Alert {
  id: number;
  content: string;
  trigger: string;
  redirectUrl: string;
  createdAt: string;
} 