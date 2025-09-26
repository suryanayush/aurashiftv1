import React, { useState, useRef } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
  Switch,
  View,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { Container } from '../../components/Container';
import { Button, Input, Typography, Card } from '../../components/ui';

interface LoginScreenProps {
  onLoginSuccess?: () => void;
  onNavigateToRegister?: () => void;
}

export default function LoginScreen({ onLoginSuccess, onNavigateToRegister }: LoginScreenProps) {
  const { colors } = useTheme();
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const slideAnim = useRef(new Animated.Value(50)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogin = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess?.();
    }, 1500);
  };

  const SocialButton = ({ icon, text, color }: { icon: string; text: string; color: string }) => (
    <Button
      title=""
      variant="outline"
      size="sm"
      icon={
        <View className="flex-row items-center">
          <Typography variant="body1" style={{ marginRight: 8 }}>
            {icon}
          </Typography>
          <Typography variant="body2" weight="medium" color="secondary">
            {text}
          </Typography>
        </View>
      }
      onPress={() => {}}
    />
  );

  return (
    <Container variant="gradient">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1">
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
            className="pb-8 pt-16">
            {/* Header */}
            <View className="mb-12 items-center">
              <View
                className="shadow-large mb-8 h-28 w-28 items-center justify-center rounded-4xl"
                style={{ backgroundColor: colors.primary }}>
                <Typography
                  variant="h1"
                  weight="bold"
                  style={{ color: colors.primaryForeground, fontSize: 36 }}>
                  👋
                </Typography>
              </View>
              <Typography variant="h1" weight="bold" align="center" style={{ marginBottom: 16 }}>
                Welcome Back
              </Typography>
              <Typography
                variant="body1"
                color="secondary"
                align="center"
                style={{ paddingHorizontal: 16, lineHeight: 24 }}>
                Sign in to your account and continue your journey
              </Typography>
            </View>

            {/* Login Form */}
            <Card variant="elevated" padding="lg" margin="sm">
              <Input
                label="Email Address"
                placeholder="Enter your email"
                value={form.email}
                onChangeText={(value) => handleInputChange('email', value)}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <Input
                label="Password"
                placeholder="Enter your password"
                value={form.password}
                onChangeText={(value) => handleInputChange('password', value)}
                secureTextEntry
              />

              {/* Remember Me & Forgot Password */}
              <View className="mb-6 mt-2 flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <Switch
                    value={rememberMe}
                    onValueChange={setRememberMe}
                    trackColor={{ false: colors.border, true: colors.primary }}
                    thumbColor={colors.surface}
                  />
                  <Typography variant="body2" weight="medium" style={{ marginLeft: 12 }}>
                    Remember me
                  </Typography>
                </View>

                <TouchableOpacity>
                  <Typography variant="body2" weight="semibold" color="accent">
                    Forgot Password?
                  </Typography>
                </TouchableOpacity>
              </View>

              {/* Login Button */}
              <Button
                title="Sign In"
                onPress={handleLogin}
                loading={isLoading}
                fullWidth
                size="lg"
              />
            </Card>

            {/* Divider */}
            <View className="my-8 flex-row items-center px-6">
              <View className="h-px flex-1" style={{ backgroundColor: colors.divider }} />
              <Typography
                variant="body2"
                color="tertiary"
                weight="medium"
                style={{ marginHorizontal: 16 }}>
                Or sign in with
              </Typography>
              <View className="h-px flex-1" style={{ backgroundColor: colors.divider }} />
            </View>

            {/* Social Login Buttons */}
            <View className="mb-12 flex-row space-x-3 px-6">
              <View className="flex-1">
                <SocialButton icon="📱" text="Google" color="#EA4335" />
              </View>
              <View className="flex-1">
                <SocialButton icon="🍎" text="Apple" color="#000000" />
              </View>
              <View className="flex-1">
                <SocialButton icon="📘" text="Facebook" color="#1877F2" />
              </View>
            </View>

            {/* Sign Up Link */}
            <View className="flex-row items-center justify-center">
              <Typography variant="body1" color="secondary">
                Don&apos;t have an account?{' '}
              </Typography>
              <TouchableOpacity onPress={onNavigateToRegister}>
                <Typography variant="body1" weight="semibold" color="accent">
                  Sign Up
                </Typography>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Container>
  );
}
