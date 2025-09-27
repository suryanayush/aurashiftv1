// Dashboard-related interfaces

export interface DashboardProps {
  // Dashboard component props (if any)
}

export interface DashboardData {
  user: {
    displayName: string;
    email: string;
    level: number;
    auraScore: number;
  };
  timer: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    formatted: string;
    startTime: Date;
  };
  progress: {
    cigarettesAvoided: number;
    moneySaved: number;
    healthScore: number;
    streakDays: number;
  };
  activities: {
    today: number;
    thisWeek: number;
    totalPositive: number;
  };
  achievements: {
    recent: string[];
    total: number;
    nextMilestone: string;
  };
  motivationalMessage: string;
  quickActions: QuickAction[];
}

export interface QuickAction {
  id: string;
  title: string;
  icon: string;
  points: number;
  color: string;
}

export interface ProgressCard {
  title: string;
  value: string | number;
  color: string;
  icon?: string;
}
