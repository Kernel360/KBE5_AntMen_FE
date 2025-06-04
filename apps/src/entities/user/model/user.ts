// 사용자 타입 정의
export interface User {
    user_id: number;
    user_birth: string; // YYYY-MM-DD 형식
    user_created_at: string;
    user_email: string;
    user_gender: 'M' | 'W'; // enum('M','W')
    user_login_id: string;
    user_name: string;
    user_password: string;
    user_profile?: string; // 프로필 이미지 경로
    user_role: 'ADMIN' | 'CUSTOMER' | 'MANAGER';
    user_tel?: string;
    user_type: string;
}