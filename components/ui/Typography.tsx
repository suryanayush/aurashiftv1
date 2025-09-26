import React from 'react';
import { Text } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

export interface TypographyProps {
  children: React.ReactNode;
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'body1' | 'body2' | 'caption' | 'overline';
  color?: 'primary' | 'secondary' | 'tertiary' | 'accent' | 'error' | 'success' | 'warning';
  align?: 'left' | 'center' | 'right';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  style?: any;
}

export function Typography({
  children,
  variant = 'body1',
  color = 'primary',
  align = 'left',
  weight = 'normal',
  style,
}: TypographyProps) {
  const { colors } = useTheme();

  const getTextStyles = () => {
    const baseStyles = {
      textAlign: align,
      color: getTextColor(),
      fontWeight: getFontWeight(),
    };

    switch (variant) {
      case 'h1':
        return {
          ...baseStyles,
          fontSize: 32,
          lineHeight: 40,
          fontWeight: 'bold',
        };
      case 'h2':
        return {
          ...baseStyles,
          fontSize: 28,
          lineHeight: 36,
          fontWeight: 'bold',
        };
      case 'h3':
        return {
          ...baseStyles,
          fontSize: 24,
          lineHeight: 32,
          fontWeight: '600',
        };
      case 'h4':
        return {
          ...baseStyles,
          fontSize: 20,
          lineHeight: 28,
          fontWeight: '600',
        };
      case 'body1':
        return {
          ...baseStyles,
          fontSize: 16,
          lineHeight: 24,
        };
      case 'body2':
        return {
          ...baseStyles,
          fontSize: 14,
          lineHeight: 20,
        };
      case 'caption':
        return {
          ...baseStyles,
          fontSize: 12,
          lineHeight: 16,
        };
      case 'overline':
        return {
          ...baseStyles,
          fontSize: 10,
          lineHeight: 16,
          letterSpacing: 1.5,
          textTransform: 'uppercase',
        };
      default:
        return baseStyles;
    }
  };

  const getTextColor = () => {
    switch (color) {
      case 'secondary':
        return colors.textSecondary;
      case 'tertiary':
        return colors.textTertiary;
      case 'accent':
        return colors.accent;
      case 'error':
        return colors.error;
      case 'success':
        return colors.success;
      case 'warning':
        return colors.warning;
      default:
        return colors.text;
    }
  };

  const getFontWeight = () => {
    switch (weight) {
      case 'medium':
        return '500';
      case 'semibold':
        return '600';
      case 'bold':
        return '700';
      default:
        return '400';
    }
  };

  return <Text style={[getTextStyles(), style]}>{children}</Text>;
}
