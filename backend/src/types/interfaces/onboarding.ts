export interface OnboardingRequest {
  yearsSmoked: number;
  cigarettesPerDay: number;
  costPerPack: number;
  motivations: string[];
}

export interface OnboardingResponse {
  success: boolean;
  error?: string;
  user?: {
    id: string;
    email: string;
    displayName: string;
    smokingHistory: SmokingProfile;
    onboardingCompleted: boolean;
  };
}

export interface SmokingProfile {
  yearsSmoked: number;
  cigarettesPerDay: number;
  costPerPack: number;
  motivations: string[];
}
