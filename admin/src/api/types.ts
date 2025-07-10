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
    reservationDate: string;
    reservationTime: string;
    totalRequests: number;
    totalManagerResponses: number;
    totalManagerAccepts: number;
    matchingStatus: 'ing' | 'fail' | 'nothing';
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