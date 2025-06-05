export interface Review {
  id: string;
  reservationId: string;
  rating: number;
  content: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateReviewData {
  reservationId: string;
  rating: number;
  content: string;
} 