import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import OnboardingScreen1 from '../screens/onboarding/OnboardingScreen1';
import OnboardingScreen2 from '../screens/onboarding/OnboardingScreen2';
import OnboardingScreen3 from '../screens/onboarding/OnboardingScreen3';
import OnboardingScreen4 from '../screens/onboarding/OnboardingScreen4';
import DashboardScreen from '../screens/DashboardScreen';

export type RootStackParamList = {
  Splash: undefined;
  Onboarding1: undefined;
  Onboarding2: undefined;
  Onboarding3: undefined;
  Onboarding4: undefined;
  Login: undefined;
  Register: undefined;
  Dashboard: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const [isLoading, setIsLoading] = useState(true);

  const handleSplashComplete = () => {
    setIsLoading(false);
  };

  if (isLoading) {
    return <SplashScreen onAnimationComplete={handleSplashComplete} />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Onboarding1"
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}>
        <Stack.Screen name="Onboarding1">
          {(props) => (
            <OnboardingScreen1
              {...props}
              onNext={() => props.navigation.navigate('Onboarding2')}
              onSkip={() => props.navigation.navigate('Login')}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="Onboarding2">
          {(props) => (
            <OnboardingScreen2
              {...props}
              onNext={() => props.navigation.navigate('Onboarding3')}
              onBack={() => props.navigation.goBack()}
              onSkip={() => props.navigation.navigate('Login')}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="Onboarding3">
          {(props) => (
            <OnboardingScreen3
              {...props}
              onNext={() => props.navigation.navigate('Onboarding4')}
              onBack={() => props.navigation.goBack()}
              onSkip={() => props.navigation.navigate('Login')}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="Onboarding4">
          {(props) => (
            <OnboardingScreen4
              {...props}
              onGetStarted={() => props.navigation.navigate('Login')}
              onBack={() => props.navigation.goBack()}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="Login">
          {(props) => (
            <LoginScreen
              {...props}
              onLoginSuccess={() => props.navigation.navigate('Dashboard')}
              onNavigateToRegister={() => props.navigation.navigate('Register')}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="Register">
          {(props) => (
            <RegisterScreen
              {...props}
              onRegisterSuccess={() => props.navigation.navigate('Dashboard')}
              onNavigateToLogin={() => props.navigation.navigate('Login')}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="Dashboard" component={DashboardScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
