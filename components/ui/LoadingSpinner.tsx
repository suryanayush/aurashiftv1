import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { Typography } from './Typography';

export interface LoadingSpinnerProps {
  size?: 'small' | 'large';
  text?: string;
  color?: string;
  overlay?: boolean;
}

export function LoadingSpinner({
  size = 'large',
  text,
  color,
  overlay = false,
}: LoadingSpinnerProps) {
  const { colors } = useTheme();

  const spinnerColor = color || colors.primary;

  const Content = () => (
    <View className="items-center justify-center">
      <ActivityIndicator size={size} color={spinnerColor} />
      {text && (
        <Typography variant="body2" color="secondary" align="center" style={{ marginTop: 12 }}>
          {text}
        </Typography>
      )}
    </View>
  );

  if (overlay) {
    return (
      <View
        className="absolute inset-0 items-center justify-center"
        style={{
          backgroundColor: colors.overlay,
          zIndex: 1000,
        }}>
        <View
          className="items-center justify-center rounded-2xl px-8 py-6"
          style={{ backgroundColor: colors.surface }}>
          <Content />
        </View>
      </View>
    );
  }

  return <Content />;
}
