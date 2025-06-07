// TODO: 예약 상태 타입 변경 필요

export type ReservationStatus = 'scheduled' | 'in-progress' | 'completed' | 'completed-pending-review' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'refunded';

export interface Worker {
  id: string;
  name: string;
  rating: number;
  experience: string;
  age: number;
  gender: string;
  avatar: string;
  phone: string;
}

export interface Customer {
  id: string;
  name: string;
  phone?: string;
}

export interface Reservation {
  id: string;
  reservationNumber: string;
  serviceType: string;
  status: ReservationStatus;
  paymentStatus: PaymentStatus;
  dateTime: string;
  duration: string;
  location: string;
  detailedAddress: string;
  worker: Worker;
  customer?: Customer; // 매니저 뷰를 위해 고객 정보 추가 (선택적)
  amount: number;
  baseAmount: number;
  discount: number;
  paymentMethod?: string;
  options: Array<{
    name: string;
    price: number;
  }>;
  createdAt: string;
  checkinTime?: string; // 매니저용 상태 필드
  checkoutTime?: string; // 매니저용 상태 필드
  review?: Review; // 매니저용 상태 필드
}

// 후기 데이터 타입
export interface Review {
  rating: number;
  content: string;
  createdAt: string;
}

// 매니저용 예약 타입 - customer 정보 포함 -> Reservation으로 통합
/*
export interface ManagerReservation {
  id: string;
  reservationNumber?: string;
  serviceType: string;
  location: string;
  status: ReservationStatus;
  dateTime: string;
  duration?: string;
  customer: {
    id:string;
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
*/

export type ReservationTab = 'upcoming' | 'past'; 