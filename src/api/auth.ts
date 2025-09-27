import { AuthFormData, AuthResponse } from '../types';
import { Platform } from 'react-native';

const getApiBaseUrl = (): string => {
  if (!__DEV__) {
    return 'https://your-production-api.com/api';
  }
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3000/api';
  } else if (Platform.OS === 'ios') {
    return 'http://localhost:3000/api';
  } else {
    return 'http://localhost:3000/api';
  }
};

const API_BASE_URL = getApiBaseUrl();

if (__DEV__) {
  console.log(`[API] Using base URL: ${API_BASE_URL}`);
  console.log(`[API] Platform: ${Platform.OS}`);
}

const getHeaders = (includeAuth: boolean = false) => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (includeAuth) {
    // For now, we'll handle this in individual functions
  }

  return headers;
};

const getAuthToken = async (): Promise<string | null> => {
  try {
    const { storage } = await import('../utils/storage');
    return await storage.getAuthToken();
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

const apiRequest = async (
  endpoint: string,
  options: RequestInit = {},
  requiresAuth: boolean = false
): Promise<any> => {
  const fullUrl = `${API_BASE_URL}${endpoint}`;
  
  try {
    const headers = getHeaders();
    
    if (requiresAuth) {
      const token = await getAuthToken();
      if (token) {
        (headers as any).Authorization = `Bearer ${token}`;
      }
    }

    if (__DEV__) {
      console.log(`[API] ${options.method || 'GET'} ${fullUrl}`);
    }

    const response = await fetch(fullUrl, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    });

    const data = await response.json();

    if (__DEV__) {
      console.log(`[API] Response ${response.status}:`, data);
    }

    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error: any) {
    console.error(`[API] Request failed for ${fullUrl}:`, error);
    
    // Handle specific network errors
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error(`Network error. Cannot connect to ${API_BASE_URL}. Make sure the backend server is running.`);
    }
    
    if (error.message.includes('ECONNREFUSED')) {
      throw new Error(`Connection refused. Backend server not running on ${API_BASE_URL}`);
    }
    
    throw error;
  }
};

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
      });
      if (response.success && response.token && response.user) {
        const { storage } = await import('../utils/storage');
        await storage.setAuthToken(response.token);
        await storage.setOnboardingCompleted(response.user.onboardingCompleted);
      }

      return response;
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Registration failed',
      };
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
      });
      if (response.success && response.token && response.user) {
        const { storage } = await import('../utils/storage');
        await storage.setAuthToken(response.token);
        // Save onboarding status from backend
        await storage.setOnboardingCompleted(response.user.onboardingCompleted);
      }

      return response;
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Login failed',
      };
    }
  },
  getProfile: async (): Promise<any> => {
    try {
      return await apiRequest('/auth/profile', {
        method: 'GET',
      }, true);
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to fetch profile',
      };
    }
  },

  verifyToken: async (): Promise<AuthResponse> => {
    try {
      const response = await apiRequest('/auth/verify', {
        method: 'GET',
      }, true);
      
      if (response.success && response.user) {
        const { storage } = await import('../utils/storage');
        // Sync onboarding status from backend
        await storage.setOnboardingCompleted(response.user.onboardingCompleted);
      }
      
      return response;
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Token verification failed',
      };
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
    costPerPack: number;
    motivations: string[];
  }): Promise<any> => {
    try {
      return await apiRequest('/onboarding/complete', {
        method: 'POST',
        body: JSON.stringify(onboardingData),
      }, true);
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to complete onboarding',
      };
    }
  },

  updateOnboarding: async (onboardingData: {
    yearsSmoked: number;
    cigarettesPerDay: number;
    costPerPack: number;
    motivations: string[];
  }): Promise<any> => {
    try {
      return await apiRequest('/onboarding/update', {
        method: 'PUT',
        body: JSON.stringify(onboardingData),
      }, true);
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to update onboarding',
      };
    }
  },

  getOnboardingStatus: async (): Promise<any> => {
    try {
      return await apiRequest('/onboarding/status', {
        method: 'GET',
      }, true);
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to get onboarding status',
      };
    }
  },
};

export const healthCheck = async (): Promise<boolean> => {
  try {
    const response = await apiRequest('/health');
    return response.success === true;
  } catch (error) {
    console.error('Health check failed:', error);
    return false;
  }
};
