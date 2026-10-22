import { apiClient } from './api.client';
import { BusinessInfo } from '../types/schema';

export const aiService = {
  async generateWebsite(businessInfo: BusinessInfo): Promise<{ success: boolean; data: any }> {
    return apiClient.post('/api/ai/generate-website', businessInfo);
  },
};

