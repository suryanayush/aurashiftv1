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

export type TimeRange = '7d' | '30d' | '90d';
export type FilterType = 'aura_score' | 'cigarettes_avoided' | 'cigarettes_consumed' | 'money_saved';

// Multi-series chart data for different timeframes
const CHART_DATA: Record<TimeRange, MultiSeriesData> = {
  '7d': {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    series: {
      aura_score: [15, 25, 35, 48, 58, 68, 78],
      cigarettes_avoided: [2, 5, 8, 12, 15, 18, 22],
      cigarettes_consumed: [8, 6, 4, 3, 2, 1, 0],
      money_saved: [12, 24, 36, 48, 60, 72, 84],
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
  aura_score: 'Aura Score',
  cigarettes_avoided: 'Cigarettes Avoided',
  cigarettes_consumed: 'Cigarettes Consumed',
  money_saved: 'Money Saved',
} as const;

// Get multi-series chart data for specific timeframe
export const getProgressChartData = (timeRange: TimeRange = '7d'): MultiSeriesData => {
  return CHART_DATA[timeRange] || CHART_DATA['7d'];
};

// Time range options
export const TIME_RANGE_OPTIONS = [
  { value: '7d' as TimeRange, label: '7 Days' },
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
