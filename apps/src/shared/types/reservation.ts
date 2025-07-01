export interface TimeSlot {
  hour: number;
  minute: string;
  formatted: string;
}

export interface Category {
  id: number;
  name: string;
  description: string;
}

export interface Option {
  id: number;
  name: string;
  price: number;
}

export interface CategoryOption {
  id: number;
  name: string;
  price: number;
  time: number;
  description: string;
  notice?: string;
}

export interface RecommendedTime {
  time: number;
  area: number;
}

export type { ReservationRequest } from '../api'; 