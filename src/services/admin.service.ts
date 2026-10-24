import { apiClient } from './api.client';

export interface MonitoringUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'support' | 'user';
  plan: 'free' | 'pro';
  subscriptionUntil: string | null;
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
    plan?: 'free' | 'pro';
    subscription_until?: string | null;
    last_login_at: string | null;
    created_at: string;
  };
  websites: AdminWebsite[];
  activeSessions: AdminActiveSession[];
}

export interface AdminModerationWebsite {
  id: string;
  userId: string;
  ownerName: string;
  ownerEmail: string;
  ownerPlan?: 'free' | 'pro';
  name: string;
  slug: string;
  status: 'draft' | 'published' | 'suspended';
  template: string | null;
  suspendReason: string | null;
  viewsCount: number;
  whatsappClicksCount: number;
  createdAt: string;
  updatedAt: string;
  sectionCount: number;
}

export interface AdminAnnouncement {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'alert';
  isActive: boolean;
  createdBy: string | null;
  authorName?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuditLogItem {
  id: string;
  userId?: string | null;
  userName?: string | null;
  userEmail?: string | null;
  action: string;
  details: Record<string, any>;
  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt: string;
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

  async updateUserPlan(
    userId: string,
    plan: 'free' | 'pro',
    durationDays: number = 30
  ): Promise<{ success: boolean; message: string }> {
    return apiClient.put(`/api/admin/users/${userId}/plan`, { plan, durationDays });
  },

  async deleteUser(userId: string): Promise<{ success: boolean; message: string }> {
    return apiClient.delete(`/api/admin/users/${userId}`);
  },

  async getStats(): Promise<PlatformStats> {
    const data = await apiClient.get<{ stats: PlatformStats }>('/api/admin/stats');
    return data.stats;
  },

  // Moderasi Konten & Suspend Website
  async getModerationWebsites(): Promise<AdminModerationWebsite[]> {
    const data = await apiClient.get<{ websites: AdminModerationWebsite[] }>('/api/admin/websites');
    return data.websites || [];
  },

  async suspendWebsite(websiteId: string, reason: string): Promise<{ success: boolean; message: string }> {
    return apiClient.post(`/api/admin/websites/${websiteId}/suspend`, { reason });
  },

  async unsuspendWebsite(websiteId: string): Promise<{ success: boolean; message: string }> {
    return apiClient.post(`/api/admin/websites/${websiteId}/unsuspend`, {});
  },

  // Broadcast Pengumuman Sistem
  async getAnnouncements(): Promise<AdminAnnouncement[]> {
    const data = await apiClient.get<{ announcements: AdminAnnouncement[] }>('/api/admin/announcements');
    return data.announcements || [];
  },

  async getActiveAnnouncements(): Promise<AdminAnnouncement[]> {
    const data = await apiClient.get<{ announcements: AdminAnnouncement[] }>('/api/announcements/active');
    return data.announcements || [];
  },

  async createAnnouncement(params: {
    title: string;
    message: string;
    type: 'info' | 'warning' | 'success' | 'alert';
  }): Promise<{ announcement: AdminAnnouncement }> {
    return apiClient.post('/api/admin/announcements', params);
  },

  async toggleAnnouncement(id: string): Promise<{ success: boolean; isActive: boolean }> {
    return apiClient.patch(`/api/admin/announcements/${id}/toggle`, {});
  },

  async deleteAnnouncement(id: string): Promise<{ success: boolean; message: string }> {
    return apiClient.delete(`/api/admin/announcements/${id}`);
  },

  // Log Aktivitas Sistem (Audit Trail)
  async getAuditLogs(params?: { limit?: number; offset?: number; action?: string }): Promise<{
    logs: AuditLogItem[];
    total: number;
  }> {
    const q = new URLSearchParams();
    if (params?.limit) q.set('limit', String(params.limit));
    if (params?.offset) q.set('offset', String(params.offset));
    if (params?.action) q.set('action', params.action);
    const qs = q.toString() ? `?${q.toString()}` : '';
    return apiClient.get(`/api/admin/audit-logs${qs}`);
  },
};
