import { Platform } from 'react-native';

export const getApiBaseUrl = (): string => {
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

export const API_BASE_URL = getApiBaseUrl();

if (__DEV__) {
  console.log(`[API] Using base URL: ${API_BASE_URL}`);
  console.log(`[API] Platform: ${Platform.OS}`);
}

export const getAuthToken = async (): Promise<string | null> => {
  try {
    const { storage } = await import('../utils/storage');
    return await storage.getAuthToken();
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

export const getHeaders = (includeAuth: boolean = false): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  // Auth will be added in apiRequest function
  return headers;
};

export const apiRequest = async (
  endpoint: string,
  options: RequestInit = {},
  requiresAuth: boolean = false,
  apiName: string = 'API'
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
      console.log(`[${apiName}] ${options.method || 'GET'} ${fullUrl}`);
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
      console.log(`[${apiName}] Response ${response.status}:`, data);
    }

    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error: any) {
    console.error(`[${apiName}] Request failed for ${fullUrl}:`, error);
    
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

export interface BaseResponse {
  success: boolean;
  error?: string;
}

export const handleApiError = (error: any, defaultMessage: string) => {
  return {
    success: false,
    error: error.message || defaultMessage,
  };
};
