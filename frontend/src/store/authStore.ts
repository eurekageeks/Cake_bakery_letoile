import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '../services/auth.service';
import type { LoginCredentials, RegisterCredentials, User } from '../types/user';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<{ is_approved: boolean; message: string }>;
  logout: () => void;
  quickDemoLogin: (role: 'admin' | 'customer') => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // Clean initial state: no default customer pre-logged in
      user: null,
      token: null,
      isAuthenticated: false,
      isAdmin: false,
      isLoading: false,
      error: null,

      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const data = await authService.login(credentials);
          set({
            user: data.user,
            token: data.access_token,
            isAuthenticated: true,
            isAdmin: data.user.role === 'ADMIN' || data.user.role === 'SUPER_ADMIN',
            isLoading: false,
          });
        } catch (err: any) {
          set({
            error: err.message || 'Login failed. Please check your credentials.',
            isLoading: false,
          });
          throw err;
        }
      },

      register: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.register(credentials);
          set({ isLoading: false });
          return response;
        } catch (err: any) {
          set({
            error: err.message || 'Registration failed. Please try again.',
            isLoading: false,
          });
          throw err;
        }
      },

      logout: () => {
        authService.logout();
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isAdmin: false,
        });
      },

      quickDemoLogin: async (role: 'admin' | 'customer') => {
        if (role === 'admin') {
          await useAuthStore.getState().login({ email: 'admin@letoile.com', password: 'admin123' });
        } else {
          await useAuthStore.getState().login({ email: 'customer@letoile.com', password: 'customer123' });
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'letoile_auth_session_v2',
    }
  )
);
