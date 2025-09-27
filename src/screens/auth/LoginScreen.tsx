import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { storage } from '../../utils/storage';
import { LoginScreenProps } from '../../types';

const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess, onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      // For now, simulate login with localStorage check
      const userData = await storage.getUserData();
      
      if (userData && userData.email === email.toLowerCase()) {
        // Simulate successful login
        await storage.setAuthToken('demo_token_' + Date.now());
        onLoginSuccess();
      } else {
        Alert.alert('Error', 'Invalid credentials. Please register first or check your email.');
      }
    } catch (error) {
      Alert.alert('Error', 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header Background */}
      <View className="bg-red-400 pt-16 pb-8" style={{ borderBottomLeftRadius: 40, borderBottomRightRadius: 40 }}>
        <View className="px-8">
          <Text className="text-3xl font-bold text-white mb-2">Welcome Back</Text>
          <Text className="text-red-100 text-base">
            Continue your smoke-free journey
          </Text>
        </View>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 px-6 -mt-6"
      >
        {/* Login Card */}
        <View className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
          <View className="items-center mb-8">
            <View className="w-16 h-16 bg-red-100 rounded-2xl items-center justify-center mb-4">
              <View className="w-8 h-8 bg-red-400 rounded-xl" />
            </View>
            <Text className="text-2xl font-bold text-gray-900">Sign In</Text>
            <Text className="text-gray-500 text-sm mt-1">Enter your credentials to continue</Text>
          </View>

          {/* Email Input */}
          <View className="mb-6">
            <Text className="text-gray-700 font-semibold mb-3">Email Address</Text>
            <View className="relative">
              <TextInput
                className="bg-gray-50 border-2 border-gray-100 rounded-2xl px-4 py-4 text-gray-900 text-base focus:border-red-400"
                placeholder="Enter your email"
                placeholderTextColor="#9CA3AF"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>

          {/* Password Input */}
          <View className="mb-8">
            <Text className="text-gray-700 font-semibold mb-3">Password</Text>
            <View className="relative">
              <TextInput
                className="bg-gray-50 border-2 border-gray-100 rounded-2xl px-4 py-4 text-gray-900 text-base focus:border-red-400"
                placeholder="Enter your password"
                placeholderTextColor="#9CA3AF"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Login Button */}
          <TouchableOpacity
            className={`rounded-2xl py-4 mb-6 shadow-lg ${isLoading ? 'bg-gray-400' : 'bg-red-500'}`}
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text className="text-white text-center font-bold text-lg">
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Text>
          </TouchableOpacity>

          {/* Switch to Register */}
          <View className="flex-row justify-center items-center">
            <Text className="text-gray-600">Don't have an account? </Text>
            <TouchableOpacity onPress={onSwitchToRegister}>
              <Text className="text-red-500 font-bold">Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer */}
        <View className="flex-1 justify-end pb-8">
          <Text className="text-gray-500 text-center text-sm">
            Your journey to wellness starts here
          </Text>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default LoginScreen;
