import React, { useRef, useEffect } from 'react';
import { View, Dimensions } from 'react-native';
import LottieView from 'lottie-react-native';
import { SplashScreenProps } from '../../types';

const SplashScreen: React.FC<SplashScreenProps> = ({ onAnimationFinish }) => {
  const animationRef = useRef<LottieView>(null);
  const { width, height } = Dimensions.get('window');

  useEffect(() => {
    // Start the animation when component mounts
    animationRef.current?.play();
  }, []);

  const handleAnimationFinish = (isCancelled?: boolean) => {
    // Only call onAnimationFinish if animation completed successfully (not cancelled)
    if (!isCancelled) {
      onAnimationFinish();
    }
  };

  return (
    <View className="flex-1 bg-white justify-center items-center">
      <LottieView
        ref={animationRef}
        source={require('../../../assets/happyLungs.json')}
        style={{
          width: Math.min(width * 0.8, 300),
          height: Math.min(height * 0.8, 300),
        }}
        autoPlay
        loop={false}
        onAnimationFinish={handleAnimationFinish}
        resizeMode="contain"
      />
    </View>
  );
};

export default SplashScreen;
