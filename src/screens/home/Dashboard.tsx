import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { generateDashboardData } from '../../utils/dashboardData';
import { DashboardData } from '../../types';

const Dashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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
      <View className="flex-1 bg-red-50 justify-center items-center">
        <Text className="text-lg text-black">Loading your dashboard...</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      className="flex-1 bg-red-50"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View className="bg-gradient-to-br from-red-300 to-red-400 px-6 pt-12 pb-8">
        <Text className="text-white text-lg font-medium">Hi, {dashboardData.user.displayName}!</Text>
        <Text className="text-red-100 text-sm mt-1">Level {dashboardData.user.level} • {dashboardData.user.auraScore} Aura Points</Text>
      </View>

      {/* Timer Section */}
      <View className="mx-6 -mt-4 bg-white rounded-2xl p-6 shadow-lg">
        <Text className="text-center text-black text-sm mb-2">Smoke-Free Timer</Text>
        <Text className="text-center text-3xl font-bold text-black mb-2">
          {dashboardData.timer.formatted}
        </Text>
        <Text className="text-center text-red-600 font-medium">
          {dashboardData.motivationalMessage}
        </Text>
      </View>

      {/* Progress Cards */}
      <View className="px-6 mt-6">
        <Text className="text-xl font-bold text-black mb-4">Your Progress</Text>
        
        <View className="flex-row flex-wrap justify-between">
          {/* Cigarettes Avoided */}
          <View className="bg-white rounded-xl p-4 shadow-md w-[48%] mb-4">
            <Text className="text-2xl font-bold text-red-500">{dashboardData.progress.cigarettesAvoided}</Text>
            <Text className="text-black text-sm">Cigarettes Avoided</Text>
          </View>

          {/* Money Saved */}
          <View className="bg-white rounded-xl p-4 shadow-md w-[48%] mb-4">
            <Text className="text-2xl font-bold text-red-400">${dashboardData.progress.moneySaved}</Text>
            <Text className="text-black text-sm">Money Saved</Text>
          </View>

          {/* Streak Days */}
          <View className="bg-white rounded-xl p-4 shadow-md w-[48%] mb-4">
            <Text className="text-2xl font-bold text-red-500">{dashboardData.progress.streakDays}</Text>
            <Text className="text-black text-sm">Days Streak</Text>
          </View>

          {/* Health Score */}
          <View className="bg-white rounded-xl p-4 shadow-md w-[48%] mb-4">
            <Text className="text-2xl font-bold text-red-400">{dashboardData.progress.healthScore}%</Text>
            <Text className="text-black text-sm">Health Score</Text>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View className="px-6 mt-6">
        <Text className="text-xl font-bold text-black mb-4">Log Activity</Text>
        
        <View className="flex-row flex-wrap justify-between">
          {dashboardData.quickActions.map((action) => (
            <TouchableOpacity
              key={action.id}
              className="bg-red-400 rounded-xl p-4 w-[48%] mb-4"
              onPress={() => Alert.alert('Activity', `Log ${action.title} (+${action.points} points)`)}
            >
              <Text className="text-white font-bold text-center">{action.title}</Text>
              <Text className="text-white/80 text-sm text-center">+{action.points} points</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Achievements */}
      {dashboardData.achievements.recent.length > 0 && (
        <View className="px-6 mt-6">
          <Text className="text-xl font-bold text-black mb-4">Recent Achievements</Text>
          
          <View className="bg-white rounded-xl p-4 shadow-md">
            {dashboardData.achievements.recent.map((achievement, index) => (
              <View key={index} className="flex-row items-center py-2">
                <View className="w-3 h-3 bg-red-400 rounded-full mr-3" />
                <Text className="text-black font-medium">{achievement}</Text>
              </View>
            ))}
            
            <View className="border-t border-gray-200 mt-4 pt-4">
              <Text className="text-black text-sm">
                Next milestone: {dashboardData.achievements.nextMilestone}
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* I Smoked Button */}
      <View className="px-6 mt-6 mb-8">
        <TouchableOpacity
          className="bg-red-600 rounded-xl p-4"
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
  );
};

export default Dashboard;
