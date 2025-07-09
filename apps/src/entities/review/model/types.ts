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