import { apiClient } from './api.client';
import { Website } from '../types/schema';

export interface CreateWebsiteDto {
  name: string;
  templateId?: string;
  businessInfo?: any;
  theme?: any;
  sections?: any[];
}

export interface UpdateWebsiteDto {
  name?: string;
  slug?: string;
  theme?: any;
  businessInfo?: any;
}

export const websiteService = {
  async getWebsites(): Promise<Website[]> {
    const data = await apiClient.get<{ websites: Website[] }>('/api/websites');
    return data.websites || [];
  },

  async getWebsiteById(id: string): Promise<Website> {
    const data = await apiClient.get<{ website: Website }>(`/api/websites/${id}`);
    return data.website;
  },

  async createWebsite(dto: CreateWebsiteDto): Promise<{ success: boolean; websiteId: string; slug: string }> {
    return apiClient.post('/api/websites', dto);
  },

  async updateWebsite(id: string, dto: UpdateWebsiteDto): Promise<{ success: boolean; message: string; slug?: string }> {
    return apiClient.put(`/api/websites/${id}`, dto);
  },

  async deleteWebsite(id: string): Promise<{ success: boolean; message: string }> {
    return apiClient.delete(`/api/websites/${id}`);
  },

  async publishWebsite(id: string): Promise<{ success: boolean; status: string; slug: string }> {
    return apiClient.post(`/api/websites/${id}/publish`);
  },

  async unpublishWebsite(id: string): Promise<{ success: boolean; status: string }> {
    return apiClient.post(`/api/websites/${id}/unpublish`);
  },

  async getPublicWebsite(slug: string): Promise<Website> {
    const data = await apiClient.get<{ website: Website }>(`/api/public/sites/${slug}`);
    return data.website;
  },

  async duplicateWebsite(id: string): Promise<{ success: boolean; websiteId: string; slug: string; name: string }> {
    return apiClient.post(`/api/websites/${id}/duplicate`);
  },

  async getAllUserLeads(): Promise<any[]> {
    const data = await apiClient.get<{ leads: any[] }>('/api/websites/user/all-leads');
    return data.leads || [];
  },

  async getWebsiteLeads(websiteId: string): Promise<any[]> {
    const data = await apiClient.get<{ leads: any[] }>(`/api/websites/${websiteId}/leads`);
    return data.leads || [];
  },

  async markLeadRead(websiteId: string, leadId: string): Promise<{ success: boolean }> {
    return apiClient.patch(`/api/websites/${websiteId}/leads/${leadId}/read`);
  },

  async deleteLead(websiteId: string, leadId: string): Promise<{ success: boolean }> {
    return apiClient.delete(`/api/websites/${websiteId}/leads/${leadId}`);
  },

  async submitPublicLead(slug: string, leadData: { name: string; phone: string; message: string; serviceInterest?: string }): Promise<{ success: boolean; message: string; leadId: string }> {
    return apiClient.post(`/api/public/sites/${slug}/leads`, leadData);
  },
};

