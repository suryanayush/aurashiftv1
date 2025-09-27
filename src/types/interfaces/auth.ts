// Auth-related interfaces

export interface LoginScreenProps {
  onLoginSuccess: () => void;
  onSwitchToRegister: () => void;
}

export interface RegisterScreenProps {
  onRegisterSuccess: () => void;
  onSwitchToLogin: () => void;
}

export interface AuthFormData {
  displayName?: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  error?: string;
  user?: {
    id: string;
    email: string;
    displayName: string;
    onboardingCompleted: boolean;
  };
}
