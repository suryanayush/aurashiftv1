// Activity-related types

export type ActivityType = 'cigarette' | 'gym' | 'healthy_meal' | 'skincare' | 'event_social';

export type Activity = {
  id: string;
  userId: string;
  type: ActivityType;
  points: number;
  timestamp: Date;
  notes?: string;
  location?: string;
  mood?: string;
  context?: string;
};

export type TimerData = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  formatted: string;
};

export type Achievement = {
  id: string;
  title: string;
  description: string;
  category: 'streak' | 'activity' | 'health' | 'financial' | 'social' | 'special';
  points: number;
  unlockedAt?: Date;
  isUnlocked: boolean;
};
