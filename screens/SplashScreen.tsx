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
      ? ([colors.background, colors.backgroundSecondary, colors.backgroundTertiary] as const)
      : ([colors.primary, colors.primaryLight, colors.accent] as const);

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
          className="shadow-large mb-12 h-36 w-36 items-center justify-center rounded-4xl"
          style={{
            backgroundColor:
              activeTheme === 'dark' ? 'rgba(168, 85, 247, 0.2)' : 'rgba(255, 255, 255, 0.25)',
            borderWidth: 2,
            borderColor:
              activeTheme === 'dark' ? 'rgba(168, 85, 247, 0.3)' : 'rgba(255, 255, 255, 0.4)',
          }}>
          <View
            className="h-24 w-24 items-center justify-center rounded-3xl"
            style={{
              backgroundColor: colors.surface,
              shadowColor: colors.primary,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 8,
            }}>
            <Typography
              variant="h1"
              weight="bold"
              style={{
                color: colors.primary,
                fontSize: 42,
                textShadowColor: 'rgba(0,0,0,0.1)',
                textShadowOffset: { width: 1, height: 1 },
                textShadowRadius: 2,
              }}>
              ✨
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
            letterSpacing: 1.2,
            fontSize: 38,
            textShadowColor: 'rgba(0,0,0,0.2)',
            textShadowOffset: { width: 2, height: 2 },
            textShadowRadius: 4,
          }}>
          Nexus
        </Typography>

        {/* Subtitle */}
        <Typography
          variant="body1"
          align="center"
          style={{
            color:
              activeTheme === 'dark' ? 'rgba(255, 255, 255, 0.85)' : 'rgba(255, 255, 255, 0.95)',
            paddingHorizontal: 32,
            lineHeight: 26,
            marginBottom: 64,
            fontSize: 18,
            fontWeight: '500',
          }}>
          Where innovation meets excellence
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
