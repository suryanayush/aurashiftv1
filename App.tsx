import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import SplashScreen from 'src/components/ui/SplashScreen';
import Dashboard from 'src/screens/home/Dashboard';

import './global.css';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  return (
    <>
      {showSplash ? (
        <SplashScreen onAnimationFinish={handleSplashFinish} />
      ) : (
        <Dashboard />
      )}
      <StatusBar style="auto" />
    </>
  );
}
