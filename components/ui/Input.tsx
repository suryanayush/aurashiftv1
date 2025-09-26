import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

export interface InputProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  error?: string;
  disabled?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoComplete?: string;
}

export function Input({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  error,
  disabled = false,
  multiline = false,
  numberOfLines = 1,
  leftIcon,
  rightIcon,
  onRightIconPress,
  autoCapitalize = 'sentences',
  autoComplete,
}: InputProps) {
  const { colors } = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  const getBorderColor = () => {
    if (error) return '#EF4444';
    if (isFocused) return colors.primary;
    return colors.border;
  };

  const getBackgroundColor = () => {
    if (disabled) return colors.backgroundTertiary;
    return colors.surface;
  };

  return (
    <View className="mb-4">
      {label && (
        <Text className="mb-2 ml-1 text-sm font-medium" style={{ color: colors.text }}>
          {label}
        </Text>
      )}

      <View
        className="flex-row items-center rounded-2xl border-2 px-4"
        style={{
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
          minHeight: multiline ? numberOfLines * 24 + 32 : 56,
        }}>
        {leftIcon && (
          <View className="mr-3" style={{ opacity: disabled ? 0.5 : 1 }}>
            {leftIcon}
          </View>
        )}

        <TextInput
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          placeholderTextColor={colors.textTertiary}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          editable={!disabled}
          multiline={multiline}
          numberOfLines={numberOfLines}
          autoCapitalize={autoCapitalize}
          autoComplete={autoComplete}
          className="flex-1 text-base"
          style={{
            color: disabled ? colors.textTertiary : colors.text,
            textAlignVertical: multiline ? 'top' : 'center',
          }}
        />

        {rightIcon && (
          <TouchableOpacity
            onPress={onRightIconPress}
            disabled={!onRightIconPress}
            className="ml-3"
            style={{ opacity: disabled ? 0.5 : 1 }}>
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>

      {error && (
        <Text className="ml-1 mt-1 text-sm" style={{ color: '#EF4444' }}>
          {error}
        </Text>
      )}
    </View>
  );
}
