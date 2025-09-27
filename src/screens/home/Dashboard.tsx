import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, Alert, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
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
import { getProgressChartData, chartConfig } from '../../utils/chartData';
import { DashboardData } from '../../types';

const { width } = Dimensions.get('window');

const Dashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

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

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  useEffect(() => {
    loadDashboardData();
    
    // Update timer every second
    const interval = setInterval(() => {
      if (dashboardData) {
        loadDashboardData();
      }
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
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
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
            <Text className="text-gray-500 text-sm font-medium mb-2">Smoke-Free Timer</Text>
            <Text className="text-4xl font-bold text-gray-900 mb-2">
              {dashboardData.timer.days} {dashboardData.timer.hours} {dashboardData.timer.minutes}
            </Text>
            <View className="flex-row space-x-6">
              <Text className="text-gray-500 text-xs">Days</Text>
              <Text className="text-gray-500 text-xs">Hours</Text>
              <Text className="text-gray-500 text-xs">Minutes</Text>
            </View>
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
                <View className="w-5 h-5 bg-green-500 rounded-lg" />
              </View>
              <Text className="text-2xl font-bold text-gray-900">{dashboardData.progress.cigarettesAvoided}</Text>
              <Text className="text-gray-600 text-xs text-center">Cigarettes avoided</Text>
            </View>

            {/* Money Saved */}
            <View className="bg-blue-100 rounded-2xl p-4 w-[30%] mb-4 items-center">
              <View className="w-10 h-10 bg-blue-200 rounded-xl items-center justify-center mb-3">
                <View className="w-5 h-5 bg-blue-500 rounded-lg" />
              </View>
              <Text className="text-2xl font-bold text-gray-900">${dashboardData.progress.moneySaved}</Text>
              <Text className="text-gray-600 text-xs text-center">Total money saved</Text>
            </View>

            {/* Health Score */}
            <View className="bg-red-100 rounded-2xl p-4 w-[30%] mb-4 items-center">
              <View className="w-10 h-10 bg-red-200 rounded-xl items-center justify-center mb-3">
                <View className="w-5 h-5 bg-red-500 rounded-lg" />
              </View>
              <Text className="text-2xl font-bold text-gray-900">{dashboardData.progress.streakDays}</Text>
              <Text className="text-gray-600 text-xs text-center">Days smoke free</Text>
            </View>
          </View>
        </View>

        {/* Progress Chart Placeholder */}
        <View className="px-6 mt-8">
          <Text className="text-xl font-bold text-gray-900 mb-4">Weekly Progress</Text>
          <View className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100">
            <View className="h-48 bg-gray-50 rounded-2xl items-center justify-center">
              <View className="w-16 h-16 bg-red-100 rounded-2xl items-center justify-center mb-4">
                <View className="w-8 h-8 bg-red-400 rounded-xl" />
              </View>
              <Text className="text-gray-600 font-medium">Progress Chart</Text>
              <Text className="text-gray-400 text-sm mt-1">Coming Soon</Text>
            </View>
          </View>
        </View>

        {/* Daily Log */}
        <View className="px-6 mt-8">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold text-gray-900">Daily log</Text>
            <TouchableOpacity className="bg-red-400 w-12 h-12 rounded-2xl items-center justify-center">
              <Text className="text-white text-2xl font-bold">+</Text>
            </TouchableOpacity>
          </View>
          
          <View className="flex-row flex-wrap justify-between">
            {dashboardData.quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                className="bg-white rounded-2xl p-4 w-[48%] mb-4 shadow-md border border-gray-100"
                onPress={() => Alert.alert('Activity', `Log ${action.title} (+${action.points} points)`)}
              >
                <View className="w-10 h-10 bg-red-100 rounded-xl items-center justify-center mb-3">
                  <View className="w-5 h-5 bg-red-400 rounded-lg" />
                </View>
                <Text className="text-gray-900 font-semibold">{action.title}</Text>
                <Text className="text-gray-500 text-sm">+{action.points} points</Text>
              </TouchableOpacity>
            ))}
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
            <View className="w-8 h-8 bg-red-400 rounded-xl mb-1" />
            <Text className="text-red-500 text-xs font-medium">Home</Text>
          </TouchableOpacity>
          
          <TouchableOpacity className="items-center py-2">
            <View className="w-8 h-8 bg-gray-200 rounded-xl mb-1" />
            <Text className="text-gray-400 text-xs font-medium">Stats</Text>
          </TouchableOpacity>
          
          <TouchableOpacity className="items-center py-2">
            <View className="w-8 h-8 bg-gray-200 rounded-xl mb-1" />
            <Text className="text-gray-400 text-xs font-medium">Calendar</Text>
          </TouchableOpacity>
          
          <TouchableOpacity className="items-center py-2">
            <View className="w-8 h-8 bg-gray-200 rounded-xl mb-1" />
            <Text className="text-gray-400 text-xs font-medium">AI Coach</Text>
          </TouchableOpacity>
          
          <TouchableOpacity className="items-center py-2">
            <View className="w-8 h-8 bg-gray-200 rounded-xl mb-1" />
            <Text className="text-gray-400 text-xs font-medium">Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Dashboard;
