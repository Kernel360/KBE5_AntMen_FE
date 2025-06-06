export type ReservationStatus = 'scheduled' | 'completed' | 'cancelled';

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

export type ReservationTab = 'upcoming' | 'past'; 