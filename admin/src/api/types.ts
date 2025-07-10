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

// 매출 요약 응답 타입
export interface AdminSalesSummaryResponseDto {
    totalSales: number;                 // 총 매출
    currentMonthSales: number;          // 이번달 매출
    averageDailySales: number;          // 일간 평균 매출
    
    totalProfit: number;                // 총 순이익
    currentMonthProfit: number;         // 이번달 순이익
    averageDailyProfit: number;         // 일간 평균 순이익
    
    recentWeeklySalesProfit: AdminDailySaleResponseDto[];  // 최근 주간 매출/순이익 데이터
} 