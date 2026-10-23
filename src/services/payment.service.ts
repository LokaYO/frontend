import { apiClient } from './api.client';

export interface PlanPricingItem {
  id: 'pro_monthly' | 'pro_yearly';
  name: string;
  price: number;
  durationDays: number;
  features: string[];
}

export interface SnapTransactionResponse {
  orderId: string;
  token: string;
  redirectUrl: string;
  plan: PlanPricingItem;
  clientKey: string;
}

export interface UserSubscriptionStatus {
  plan: 'free' | 'pro';
  subscriptionUntil: string | null;
  isPro: boolean;
}

export interface TransactionHistoryItem {
  id: string;
  orderId: string;
  planType: string;
  amount: number;
  status: 'pending' | 'settlement' | 'cancel' | 'expire' | 'deny';
  paymentType: string | null;
  createdAt: string;
}

export const paymentService = {
  /**
   * Request Snap Token dari backend untuk memunculkan Midtrans popup
   */
  async createSnapToken(planType: 'pro_monthly' | 'pro_yearly'): Promise<SnapTransactionResponse> {
    return apiClient.post<SnapTransactionResponse>('/api/payments/snap-token', { planType });
  },

  /**
   * Mengambil status paket pengguna saat ini
   */
  async getSubscription(): Promise<UserSubscriptionStatus> {
    return apiClient.get<UserSubscriptionStatus>('/api/payments/subscription');
  },

  /**
   * Mengambil riwayat transaksi pembayaran
   */
  async getTransactions(): Promise<{ transactions: TransactionHistoryItem[] }> {
    return apiClient.get<{ transactions: TransactionHistoryItem[] }>('/api/payments/transactions');
  },

  /**
   * Simulator Sukses Sandbox (Untuk Demo Praktis & Testing Kuliah)
   */
  async simulateSuccess(orderId: string): Promise<{ success: boolean; message: string; plan: 'pro' }> {
    return apiClient.post('/api/payments/simulate-sandbox', { orderId });
  },

  /**
   * Verifikasi status transaksi dari Midtrans & sinkronisasi otomatis ke database
   */
  async verifyPayment(orderId: string): Promise<{ success: boolean; plan: 'free' | 'pro'; user: any }> {
    return apiClient.post(`/api/payments/verify/${orderId}`);
  },
};

