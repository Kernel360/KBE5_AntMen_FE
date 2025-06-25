export type UserGender = 'M' | 'W';

export interface UserProfile {
  userId: number;
  userName: string;
  userTel: string;
  userEmail: string;
  userGender: string;  // "남성" | "여성" 형태로 옴
  userBirth: string;
  userProfile: string;
  customerPoint: number;
}

// 성별 표시값과 실제값 매핑
export const GENDER_DISPLAY_MAP = {
  '남성': 'M',
  '여성': 'W'
} as const;

export const GENDER_VALUE_MAP = {
  'M': '남성',
  'W': '여성'
} as const; 