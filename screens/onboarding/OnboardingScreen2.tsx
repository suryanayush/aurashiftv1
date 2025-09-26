import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Dimensions, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

interface OnboardingScreen2Props {
  onNext?: () => void;
  onSkip?: () => void;
  onBack?: () => void;
}

export default function OnboardingScreen2({ onNext, onSkip, onBack }: OnboardingScreen2Props) {
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
    <LinearGradient colors={['#ffecd2', '#fcb69f']} className="flex-1">
      <SafeAreaView className="flex-1">
        <View className="flex-1 px-6">
          <View className="mb-8 mt-4 flex-row items-center justify-between">
            <TouchableOpacity onPress={onBack} className="rounded-full bg-white/20 px-4 py-2">
              <Text className="font-medium text-white">← Back</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={onSkip} className="rounded-full bg-white/20 px-4 py-2">
              <Text className="font-medium text-white">Skip</Text>
            </TouchableOpacity>
          </View>

          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
            }}
            className="flex-1 items-center justify-center">
            <View className="mb-16 h-64 w-64 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm">
              <View className="h-48 w-48 items-center justify-center rounded-full bg-white/25">
                <Text className="text-8xl">⚡</Text>
              </View>
            </View>

            <Text className="mb-6 text-center text-4xl font-bold tracking-wide text-white">
              Lightning Fast
            </Text>

            <Text className="mb-16 px-4 text-center text-lg leading-relaxed text-white/95">
              Experience blazing fast performance with our optimized platform that delivers results
              in real-time
            </Text>

            <View className="mb-8 flex-row space-x-3">
              <View className="h-2 w-2 rounded-full bg-white/40" />
              <View className="h-2 w-8 rounded-full bg-white" />
              <View className="h-2 w-2 rounded-full bg-white/40" />
              <View className="h-2 w-2 rounded-full bg-white/40" />
            </View>
          </Animated.View>

          <TouchableOpacity onPress={onNext} className="mb-8">
            <LinearGradient colors={['#ffffff', '#f8fafc']} className="rounded-2xl py-4 shadow-lg">
              <Text className="text-center text-lg font-semibold text-orange-600">Continue</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
