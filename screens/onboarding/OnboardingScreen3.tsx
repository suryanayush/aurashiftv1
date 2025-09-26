import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Dimensions, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

interface OnboardingScreen3Props {
  onNext?: () => void;
  onSkip?: () => void;
  onBack?: () => void;
}

export default function OnboardingScreen3({ onNext, onSkip, onBack }: OnboardingScreen3Props) {
  const slideAnim = useRef(new Animated.Value(100)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
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
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <LinearGradient colors={['#a8edea', '#fed6e3']} className="flex-1">
      <SafeAreaView className="flex-1">
        <View className="flex-1 px-6">
          <View className="mb-8 mt-4 flex-row items-center justify-between">
            <TouchableOpacity onPress={onBack} className="rounded-full bg-white/20 px-4 py-2">
              <Text className="font-medium text-gray-700">← Back</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={onSkip} className="rounded-full bg-white/20 px-4 py-2">
              <Text className="font-medium text-gray-700">Skip</Text>
            </TouchableOpacity>
          </View>

          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
            }}
            className="flex-1 items-center justify-center">
            <View className="mb-16 h-64 w-64 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
              <View className="h-48 w-48 items-center justify-center rounded-full bg-white/30">
                <Text className="text-8xl">🔒</Text>
              </View>
            </View>

            <Text className="mb-6 text-center text-4xl font-bold tracking-wide text-gray-800">
              Secure & Safe
            </Text>

            <Text className="mb-16 px-4 text-center text-lg leading-relaxed text-gray-700">
              Your data is protected with enterprise-grade security and privacy features you can
              trust
            </Text>

            <View className="mb-8 flex-row space-x-3">
              <View className="h-2 w-2 rounded-full bg-gray-400" />
              <View className="h-2 w-2 rounded-full bg-gray-400" />
              <View className="h-2 w-8 rounded-full bg-gray-600" />
              <View className="h-2 w-2 rounded-full bg-gray-400" />
            </View>
          </Animated.View>

          <TouchableOpacity onPress={onNext} className="mb-8">
            <LinearGradient colors={['#4f46e5', '#7c3aed']} className="rounded-2xl py-4 shadow-lg">
              <Text className="text-center text-lg font-semibold text-white">Continue</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
