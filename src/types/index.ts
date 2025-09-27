// Main export file for all types and interfaces

// Export types explicitly
export type {
  AuthMode,
  AuthStatus,
  LoginCredentials,
  RegisterCredentials
} from './types/auth';

export type {
  AppState,
  LoadingState,
  Theme
} from './types/app';

export type {
  UserProfile,
  SmokingProfile,
  NotificationSettings,
  StoredUserData
} from './types/user';

export type {
  ActivityType,
  Activity,
  TimerData,
  Achievement
} from './types/activity';

// Export interfaces explicitly
export type {
  LoginScreenProps,
  RegisterScreenProps,
  AuthFormData,
  AuthResponse
} from './interfaces/auth';

export type {
  OnboardingFlowProps,
  OnboardingData,
  OnboardingStepProps,
  MotivationOption
} from './interfaces/onboarding';

export type {
  DashboardProps,
  DashboardData,
  QuickAction,
  ProgressCard
} from './interfaces/dashboard';

export type {
  SplashScreenProps,
  ContainerProps,
  BaseScreenProps
} from './interfaces/common';
