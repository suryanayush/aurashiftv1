import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { authAPI } from '../../api/auth';
import { RegisterScreenProps } from '../../types';

const RegisterScreen: React.FC<RegisterScreenProps> = ({ onRegisterSuccess, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const { displayName, email, password, confirmPassword } = formData;

    if (!displayName.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return false;
    }

    if (!email.trim() || !email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return false;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await authAPI.register({
        displayName: formData.displayName.trim(),
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      if (response.success && response.user) {
        Alert.alert(
          'Success', 
          'Account created successfully! Let\'s complete your profile.',
          [{ text: 'Continue', onPress: onRegisterSuccess }]
        );
      } else {
        Alert.alert('Error', response.error || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert('Error', 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header Background */}
      <View className="bg-red-400 pt-16 pb-8" style={{ borderBottomLeftRadius: 40, borderBottomRightRadius: 40 }}>
        <View className="px-8">
          <Text className="text-3xl font-bold text-white mb-2">Join AuraShift</Text>
          <Text className="text-red-100 text-base">
            Start your transformation journey today
          </Text>
        </View>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView className="flex-1 px-6 -mt-6" showsVerticalScrollIndicator={false}>
          {/* Register Card */}
          <View className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 mb-8">
            <View className="items-center mb-8">
              <View className="w-16 h-16 bg-red-100 rounded-2xl items-center justify-center mb-4">
                <View className="w-8 h-8 bg-red-400 rounded-xl" />
              </View>
              <Text className="text-2xl font-bold text-gray-900">Create Account</Text>
              <Text className="text-gray-500 text-sm mt-1">Fill in your details to get started</Text>
            </View>

            {/* Name Input */}
            <View className="mb-5">
              <Text className="text-gray-700 font-semibold mb-3">Full Name</Text>
              <TextInput
                className="bg-gray-50 border-2 border-gray-100 rounded-2xl px-4 py-4 text-gray-900 text-base focus:border-red-400"
                placeholder="Enter your full name"
                placeholderTextColor="#9CA3AF"
                value={formData.displayName}
                onChangeText={(value) => handleInputChange('displayName', value)}
                autoCapitalize="words"
              />
            </View>

            {/* Email Input */}
            <View className="mb-5">
              <Text className="text-gray-700 font-semibold mb-3">Email Address</Text>
              <TextInput
                className="bg-gray-50 border-2 border-gray-100 rounded-2xl px-4 py-4 text-gray-900 text-base focus:border-red-400"
                placeholder="Enter your email"
                placeholderTextColor="#9CA3AF"
                value={formData.email}
                onChangeText={(value) => handleInputChange('email', value)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {/* Password Input */}
            <View className="mb-5">
              <Text className="text-gray-700 font-semibold mb-3">Password</Text>
              <TextInput
                className="bg-gray-50 border-2 border-gray-100 rounded-2xl px-4 py-4 text-gray-900 text-base focus:border-red-400"
                placeholder="Create a password (min 6 characters)"
                placeholderTextColor="#9CA3AF"
                value={formData.password}
                onChangeText={(value) => handleInputChange('password', value)}
                secureTextEntry
                autoCapitalize="none"
              />
            </View>

            {/* Confirm Password Input */}
            <View className="mb-8">
              <Text className="text-gray-700 font-semibold mb-3">Confirm Password</Text>
              <TextInput
                className="bg-gray-50 border-2 border-gray-100 rounded-2xl px-4 py-4 text-gray-900 text-base focus:border-red-400"
                placeholder="Confirm your password"
                placeholderTextColor="#9CA3AF"
                value={formData.confirmPassword}
                onChangeText={(value) => handleInputChange('confirmPassword', value)}
                secureTextEntry
                autoCapitalize="none"
              />
            </View>

            {/* Register Button */}
            <TouchableOpacity
              className={`rounded-2xl py-4 mb-6 shadow-lg ${isLoading ? 'bg-gray-400' : 'bg-red-500'}`}
              onPress={handleRegister}
              disabled={isLoading}
            >
              <Text className="text-white text-center font-bold text-lg">
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Text>
            </TouchableOpacity>

            {/* Switch to Login */}
            <View className="flex-row justify-center items-center">
              <Text className="text-gray-600">Already have an account? </Text>
              <TouchableOpacity onPress={onSwitchToLogin}>
                <Text className="text-red-500 font-bold">Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Footer */}
          <View className="pb-8">
            <Text className="text-gray-500 text-center text-sm">
              By creating an account, you're taking the first step towards a healthier you
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default RegisterScreen;
