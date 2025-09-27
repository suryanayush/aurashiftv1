import { apiRequest, handleApiError, BaseResponse } from './apiUtils';

// Activity types - matching backend exactly
export type ActivityType = 
  | 'cigarette_consumed' 
  | 'gym_workout' 
  | 'healthy_meal' 
  | 'skin_care' 
  | 'social_event';

// Activity interface
export interface Activity {
  id: string;
  userId: string;
  type: ActivityType;
  points: number;
  metadata?: {
    note?: string;
    location?: string;
    duration?: number;
    intensity?: 'low' | 'medium' | 'high';
    [key: string]: any;
  };
  createdAt: string;
  updatedAt: string;
}

// API Response interfaces
export interface CreateActivityResponse extends BaseResponse {
  data?: {
    activity: Activity;
    newAuraScore: number;
  };
}

export interface ActivitiesResponse extends BaseResponse {
  data?: {
    activities: Activity[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

export interface UpdateActivityResponse extends BaseResponse {
  data?: {
    activity: Activity;
    newAuraScore: number;
  };
}

export interface DeleteActivityResponse extends BaseResponse {
  data?: {
    deletedActivityId: string;
    newAuraScore: number;
  };
}

// Activity API
export const activitiesAPI = {
  // Create activity
  create: async (activityData: {
    type: ActivityType;
    metadata?: any;
  }): Promise<CreateActivityResponse> => {
    try {
      const response = await apiRequest('/activities', {
        method: 'POST',
        body: JSON.stringify(activityData),
      }, true, 'ACTIVITIES');

      return {
        success: response.success,
        data: response.data,
      };
    } catch (error: any) {
      return handleApiError(error, 'Failed to create activity');
    }
  },

  // Get user activities
  getActivities: async (params: {
    page?: number;
    limit?: number;
    type?: ActivityType;
    startDate?: string;
    endDate?: string;
  } = {}): Promise<ActivitiesResponse> => {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.type) queryParams.append('type', params.type);
      if (params.startDate) queryParams.append('startDate', params.startDate);
      if (params.endDate) queryParams.append('endDate', params.endDate);

      const queryString = queryParams.toString();
      const endpoint = queryString ? `/activities?${queryString}` : '/activities';

      const response = await apiRequest(endpoint, {
        method: 'GET',
      }, true, 'ACTIVITIES');

      return {
        success: response.success,
        data: response.data,
      };
    } catch (error: any) {
      return handleApiError(error, 'Failed to fetch activities');
    }
  },

  // Update activity
  update: async (activityId: string, updateData: {
    type?: ActivityType;
    metadata?: any;
  }): Promise<UpdateActivityResponse> => {
    try {
      const response = await apiRequest(`/activities/${activityId}`, {
        method: 'PUT',
        body: JSON.stringify(updateData),
      }, true, 'ACTIVITIES');

      return {
        success: response.success,
        data: response.data,
      };
    } catch (error: any) {
      return handleApiError(error, 'Failed to update activity');
    }
  },

  // Delete activity
  delete: async (activityId: string): Promise<DeleteActivityResponse> => {
    try {
      const response = await apiRequest(`/activities/${activityId}`, {
        method: 'DELETE',
      }, true, 'ACTIVITIES');

      return {
        success: response.success,
        data: response.data,
      };
    } catch (error: any) {
      return handleApiError(error, 'Failed to delete activity');
    }
  },
};
