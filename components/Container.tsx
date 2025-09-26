import React from 'react';
import { SafeAreaView, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';

export interface ContainerProps {
  children: React.ReactNode;
  variant?: 'default' | 'gradient' | 'surface';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  safe?: boolean;
}

export const Container = ({
  children,
  variant = 'default',
  padding = 'md',
  safe = true,
}: ContainerProps) => {
  const { colors, activeTheme } = useTheme();

  const getPaddingStyles = () => {
    switch (padding) {
      case 'none':
        return '';
      case 'sm':
        return 'px-4';
      case 'lg':
        return 'px-8';
      default:
        return 'px-6';
    }
  };

  const containerStyles = `flex-1 ${getPaddingStyles()}`;

  const ContainerContent = () => <View className={containerStyles}>{children}</View>;

  if (variant === 'gradient') {
    const gradientColors =
      activeTheme === 'dark'
        ? ([colors.background, colors.backgroundSecondary, colors.backgroundTertiary] as const)
        : ([colors.background, colors.backgroundSecondary, colors.backgroundTertiary] as const);

    return (
      <LinearGradient colors={gradientColors} style={{ flex: 1 }}>
        {safe ? (
          <SafeAreaView className="flex-1">
            <ContainerContent />
          </SafeAreaView>
        ) : (
          <ContainerContent />
        )}
      </LinearGradient>
    );
  }

  const backgroundColor = variant === 'surface' ? colors.surface : colors.background;

  return (
    <View className="flex-1" style={{ backgroundColor }}>
      {safe ? (
        <SafeAreaView className="flex-1">
          <ContainerContent />
        </SafeAreaView>
      ) : (
        <ContainerContent />
      )}
    </View>
  );
};
