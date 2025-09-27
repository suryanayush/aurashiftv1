// Common interfaces used across the app

export interface SplashScreenProps {
  onAnimationFinish: () => void;
}

export interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export interface BaseScreenProps {
  navigation?: any; // Will be properly typed when navigation is implemented
  route?: any;
}
