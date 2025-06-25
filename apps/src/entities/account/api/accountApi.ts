import { customFetch } from '@/shared/api/base';
import type { UserProfile, UserGender } from '../model/types';

const BASE_URL = 'http://localhost:9091/customers';

export const accountApi = {
  getProfile: () => 
    customFetch<UserProfile>(`${BASE_URL}/me`),

  updateProfile: (data: {
    userName: string;
    userTel: string;
    userEmail: string;
    userBirth: string;
    userGender: UserGender;
    userProfile: string;
  }) =>
    customFetch<UserProfile>(`${BASE_URL}/me`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  updateProfileImage: async (imageFile: File) => {
    const formData = new FormData();
    formData.append('userProfile', imageFile);
    
    const response = await fetch(`${BASE_URL}/me/profile`, {
      method: 'PUT',
      body: formData,
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to upload profile image');
    }
  },
}; 