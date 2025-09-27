import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import SplashScreen from 'src/components/ui/SplashScreen';
import { LoginScreen, RegisterScreen } from 'src/screens/auth';
import { OnboardingFlow } from 'src/screens/onboarding';
import Dashboard from 'src/screens/home/Dashboard';
import { storage } from 'src/utils/storage';
import { AppState, AuthMode } from 'src/types';

import './global.css';

export default function App() {
  const [appState, setAppState] = useState<AppState>('splash');
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [isLoading, setIsLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true);
  const [animationCompleted, setAnimationCompleted] = useState(false);

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

      // Verify token with backend and get current user state
      const { authAPI } = await import('src/api/auth');
      const verifyResponse = await authAPI.verifyToken();
      
      if (!verifyResponse.success || !verifyResponse.user) {
        // Token is invalid, remove it and go to auth
        await storage.removeItem('aurashift_auth_token');
        await storage.removeItem('aurashift_onboarding_completed');
        setAppState('auth');
        setIsLoading(false);
        return;
      }

      // Check onboarding status from backend (this is now synced to local storage by verifyToken)
      if (!verifyResponse.user.onboardingCompleted) {
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
      // Default to auth on error and clear potentially invalid data
      await storage.removeItem('aurashift_auth_token');
      await storage.removeItem('aurashift_onboarding_completed');
      setAppState('auth');
      setIsLoading(false);
    }
  };

  const handleSplashFinish = () => {
    setAnimationCompleted(true);
  };

  // Hide splash screen only when both animation is completed and app state is determined
  useEffect(() => {
    if (animationCompleted && !isLoading) {
      setShowSplash(false);
    }
  }, [animationCompleted, isLoading]);

  const handleLoginSuccess = () => {
    checkAppState(); // Re-check state after login (now verifies with backend)
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
  if (showSplash || isLoading) {
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
