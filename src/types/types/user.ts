// User-related types

export type UserProfile = {
  id: string;
  displayName: string;
  email: string;
  smokingHistory: SmokingProfile;
  auraScore: number;
  streakStartTime: Date;
  lastSmoked?: Date;
  onboardingCompleted: boolean;
  notificationPreferences: NotificationSettings;
  createdAt: Date;
  updatedAt: Date;
};

export type SmokingProfile = {
  yearsSmoked: number;
  cigarettesPerDay: number;
  costPerPack: number;
  motivations: string[];
};

export type NotificationSettings = {
  hourlyEnabled: boolean;
  halfHourlyEnabled: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
  customMessages: {
    hourly: string;
    halfHourly: string;
  };
};

export type StoredUserData = {
  displayName: string;
  email: string;
  smokingHistory: SmokingProfile;
  createdAt: string;
};
