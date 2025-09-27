import { AuthFormData, AuthResponse } from '../types';
import { apiRequest, handleApiError } from './apiUtils';

export const authAPI = {
  register: async (userData: AuthFormData): Promise<AuthResponse> => {
    try {
      const response = await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          displayName: userData.displayName,
          email: userData.email,
          password: userData.password,
          confirmPassword: userData.confirmPassword,
        }),
      }, false, 'AUTH');
      if (response.success && response.token && response.user) {
        const { storage } = await import('../utils/storage');
        await storage.setAuthToken(response.token);
        await storage.setOnboardingCompleted(response.user.onboardingCompleted);
      }

      return response;
    } catch (error: any) {
      return handleApiError(error, 'Registration failed');
    }
  },

  login: async (credentials: Pick<AuthFormData, 'email' | 'password'>): Promise<AuthResponse> => {
    try {
      const response = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
        }),
      }, false, 'AUTH');
      if (response.success && response.token && response.user) {
        const { storage } = await import('../utils/storage');
        await storage.setAuthToken(response.token);
        // Save onboarding status from backend
        await storage.setOnboardingCompleted(response.user.onboardingCompleted);
      }

      return response;
    } catch (error: any) {
      return handleApiError(error, 'Login failed');
    }
  },
  getProfile: async (): Promise<any> => {
    try {
      return await apiRequest('/auth/profile', {
        method: 'GET',
      }, true, 'AUTH');
    } catch (error: any) {
      return handleApiError(error, 'Failed to fetch profile');
    }
  },

  verifyToken: async (): Promise<AuthResponse> => {
    try {
      const response = await apiRequest('/auth/verify', {
        method: 'GET',
      }, true, 'AUTH');
      
      if (response.success && response.user) {
        const { storage } = await import('../utils/storage');
        // Sync onboarding status from backend
        await storage.setOnboardingCompleted(response.user.onboardingCompleted);
      }
      
      return response;
    } catch (error: any) {
      return handleApiError(error, 'Token verification failed');
    }
  },
  logout: async (): Promise<void> => {
    try {
      const { storage } = await import('../utils/storage');
      await storage.removeItem('aurashift_auth_token');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  },
};
export const onboardingAPI = {
  completeOnboarding: async (onboardingData: {
    yearsSmoked: number;
    cigarettesPerDay: number;
    costPerCigarette: number;
    motivations: string[];
  }): Promise<any> => {
    try {
      return await apiRequest('/onboarding/complete', {
        method: 'POST',
        body: JSON.stringify(onboardingData),
      }, true, 'ONBOARDING');
    } catch (error: any) {
      return handleApiError(error, 'Failed to complete onboarding');
    }
  },

  updateOnboarding: async (onboardingData: {
    yearsSmoked: number;
    cigarettesPerDay: number;
    costPerCigarette: number;
    motivations: string[];
  }): Promise<any> => {
    try {
      return await apiRequest('/onboarding/update', {
        method: 'PUT',
        body: JSON.stringify(onboardingData),
      }, true, 'ONBOARDING');
    } catch (error: any) {
      return handleApiError(error, 'Failed to update onboarding');
    }
  },

  getOnboardingStatus: async (): Promise<any> => {
    try {
      return await apiRequest('/onboarding/status', {
        method: 'GET',
      }, true, 'ONBOARDING');
    } catch (error: any) {
      return handleApiError(error, 'Failed to get onboarding status');
    }
  },
};

export const healthCheck = async (): Promise<boolean> => {
  try {
    const response = await apiRequest('/health', {}, false, 'HEALTH');
    return response.success === true;
  } catch (error) {
    console.error('Health check failed:', error);
    return false;
  }
};
