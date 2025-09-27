import { apiRequest, handleApiError, BaseResponse } from './apiUtils';

export interface DashboardStats {
  smokeFreeTime: number;
  level: number;
  moneySaved: number;
  cigarettesAvoided: number;
  daysSmokeFree: number;
}

export interface DashboardUser {
  id: string;
  email: string;
  displayName: string;
  auraScore: number;
  cigarettesAvoided: number;
  totalMoneySaved: number;
  onboardingCompleted: boolean;
  smokingHistory?: {
    yearsSmoked: number;
    cigarettesPerDay: number;
    costPerCigarette: number;
    motivations: string[];
  };
  streakStartTime?: string;
  lastSmoked?: string;
  createdAt: string;
  updatedAt: string;
  stats: DashboardStats;
}

export interface DashboardResponse extends BaseResponse {
  data?: DashboardUser;
}

export const dashboardAPI = {
  getStats: async (): Promise<DashboardResponse> => {
    try {
      const response = await apiRequest('/dashboard/stats', {
        method: 'GET',
      }, true, 'DASHBOARD');

      return {
        success: response.success,
        data: response.data,
      };
    } catch (error: any) {
      return handleApiError(error, 'Failed to fetch dashboard stats');
    }
  },
};
