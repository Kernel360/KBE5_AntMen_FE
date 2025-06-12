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