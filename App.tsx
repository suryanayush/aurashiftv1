import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import SplashScreen from 'src/components/ui/SplashScreen';
import { LoginScreen, RegisterScreen } from 'src/screens/auth';
import { OnboardingFlow } from 'src/screens/onboarding';
import Dashboard from 'src/screens/home/Dashboard';
import { storage } from 'src/utils/storage';

import './global.css';

type AppState = 'splash' | 'auth' | 'onboarding' | 'dashboard';
type AuthMode = 'login' | 'register';

export default function App() {
  const [appState, setAppState] = useState<AppState>('splash');
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [isLoading, setIsLoading] = useState(true);

  // Check app state on startup
  useEffect(() => {
    checkAppState();
  }, []);

  const checkAppState = async () => {
    try {
      // Check if user is authenticated
      const authToken = await storage.getAuthToken();
      
      if (!authToken) {
        // No auth token, go to auth
        setAppState('auth');
        setIsLoading(false);
        return;
      }

      // Check if onboarding is completed
      const onboardingCompleted = await storage.isOnboardingCompleted();
      
      if (!onboardingCompleted) {
        // Auth exists but onboarding not completed
        setAppState('onboarding');
        setIsLoading(false);
        return;
      }

      // Everything is set up, go to dashboard
      setAppState('dashboard');
      setIsLoading(false);
    } catch (error) {
      console.error('Error checking app state:', error);
      // Default to auth on error
      setAppState('auth');
      setIsLoading(false);
    }
  };

  const handleSplashFinish = () => {
    if (!isLoading) {
      // App state has been determined, transition from splash
      // Keep current appState (auth, onboarding, or dashboard)
    }
  };

  const handleLoginSuccess = () => {
    checkAppState(); // Re-check state after login
  };

  const handleRegisterSuccess = () => {
    setAppState('onboarding');
  };

  const handleOnboardingComplete = () => {
    setAppState('dashboard');
  };

  const switchToRegister = () => {
    setAuthMode('register');
  };

  const switchToLogin = () => {
    setAuthMode('login');
  };

  // Show splash screen while loading or during splash animation
  if (appState === 'splash' || isLoading) {
    return (
      <>
        <SplashScreen onAnimationFinish={handleSplashFinish} />
        <StatusBar style="light" />
      </>
    );
  }

  // Render appropriate screen based on app state
  const renderScreen = () => {
    switch (appState) {
      case 'auth':
        return authMode === 'login' ? (
          <LoginScreen 
            onLoginSuccess={handleLoginSuccess}
            onSwitchToRegister={switchToRegister}
          />
        ) : (
          <RegisterScreen 
            onRegisterSuccess={handleRegisterSuccess}
            onSwitchToLogin={switchToLogin}
          />
        );
      
      case 'onboarding':
        return <OnboardingFlow onComplete={handleOnboardingComplete} />;
      
      case 'dashboard':
        return <Dashboard />;
      
      default:
        return <Dashboard />;
    }
  };

  return (
    <>
      {renderScreen()}
      <StatusBar style="auto" />
    </>
  );
}
