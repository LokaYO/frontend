import { apiClient } from './api.client';
import { User } from '../types/schema';

export interface AuthResponse {
  token: string;
  user: User;
}

export const authService = {
  async register(name: string, email: string, password: string): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/api/auth/register', { name, email, password });
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/api/auth/login', { email, password });
  },

  async getMe(token?: string): Promise<{ user: User }> {
    return apiClient.get<{ user: User }>('/api/auth/me', { token });
  },

  async logout(token?: string): Promise<{ success: boolean; message: string }> {
    return apiClient.post<{ success: boolean; message: string }>('/api/auth/logout', {}, { token });
  },
};

