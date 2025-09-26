import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { Typography } from './Typography';

export function ThemeToggle() {
  const { themeMode, toggleTheme, colors } = useTheme();

  const getThemeIcon = () => {
    switch (themeMode) {
      case 'light':
        return '☀️';
      case 'dark':
        return '🌙';
      default:
        return '🔄';
    }
  };

  const getThemeLabel = () => {
    switch (themeMode) {
      case 'light':
        return 'Light';
      case 'dark':
        return 'Dark';
      default:
        return 'System';
    }
  };

  return (
    <TouchableOpacity
      onPress={toggleTheme}
      className="rounded-full px-4 py-2"
      style={{
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
      }}>
      <View className="flex-row items-center">
        <Typography variant="body1" style={{ marginRight: 8 }}>
          {getThemeIcon()}
        </Typography>
        <Typography variant="body2" weight="medium">
          {getThemeLabel()}
        </Typography>
      </View>
    </TouchableOpacity>
  );
}
