import { apiClient } from './api';
import type { ApiResponse } from '../types/api';
import type { LoginCredentials, RegisterCredentials, TokenResponse, User } from '../types/user';

export interface RegisterResult {
  is_approved: boolean;
  message: string;
  user?: User;
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<TokenResponse> => {
    const response = await apiClient.post<ApiResponse<TokenResponse>>('/auth/login', credentials);
    if (response.data.data) {
      localStorage.setItem('bakery_access_token', response.data.data.access_token);
      return response.data.data;
    }
    throw new Error(response.data.message || 'Login failed');
  },

  loginWithGoogle: async (idToken: string): Promise<TokenResponse> => {
    const response = await apiClient.post<ApiResponse<TokenResponse>>('/auth/google', { id_token: idToken });
    if (response.data.data) {
      localStorage.setItem('bakery_access_token', response.data.data.access_token);
      return response.data.data;
    }
    throw new Error(response.data.message || 'Google Login failed');
  },

  register: async (credentials: RegisterCredentials): Promise<RegisterResult> => {
    const response = await apiClient.post<ApiResponse<RegisterResult>>('/auth/register', credentials);
    if (response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Registration failed');
  },

  getMe: async (): Promise<User> => {
    const response = await apiClient.get<ApiResponse<User>>('/auth/me');
    if (response.data.data) {
      return response.data.data;
    }
    throw new Error('Could not fetch user profile');
  },

  logout: () => {
    localStorage.removeItem('bakery_access_token');
  },
};
