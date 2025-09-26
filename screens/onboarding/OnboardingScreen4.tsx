import React, { useRef, useEffect } from 'react';
import { View, Animated, TouchableOpacity } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { Container } from '../../components/Container';
import { Button, Typography } from '../../components/ui';

interface OnboardingScreen4Props {
  onGetStarted?: () => void;
  onBack?: () => void;
}

export default function OnboardingScreen4({ onGetStarted, onBack }: OnboardingScreen4Props) {
  const { colors, activeTheme } = useTheme();
  const slideAnim = useRef(new Animated.Value(100)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const buttonAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
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
      ]),
      Animated.timing(buttonAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Container variant="gradient">
      <View className="flex-1">
        {/* Back Button */}
        <View className="mt-4 items-start">
          <TouchableOpacity
            onPress={onBack}
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
              ← Back
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
                activeTheme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.1)',
            }}>
            <View
              className="h-48 w-48 items-center justify-center rounded-full"
              style={{
                backgroundColor:
                  activeTheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.2)',
              }}>
              <Typography variant="h1" style={{ fontSize: 80, lineHeight: 80 }}>
                🎉
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
            Ready to Begin!
          </Typography>

          {/* Description */}
          <Typography
            variant="body1"
            align="center"
            style={{
              color: activeTheme === 'dark' ? colors.textSecondary : 'rgba(255, 255, 255, 0.9)',
              paddingHorizontal: 16,
              lineHeight: 28,
              marginBottom: 48,
            }}>
            Everything is set up! Let&apos;s start your amazing journey with all these powerful
            features at your fingertips
          </Typography>

          {/* Progress Indicator */}
          <View className="mb-12 flex-row space-x-3">
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
            <View
              className="h-2 w-8 rounded-full"
              style={{
                backgroundColor: activeTheme === 'dark' ? colors.accent : colors.primaryForeground,
              }}
            />
          </View>
        </Animated.View>

        {/* Get Started Button */}
        <Animated.View
          style={{
            opacity: buttonAnim,
            transform: [
              {
                translateY: buttonAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [30, 0],
                }),
              },
            ],
          }}
          className="mb-8">
          <Button
            title="Get Started Now"
            onPress={onGetStarted}
            variant={activeTheme === 'dark' ? 'primary' : 'secondary'}
            size="lg"
            fullWidth
          />
        </Animated.View>
      </View>
    </Container>
  );
}
