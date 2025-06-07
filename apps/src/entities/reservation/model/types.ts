// TODO: 예약 상태 타입 변경 필요

export type ReservationStatus = 'scheduled' | 'in-progress' | 'completed' | 'completed-pending-review' | 'cancelled';

export interface Reservation {
  id: string;
  reservationNumber?: string;
  serviceType: string;
  location: string;
  status: ReservationStatus;
  dateTime: string;
  duration?: string;
  worker: {
    id: string;
    name: string;
    rating?: number;
    experience?: string;
  };
  amount: number;
  payment?: {
    baseFee: number;
    discount?: number;
    total: number;
    method?: string;
  };
}

// 후기 데이터 타입
export interface Review {
  rating: number;
  content: string;
  createdAt: string;
}

// 매니저용 예약 타입 - customer 정보 포함
export interface ManagerReservation {
  id: string;
  reservationNumber?: string;
  serviceType: string;
  location: string;
  status: ReservationStatus;
  dateTime: string;
  duration?: string;
  customer: {
    id: string;
    name: string;
    phone?: string;
    rating?: number;
  };
  amount: number;
  payment?: {
    baseFee: number;
    discount?: number;
    total: number;
    method?: string;
  };
  checkinTime?: string;
  checkoutTime?: string;
  review?: Review;
}

export type ReservationTab = 'upcoming' | 'past'; 