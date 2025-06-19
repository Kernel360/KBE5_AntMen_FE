export interface Review {
  id: string;
  customerId: string;
  customerName: string;
  customerProfile: string;
  managerId: string;
  managerName: string;
  managerProfile: string;
  reservationId: string;
  rating: number;
  comment: string;
  authorType: 'CUSTOMER' | 'MANAGER';
  createdAt: string;
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