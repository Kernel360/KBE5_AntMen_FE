import { customFetch } from './base';
import { API_CONFIG } from './config';

export interface LoginRequest {
  userLoginId: string;
  userPassword: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: number;
    loginId: string;
    name: string;
    role: string;
  };
}

export interface GoogleLoginRequest {
  code: string;
  timestamp: string;
}

export const authApi = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    return customFetch<LoginResponse>(`${API_CONFIG.REMOTE.ENDPOINTS.AUTH}/login`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  googleLogin: async (data: GoogleLoginRequest): Promise<LoginResponse> => {
    return customFetch<LoginResponse>(`${API_CONFIG.REMOTE.ENDPOINTS.AUTH}/google/login`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  logout: async (): Promise<void> => {
    return customFetch<void>(`${API_CONFIG.REMOTE.ENDPOINTS.AUTH}/logout`, {
      method: 'POST',
    });
  },

  refreshToken: async (refreshToken: string): Promise<LoginResponse> => {
    return customFetch<LoginResponse>(`${API_CONFIG.REMOTE.ENDPOINTS.AUTH}/refresh`, {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  },
}; 