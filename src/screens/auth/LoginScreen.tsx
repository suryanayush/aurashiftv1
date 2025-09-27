import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { storage } from '../../utils/storage';

interface LoginScreenProps {
  onLoginSuccess: () => void;
  onSwitchToRegister: () => void;
}

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
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-gradient-to-br from-blue-500 to-purple-600"
    >
      <View className="flex-1 justify-center px-8">
        {/* Header */}
        <View className="items-center mb-12">
          <Text className="text-4xl font-bold text-white mb-2">Welcome Back</Text>
          <Text className="text-lg text-blue-100 text-center">
            Continue your smoke-free journey
          </Text>
        </View>

        {/* Login Form */}
        <View className="bg-white rounded-3xl p-8 shadow-2xl">
          <Text className="text-2xl font-bold text-gray-800 text-center mb-8">
            Sign In
          </Text>

          {/* Email Input */}
          <View className="mb-6">
            <Text className="text-gray-700 font-medium mb-2">Email</Text>
            <TextInput
              className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-gray-800 text-base"
              placeholder="Enter your email"
              placeholderTextColor="#9CA3AF"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* Password Input */}
          <View className="mb-8">
            <Text className="text-gray-700 font-medium mb-2">Password</Text>
            <TextInput
              className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-gray-800 text-base"
              placeholder="Enter your password"
              placeholderTextColor="#9CA3AF"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
            />
          </View>

          {/* Login Button */}
          <TouchableOpacity
            className={`rounded-xl py-4 mb-6 ${isLoading ? 'bg-gray-400' : 'bg-gradient-to-r from-blue-500 to-purple-600'}`}
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text className="text-white text-center font-bold text-lg">
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Text>
          </TouchableOpacity>

          {/* Switch to Register */}
          <View className="flex-row justify-center">
            <Text className="text-gray-600">Don't have an account? </Text>
            <TouchableOpacity onPress={onSwitchToRegister}>
              <Text className="text-blue-600 font-bold">Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer */}
        <Text className="text-blue-100 text-center mt-8 text-sm">
          Your journey to wellness starts here
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
