import { apiClient } from './api.client';
import { Section } from '../types/schema';

export const sectionService = {
  async addSection(websiteId: string, type: string, content: any): Promise<Section> {
    const data = await apiClient.post<{ success: boolean; section: Section }>(
      `/api/websites/${websiteId}/sections`,
      { type, content }
    );
    return data.section;
  },

  async updateSection(websiteId: string, sectionId: string, content: any): Promise<{ success: boolean; message: string }> {
    return apiClient.put(`/api/websites/${websiteId}/sections/${sectionId}`, { content });
  },

  async deleteSection(websiteId: string, sectionId: string): Promise<{ success: boolean; message: string }> {
    return apiClient.delete(`/api/websites/${websiteId}/sections/${sectionId}`);
  },

  async reorderSections(websiteId: string, sectionIds: string[]): Promise<{ success: boolean; message: string }> {
    return apiClient.put(`/api/websites/${websiteId}/sections/reorder`, { sectionIds });
  },
};

