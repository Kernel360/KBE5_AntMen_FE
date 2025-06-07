export interface Review {
  id: string;
  workId: string;
  rating: number;
  serviceCompletionComment?: string;
  customerFeedback?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateReviewRequest {
  workId: string;
  rating: number;
  serviceCompletionComment?: string;
  customerFeedback?: string;
}

export interface CreateReviewData {
  reservationId: string;
  rating: number;
  content: string;
} 