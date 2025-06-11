export type ReservationStatus =
  | 'scheduled'
  | 'in-progress'
  | 'completed'
  | 'cancelled';

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
  customer: Customer;
  amount: number;
  baseAmount: number;
  discount: number;
  paymentMethod?: string;
  options: Array<{
    name: string;
    price: number;
  }>;
  createdAt: string;
  checkinTime?: string;
  checkoutTime?: string;
  review?: {
    rating: number;
    content: string;
    createdAt: string;
  };
}

export type ReservationTab = 'upcoming' | 'past';