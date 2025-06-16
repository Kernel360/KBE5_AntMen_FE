export type MatchingRequestType = 'oneTime' | 'regular';
export type MatchingRequestStatus = 'pending' | 'accepted' | 'rejected';

export interface MatchingRequest {
  id: string;
  
  // 카드 표시용 핵심 정보
  categoryName: string; // '대청소', '사무실 청소', '부분 청소' 등
  reservationDate: string;
  reservationTime: string;
  reservationDuration: number; // 기본 시간
  additionalDuration: number; // 추가 시간
  reservationAmount: number; // 총 금액
  location: {
    district: string; // 카드에는 구만 표시
  };
  type: MatchingRequestType;
  status: MatchingRequestStatus;
  
  // 상세페이지용 추가 정보 (선택사항)
  reservationId?: string;
  customerId?: number;
  reservationCreatedAt?: string;
  categoryId?: number;
  reservationMemo?: string;
  location_full?: {
    address: string;
  };
  baseAmount?: number;
  additionalAmount?: number;
  optionIds?: number[];
  optionNames?: string[];
  priority?: number;
  createdAt?: string;
  customer: MatchingManager;
  manager: MatchingManager;
  address: string;
  selectedOptions: string[];
  matchings: Matching[];
}

export interface ReservationResponse {
  reservationId: number;
  customerId: number;
  reservationCreatedAt: string; // ISO string
  reservationDate: string; // ISO string (yyyy-MM-dd)
  reservationTime: string; // ISO string (HH:mm:ss)
  categoryId: number;
  categoryName: string;
  recommendDuration: number;
  reservationDuration: number;
  managerId: number;
  managerName: string;
  matchedAt: string; // ISO string
  reservationStatus: string;
  reservationCancelReason: string;
  reservationMemo: string;
  reservationAmount: number;
  optionIds: number[];
  optionNames: string[];
}

export interface MatchingRequestResponse {
  // 기존 MatchingRequest 필드들 (필요시 추가)
  reservation: ReservationResponse;
  // 기타 필요한 필드 추가 가능
}

export interface MatchingManager {
  managerId: number;
  managerName: string;
  managerGender: string;
  managerAge: number;
  managerComment: string;
  managerRating: number;
  managerImage: string;
}

export interface Matching {
  matchingId: number;
  priority: number;
  isRequested: boolean;
  isAccepted: boolean;
  isFinal: boolean;
  refuseReason: string;
  manager: MatchingManager;
}

export type MatchingFilterTab = 'all' | 'oneTime' | 'regular'; 