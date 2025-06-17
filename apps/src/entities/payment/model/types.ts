export type PaymentStatus = 'READY' | 'REQUESTED' | 'IN_PROGRESS' | 'DONE' | 'CANCELED' | 'FAILED';
export type RefundStatus = 'REQUESTED' | 'COMPLETED' | 'REJECTED';

export const PaymentStatusDescription = {
  READY: '결제 준비',
  REQUESTED: '결제 요청',
  IN_PROGRESS: '결제 진행중',
  DONE: '결제 완료',
  CANCELED: '결제 취소',
  FAILED: '결제 실패'
} as const;

export interface PaymentRequestDto {
  reservationId: number;
  payMethod: string;
  payAmount: number;
}

export interface Payment {
  payId: number;
  reservation: {
    id: number;
  };
  payMethod: string;
  payAmount: number;
  payStatus: PaymentStatus;
  payRequestTime: string;
  pay_createdTime: string;
  payLastTransactionKey?: string;
  refund?: {
    refundId: number;
    refundAmount: number;
    refundStatus: RefundStatus;
    refundRequestTime: string;
    refundCreatedTime: string;
  };
}

export interface PaymentSuccessCallback {
  paymentKey: string;
  orderId: string;
  amount: number;
}

export interface PaymentFailCallback {
  code: string;
  message: string;
  orderId: string;
} 