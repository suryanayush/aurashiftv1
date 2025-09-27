// Onboarding-related interfaces

export interface OnboardingFlowProps {
  onComplete: () => void;
}

export interface OnboardingData {
  yearsSmoked: string;
  cigarettesPerDay: string;
  costPerPack: string;
  motivations: string[];
}

export interface OnboardingStepProps {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onBack: () => void;
  isLoading?: boolean;
}

export interface MotivationOption {
  id: string;
  label: string;
  description?: string;
}
