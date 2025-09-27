import { SmokingProfile } from './onboarding';

export interface UserDocument {
  _id: string;
  displayName: string;
  email: string;
  password: string;
  smokingHistory?: SmokingProfile;
  onboardingCompleted: boolean;
  auraScore: number;
  streakStartTime?: Date;
  lastSmoked?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserResponse {
  id: string;
  displayName: string;
  email: string;
  smokingHistory?: SmokingProfile;
  onboardingCompleted: boolean;
  auraScore: number;
  streakStartTime?: Date;
  lastSmoked?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateUserRequest {
  displayName?: string;
  smokingHistory?: SmokingProfile;
  auraScore?: number;
  streakStartTime?: Date;
  lastSmoked?: Date;
}
