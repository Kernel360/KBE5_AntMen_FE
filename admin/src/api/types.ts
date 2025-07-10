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

// 일일 매출 응답 타입
export interface AdminDailySaleResponseDto {
    dailyDate: string;        // LocalDate -> ISO string format (YYYY-MM-DD)
    dailySales: number;       // 일일 매출
    dailyFee: number;         // 일일 수수료
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