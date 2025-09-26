import React, { useEffect } from 'react';
import { View, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { Typography } from '../components/ui';

interface SplashScreenProps {
  onAnimationComplete?: () => void;
}

export default function SplashScreen({ onAnimationComplete }: SplashScreenProps) {
  const { colors, activeTheme } = useTheme();
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

  const gradientColors =
    activeTheme === 'dark'
      ? [colors.backgroundSecondary, colors.backgroundTertiary] as const
      : [colors.primary, colors.primaryLight] as const;

  return (
    <LinearGradient
      colors={gradientColors}
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }, { translateY: slideAnim }],
        }}
        className="items-center">
        {/* Logo Container */}
        <View
          className="shadow-large mb-12 h-32 w-32 items-center justify-center rounded-4xl"
          style={{
            backgroundColor:
              activeTheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.2)',
          }}>
          <View
            className="h-20 w-20 items-center justify-center rounded-3xl"
            style={{ backgroundColor: colors.surface }}>
            <Typography
              variant="h1"
              weight="bold"
              style={{
                color: colors.primary,
                fontSize: 36,
              }}>
              A
            </Typography>
          </View>
        </View>

        {/* App Name */}
        <Typography
          variant="h1"
          weight="bold"
          align="center"
          style={{
            color: colors.primaryForeground,
            marginBottom: 16,
            letterSpacing: 1,
          }}>
          AppName
        </Typography>

        {/* Subtitle */}
        <Typography
          variant="body1"
          align="center"
          style={{
            color: activeTheme === 'dark' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.9)',
            paddingHorizontal: 32,
            lineHeight: 24,
            marginBottom: 64,
          }}>
          Your professional journey begins here
        </Typography>

        {/* Loading Animation */}
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
                  transform: [{ scale: scaleAnim }],
                  backgroundColor:
                    activeTheme === 'dark'
                      ? 'rgba(255, 255, 255, 0.6)'
                      : 'rgba(255, 255, 255, 0.8)',
                }}
                className="h-2 w-2 rounded-full"
              />
            ))}
          </View>
        </Animated.View>
      </Animated.View>
    </LinearGradient>
  );
}
