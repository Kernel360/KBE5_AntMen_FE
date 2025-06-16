export interface UserSummary {
  userId: number;
  name: string;
  // 필요한 경우 추가 필드
}

export interface Matching {
  matchingId: number;
  priority: number;
  isRequested: boolean;
  isAccepted: boolean;
  isFinal: boolean;
  refuseReason: string | null;
  manager: UserSummary;
}

export interface ReservationHistory {
  reservationId: number;
  categoryName: string;
  reservationStatus: ReservationStatus;
  reservationDate: string;
  totalDuration: number;
  totalAmount: number;
  customer: UserSummary;
  manager: UserSummary;
  address: string;
  selectedOptions: string[];
  matchings: Matching[];
}

export type ReservationStatus = 
  | 'W'  // WAITING
  | 'M'  // MATCHING
  | 'P'  // PAY
  | 'D'  // DONE
  | 'C'  // CANCEL
  | 'E'; // ERROR

export const ReservationStatusLabel: Record<ReservationStatus, string> = {
  'W': '대기중',
  'M': '매칭중',
  'P': '결제대기',
  'D': '완료',
  'C': '취소',
  'E': '오류'
};

export type PaymentStatus = 'pending' | 'paid' | 'refunded'

export interface Worker {
  id: string
  name: string
  rating: number
  experience: string
  age: number
  gender: string
  avatar: string
  phone: string
}

export interface Customer {
  id: string
  name: string
  phone?: string
}

export interface Reservation {
  reservationId: number;
  customerId: number;
  reservationCreatedAt: string;
  reservationDate: string;
  reservationTime: string;
  categoryId: number;
  categoryName: string;
  recommendDuration: number;
  reservationDuration: number;
  managerId: number;
  managerName: string;
  matchedAt: string;
  reservationStatus: string;
  reservationCancelReason: string | null;
  reservationMemo: string | null;
  reservationAmount: number;
  optionIds: number[];
  optionNames: string[];
}

export type ReservationTab = 'upcoming' | 'past'
