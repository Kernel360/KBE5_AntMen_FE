export interface User {
    userId: number;
    userLoginId: string;
    userName: string;
    userTel: string;
    userEmail: string;
    userRole: 'CUSTOMER' | 'MANAGER' | 'ADMIN';
    userGender: string;
    userBirth: string;
    userProfile: string;
    userType: string;
    userCreatedAt: string;
}

// 관리자 관련 타입 추가
export interface AdminLoginRequest {
    userLoginId: string;
    userPassword: string;
}

export interface AdminLoginResponse {
    accessToken: string;
    expiresIn: number;
    initialPassword: boolean;
}

export interface AdminChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export interface Admin {
    id: number;
}

export interface BoardRequestDto {
    boardTitle: string;
    boardContent: string;
    boardIsPinned: boolean;
    boardReservatedAt?: string; // ISO string format
    boardType: string; // 'customer-notice' | 'manager-notice'
}

// 매칭 전 예약 관련 타입
export interface ReservationMatchingListDto {
    reservationId: number;
    customerId: number;
    customerName: string;
    categoryName: string;
    reservationCreatedAt: string;
    reservationDate: string;
    reservationTime: string;
    totalRequests: number;
    totalManagerResponses: number;
    totalManagerAccepts: number;
    matchingStatus: 'ing' | 'fail' | 'nothing';
}

// 예약 취소 요청 타입
export interface ReservationCancelRequest {
    status: string;
    reason: string;
}

// 예약 취소 응답 타입
export interface ReservationCancelResponse {
    success: boolean;
    message: string;
    refundAmount?: number;
}

// 통계 정보 타입
export interface ReservationStats {
    status: 'ing' | 'fail' | 'nothing';
    count: number;
}

// 통합 응답 타입
export interface ReservationMatchingResponse {
    stats: ReservationStats[];
    reservations: ReservationMatchingListDto[];
}

export interface MatchingRequest {
    id: string;
    status: 'pending' | 'failed' | 'matched';
    requestedAt: string;
    candidateCount: number;
    reason: string;
    managerIds: string[];
    matchedManagerId?: string;
}

export interface ManualMatchingRequest {
    reservationId: string;
    managerIds: string[];
    matchingType: 'auto' | 'manual';
}

// 일일 매출 응답 타입
export interface AdminDailySaleResponseDto {
    dailyDate: string;        // LocalDate -> ISO string format (YYYY-MM-DD)
    dailySales: number;       // 일일 매출
    dailyFee: number;         // 일일 비용
    dailyProfit: number;      // 일일 순이익
}

// 매출 응답 타입
export interface AdminSalesSummaryResponseDto {
    totalSales: number;                 // 총 매출
    currentMonthSales: number;          // 이번달 매출
    averageDailySales: number;          // 일간 평균 매출

    totalProfit: number;                // 총 순이익
    currentMonthProfit: number;         // 이번달 순이익
    averageDailyProfit: number;         // 일간 평균 순이익

    recentWeeklySalesProfit: AdminDailySaleResponseDto[];  // 최근 주간 매출/순이익 데이터
}

// 환불 응답 타입
export interface AdminRefundResponseDto {
    payId: number;                      // 결제 ID
    userId: number;                     // 사용자 ID
    userName: string;                   // 사용자명
    userLoginId: string;                // 사용자 로그인 ID
    reservationId: number;              // 예약 ID
    refundAmount: number;               // 환불 금액
    refundReason: string;               // 환불 사유
    payMethod: string;                  // 결제 방법 (CARD, BANK 등)
    refundStatus: string;               // 환불 상태 (WAITING, APPROVED, REJECTED 등)
    refundCreatedAt: string;            // 환불 요청 생성일 (ISO string)
    refundProcessedAt: string | null;   // 환불 처리일 (ISO string or null)
}

// 환불 통계 응답 타입
export interface AdminRefundStatisticsResponseDto {
    refundRate: number;                 // 환불률 (%)
    totalRefundCount: number;           // 총 환불 건수
    approveRefundCount: number;         // 승인된 환불 건수
    totalRefundAmount: number;          // 총 환불 금액
}

// 정산 관련 타입
export interface AdminCalculationItemDto {
    calculationId: number;              // 정산 ID
    managerId: number;                  // 매니저 ID
    managerName: string;                // 매니저명
    startDate: string;                  // 시작일 (YYYY-MM-DD)
    endDate: string;                    // 종료일 (YYYY-MM-DD)
    amount: number;                     // 정산 금액
    requestedAt: string;                // 요청일 (ISO string)
}

export interface AdminCalculationResponseDto {
    totalAmount: number;                // 총 정산 금액
    currentMonthAmount: number;         // 이번 달 정산
    currentWeekAmount: number;          // 지난주 정산
    calculationCount: number;           // 정산 완료 건수
    recentMonthCalculations: AdminCalculationItemDto[];  // 최근 정산 내역
}

// 정산 상세보기 관련 타입
export interface AdminCalculationReservationDto {
    reservationId: number;              // 예약 ID
    reservationDate: string;            // 예약일 (YYYY-MM-DD)
    categoryName: string;               // 카테고리명
    optionNames: string[];              // 옵션명 리스트
    reservationAmount: number;          // 예약 금액
}

export interface AdminCalculationDetailDto {
    calculationId: number;              // 정산 ID
    startDate: string;                  // 시작일 (YYYY-MM-DD)
    endDate: string;                    // 종료일 (YYYY-MM-DD)
    requestedAt: string;                // 요청일 (ISO string)
    amount: number;                     // 정산 금액
    managerId: number;                  // 매니저 ID
    managerName: string;                // 매니저명
    managerLoginId: string;             // 매니저 로그인 ID
    totalReservationCount: number;      // 총 예약 건수
    totalReservationAmount: number;     // 총 예약 금액
    reservations: AdminCalculationReservationDto[];  // 예약 목록
}

// 카테고리 관련 타입
export interface CategoryDto {
    categoryId: number;                 // 카테고리 ID
    categoryName: string;               // 카테고리명
    categoryPrice: number;              // 기본 가격
    categoryTime: number;               // 소요 시간 (시간)
}

export interface CategoryRequestDto {
    categoryName: string;               // 카테고리명
    categoryPrice: number;              // 기본 가격
    categoryTime: number;               // 소요 시간 (시간)
}

// 카테고리 옵션 관련 타입
export interface CategoryOptionDto {
    categoryId: number;                 // 소속 카테고리 ID
    coId: number;                       // 옵션 ID
    coName: string;                     // 옵션명
    coPrice: number;                    // 추가 가격
    coTime: number;                     // 추가 시간 (분)
}

export interface CategoryOptionRequestDto {
    categoryId: number;                 // 소속 카테고리 ID
    coName: string;                     // 옵션명
    coPrice: number;                    // 추가 가격
    coTime: number;                     // 추가 시간 (분)
}