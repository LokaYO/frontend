import { apiClient } from './api.client';
import { PresetTemplate } from '../templates/presetTemplates';

export const templateService = {
  async getTemplates(): Promise<PresetTemplate[]> {
    const data = await apiClient.get<{ templates: PresetTemplate[] }>('/api/templates');
    return data.templates || [];
  },
};

