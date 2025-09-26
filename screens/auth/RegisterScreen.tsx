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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

interface RegisterScreenProps {
  onRegisterSuccess?: () => void;
  onNavigateToLogin?: () => void;
}

export default function RegisterScreen({
  onRegisterSuccess,
  onNavigateToLogin,
}: RegisterScreenProps) {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

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
        className={`rounded-2xl border-2 bg-white/80 backdrop-blur-sm ${
          focusedField === field ? 'border-purple-400' : 'border-gray-200'
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
    <LinearGradient colors={['#f8fafc', '#e2e8f0', '#cbd5e1']} className="flex-1">
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
              className="pb-8 pt-12">
              <View className="mb-12 items-center">
                <View className="mb-6 h-24 w-24 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg">
                  <Text className="text-3xl font-bold text-white">✨</Text>
                </View>
                <Text className="mb-3 text-4xl font-bold text-gray-800">Create Account</Text>
                <Text className="text-center text-base leading-relaxed text-gray-600">
                  Join thousands of users and start your amazing journey today
                </Text>
              </View>

              <View className="space-y-4">
                <InputField label="Full Name" field="fullName" placeholder="Enter your full name" />

                <InputField
                  label="Email Address"
                  field="email"
                  placeholder="Enter your email"
                  keyboardType="email-address"
                />

                <InputField
                  label="Password"
                  field="password"
                  placeholder="Create a password"
                  secureTextEntry
                />

                <InputField
                  label="Confirm Password"
                  field="confirmPassword"
                  placeholder="Confirm your password"
                  secureTextEntry
                />
              </View>

              <TouchableOpacity className="mt-8" onPress={onRegisterSuccess}>
                <LinearGradient
                  colors={['#8b5cf6', '#a855f7']}
                  className="rounded-2xl py-4 shadow-lg">
                  <Text className="text-center text-lg font-semibold text-white">
                    Create Account
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              <View className="my-8 flex-row items-center">
                <View className="h-px flex-1 bg-gray-300" />
                <Text className="mx-4 font-medium text-gray-500">Or continue with</Text>
                <View className="h-px flex-1 bg-gray-300" />
              </View>

              <View className="mb-8 flex-row space-x-3">
                <SocialButton icon="📱" text="Google" bgColor="bg-red-500" />
                <SocialButton icon="🍎" text="Apple" bgColor="bg-gray-800" />
              </View>

              <View className="flex-row items-center justify-center">
                <Text className="text-gray-600">Already have an account? </Text>
                <TouchableOpacity onPress={onNavigateToLogin}>
                  <Text className="font-semibold text-purple-600">Sign In</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}
