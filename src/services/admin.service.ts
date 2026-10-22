import { apiClient } from './api.client';

export interface MonitoringUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'support' | 'user';
  lastLoginAt: string | null;
  createdAt: string;
  totalWebsites: number;
  publishedWebsites: number;
  isCurrentlyOnline: boolean;
  lastDeviceInfo: string | null;
  lastIpAddress: string | null;
}

export interface PlatformStats {
  totalUsers: number;
  totalAdmins: number;
  totalSupports: number;
  totalWebsites: number;
  totalPublished: number;
}

export interface AdminSection {
  id: string;
  type: string;
  content: Record<string, any>;
  position: number;
  created_at: string;
  updated_at: string;
}

export interface AdminWebsite {
  id: string;
  name: string;
  slug: string;
  status: string;
  template: string | null;
  businessInfo: {
    name?: string;
    category?: string;
    phone?: string;
    address?: string;
    description?: string;
    [key: string]: any;
  };
  theme: {
    primaryColor?: string;
    backgroundColor?: string;
    [key: string]: any;
  };
  createdAt: string;
  updatedAt: string;
  sectionCount: number;
  sections: AdminSection[];
}

export interface AdminActiveSession {
  token: string;
  ip_address: string | null;
  user_agent: string | null;
  expires_at: string;
  created_at: string;
}

export interface UserDetails {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    last_login_at: string | null;
    created_at: string;
  };
  websites: AdminWebsite[];
  activeSessions: AdminActiveSession[];
}

export const adminService = {
  async getMonitoringUsers(): Promise<MonitoringUser[]> {
    const data = await apiClient.get<{ users: MonitoringUser[] }>('/api/admin/users');
    return data.users || [];
  },

  async getUserDetails(userId: string): Promise<UserDetails> {
    return apiClient.get<UserDetails>(`/api/admin/users/${userId}`);
  },

  async updateUserRole(userId: string, role: 'admin' | 'support' | 'user'): Promise<{ success: boolean; message: string }> {
    return apiClient.put(`/api/admin/users/${userId}/role`, { role });
  },

  async deleteUser(userId: string): Promise<{ success: boolean; message: string }> {
    return apiClient.delete(`/api/admin/users/${userId}`);
  },

  async getStats(): Promise<PlatformStats> {
    const data = await apiClient.get<{ stats: PlatformStats }>('/api/admin/stats');
    return data.stats;
  },
};
