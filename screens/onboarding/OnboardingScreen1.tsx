import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Dimensions, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

interface OnboardingScreen1Props {
  onNext?: () => void;
  onSkip?: () => void;
}

export default function OnboardingScreen1({ onNext, onSkip }: OnboardingScreen1Props) {
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
    <LinearGradient colors={['#667eea', '#764ba2']} className="flex-1">
      <SafeAreaView className="flex-1">
        <View className="flex-1 px-6">
          <TouchableOpacity
            onPress={onSkip}
            className="mt-4 self-end rounded-full bg-white/20 px-4 py-2">
            <Text className="font-medium text-white">Skip</Text>
          </TouchableOpacity>

          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
            }}
            className="flex-1 items-center justify-center">
            <View className="mb-16 h-64 w-64 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm">
              <View className="h-48 w-48 items-center justify-center rounded-full bg-white/20">
                <Text className="text-8xl">🚀</Text>
              </View>
            </View>

            <Text className="mb-6 text-center text-4xl font-bold tracking-wide text-white">
              Get Started
            </Text>

            <Text className="mb-16 px-4 text-center text-lg leading-relaxed text-white/90">
              Discover amazing features and unlock your potential with our innovative platform
              designed for success
            </Text>

            <View className="mb-8 flex-row space-x-3">
              <View className="h-2 w-8 rounded-full bg-white" />
              <View className="h-2 w-2 rounded-full bg-white/40" />
              <View className="h-2 w-2 rounded-full bg-white/40" />
              <View className="h-2 w-2 rounded-full bg-white/40" />
            </View>
          </Animated.View>

          <TouchableOpacity onPress={onNext} className="mb-8">
            <LinearGradient colors={['#ffffff', '#f8fafc']} className="rounded-2xl py-4 shadow-lg">
              <Text className="text-center text-lg font-semibold text-purple-600">Continue</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
