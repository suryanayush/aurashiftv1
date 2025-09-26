import React, { useRef, useEffect } from 'react';
import { View, Animated, TouchableOpacity } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { Container } from '../../components/Container';
import { Button, Typography } from '../../components/ui';

interface OnboardingScreen1Props {
  onNext?: () => void;
  onSkip?: () => void;
}

export default function OnboardingScreen1({ onNext, onSkip }: OnboardingScreen1Props) {
  const { colors, activeTheme } = useTheme();
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
    <Container variant="gradient">
      <View className="flex-1">
        {/* Skip Button */}
        <View className="mt-4 items-end">
          <TouchableOpacity
            onPress={onSkip}
            className="rounded-full px-4 py-2"
            style={{
              backgroundColor:
                activeTheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.2)',
            }}>
            <Typography
              variant="body2"
              weight="medium"
              style={{
                color: activeTheme === 'dark' ? colors.text : colors.primaryForeground,
              }}>
              Skip
            </Typography>
          </TouchableOpacity>
        </View>

        {/* Main Content */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
          }}
          className="flex-1 items-center justify-center">
          {/* Illustration */}
          <View
            className="shadow-large mb-16 h-64 w-64 items-center justify-center rounded-full"
            style={{
              backgroundColor:
                activeTheme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.15)',
            }}>
            <View
              className="h-48 w-48 items-center justify-center rounded-full"
              style={{
                backgroundColor:
                  activeTheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.25)',
              }}>
              <Typography variant="h1" style={{ fontSize: 80, lineHeight: 80 }}>
                🚀
              </Typography>
            </View>
          </View>

          {/* Title */}
          <Typography
            variant="h1"
            weight="bold"
            align="center"
            style={{
              color: activeTheme === 'dark' ? colors.text : colors.primaryForeground,
              marginBottom: 24,
              letterSpacing: 1,
            }}>
            Get Started
          </Typography>

          {/* Description */}
          <Typography
            variant="body1"
            align="center"
            style={{
              color: activeTheme === 'dark' ? colors.textSecondary : 'rgba(255, 255, 255, 0.9)',
              paddingHorizontal: 16,
              lineHeight: 28,
              marginBottom: 64,
            }}>
            Discover amazing features and unlock your potential with our innovative platform
            designed for success
          </Typography>

          {/* Progress Indicator */}
          <View className="mb-8 flex-row space-x-3">
            <View
              className="h-2 w-8 rounded-full"
              style={{
                backgroundColor: activeTheme === 'dark' ? colors.accent : colors.primaryForeground,
              }}
            />
            <View
              className="h-2 w-2 rounded-full"
              style={{
                backgroundColor:
                  activeTheme === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.4)',
              }}
            />
            <View
              className="h-2 w-2 rounded-full"
              style={{
                backgroundColor:
                  activeTheme === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.4)',
              }}
            />
            <View
              className="h-2 w-2 rounded-full"
              style={{
                backgroundColor:
                  activeTheme === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.4)',
              }}
            />
          </View>
        </Animated.View>

        {/* Continue Button */}
        <View className="mb-8">
          <Button
            title="Continue"
            onPress={onNext}
            variant={activeTheme === 'dark' ? 'primary' : 'secondary'}
            size="lg"
            fullWidth
          />
        </View>
      </View>
    </Container>
  );
}
