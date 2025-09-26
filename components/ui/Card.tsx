import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

export interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: 'default' | 'elevated' | 'outlined' | 'glass';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  margin?: 'none' | 'sm' | 'md' | 'lg';
}

export function Card({
  children,
  onPress,
  variant = 'default',
  padding = 'md',
  margin = 'none',
}: CardProps) {
  const { colors, activeTheme } = useTheme();

  const getPaddingStyles = () => {
    switch (padding) {
      case 'none':
        return '';
      case 'sm':
        return 'p-3';
      case 'lg':
        return 'p-6';
      default:
        return 'p-4';
    }
  };

  const getMarginStyles = () => {
    switch (margin) {
      case 'none':
        return '';
      case 'sm':
        return 'm-2';
      case 'lg':
        return 'm-6';
      default:
        return 'm-4';
    }
  };

  const baseStyles = `rounded-2xl ${getPaddingStyles()} ${getMarginStyles()}`;

  const getCardStyles = () => {
    switch (variant) {
      case 'elevated':
        return {
          backgroundColor: colors.surface,
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: activeTheme === 'dark' ? 0.4 : 0.15,
          shadowRadius: 12,
          elevation: 12,
          borderWidth: activeTheme === 'dark' ? 1 : 0,
          borderColor: activeTheme === 'dark' ? colors.border : 'transparent',
        };
      case 'glass':
        return {
          backgroundColor:
            activeTheme === 'dark' ? 'rgba(26, 27, 58, 0.7)' : 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          borderWidth: 1,
          borderColor:
            activeTheme === 'dark' ? 'rgba(168, 85, 247, 0.2)' : 'rgba(107, 70, 193, 0.1)',
          shadowColor: colors.primary,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 8,
        };
      case 'outlined':
        return {
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.border,
        };
      default:
        return {
          backgroundColor: colors.surface,
        };
    }
  };

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
        className={baseStyles}
        style={getCardStyles()}>
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View className={baseStyles} style={getCardStyles()}>
      {children}
    </View>
  );
}
