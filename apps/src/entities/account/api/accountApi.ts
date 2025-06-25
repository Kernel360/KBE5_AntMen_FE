import { customFetch } from '@/shared/api/base';
import type { UserProfile, UserGender } from '../model/types';

const MANAGER_BASE_URL = 'http://localhost:9092/v1/manager';
const CUSTOMER_BASE_URL = 'http://localhost:9091/customers';

// 매니저용 API 함수들
export const managerApi = {
  getProfile: () => 
    customFetch<UserProfile>(`${MANAGER_BASE_URL}/me`),

  updateProfile: (data: {
    userName: string;
    userTel: string;
    userEmail: string;
    userBirth: string;
    userGender: UserGender;
    userProfile: string;
  }) =>
    customFetch<UserProfile>(`${MANAGER_BASE_URL}/me`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  updateProfileImage: async (imageFile: File) => {
    const formData = new FormData();
    formData.append('userProfile', imageFile);
    
    const response = await fetch(`${MANAGER_BASE_URL}/me/profile`, {
      method: 'PUT',
      body: formData,
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to upload profile image');
    }
  },
};

// 수요자용 API 함수들
export const customerApi = {
  getProfile: () => 
    customFetch<UserProfile>(`${CUSTOMER_BASE_URL}/me`),

  updateProfile: (data: {
    userName: string;
    userTel: string;
    userEmail: string;
    userBirth: string;
    userGender: UserGender;
    userProfile: string;
  }) =>
    customFetch<UserProfile>(`${CUSTOMER_BASE_URL}/me`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  updateProfileImage: async (imageFile: File) => {
    const formData = new FormData();
    formData.append('userProfile', imageFile);
    
    const response = await fetch(`${CUSTOMER_BASE_URL}/me/profile`, {
      method: 'PUT',
      body: formData,
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to upload profile image');
    }
  },
}; 