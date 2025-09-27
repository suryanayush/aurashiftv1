import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { onboardingAPI } from '../../api/auth';
import { OnboardingFlowProps, OnboardingData } from '../../types';

const MOTIVATION_OPTIONS = [
  'Health & Wellness',
  'Save Money',
  'Family & Relationships',
  'Physical Appearance',
  'Fitness & Performance',
  'Social Reasons',
  'Self-Control',
  'Medical Advice',
];

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    yearsSmoked: '',
    cigarettesPerDay: '',
    costPerPack: '10',
    motivations: [],
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: keyof OnboardingData, value: string) => {
    setOnboardingData(prev => ({ ...prev, [field]: value }));
  };

  const toggleMotivation = (motivation: string) => {
    setOnboardingData(prev => ({
      ...prev,
      motivations: prev.motivations.includes(motivation)
        ? prev.motivations.filter(m => m !== motivation)
        : [...prev.motivations, motivation]
    }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!onboardingData.yearsSmoked || isNaN(Number(onboardingData.yearsSmoked)) || Number(onboardingData.yearsSmoked) < 0) {
          Alert.alert('Error', 'Please enter a valid number of years');
          return false;
        }
        return true;
      case 2:
        if (!onboardingData.cigarettesPerDay || isNaN(Number(onboardingData.cigarettesPerDay)) || Number(onboardingData.cigarettesPerDay) < 0) {
          Alert.alert('Error', 'Please enter a valid number of cigarettes per day');
          return false;
        }
        return true;
      case 3:
        if (onboardingData.motivations.length === 0) {
          Alert.alert('Error', 'Please select at least one motivation');
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 3) {
        setCurrentStep(currentStep + 1);
      } else {
        handleComplete();
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    setIsLoading(true);
    
    try {
      const response = await onboardingAPI.completeOnboarding({
        yearsSmoked: Number(onboardingData.yearsSmoked),
        cigarettesPerDay: Number(onboardingData.cigarettesPerDay),
        costPerPack: Number(onboardingData.costPerPack),
        motivations: onboardingData.motivations,
      });

      if (response.success && response.user) {
        // Update local storage for offline access
        const { storage } = await import('../../utils/storage');
        await storage.setOnboardingCompleted(true);
        await storage.setTimerStart(new Date());
        await storage.setAuraScore(0);

        Alert.alert(
          'Welcome to AuraShift!',
          'Your profile is complete. Your smoke-free journey starts now!',
          [{ text: 'Let\'s Go!', onPress: onComplete }]
        );
      } else {
        Alert.alert('Error', response.error || 'Failed to save onboarding data. Please try again.');
      }
    } catch (error) {
      console.error('Onboarding completion error:', error);
      Alert.alert('Error', 'Failed to save onboarding data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <View>
            <Text className="text-2xl font-bold text-black text-center mb-4">
              Smoking History
            </Text>
            <Text className="text-black text-center mb-8">
              Help us understand your smoking background
            </Text>
            <View className="mb-6">
              <Text className="text-black font-medium mb-2">How many years have you been smoking?</Text>
              <TextInput
                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-black text-base text-center"
                placeholder="Enter number of years"
                placeholderTextColor="#9CA3AF"
                value={onboardingData.yearsSmoked}
                onChangeText={(value) => handleInputChange('yearsSmoked', value)}
                keyboardType="numeric"
              />
            </View>
          </View>
        );

      case 2:
        return (
          <View>
            <Text className="text-2xl font-bold text-black text-center mb-4">
              Daily Consumption
            </Text>
            <Text className="text-black text-center mb-8">
              This helps us calculate your progress and savings
            </Text>
            
            <View className="mb-6">
              <Text className="text-black font-medium mb-2">How many cigarettes do you smoke per day?</Text>
              <TextInput
                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-black text-base text-center"
                placeholder="Enter number of cigarettes"
                placeholderTextColor="#9CA3AF"
                value={onboardingData.cigarettesPerDay}
                onChangeText={(value) => handleInputChange('cigarettesPerDay', value)}
                keyboardType="numeric"
              />
            </View>

            <View className="mb-6">
              <Text className="text-black font-medium mb-2">Cost per pack (optional)</Text>
              <TextInput
                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-black text-base text-center"
                placeholder="Enter cost per pack"
                placeholderTextColor="#9CA3AF"
                value={onboardingData.costPerPack}
                onChangeText={(value) => handleInputChange('costPerPack', value)}
                keyboardType="numeric"
              />
            </View>
          </View>
        );

      case 3:
        return (
          <View>
            <Text className="text-2xl font-bold text-black text-center mb-4">
              Your Motivations
            </Text>
            <Text className="text-black text-center mb-8">
              What drives you to quit smoking? (Select all that apply)
            </Text>
            
            <ScrollView className="max-h-80" showsVerticalScrollIndicator={false}>
              {MOTIVATION_OPTIONS.map((motivation) => (
                <TouchableOpacity
                  key={motivation}
                  className={`p-4 rounded-xl mb-3 border-2 ${
                    onboardingData.motivations.includes(motivation)
                      ? 'bg-red-50 border-red-400'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                  onPress={() => toggleMotivation(motivation)}
                >
                  <Text className={`text-center font-medium ${
                    onboardingData.motivations.includes(motivation)
                      ? 'text-red-700'
                      : 'text-black'
                  }`}>
                    {motivation}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-red-400 pt-16 pb-12" style={{ borderBottomLeftRadius: 40, borderBottomRightRadius: 40 }}>
        <View className="px-8">
          <Text className="text-3xl font-bold text-white mb-2">Setup Profile</Text>
          <Text className="text-red-100 text-base mb-8">
            Help us personalize your journey
          </Text>
          
          {/* Modern Progress Indicator */}
          <View className="w-full flex-row items-center">
            {[1, 2, 3].map((step, index) => (
              <React.Fragment key={step}>
                <View
                  className={`w-10 h-10 rounded-2xl items-center justify-center ${
                    step <= currentStep ? 'bg-white' : 'bg-white'
                  }`}
                  style={{ opacity: step <= currentStep ? 1 : 0.2 }}
                >
                  <Text className={`font-bold ${
                    step <= currentStep ? 'text-red-500' : 'text-white'
                  }`}
                  style={{ opacity: step <= currentStep ? 1 : 0.6 }}>
                    {step}
                  </Text>
                </View>
                {index < 2 && (
                  <View 
                    className={`flex-1 h-1 mx-3 rounded-full ${
                      step < currentStep ? 'bg-white' : 'bg-white'
                    }`}
                    style={{ opacity: step < currentStep ? 1 : 0.2 }}
                  />
                )}
              </React.Fragment>
            ))}
          </View>
        </View>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 px-6 -mt-6"
      >
        {/* Content Card */}
        <View className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
          {renderStep()}

          {/* Navigation Buttons */}
          <View className="flex-row justify-between mt-8">
            <TouchableOpacity
              className={`flex-1 py-4 rounded-2xl mr-3 ${
                currentStep === 1 ? 'bg-gray-100' : 'bg-gray-100 border-2 border-gray-200'
              }`}
              onPress={handleBack}
              disabled={currentStep === 1}
            >
              <Text className={`text-center font-bold ${
                currentStep === 1 ? 'text-gray-400' : 'text-gray-700'
              }`}>
                Back
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className={`flex-1 py-4 rounded-2xl ml-3 shadow-lg ${
                isLoading ? 'bg-gray-400' : 'bg-red-500'
              }`}
              onPress={handleNext}
              disabled={isLoading}
            >
              <Text className="text-white text-center font-bold">
                {isLoading ? 'Saving...' : currentStep === 3 ? 'Complete' : 'Next'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default OnboardingFlow;
