// Multi-series chart data implementation
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

// Multi-series chart data for different timeframes
const CHART_DATA: Record<TimeRange, MultiSeriesData> = {
  '4d': {
    labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4'],
    series: {
      aura_score: [15, 35, 58, 78],
      cigarettes_avoided: [2, 8, 15, 22],
      cigarettes_consumed: [8, 4, 2, 0],
      money_saved: [12, 36, 60, 84],
    },
  },
  '30d': {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    series: {
      aura_score: [120, 180, 245, 320],
      cigarettes_avoided: [45, 68, 85, 98],
      cigarettes_consumed: [25, 18, 12, 8],
      money_saved: [180, 272, 340, 392],
    },
  },
  '90d': {
    labels: ['Month 1', 'Month 2', 'Month 3'],
    series: {
      aura_score: [680, 1250, 1890],
      cigarettes_avoided: [280, 420, 580],
      cigarettes_consumed: [120, 80, 45],
      money_saved: [1120, 1680, 2320],
    },
  },
};

// Color constants for trend lines - Enhanced visibility
export const TREND_COLORS = {
  aura_score: () => '#8b7ed8', // Purple
  cigarettes_avoided: () => '#22c55e', // Bright Green
  cigarettes_consumed: () => '#dc2626', // Bright Red
  money_saved: () => '#f59e0b', // Bright Orange
} as const;

// Filter labels for display
export const FILTER_LABELS = {
  aura_score: 'Score',
  cigarettes_avoided: 'Avoided',
  cigarettes_consumed: 'Consumed',
  money_saved: 'Savings',
} as const;

// Get multi-series chart data for specific timeframe
export const getProgressChartData = (timeRange: TimeRange = '4d'): MultiSeriesData => {
  return CHART_DATA[timeRange] || CHART_DATA['4d'];
};

// Future: Get real chart data from user activities
export const getRealProgressChartData = async (timeRange: TimeRange = '4d'): Promise<MultiSeriesData> => {
  // TODO: Implement real data fetching from user activities
  // For now, return static data
  return getProgressChartData(timeRange);
};

// Time range options
export const TIME_RANGE_OPTIONS = [
  { value: '4d' as TimeRange, label: '4 Days' },
  { value: '30d' as TimeRange, label: '30 Days' },
  { value: '90d' as TimeRange, label: '90 Days' },
];

// Default active filters - Show all 4 series by default
export const DEFAULT_ACTIVE_FILTERS: FilterType[] = [
  'aura_score', 
  'cigarettes_avoided',
  'cigarettes_consumed',
  'money_saved'
];
