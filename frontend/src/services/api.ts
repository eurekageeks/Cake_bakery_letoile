import axios, { AxiosError } from 'axios';
import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import type { ApiResponse, HealthCheckData } from '../types/api';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request Interceptor: Attach JWT Token if available
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('bakery_access_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Format errors consistently
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiResponse>) => {
    if (error.response?.status === 401) {
      // Auto logout / token expiration handler
      localStorage.removeItem('bakery_access_token');
    }
    const errorMessage =
      error.response?.data?.message || error.message || 'An unexpected error occurred. Please try again.';
    return Promise.reject(new Error(errorMessage));
  }
);

export const systemService = {
  getHealth: async (): Promise<ApiResponse<HealthCheckData>> => {
    const response = await apiClient.get<ApiResponse<HealthCheckData>>('/health');
    return response.data;
  },
};

export default apiClient;
