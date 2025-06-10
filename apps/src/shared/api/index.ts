export * from './category';
export * from './reservation';
export * from './reservationOption';
export * from './address';

export interface ReservationRequest {
  customerId: number;
  categoryId: number;
  addressId: number;
  reservationCreatedAt: string;  // "YYYY-MM-DD HH:mm:ss" 형식
  reservationDate: string;  // "YYYY-MM-DD" 형식
  reservationTime: string;  // "HH:mm:ss" 형식
  reservationDuration: number;
  reservationMemo?: string;
  reservationAmount: number;
  additionalDuration: number;
  optionIds: number[];
  managerIds: number[];  // 선택한 매니저 ID 리스트
}

export interface ReservationResponse {
  reservationId: number;
  status: string;
  message?: string;
}