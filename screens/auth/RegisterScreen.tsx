import React, { useState, useRef } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
  View,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { Container } from '../../components/Container';
import { Button, Input, Typography, Card } from '../../components/ui';

interface RegisterScreenProps {
  onRegisterSuccess?: () => void;
  onNavigateToLogin?: () => void;
}

export default function RegisterScreen({
  onRegisterSuccess,
  onNavigateToLogin,
}: RegisterScreenProps) {
  const { colors } = useTheme();
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
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
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!form.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!form.password) {
      newErrors.password = 'Password is required';
    } else if (form.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!form.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      onRegisterSuccess?.();
    }, 2000);
  };

  const SocialButton = ({ icon, text }: { icon: string; text: string }) => (
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
            className="pb-8 pt-12">
            {/* Header */}
            <View className="mb-8 items-center">
              <View
                className="shadow-large mb-6 h-24 w-24 items-center justify-center rounded-4xl"
                style={{ backgroundColor: colors.accent }}>
                <Typography
                  variant="h2"
                  weight="bold"
                  style={{ color: colors.primaryForeground, fontSize: 28 }}>
                  ✨
                </Typography>
              </View>
              <Typography variant="h1" weight="bold" align="center" style={{ marginBottom: 12 }}>
                Create Account
              </Typography>
              <Typography
                variant="body1"
                color="secondary"
                align="center"
                style={{ paddingHorizontal: 16, lineHeight: 24 }}>
                Join thousands of users and start your amazing journey today
              </Typography>
            </View>

            {/* Registration Form */}
            <Card variant="elevated" padding="lg" margin="sm">
              <Input
                label="Full Name"
                placeholder="Enter your full name"
                value={form.fullName}
                onChangeText={(value) => handleInputChange('fullName', value)}
                error={errors.fullName}
                autoCapitalize="words"
              />

              <Input
                label="Email Address"
                placeholder="Enter your email"
                value={form.email}
                onChangeText={(value) => handleInputChange('email', value)}
                keyboardType="email-address"
                autoCapitalize="none"
                error={errors.email}
              />

              <Input
                label="Password"
                placeholder="Create a password"
                value={form.password}
                onChangeText={(value) => handleInputChange('password', value)}
                secureTextEntry
                error={errors.password}
              />

              <Input
                label="Confirm Password"
                placeholder="Confirm your password"
                value={form.confirmPassword}
                onChangeText={(value) => handleInputChange('confirmPassword', value)}
                secureTextEntry
                error={errors.confirmPassword}
              />

              {/* Terms & Privacy */}
              <Typography
                variant="caption"
                color="tertiary"
                align="center"
                style={{ marginBottom: 24, lineHeight: 16 }}>
                By creating an account, you agree to our Terms of Service and Privacy Policy
              </Typography>

              {/* Register Button */}
              <Button
                title="Create Account"
                onPress={handleRegister}
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
                Or continue with
              </Typography>
              <View className="h-px flex-1" style={{ backgroundColor: colors.divider }} />
            </View>

            {/* Social Registration Buttons */}
            <View className="mb-8 flex-row space-x-4 px-6">
              <View className="flex-1">
                <SocialButton icon="📱" text="Google" />
              </View>
              <View className="flex-1">
                <SocialButton icon="🍎" text="Apple" />
              </View>
            </View>

            {/* Sign In Link */}
            <View className="flex-row items-center justify-center">
              <Typography variant="body1" color="secondary">
                Already have an account?{' '}
              </Typography>
              <TouchableOpacity onPress={onNavigateToLogin}>
                <Typography variant="body1" weight="semibold" color="accent">
                  Sign In
                </Typography>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Container>
  );
}
