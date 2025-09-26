import React, { useRef, useEffect } from 'react';
import { View, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { Container } from '../components/Container';
import { Typography, Card, ThemeToggle } from '../components/ui';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  icon: string;
  color?: string;
}

interface ActionCardProps {
  title: string;
  subtitle: string;
  icon: string;
  onPress?: () => void;
}

interface ActivityItemProps {
  title: string;
  subtitle: string;
  time: string;
  icon: string;
}

export default function DashboardScreen() {
  const { colors } = useTheme();
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

  const StatCard = ({ title, value, change, icon }: StatCardProps) => (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
      }}
      className="mr-4 w-48">
      <LinearGradient
        colors={[colors.primary, colors.primaryLight, colors.accent]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          borderRadius: 20,
          padding: 20,
          shadowColor: colors.primary,
          shadowOffset: { width: 0, height: 12 },
          shadowOpacity: 0.4,
          shadowRadius: 16,
          elevation: 16,
          borderWidth: 2,
          borderColor: 'rgba(255, 255, 255, 0.2)',
        }}>
        <View className="mb-3 flex-row items-start justify-between">
          <Typography variant="body2" weight="medium" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
            {title}
          </Typography>
          <Typography variant="h3" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            {icon}
          </Typography>
        </View>
        <Typography
          variant="h2"
          weight="bold"
          style={{ color: colors.primaryForeground, marginBottom: 4 }}>
          {value}
        </Typography>
        <Typography variant="caption" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
          {change}
        </Typography>
      </LinearGradient>
    </Animated.View>
  );

  const ActionCard = ({ title, subtitle, icon, onPress }: ActionCardProps) => (
    <View className="w-1/2 p-2">
      <Card variant="glass" padding="lg" onPress={onPress}>
        <View className="items-center">
          <Typography variant="h2" style={{ marginBottom: 12, color: colors.accent }}>
            {icon}
          </Typography>
          <Typography variant="h4" weight="semibold" align="center" style={{ marginBottom: 4 }}>
            {title}
          </Typography>
          <Typography variant="body2" color="secondary" align="center">
            {subtitle}
          </Typography>
        </View>
      </Card>
    </View>
  );

  const ActivityItem = ({ title, subtitle, time, icon }: ActivityItemProps) => (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateX: slideAnim }],
      }}>
      <Card variant="glass" padding="md" margin="sm">
        <View className="flex-row items-center">
          <View
            className="mr-4 h-12 w-12 items-center justify-center rounded-full"
            style={{
              backgroundColor: colors.primary,
              shadowColor: colors.primary,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 8,
            }}>
            <Typography variant="h4">{icon}</Typography>
          </View>
          <View className="flex-1">
            <Typography variant="body1" weight="semibold" style={{ marginBottom: 2 }}>
              {title}
            </Typography>
            <Typography variant="body2" color="secondary">
              {subtitle}
            </Typography>
          </View>
          <Typography variant="caption" color="tertiary">
            {time}
          </Typography>
        </View>
      </Card>
    </Animated.View>
  );

  return (
    <Container variant="gradient" padding="none">
      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
          className="pb-4 pt-6">
          <View className="mb-8 flex-row items-center justify-between">
            <View>
              <Typography variant="body1" color="secondary">
                Welcome back,
              </Typography>
              <Typography variant="h2" weight="bold">
                John Doe
              </Typography>
            </View>

            <TouchableOpacity
              className="shadow-medium h-12 w-12 items-center justify-center rounded-full"
              style={{ backgroundColor: colors.surface }}>
              <Typography variant="h4">🔔</Typography>
            </TouchableOpacity>
          </View>

          {/* Theme Toggle for Testing */}
          <View className="mb-6 flex-row items-center justify-between">
            <Typography variant="body1" color="secondary">
              Theme Settings:
            </Typography>
            <ThemeToggle />
          </View>
        </Animated.View>

        {/* Stats Overview */}
        <View className="mb-8">
          <Typography variant="h3" weight="semibold" style={{ marginBottom: 16 }}>
            Overview
          </Typography>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row">
              <StatCard
                title="Total Sales"
                value="$24,500"
                change="+12% from last month"
                icon="📈"
              />
              <StatCard title="Active Users" value="1,249" change="+8% from last week" icon="👥" />
              <StatCard title="Orders" value="89" change="+23% from yesterday" icon="🛒" />
            </View>
          </ScrollView>
        </View>

        {/* Quick Actions */}
        <View className="mb-8">
          <Typography variant="h3" weight="semibold" style={{ marginBottom: 16 }}>
            Quick Actions
          </Typography>
          <View className="flex-row flex-wrap">
            <ActionCard
              title="Add Product"
              subtitle="Create new product"
              icon="➕"
              onPress={() => {}}
            />
            <ActionCard
              title="View Analytics"
              subtitle="Check performance"
              icon="📊"
              onPress={() => {}}
            />
            <ActionCard
              title="Messages"
              subtitle="Chat with customers"
              icon="💬"
              onPress={() => {}}
            />
            <ActionCard
              title="Settings"
              subtitle="Manage preferences"
              icon="⚙️"
              onPress={() => {}}
            />
          </View>
        </View>

        {/* Recent Activity */}
        <View className="mb-8">
          <Typography variant="h3" weight="semibold" style={{ marginBottom: 16 }}>
            Recent Activity
          </Typography>
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

        {/* Upgrade CTA */}
        <View className="pb-8">
          <TouchableOpacity>
            <LinearGradient
              colors={[colors.accent, colors.primary, colors.primaryLight]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                borderRadius: 20,
                padding: 20,
                shadowColor: colors.accent,
                shadowOffset: { width: 0, height: 12 },
                shadowOpacity: 0.4,
                shadowRadius: 16,
                elevation: 16,
                borderWidth: 2,
                borderColor: 'rgba(255, 255, 255, 0.2)',
              }}>
              <View className="flex-row items-center justify-between">
                <View>
                  <Typography
                    variant="h4"
                    weight="semibold"
                    style={{ color: colors.primaryForeground }}>
                    Upgrade to Pro
                  </Typography>
                  <Typography variant="body2" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    Unlock premium features
                  </Typography>
                </View>
                <Typography variant="h2">✨</Typography>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Container>
  );
}
