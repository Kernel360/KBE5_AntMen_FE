export type MatchingRequestType = 'oneTime' | 'regular'
export type MatchingRequestStatus = 'pending' | 'accepted' | 'rejected'
export type MatchingFilterTab = 'all' | 'oneTime' | 'regular'
export type UserGender = 'M' | 'W'

export interface MatchingRequest {
  id: string

  // 카드 표시용 핵심 정보
  categoryName: string // '대청소', '사무실 청소', '부분 청소' 등
  reservationDate: string
  reservationTime: string
  reservationDuration: number // 기본 시간
  additionalDuration: number // 추가 시간
  reservationAmount: number // 총 금액
  location: {
    district: string // 카드에는 구만 표시
  }
  type: MatchingRequestType
  status: MatchingRequestStatus

  // 상세페이지용 추가 정보 (선택사항)
  reservationId?: string
  customerId?: number
  reservationCreatedAt?: string
  categoryId?: number
  reservationMemo?: string
  location_full?: {
    address: string
  }
  baseAmount?: number
  additionalAmount?: number
  optionIds?: number[]
  optionNames?: string[]
  priority?: number
  createdAt?: string
}

export interface ReservationHistoryDto {
  reservationId: number
  categoryName: string
  reservationStatus: string
  reservationDate: string
  totalDuration: number
  totalAmount: number
  reservationMemo: string
  customer: UserSummaryDto
  manager: UserSummaryDto
  address: string
  selectedOptions: string[]
  matchings: MatchingDto[]
}

export interface UserSummaryDto {
  userId: number
  name: string
  gender: UserGender // 'M' | 'W'
  age: number
  profileImage: string
}

export interface MatchingDto {
  matchingId: number
  priority: number
  isRequested: boolean
  isAccepted: boolean
  isFinal: boolean
  refuseReason: string
  manager: UserSummaryDto
}

export interface MatchingResponseRequestDto {
  matchingIsFinal: boolean
  matchingRefuseReason?: string
}

// 페이징된 응답을 위한 타입 추가
export interface PageableResponse<T> {
  totalPages: number
  totalElements: number
  first: boolean
  last: boolean
  size: number
  content: T[]
  number: number
  sort: {
    empty: boolean
    sorted: boolean
    unsorted: boolean
  }
  pageable: {
    pageNumber: number
    pageSize: number
    sort: {
      empty: boolean
      sorted: boolean
      unsorted: boolean
    }
    offset: number
    paged: boolean
    unpaged: boolean
  }
  numberOfElements: number
  empty: boolean
}

export type PaginatedMatchingResponse = PageableResponse<ReservationHistoryDto>

// 추천 매니저 리스트 조회 API 관련 타입들
export interface MatchingRequestDto {
  reservationDate: string        // 예약 날짜 (YYYY-MM-DD)
  reservationTime: string        // 예약 시작 시간 (HH:mm)
  reservationDuration: number    // 예약 소요 시간 (시간 단위)
  addressId: number              // 고객 주소 ID
}

export interface MatchingManagerListResponseDto {
  managerId: number
  managerName: string
  managerGender: string
  managerAge: number
  managerComment: string
  managerRating: number
  managerImage: string
}

export type SortType = 'distance' | 'recent'