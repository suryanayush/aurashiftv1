import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
  Switch,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

interface LoginScreenProps {
  onLoginSuccess?: () => void;
  onNavigateToRegister?: () => void;
}

export default function LoginScreen({ onLoginSuccess, onNavigateToRegister }: LoginScreenProps) {
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const [rememberMe, setRememberMe] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
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

  const InputField = ({
    label,
    field,
    placeholder,
    secureTextEntry = false,
    keyboardType = 'default',
  }: any) => (
    <View className="mb-6">
      <Text className="mb-2 ml-1 text-sm font-medium text-gray-700">{label}</Text>
      <View
        className={`rounded-2xl border-2 bg-white/90 backdrop-blur-sm ${
          focusedField === field ? 'border-blue-400' : 'border-gray-200'
        } shadow-sm`}>
        <TextInput
          value={form[field as keyof typeof form]}
          onChangeText={(value) => handleInputChange(field, value)}
          onFocus={() => setFocusedField(field)}
          onBlur={() => setFocusedField(null)}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          className="px-4 py-4 text-base text-gray-800"
        />
      </View>
    </View>
  );

  const SocialButton = ({ icon, text, bgColor }: any) => (
    <TouchableOpacity className={`flex-1 ${bgColor} mx-1 rounded-xl py-4 shadow-sm`}>
      <View className="flex-row items-center justify-center">
        <Text className="mr-2 text-lg">{icon}</Text>
        <Text className="font-medium text-white">{text}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <LinearGradient colors={['#ddd6fe', '#e0e7ff', '#f1f5f9']} className="flex-1">
      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1">
          <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
            <Animated.View
              style={{
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }}
              className="pb-8 pt-16">
              <View className="mb-16 items-center">
                <View className="mb-8 h-28 w-28 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600 shadow-xl">
                  <Text className="text-4xl font-bold text-white">👋</Text>
                </View>
                <Text className="mb-4 text-4xl font-bold text-gray-800">Welcome Back</Text>
                <Text className="px-4 text-center text-base leading-relaxed text-gray-600">
                  Sign in to your account and continue your journey
                </Text>
              </View>

              <View className="space-y-4">
                <InputField
                  label="Email Address"
                  field="email"
                  placeholder="Enter your email"
                  keyboardType="email-address"
                />

                <InputField
                  label="Password"
                  field="password"
                  placeholder="Enter your password"
                  secureTextEntry
                />
              </View>

              <View className="mb-8 mt-6 flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <Switch
                    value={rememberMe}
                    onValueChange={setRememberMe}
                    trackColor={{ false: '#e5e7eb', true: '#3b82f6' }}
                    thumbColor={rememberMe ? '#ffffff' : '#ffffff'}
                  />
                  <Text className="ml-3 font-medium text-gray-700">Remember me</Text>
                </View>

                <TouchableOpacity>
                  <Text className="font-semibold text-blue-600">Forgot Password?</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity className="mb-8" onPress={onLoginSuccess}>
                <LinearGradient
                  colors={['#3b82f6', '#1d4ed8']}
                  className="rounded-2xl py-4 shadow-lg">
                  <Text className="text-center text-lg font-semibold text-white">Sign In</Text>
                </LinearGradient>
              </TouchableOpacity>

              <View className="my-8 flex-row items-center">
                <View className="h-px flex-1 bg-gray-300" />
                <Text className="mx-4 font-medium text-gray-500">Or sign in with</Text>
                <View className="h-px flex-1 bg-gray-300" />
              </View>

              <View className="mb-12 flex-row space-x-3">
                <SocialButton icon="📱" text="Google" bgColor="bg-red-500" />
                <SocialButton icon="🍎" text="Apple" bgColor="bg-gray-800" />
                <SocialButton icon="📘" text="Facebook" bgColor="bg-blue-600" />
              </View>

              <View className="flex-row items-center justify-center">
                <Text className="text-gray-600">Don&apos;t have an account? </Text>
                <TouchableOpacity onPress={onNavigateToRegister}>
                  <Text className="font-semibold text-blue-600">Sign Up</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}
