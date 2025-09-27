import React, { useRef, useEffect } from 'react';
import { View, Text, Dimensions } from 'react-native';
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
    <View className="flex-1 bg-white">
      {/* Background Design */}
      <View className="absolute inset-0">
        {/* Top curved background */}
        <View className="absolute top-0 left-0 right-0 h-2/3 bg-red-400" style={{ borderBottomLeftRadius: 60 }} />
        
        {/* Decorative circles */}
        <View className="absolute top-20 right-8 w-20 h-20 bg-red-300 rounded-full" style={{ opacity: 0.3 }} />
        <View className="absolute top-40 left-12 w-12 h-12 bg-red-200 rounded-full" style={{ opacity: 0.4 }} />
        <View className="absolute bottom-40 right-16 w-16 h-16 bg-red-300 rounded-full" style={{ opacity: 0.2 }} />
      </View>

      {/* Content */}
      <View className="flex-1 justify-center items-center px-8">
        {/* App Logo/Animation */}
        <View className="bg-white rounded-3xl p-8 shadow-2xl mb-8">
          <LottieView
            ref={animationRef}
            source={require('../../../assets/happyLungs.json')}
            style={{
              width: Math.min(width * 0.5, 200),
              height: Math.min(height * 0.3, 200),
            }}
            autoPlay
            loop={false}
            onAnimationFinish={handleAnimationFinish}
            resizeMode="contain"
          />
        </View>

        {/* App Title */}
        <Text className="text-4xl font-bold text-white mb-3">AuraShift</Text>
        <Text className="text-lg text-red-100 text-center leading-6">
          Your journey to a{'\n'}smoke-free life begins here
        </Text>

        {/* Loading indicator */}
        <View className="mt-12 flex-row space-x-2">
          <View className="w-2 h-2 bg-white/60 rounded-full" />
          <View className="w-2 h-2 bg-white/80 rounded-full" />
          <View className="w-2 h-2 bg-white rounded-full" />
        </View>
      </View>
    </View>
  );
};

export default SplashScreen;
