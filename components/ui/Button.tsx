import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/ThemeContext';

export interface ButtonProps {
  title: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  icon,
  iconPosition = 'left',
}: ButtonProps) {
  const { colors } = useTheme();

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'px-4 py-2';
      case 'lg':
        return 'px-8 py-4';
      default:
        return 'px-6 py-3';
    }
  };

  const getTextSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'text-sm';
      case 'lg':
        return 'text-lg';
      default:
        return 'text-base';
    }
  };

  const isDisabled = disabled || loading;

  const ButtonContent = () => (
    <View className="flex-row items-center justify-center">
      {loading && (
        <ActivityIndicator
          size="small"
          color={
            variant === 'outline' || variant === 'ghost' ? colors.primary : colors.primaryForeground
          }
          style={{ marginRight: icon || title ? 8 : 0 }}
        />
      )}
      {!loading && icon && iconPosition === 'left' && (
        <View style={{ marginRight: title ? 8 : 0 }}>{icon}</View>
      )}
      {title ? (
        <Text
          className={`font-semibold ${getTextSizeStyles()}`}
          style={{
            color:
              variant === 'outline' || variant === 'ghost'
                ? isDisabled
                  ? colors.textTertiary
                  : colors.primary
                : isDisabled
                  ? colors.textTertiary
                  : colors.primaryForeground,
          }}>
          {title}
        </Text>
      ) : null}
      {!loading && icon && iconPosition === 'right' && (
        <View style={{ marginLeft: title ? 8 : 0 }}>{icon}</View>
      )}
    </View>
  );

  const baseStyles = `${getSizeStyles()} rounded-2xl ${fullWidth ? 'w-full' : ''}`;

  if (variant === 'primary') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={isDisabled}
        activeOpacity={0.8}
        className={baseStyles}>
        <LinearGradient
          colors={
            isDisabled
              ? [colors.backgroundTertiary, colors.backgroundTertiary]
              : [colors.primary, colors.primaryLight, colors.accent]
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            paddingHorizontal: size === 'sm' ? 16 : size === 'lg' ? 32 : 24,
            paddingVertical: size === 'sm' ? 8 : size === 'lg' ? 16 : 12,
            borderRadius: 16,
            shadowColor: colors.primary,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
          }}>
          <ButtonContent />
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
      className={baseStyles}
      style={{
        backgroundColor:
          variant === 'secondary'
            ? isDisabled
              ? colors.backgroundTertiary
              : colors.backgroundSecondary
            : 'transparent',
        borderWidth: variant === 'outline' ? 2 : 0,
        borderColor: isDisabled ? colors.border : colors.primary,
        opacity: isDisabled ? 0.6 : 1,
      }}>
      <ButtonContent />
    </TouchableOpacity>
  );
}
