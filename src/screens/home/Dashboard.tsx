import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, Dimensions } from 'react-native';
// import { LineChart } from 'react-native-chart-kit'; // Temporarily disabled to isolate errors
import { 
  Home, 
  BarChart3, 
  Calendar, 
  MessageCircle, 
  User, 
  Cigarette, 
  DollarSign, 
  Heart, 
  Trophy,
  Dumbbell,
  Apple,
  Sparkles,
  Users,
  Plus
} from 'lucide-react-native';
import { generateDashboardData } from '../../utils/dashboardData';
import { 
  getProgressChartData, 
  TREND_COLORS, 
  FILTER_LABELS,
  TIME_RANGE_OPTIONS,
  DEFAULT_ACTIVE_FILTERS,
  TimeRange,
  FilterType,
  MultiSeriesData
} from '../../utils/chartData';
import { DashboardData } from '../../types';

const { width } = Dimensions.get('window');

// Multi-Series Bar Chart Component
const MultiSeriesBarChart = React.memo(({ data, activeFilters }: { data: MultiSeriesData, activeFilters: FilterType[] }) => {
  if (!data || !data.labels || !data.series) {
    return (
      <View className="h-full bg-white rounded-2xl p-4 items-center justify-center">
        <Text className="text-gray-500">No chart data available</Text>
      </View>
    );
  }

  // Calculate max value for each series separately for better scaling
  const getMaxValueForSeries = (filter: FilterType) => {
    return Math.max(...(data.series[filter] || [1]));
  };

  // Get overall max for reference
  const overallMax = Math.max(
    ...activeFilters.flatMap(filter => data.series[filter] || [])
  );

  const barWidth = 12; // Increased width for better visibility
  const barSpacing = 3;
  const groupSpacing = 16;

  return (
    <View className="h-full bg-white rounded-2xl p-4">
      <Text className="text-center text-gray-600 text-sm mb-4">Multi-Series Progress Chart</Text>
      
      {/* Multi-series bars */}
      <View className="flex-row justify-between items-end h-32 mb-4">
        {data.labels.map((label: string, labelIndex: number) => (
          <View key={labelIndex} className="items-center flex-1">
            {/* Group of bars for each label */}
            <View className="mb-2">
              {/* Value labels row */}
              <View 
                className="flex-row justify-center mb-1"
                style={{ gap: barSpacing }}
              >
                {activeFilters.map((filter) => {
                  const value = data.series[filter][labelIndex] || 0;
                  return (
                    <Text 
                      key={`label-${filter}`}
                      className="text-xs text-gray-700 font-semibold text-center"
                      style={{ 
                        width: barWidth,
                        fontSize: 8
                      }}
                    >
                      {value}
                    </Text>
                  );
                })}
              </View>
              
              {/* Bars row */}
              <View 
                className="flex-row items-end justify-center"
                style={{ gap: barSpacing }}
              >
                {activeFilters.map((filter, filterIndex) => {
                  const value = data.series[filter][labelIndex] || 0;
                  const seriesMax = getMaxValueForSeries(filter);
                  
                  // Simplified scaling - ensure all bars are visible
                  let normalizedHeight;
                  if (value === 0) {
                    normalizedHeight = 6; // Small bar for zero values
                  } else {
                    const proportion = value / seriesMax;
                    // Minimum 25px height for visibility, max 80px
                    normalizedHeight = Math.max(25, proportion * 55 + 25);
                  }
                  
                  return (
                    <View
                      key={filter}
                      className="rounded-t-md"
                      style={{
                        width: barWidth,
                        height: normalizedHeight,
                        backgroundColor: TREND_COLORS[filter](),
                        opacity: value === 0 ? 0.4 : 1,
                        borderWidth: 0.5,
                        borderColor: '#d1d5db',
                      }}
                    />
                  );
                })}
              </View>
            </View>
            <Text className="text-xs text-gray-500 text-center" numberOfLines={1}>
              {label}
            </Text>
          </View>
        ))}
      </View>
      
      {/* Legend */}
      <View className="flex-row flex-wrap justify-center gap-3">
        {activeFilters.map((filter) => (
          <View key={filter} className="flex-row items-center gap-1">
            <View 
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: TREND_COLORS[filter]() }}
            />
            <Text className="text-xs text-gray-600">{FILTER_LABELS[filter]}</Text>
          </View>
        ))}
      </View>
      
      {/* Value indicators */}
      <View className="mt-3 px-2">
        <Text className="text-xs text-gray-400 text-center">
          Max: {overallMax.toLocaleString()} • Showing {activeFilters.length} series
        </Text>
        {/* Debug info */}
        <View className="mt-2">
          {activeFilters.map((filter) => (
            <Text key={filter} className="text-xs text-gray-500 text-center">
              {FILTER_LABELS[filter]}: {data.series[filter].join(', ')}
            </Text>
          ))}
        </View>
      </View>
    </View>
  );
});

const Dashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Simplified chart state management
  const [timeRange, setTimeRange] = useState<TimeRange>('4d');
  const [activeFilters, setActiveFilters] = useState<FilterType[]>(DEFAULT_ACTIVE_FILTERS);

  // Real-time timer calculation
  const calculateRealTimeTimer = (startTime: Date) => {
    const now = new Date();
    const diffInMilliseconds = now.getTime() - startTime.getTime();
    
    if (diffInMilliseconds < 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    const totalSeconds = Math.floor(diffInMilliseconds / 1000);
    const days = Math.floor(totalSeconds / (24 * 60 * 60));
    const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
    const seconds = totalSeconds % 60;

    return { days, hours, minutes, seconds };
  };

  const loadDashboardData = async () => {
    try {
      const data = await generateDashboardData();
      setDashboardData(data);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      Alert.alert('Error', 'Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  // Simple chart helper functions
  const handleTimeRangeChange = (newTimeRange: TimeRange) => {
    setTimeRange(newTimeRange);
  };

  const toggleFilter = (filter: FilterType) => {
    if (activeFilters.includes(filter)) {
      if (activeFilters.length > 1) {
        setActiveFilters(activeFilters.filter(f => f !== filter));
      }
    } else {
      setActiveFilters([...activeFilters, filter]);
    }
  };

  // Get chart data
  const chartData: MultiSeriesData = getProgressChartData(timeRange);

  useEffect(() => {
    loadDashboardData();
    
    // Update current time every second for real-time timer
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (isLoading || !dashboardData) {
    return (
      <View className="flex-1 bg-gray-50 justify-center items-center">
        <View className="bg-white rounded-3xl p-8 shadow-xl">
          <View className="w-16 h-16 bg-red-100 rounded-2xl items-center justify-center mb-4 mx-auto">
            <View className="w-8 h-8 bg-red-400 rounded-xl" />
          </View>
          <Text className="text-lg text-gray-900 text-center font-semibold">Loading Dashboard...</Text>
          <Text className="text-gray-500 text-center mt-2">Preparing your progress</Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView 
        className="flex-1"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="bg-red-400 pt-16 pb-8" style={{ borderBottomLeftRadius: 40, borderBottomRightRadius: 40 }}>
          <View className="px-6 flex-row justify-between items-center">
            <View>
              <Text className="text-white text-2xl font-bold">Hi, {dashboardData.user.displayName.split(' ')[0]}!</Text>
              <Text className="text-red-100 text-base mt-1">
                Level {dashboardData.user.level} • {dashboardData.user.auraScore} Points
              </Text>
            </View>
            <View className="w-12 h-12 bg-white rounded-2xl items-center justify-center" style={{ opacity: 0.2 }}>
              <View className="w-6 h-6 bg-white rounded-xl" />
            </View>
          </View>
        </View>

        {/* Timer Card */}
        <View className="mx-6 -mt-6 bg-white rounded-3xl p-6 shadow-xl border border-gray-100">
          <View className="items-center">
            <Text className="text-gray-500 text-sm font-medium mb-4">Smoke-Free Timer</Text>
            {(() => {
              const realTimeTimer = calculateRealTimeTimer(dashboardData.timer.startTime);
              return (
                <>
                  <View className="flex-row items-center justify-center mb-3">
                    <View className="items-center mx-3">
                      <Text className="text-3xl font-bold text-gray-900">{realTimeTimer.days.toString().padStart(2, '0')}</Text>
                      <Text className="text-gray-500 text-xs">Days</Text>
                    </View>
                    <Text className="text-2xl font-bold text-gray-400 mx-1">:</Text>
                    <View className="items-center mx-3">
                      <Text className="text-3xl font-bold text-gray-900">{realTimeTimer.hours.toString().padStart(2, '0')}</Text>
                      <Text className="text-gray-500 text-xs">Hours</Text>
                    </View>
                    <Text className="text-2xl font-bold text-gray-400 mx-1">:</Text>
                    <View className="items-center mx-3">
                      <Text className="text-3xl font-bold text-gray-900">{realTimeTimer.minutes.toString().padStart(2, '0')}</Text>
                      <Text className="text-gray-500 text-xs">Minutes</Text>
                    </View>
                    <Text className="text-2xl font-bold text-gray-400 mx-1">:</Text>
                    <View className="items-center mx-3">
                      <Text className="text-3xl font-bold text-red-500">{realTimeTimer.seconds.toString().padStart(2, '0')}</Text>
                      <Text className="text-gray-500 text-xs">Seconds</Text>
                    </View>
                  </View>
                </>
              );
            })()}
            <Text className="text-red-500 font-medium text-center mt-4 leading-5">
              {dashboardData.motivationalMessage}
            </Text>
          </View>
        </View>

        {/* Progress Cards */}
        <View className="px-6 mt-8">
          <Text className="text-xl font-bold text-gray-900 mb-4">Other Progresses</Text>
          
          <View className="flex-row flex-wrap justify-between">
            {/* Cigarettes Avoided */}
            <View className="bg-green-100 rounded-2xl p-4 w-[30%] mb-4 items-center">
              <View className="w-10 h-10 bg-green-200 rounded-xl items-center justify-center mb-3">
                <Cigarette size={20} color="#22c55e" />
              </View>
              <Text className="text-2xl font-bold text-gray-900">{dashboardData.progress.cigarettesAvoided}</Text>
              <Text className="text-gray-600 text-xs text-center">Cigarettes avoided</Text>
            </View>

            {/* Money Saved */}
            <View className="bg-blue-100 rounded-2xl p-4 w-[30%] mb-4 items-center">
              <View className="w-10 h-10 bg-blue-200 rounded-xl items-center justify-center mb-3">
                <DollarSign size={20} color="#3b82f6" />
              </View>
              <Text className="text-2xl font-bold text-gray-900">${dashboardData.progress.moneySaved}</Text>
              <Text className="text-gray-600 text-xs text-center">Total money saved</Text>
            </View>

            {/* Health Score */}
            <View className="bg-red-100 rounded-2xl p-4 w-[30%] mb-4 items-center">
              <View className="w-10 h-10 bg-red-200 rounded-xl items-center justify-center mb-3">
                <Heart size={20} color="#ef4444" />
              </View>
              <Text className="text-2xl font-bold text-gray-900">{dashboardData.progress.streakDays}</Text>
              <Text className="text-gray-600 text-xs text-center">Days smoke free</Text>
            </View>
          </View>
        </View>

        {/* Progress Chart */}
        <View className="px-6 mt-8">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold text-gray-900">Progress Trends</Text>
          </View>
          
          <View className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100">
            
            {/* Time Range Selector */}
            <View className="flex-row justify-center mb-6">
              <View className="bg-gray-100 rounded-2xl p-1 flex-row">
                {TIME_RANGE_OPTIONS.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    className={`px-4 py-2 rounded-xl ${
                      timeRange === option.value ? 'bg-red-400' : 'bg-transparent'
                    }`}
                    onPress={() => handleTimeRangeChange(option.value)}
                  >
                    <Text className={`text-sm font-medium ${
                      timeRange === option.value ? 'text-white' : 'text-gray-600'
                    }`}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

         
            {/* Chart Container */}
            <View 
              style={{
                height: 200,
                marginHorizontal: -24,
              }}
            >
              <MultiSeriesBarChart 
                data={chartData}
                activeFilters={activeFilters}
              />
            </View>

          </View>
        </View>

        {/* Daily Log */}
        <View className="px-6 mt-8">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold text-gray-900">Daily log</Text>
            <TouchableOpacity className="bg-red-400 w-12 h-12 rounded-2xl items-center justify-center">
              <Plus size={24} color="#ffffff" />
            </TouchableOpacity>
          </View>
          
          <View className="flex-row flex-wrap justify-between">
            {dashboardData.quickActions.map((action) => {
              const getIcon = (actionId: string) => {
                switch (actionId) {
                  case 'gym':
                    return <Dumbbell size={20} color="#ef4444" />;
                  case 'healthy_meal':
                    return <Apple size={20} color="#ef4444" />;
                  case 'skincare':
                    return <Sparkles size={20} color="#ef4444" />;
                  case 'event_social':
                    return <Users size={20} color="#ef4444" />;
                  default:
                    return <Trophy size={20} color="#ef4444" />;
                }
              };

              return (
                <TouchableOpacity
                  key={action.id}
                  className="bg-white rounded-2xl p-4 w-[48%] mb-4 shadow-md border border-gray-100"
                  onPress={() => Alert.alert('Activity', `Log ${action.title} (+${action.points} points)`)}
                >
                  <View className="w-10 h-10 bg-red-100 rounded-xl items-center justify-center mb-3">
                    {getIcon(action.id)}
                  </View>
                  <Text className="text-gray-900 font-semibold">{action.title}</Text>
                  <Text className="text-gray-500 text-sm">+{action.points} points</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* I Smoked Button */}
        <View className="px-6 mt-8 mb-32">
          <TouchableOpacity
            className="bg-red-500 rounded-2xl p-4 shadow-lg"
            onPress={() => Alert.alert(
              'Reset Timer?',
              'This will reset your smoke-free timer and deduct 10 points from your Aura score.',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Reset', style: 'destructive', onPress: () => Alert.alert('Feature', 'Timer reset functionality will be implemented') }
              ]
            )}
          >
            <Text className="text-white font-bold text-center text-lg">I Smoked</Text>
            <Text className="text-red-100 text-center text-sm">-10 Aura Points</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-4 rounded-t-3xl shadow-2xl">
        <View className="flex-row justify-around items-center">
          <TouchableOpacity className="items-center py-2">
            <View className="w-8 h-8 bg-red-100 rounded-xl mb-1 items-center justify-center">
              <Home size={18} color="#ef4444" />
            </View>
            <Text className="text-red-500 text-xs font-medium">Home</Text>
          </TouchableOpacity>
          
          <TouchableOpacity className="items-center py-2">
            <View className="w-8 h-8 bg-gray-100 rounded-xl mb-1 items-center justify-center">
              <BarChart3 size={18} color="#9ca3af" />
            </View>
            <Text className="text-gray-400 text-xs font-medium">Stats</Text>
          </TouchableOpacity>
          
          <TouchableOpacity className="items-center py-2">
            <View className="w-8 h-8 bg-gray-100 rounded-xl mb-1 items-center justify-center">
              <Calendar size={18} color="#9ca3af" />
            </View>
            <Text className="text-gray-400 text-xs font-medium">Calendar</Text>
          </TouchableOpacity>
          
          <TouchableOpacity className="items-center py-2">
            <View className="w-8 h-8 bg-gray-100 rounded-xl mb-1 items-center justify-center">
              <MessageCircle size={18} color="#9ca3af" />
            </View>
            <Text className="text-gray-400 text-xs font-medium">AI Coach</Text>
          </TouchableOpacity>
          
          <TouchableOpacity className="items-center py-2">
            <View className="w-8 h-8 bg-gray-100 rounded-xl mb-1 items-center justify-center">
              <User size={18} color="#9ca3af" />
            </View>
            <Text className="text-gray-400 text-xs font-medium">Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Dashboard;
