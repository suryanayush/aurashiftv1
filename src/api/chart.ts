import { apiRequest, handleApiError, BaseResponse } from './apiUtils';

// Chart data interfaces - exactly matching your frontend chartData.ts
export interface ChartDataPoint {
  label: string;
  aura_score: number;
  cigarettes_avoided: number;
  cigarettes_consumed: number;
  money_saved: number;
}

export interface MultiSeriesData {
  labels: string[];
  series: {
    aura_score: number[];
    cigarettes_avoided: number[];
    cigarettes_consumed: number[];
    money_saved: number[];
  };
}

export type TimeRange = '4d' | '30d' | '90d';
export type FilterType = 'aura_score' | 'cigarettes_avoided' | 'cigarettes_consumed' | 'money_saved';

// API Response interface
export interface ChartDataResponse extends BaseResponse {
  data?: MultiSeriesData;
}

// Chart API
export const chartAPI = {
  // Get chart data for specified time range
  getChartData: async (timeRange: TimeRange = '4d'): Promise<ChartDataResponse> => {
    try {
      const response = await apiRequest(`/chart/data?timeRange=${timeRange}`, {
        method: 'GET',
      }, true, 'CHART');

      return {
        success: response.success,
        data: response.data,
      };
    } catch (error: any) {
      return handleApiError(error, 'Failed to fetch chart data');
    }
  },
};

// Helper function to get real chart data (replaces the static data)
export const getProgressChartData = async (timeRange: TimeRange = '4d'): Promise<MultiSeriesData> => {
  const response = await chartAPI.getChartData(timeRange);
  
  if (response.success && response.data) {
    return response.data;
  }
  
  // Fallback to empty data structure
  return {
    labels: [],
    series: {
      aura_score: [],
      cigarettes_avoided: [],
      cigarettes_consumed: [],
      money_saved: [],
    },
  };
};

// Export constants for compatibility with existing code
export const TREND_COLORS = {
  aura_score: () => '#8b7ed8', // Purple
  cigarettes_avoided: () => '#22c55e', // Bright Green
  cigarettes_consumed: () => '#dc2626', // Bright Red
  money_saved: () => '#f59e0b', // Bright Orange
} as const;

export const FILTER_LABELS = {
  aura_score: 'Score',
  cigarettes_avoided: 'Avoided',
  cigarettes_consumed: 'Consumed',
  money_saved: 'Savings',
} as const;

export const TIME_RANGE_OPTIONS = [
  { value: '4d' as TimeRange, label: '4 Days' },
  { value: '30d' as TimeRange, label: '30 Days' },
  { value: '90d' as TimeRange, label: '90 Days' },
];

export const DEFAULT_ACTIVE_FILTERS: FilterType[] = [
  'aura_score', 
  'cigarettes_avoided',
  'cigarettes_consumed',
  'money_saved'
];
