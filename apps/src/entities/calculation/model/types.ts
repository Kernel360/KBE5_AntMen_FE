// 정산 요청(POST) 응답 타입
export interface CalculationRequestResponse {
  totalAmount: number;
  list: CalculationHistoryItem[];
}

// 정산 이력(History) 항목 타입
export interface CalculationHistoryItem {
  calculationId: number;
  managerId: number;
  startDate: string; // yyyy-MM-dd
  endDate: string;   // yyyy-MM-dd
  amount: number;
  reservationId: number;
  reservationDate: string; // yyyy-MM-dd
  reservationAmount: number;
  categoryName: string;
  requestedAt: string; // ISO string
}

// 정산 요청(POST) 파라미터 타입
export interface CalculationRequestParams {
  startDate: string; // yyyy-MM-dd
  endDate: string;   // yyyy-MM-dd
} 