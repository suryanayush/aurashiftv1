import React, { useEffect } from 'react';
import { View, Text, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
  onAnimationComplete?: () => void;
}

export default function SplashScreen({ onAnimationComplete }: SplashScreenProps) {
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.3);
  const slideAnim = new Animated.Value(50);

  useEffect(() => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      setTimeout(() => {
        onAnimationComplete?.();
      }, 1000);
    });
  }, []);

  return (
    <LinearGradient colors={['#667eea', '#764ba2']} className="flex-1 items-center justify-center">
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }, { translateY: slideAnim }],
        }}
        className="items-center">
        <View className="mb-8 h-32 w-32 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
          <View className="h-20 w-20 items-center justify-center rounded-full bg-white">
            <Text className="text-4xl font-bold text-purple-600">A</Text>
          </View>
        </View>

        <Text className="mb-4 text-4xl font-bold tracking-wide text-white">AppName</Text>

        <Text className="px-8 text-center text-lg leading-relaxed text-white/80">
          Your journey begins here
        </Text>

        <View className="mt-16">
          <Animated.View
            style={{
              opacity: fadeAnim,
            }}>
            <View className="flex-row space-x-2">
              {[0, 1, 2].map((index) => (
                <Animated.View
                  key={index}
                  style={{
                    opacity: fadeAnim,
                    transform: [
                      {
                        scale: scaleAnim,
                      },
                    ],
                  }}
                  className="h-2 w-2 rounded-full bg-white/60"
                />
              ))}
            </View>
          </Animated.View>
        </View>
      </Animated.View>
    </LinearGradient>
  );
}
