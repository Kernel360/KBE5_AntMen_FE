export interface UserSummary {
  userId: number;
  name: string;
  gender: string; // "남성" | "여성"
  age: number;
  profileImage: string;
  // 필요한 경우 추가 필드
}

export interface Matching {
  matchingId: number
  priority: number
  isRequested: boolean
  isAccepted: boolean
  isFinal: boolean
  refuseReason: string | null
  manager: UserSummary
}

export interface ReservationHistory {
  reservationId: number;
  categoryName: string;
  reservationStatus: ReservationStatus;
  reservationDate: string;
  totalDuration: number;
  totalAmount: number;
  reservationMemo: string;
  reservationTime: string;
  customer: UserSummary;
  manager: UserSummary;
  address: string;
  selectedOptions: string[];
  matchings: Matching[];
}

// FE에서 사용하는 예약 상태 코드 타입 (API 매핑은 ReservationStatusMap 참고)
export type ReservationStatus =
  | 'WAITING'
  | 'MATCHING'
  | 'PAY'
  | 'DONE'
  | 'CANCEL'
  | 'ERROR'
  | 'SCHEDULED'

// FE 예약 상태 코드 → 한글 라벨 매핑
export const ReservationStatusLabel: Record<ReservationStatus, string> = {
  WAITING: '대기중',
  MATCHING: '매칭중',
  PAY: '결제 완료',
  DONE: '완료',
  CANCEL: '취소',
  ERROR: '오류',
  SCHEDULED: '신청중',
}

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

export interface CustomerAddress {
  addressId: number
  addressName: string
  addressAddr: string
  addressDetail?: string
  addressArea: number
}

export interface Reservation {
  reservationId: number
  customerId: number
  reservationCreatedAt: string
  reservationDate: string
  reservationTime:
    | string
    | { hour: number; minute: number; second: number; nano: number }
  categoryId: number
  categoryName: string
  recommendDuration: number
  reservationDuration: number
  managerId: number
  managerName: string
  matchedAt: string
  reservationStatus: ReservationStatus
  reservationCancelReason: string | null
  reservationMemo: string | null
  reservationAmount: number
  optionIds: number[]
  optionNames: string[]
  address: CustomerAddress
}

export type ReservationTab = 'pending' | 'upcoming' | 'past'

// API 상태값 → FE ReservationStatus 매핑 테이블 (모든 화면에서 import해서 사용)
export const ReservationStatusMap: Record<string, ReservationStatus> = {
  SCHEDULED: 'WAITING',
  MATCHING: 'MATCHING',
  PAY: 'PAY',
  DONE: 'DONE',
  CANCEL: 'CANCEL',
  ERROR: 'ERROR',
  // 필요시 추가
}
