export type UserGender = 'M' | 'W';

export interface ManagerIdFileDto {
  fileId: number;
  fileUrl: string;
}

export type ManagerStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface BaseProfile {
  userId: number;
  userName: string;
  userTel: string;
  userEmail: string;
  userGender: string;
  userBirth: string;
  userProfile: string;
  userType: string;
}

export interface CustomerProfile extends BaseProfile {
  customerPoint: number;
}

export interface ManagerProfile extends BaseProfile {
  managerAddress: string;
  managerLatitude: number;
  managerLongitude: number;
  managerTime: string;
  managerFileUrls: ManagerIdFileDto[];
  managerStatus: ManagerStatus;
}

export type UserProfile = CustomerProfile | ManagerProfile;

// 성별 표시값과 실제값 매핑
export const GENDER_DISPLAY_MAP = {
  '남성': 'M',
  '여성': 'W'
} as const;

export const GENDER_VALUE_MAP = {
  'M': '남성',
  'W': '여성'
} as const; 