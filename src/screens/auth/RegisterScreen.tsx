import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { storage } from '../../utils/storage';
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
      // Check if user already exists
      const existingUser = await storage.getUserData();
      if (existingUser && existingUser.email === formData.email.toLowerCase()) {
        Alert.alert('Error', 'An account with this email already exists');
        setIsLoading(false);
        return;
      }

      // Create user data structure (without smoking history for now)
      const userData = {
        displayName: formData.displayName.trim(),
        email: formData.email.toLowerCase().trim(),
        smokingHistory: {
          yearsSmoked: 0,
          cigarettesPerDay: 0,
          costPerPack: 10,
          motivations: [],
        },
        createdAt: new Date().toISOString(),
      };

      // Save user data
      await storage.saveUserData(userData);
      await storage.setAuthToken('demo_token_' + Date.now());
      
      Alert.alert(
        'Success', 
        'Account created successfully! Let\'s complete your profile.',
        [{ text: 'Continue', onPress: onRegisterSuccess }]
      );
    } catch (error) {
      Alert.alert('Error', 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-gradient-to-br from-red-300 to-red-500"
    >
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="flex-1 justify-center px-8 py-12">
          {/* Header */}
          <View className="items-center mb-8">
            <Text className="text-4xl font-bold text-white mb-2">Join AuraShift</Text>
            <Text className="text-lg text-red-100 text-center">
              Start your transformation journey today
            </Text>
          </View>

          {/* Register Form */}
          <View className="bg-white rounded-3xl p-8 shadow-2xl">
            <Text className="text-2xl font-bold text-black text-center mb-8">
              Create Account
            </Text>

            {/* Name Input */}
            <View className="mb-4">
              <Text className="text-black font-medium mb-2">Full Name</Text>
              <TextInput
                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-black text-base"
                placeholder="Enter your full name"
                placeholderTextColor="#9CA3AF"
                value={formData.displayName}
                onChangeText={(value) => handleInputChange('displayName', value)}
                autoCapitalize="words"
              />
            </View>

            {/* Email Input */}
            <View className="mb-4">
              <Text className="text-black font-medium mb-2">Email</Text>
              <TextInput
                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-black text-base"
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
            <View className="mb-4">
              <Text className="text-black font-medium mb-2">Password</Text>
              <TextInput
                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-black text-base"
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
              <Text className="text-black font-medium mb-2">Confirm Password</Text>
              <TextInput
                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-black text-base"
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
              className={`rounded-xl py-4 mb-6 ${isLoading ? 'bg-gray-400' : 'bg-gradient-to-r from-red-400 to-red-500'}`}
              onPress={handleRegister}
              disabled={isLoading}
            >
              <Text className="text-white text-center font-bold text-lg">
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Text>
            </TouchableOpacity>

            {/* Switch to Login */}
            <View className="flex-row justify-center">
              <Text className="text-black">Already have an account? </Text>
              <TouchableOpacity onPress={onSwitchToLogin}>
                <Text className="text-red-600 font-bold">Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Footer */}
          <Text className="text-red-100 text-center mt-8 text-sm">
            By creating an account, you're taking the first step towards a healthier you
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;
