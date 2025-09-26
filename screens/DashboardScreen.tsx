import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function DashboardScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const StatCard = ({ title, value, change, icon, color }: any) => (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
      }}
      className="mr-4 flex-1">
      <LinearGradient colors={color} className="rounded-2xl p-4 shadow-sm">
        <View className="mb-3 flex-row items-start justify-between">
          <Text className="text-sm font-medium text-white/90">{title}</Text>
          <Text className="text-2xl">{icon}</Text>
        </View>
        <Text className="mb-1 text-2xl font-bold text-white">{value}</Text>
        <Text className="text-xs text-white/80">{change}</Text>
      </LinearGradient>
    </Animated.View>
  );

  const ActionCard = ({ title, subtitle, icon, bgColor }: any) => (
    <TouchableOpacity className="mx-2 mb-4 flex-1">
      <View className={`${bgColor} rounded-2xl p-6 shadow-sm`}>
        <View className="items-center">
          <Text className="mb-3 text-4xl">{icon}</Text>
          <Text className="mb-1 text-lg font-semibold text-white">{title}</Text>
          <Text className="text-center text-sm text-white/80">{subtitle}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const ActivityItem = ({ title, subtitle, time, icon }: any) => (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateX: slideAnim }],
      }}
      className="mb-3 flex-row items-center rounded-xl bg-white p-4 shadow-sm">
      <View className="mr-4 h-12 w-12 items-center justify-center rounded-full bg-gray-100">
        <Text className="text-xl">{icon}</Text>
      </View>
      <View className="flex-1">
        <Text className="text-base font-semibold text-gray-800">{title}</Text>
        <Text className="text-sm text-gray-500">{subtitle}</Text>
      </View>
      <Text className="text-xs text-gray-400">{time}</Text>
    </Animated.View>
  );

  return (
    <LinearGradient colors={['#f8fafc', '#e2e8f0']} className="flex-1">
      <SafeAreaView className="flex-1">
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
            className="px-6 pb-4 pt-6">
            <View className="mb-8 flex-row items-center justify-between">
              <View>
                <Text className="text-base text-gray-500">Welcome back,</Text>
                <Text className="text-2xl font-bold text-gray-800">John Doe</Text>
              </View>

              <TouchableOpacity className="h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
                <Text className="text-xl">🔔</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>

          <View className="mb-8 px-6">
            <Text className="mb-4 text-lg font-semibold text-gray-800">Overview</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row">
                <StatCard
                  title="Total Sales"
                  value="$24,500"
                  change="+12% from last month"
                  icon="📈"
                  color={['#3b82f6', '#1d4ed8']}
                />
                <StatCard
                  title="Active Users"
                  value="1,249"
                  change="+8% from last week"
                  icon="👥"
                  color={['#10b981', '#047857']}
                />
                <StatCard
                  title="Orders"
                  value="89"
                  change="+23% from yesterday"
                  icon="🛒"
                  color={['#f59e0b', '#d97706']}
                />
              </View>
            </ScrollView>
          </View>

          <View className="mb-8 px-6">
            <Text className="mb-4 text-lg font-semibold text-gray-800">Quick Actions</Text>
            <View className="flex-row flex-wrap">
              <ActionCard
                title="Add Product"
                subtitle="Create new product"
                icon="➕"
                bgColor="bg-purple-500"
              />
              <ActionCard
                title="View Analytics"
                subtitle="Check performance"
                icon="📊"
                bgColor="bg-blue-500"
              />
              <ActionCard
                title="Messages"
                subtitle="Chat with customers"
                icon="💬"
                bgColor="bg-green-500"
              />
              <ActionCard
                title="Settings"
                subtitle="Manage preferences"
                icon="⚙️"
                bgColor="bg-gray-600"
              />
            </View>
          </View>

          <View className="mb-8 px-6">
            <Text className="mb-4 text-lg font-semibold text-gray-800">Recent Activity</Text>
            <ActivityItem
              title="New Order Received"
              subtitle="Order #12345 from Sarah Johnson"
              time="2 min ago"
              icon="🛍️"
            />
            <ActivityItem
              title="Product Updated"
              subtitle="iPhone 15 Pro Max - Stock updated"
              time="15 min ago"
              icon="📱"
            />
            <ActivityItem
              title="Customer Review"
              subtitle="5-star review for Wireless Headphones"
              time="1 hour ago"
              icon="⭐"
            />
            <ActivityItem
              title="Payment Received"
              subtitle="$299.99 from Mike Chen"
              time="2 hours ago"
              icon="💳"
            />
          </View>

          <View className="px-6 pb-8">
            <TouchableOpacity>
              <LinearGradient colors={['#667eea', '#764ba2']} className="rounded-2xl p-4 shadow-lg">
                <View className="flex-row items-center justify-between">
                  <View>
                    <Text className="text-lg font-semibold text-white">Upgrade to Pro</Text>
                    <Text className="text-sm text-white/80">Unlock premium features</Text>
                  </View>
                  <Text className="text-3xl">✨</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
