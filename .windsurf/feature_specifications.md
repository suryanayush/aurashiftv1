# AuraShift Feature Specifications

## 1. Core Features (MVP)

### 1.1 Smoke-Free Timer
**Priority**: Critical
**Description**: Central feature tracking time since last cigarette

#### Functional Requirements
- Display timer in Days:Hours:Minutes:Seconds format
- Update every second with precision accuracy
- Persist across app restarts and device reboots
- Show multiple display formats (compact, detailed, milestone)
- Automatic milestone celebrations at key intervals

#### Technical Specifications
```typescript
interface TimerState {
  startTime: Date;
  currentTime: Date;
  isActive: boolean;
  lastResetReason?: 'user_action' | 'relapse' | 'manual_reset';
}

interface TimerDisplay {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
  formatted: string;
  milestoneReached?: string;
}
```

#### User Stories
- As a user, I want to see exactly how long I've been smoke-free
- As a user, I want the timer to continue running even when I close the app
- As a user, I want to celebrate milestones like 24 hours, 1 week, 1 month

### 1.2 "I Smoked" Button & Reset Functionality
**Priority**: Critical
**Description**: Reset mechanism with confirmation and automatic logging

#### Functional Requirements
- Prominent button placement with clear labeling
- Confirmation dialog before reset: "Are you sure? This will reset your timer and deduct 10 points."
- Automatic cigarette activity logging upon confirmation
- Immediate Aura score deduction (-10 points)
- Optional trigger analysis ("What led to this moment?")
- Supportive messaging after reset ("Your new journey starts now")

#### Technical Specifications
```typescript
interface ResetConfirmation {
  showDialog: boolean;
  message: string;
  confirmText: string;
  cancelText: string;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
}

const handleSmokeReset = async (userId: string, notes?: string) => {
  // Reset timer
  await resetUserTimer(userId);
  
  // Log cigarette activity
  await logActivity({
    userId,
    type: 'cigarette',
    points: -10,
    timestamp: new Date(),
    notes,
    context: 'user_reported'
  });
  
  // Update Aura score
  await updateAuraScore(userId, -10);
  
  // Send supportive notification
  await sendEncouragementNotification(userId);
};
```

### 1.3 Activity Logging System
**Priority**: Critical
**Description**: Comprehensive activity tracking with point system

#### Activity Types & Points
- **Cigarette** 🚬: -10 points (automatic when "I Smoked" pressed)
- **Gym/Workout** 💪: +5 points
- **Healthy Meal** 🥗: +3 points
- **Skincare Routine** ✨: +2 points
- **Event/Social** 📅: 0 points (for context tracking)

#### Functional Requirements
- Quick-add buttons for each activity type
- Detailed logging form with optional fields:
  - Activity notes/description
  - Mood selection (happy, stressed, motivated, neutral, etc.)
  - Location (optional)
  - Duration (for gym activities)
  - Photo attachment (future feature)
- Activity history with search and filtering
- Edit/delete activities within 24 hours
- Bulk activity logging for convenience

#### Technical Specifications
```typescript
interface Activity {
  id: string;
  userId: string;
  type: 'cigarette' | 'gym' | 'healthy_meal' | 'skincare' | 'event_social';
  points: number;
  timestamp: Date;
  notes?: string;
  mood?: 'happy' | 'stressed' | 'motivated' | 'neutral' | 'anxious' | 'proud';
  location?: string;
  duration?: number; // in minutes
  metadata?: {
    workoutType?: string;
    mealType?: string;
    skincareRoutine?: string[];
    eventType?: string;
  };
}

const ACTIVITY_POINTS = {
  cigarette: -10,
  gym: 5,
  healthy_meal: 3,
  skincare: 2,
  event_social: 0
} as const;
```

### 1.4 Aura Score System
**Priority**: Critical
**Description**: Gamified scoring system for motivation

#### Scoring Rules
- Start at 0 points for new users
- Real-time updates when activities are logged
- Automatic +10 bonus for every 24-hour smoke-free period
- Score history tracking for analytics
- Level progression based on total score (every 100 points = 1 level)

#### Technical Specifications
```typescript
interface AuraScore {
  current: number;
  total: number; // All-time total including resets
  level: number;
  levelProgress: number; // 0-1 progress to next level
  todayPoints: number;
  weekPoints: number;
  monthPoints: number;
}

const calculateLevel = (totalScore: number): number => {
  return Math.floor(totalScore / 100) + 1;
};

const calculateStreakBonus = async (userId: string): Promise<number> => {
  const streakHours = await getCurrentStreakHours(userId);
  const completedDays = Math.floor(streakHours / 24);
  const lastBonusDay = await getLastStreakBonusDay(userId);
  
  if (completedDays > lastBonusDay) {
    const bonusPoints = (completedDays - lastBonusDay) * 10;
    await updateLastStreakBonusDay(userId, completedDays);
    return bonusPoints;
  }
  
  return 0;
};
```

### 1.5 User Onboarding Flow
**Priority**: Critical
**Description**: Personalized setup collecting smoking history

#### Onboarding Screens
1. **Welcome Screen**: Introduction to AuraShift concept
2. **Registration**: Name, email, password with validation
3. **Smoking Assessment**: 
   - How many years have you been smoking?
   - How many cigarettes per day on average?
   - How much does a pack cost? (optional, default $10)
4. **Motivation Selection**: Why do you want to quit?
   - Health improvement
   - Save money
   - Family/relationships
   - Personal achievement
   - Other (custom input)
5. **Goal Setting**: Initial targets and preferences
6. **Notification Setup**: Permission and message customization
7. **Complete**: Welcome to your journey!

#### Technical Specifications
```typescript
interface OnboardingData {
  personalInfo: {
    displayName: string;
    email: string;
    password: string;
  };
  smokingHistory: {
    yearsSmoked: number;
    cigarettesPerDay: number;
    costPerPack: number;
    quitAttempts?: number;
  };
  motivations: string[];
  goals: {
    primaryGoal: string;
    targetDate?: Date;
    milestones: string[];
  };
  notificationPreferences: {
    hourlyEnabled: boolean;
    halfHourlyEnabled: boolean;
    customMessages: {
      hourly: string;
      halfHourly: string;
    };
  };
}

const completeOnboarding = async (data: OnboardingData) => {
  // Create user account
  const user = await createUserAccount(data.personalInfo);
  
  // Store user profile
  await createUserProfile({
    ...data,
    auraScore: 0,
    streakStartTime: new Date(),
    onboardingCompleted: true,
    createdAt: new Date()
  });
  
  // Schedule notifications
  await scheduleUserNotifications(user.uid, data.notificationPreferences);
  
  // Send welcome notification
  await sendWelcomeNotification(user.uid);
};
```

## 2. Enhanced Features

### 2.1 Smart Notification System
**Priority**: High
**Description**: Customizable hourly and half-hourly notifications

#### Notification Schedule
- **Hourly** (8:00, 9:00, 10:00, etc.): Default message "abc"
- **Half-hourly** (8:30, 9:30, 10:30, etc.): Default message "xyz"
- **Operating Hours**: 8:00 AM to 10:00 PM (customizable)
- **Quiet Hours**: User-defined sleep hours

#### Functional Requirements
- Firebase Cloud Messaging integration
- Custom message editing for both hourly and half-hourly
- Quiet hours configuration
- Notification history and analytics
- Context-aware messages based on progress
- Emergency craving support notifications

#### Technical Specifications
```typescript
interface NotificationPreferences {
  hourlyEnabled: boolean;
  halfHourlyEnabled: boolean;
  customMessages: {
    hourly: string; // Default: "abc"
    halfHourly: string; // Default: "xyz"
  };
  quietHours: {
    enabled: boolean;
    startTime: string; // "22:00"
    endTime: string; // "08:00"
  };
  operatingHours: {
    startHour: number; // 8
    endHour: number; // 22
  };
}

const scheduleNotifications = async (userId: string, preferences: NotificationPreferences) => {
  const notifications: ScheduledNotification[] = [];
  
  for (let hour = preferences.operatingHours.startHour; hour <= preferences.operatingHours.endHour; hour++) {
    // Skip if within quiet hours
    if (isWithinQuietHours(hour, preferences.quietHours)) continue;
    
    // Hourly notification
    if (preferences.hourlyEnabled) {
      notifications.push({
        userId,
        title: "Stay Strong! 💪",
        body: preferences.customMessages.hourly,
        scheduledTime: { hour, minute: 0 },
        type: 'hourly'
      });
    }
    
    // Half-hourly notification
    if (preferences.halfHourlyEnabled) {
      notifications.push({
        userId,
        title: "You're Amazing! 🌟",
        body: preferences.customMessages.halfHourly,
        scheduledTime: { hour, minute: 30 },
        type: 'half_hourly'
      });
    }
  }
  
  return await scheduleFirebaseNotifications(notifications);
};
```

### 2.2 Calendar & Activity History
**Priority**: High
**Description**: Visual calendar showing daily activities and progress

#### Functional Requirements
- Monthly calendar view with activity indicators
- Color-coded dots for different activity types
- Day detail view showing activity timeline
- Activity editing from calendar interface
- Date range selection for bulk operations
- Export calendar data functionality
- Streak visualization across dates

#### Technical Specifications
```typescript
interface CalendarDay {
  date: Date;
  activities: Activity[];
  totalPoints: number;
  hasStreak: boolean;
  indicators: {
    cigarette: number;
    gym: number;
    healthyMeal: number;
    skincare: number;
    events: number;
  };
}

interface CalendarData {
  month: number;
  year: number;
  days: CalendarDay[];
  monthlyStats: {
    totalPoints: number;
    smokeFreedays: number;
    mostActiveDay: Date;
    averageDailyPoints: number;
  };
}
```

### 2.3 Achievement System
**Priority**: High
**Description**: Gamified achievement and badge system

#### Achievement Categories
1. **Streak Achievements**
   - First 24 Hours: "Day One Champion"
   - 48 Hours: "Two Day Warrior"
   - 1 Week: "Week One Hero"
   - 1 Month: "Monthly Master"
   - 3 Months: "Quarterly Champion"
   - 6 Months: "Half Year Hero"
   - 1 Year: "Annual Legend"

2. **Activity Achievements**
   - Gym Streak: 7 days, 14 days, 30 days
   - Healthy Eating: 10 meals, 50 meals, 100 meals
   - Skincare Consistency: 7 days, 30 days
   - Activity Variety: Log all activity types in one day

3. **Health & Financial Achievements**
   - Money Saved: $50, $100, $500, $1000
   - Cigarettes Avoided: 100, 500, 1000, 5000
   - Health Milestones: Based on scientific recovery timeline

#### Technical Specifications
```typescript
interface Achievement {
  id: string;
  title: string;
  description: string;
  category: 'streak' | 'activity' | 'health' | 'financial' | 'special';
  criteria: {
    type: string;
    value: number;
    timeframe?: string;
  };
  points: number;
  badge: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt?: Date;
}

const checkAchievements = async (userId: string, activity: Activity) => {
  const userProgress = await getUserProgress(userId);
  const unlockedAchievements = [];
  
  for (const achievement of AVAILABLE_ACHIEVEMENTS) {
    if (await meetsAchievementCriteria(userProgress, achievement)) {
      await unlockAchievement(userId, achievement.id);
      unlockedAchievements.push(achievement);
    }
  }
  
  return unlockedAchievements;
};
```

## 3. Advanced Features

### 3.1 AI Coaching Integration (ChatGPT)
**Priority**: Medium-High
**Description**: Personalized AI coaching using OpenAI API

#### Functional Requirements
- Chat interface with conversation history
- Personalized responses based on user context:
  - Smoking history and motivations
  - Current streak and Aura score
  - Recent activities and patterns
  - Achievement progress
- Daily feedback and insights
- Craving support and coping strategies
- Progress projections and goal setting

#### Technical Specifications
```typescript
interface AIContext {
  userProfile: {
    smokingHistory: SmokingHistory;
    motivations: string[];
    currentStreak: number;
    auraScore: number;
  };
  recentProgress: {
    activitiesLast7Days: Activity[];
    lastRelapse?: Date;
    positiveActivities: Activity[];
    challengingMoments: Activity[];
  };
  conversationHistory: ChatMessage[];
}

const generateAIResponse = async (userId: string, message: string) => {
  const context = await prepareAIContext(userId);
  
  const prompt = `
  You are AuraAI, a supportive quit-smoking coach for the AuraShift app.
  
  User Context:
  - Smoking History: ${context.userProfile.smokingHistory}
  - Current Streak: ${context.userProfile.currentStreak} hours
  - Aura Score: ${context.userProfile.auraScore}
  - Motivations: ${context.userProfile.motivations.join(', ')}
  - Recent Activities: ${context.recentProgress.activitiesLast7Days}
  
  Guidelines:
  - Be supportive, encouraging, and non-judgmental
  - Provide actionable, specific advice
  - Reference the user's specific progress and achievements
  - Never provide medical advice
  - Focus on motivation, coping strategies, and positive reinforcement
  - If user mentions craving, provide immediate coping techniques
  
  User Message: ${message}
  
  Respond in a supportive, personalized way:
  `;
  
  const response = await openai.createCompletion({
    model: "gpt-4",
    prompt,
    max_tokens: 300,
    temperature: 0.7
  });
  
  return response.data.choices[0].text;
};
```

### 3.2 Progress Analytics & Insights
**Priority**: Medium-High
**Description**: Advanced data visualization and predictive analytics

#### Chart Types
1. **Aura Score Trends**: Line chart showing score over time
2. **Activity Breakdown**: Pie chart of activity types
3. **Streak Progress**: Area chart of streak lengths over time
4. **Financial Savings**: Bar chart of money saved over time
5. **Health Milestones**: Timeline of health improvements

#### Functional Requirements
- Interactive charts with Victory Native
- Multiple time periods (daily, weekly, monthly, yearly)
- Trend analysis and pattern recognition
- Comparative analytics (this week vs last week)
- Predictive modeling for success probability
- Export charts as images or PDF reports

#### Technical Specifications
```typescript
interface ChartData {
  labels: string[];
  datasets: {
    data: number[];
    color: string;
    strokeWidth?: number;
  }[];
  metadata: {
    period: 'daily' | 'weekly' | 'monthly' | 'yearly';
    metric: 'aura_score' | 'activities' | 'streak_length' | 'money_saved';
    startDate: Date;
    endDate: Date;
  };
}

const generateProgressReport = async (userId: string, period: string) => {
  const activities = await getActivitiesByPeriod(userId, period);
  const streakData = await getStreakHistory(userId, period);
  
  return {
    summary: {
      totalPoints: activities.reduce((sum, a) => sum + a.points, 0),
      smokeFreedays: calculateSmokeFreedays(streakData),
      moneySaved: calculateMoneySaved(userId, period),
      topActivity: getMostFrequentActivity(activities)
    },
    charts: {
      auraScoreTrend: generateAuraScoreChart(activities),
      activityBreakdown: generateActivityBreakdownChart(activities),
      streakProgress: generateStreakChart(streakData)
    },
    insights: await generatePersonalizedInsights(userId, activities, streakData)
  };
};
```

### 3.3 Health Milestone Tracking
**Priority**: Medium
**Description**: Science-based health improvement timeline

#### Health Milestones (Based on Medical Research)
- **20 minutes**: Heart rate and blood pressure drop
- **12 hours**: Carbon monoxide levels normalize
- **2-12 weeks**: Circulation improves, lung function increases
- **1-9 months**: Coughing and shortness of breath decrease
- **1 year**: Risk of coronary heart disease is half that of a smoker
- **5 years**: Stroke risk reduced to that of a non-smoker
- **10 years**: Lung cancer death rate is half that of a smoker

#### Technical Specifications
```typescript
interface HealthMilestone {
  id: string;
  timeframe: string;
  title: string;
  description: string;
  benefits: string[];
  scientificSource: string;
  achieved: boolean;
  achievedAt?: Date;
}

const trackHealthMilestones = async (userId: string) => {
  const quitDate = await getUserQuitDate(userId);
  const timeSinceQuit = Date.now() - quitDate.getTime();
  
  const milestones = HEALTH_MILESTONES.map(milestone => ({
    ...milestone,
    achieved: timeSinceQuit >= milestone.requiredTime,
    achievedAt: timeSinceQuit >= milestone.requiredTime 
      ? new Date(quitDate.getTime() + milestone.requiredTime)
      : undefined
  }));
  
  return milestones;
};
```

## 4. Future Features

### 4.1 Community Features
**Priority**: Low
**Description**: Anonymous support and sharing system

#### Functional Requirements
- Anonymous user profiles for privacy
- Achievement sharing with community
- Support group discussions
- Motivational content feed
- Peer encouragement system
- Content moderation and reporting

### 4.2 Advanced Health Tracking
**Priority**: Low
**Description**: Integration with health apps and wearables

#### Functional Requirements
- Apple Health / Google Fit integration
- Heart rate monitoring correlation
- Sleep quality tracking
- Weight and BMI tracking
- Skin health photo comparison (AI-powered)

### 4.3 Premium Features
**Priority**: Low
**Description**: Subscription-based advanced features

#### Premium Features
- Advanced AI coaching with unlimited conversations
- Detailed health reports and projections
- Priority customer support
- Advanced analytics and insights
- Custom achievement creation
- Data export in multiple formats

## 5. Technical Requirements

### 5.1 Performance Requirements
- App launch time: < 2 seconds
- Screen transition time: < 300ms
- Chart rendering time: < 1 second
- Offline functionality: 100% for core features
- Battery usage: Minimal background processing

### 5.2 Security Requirements
- End-to-end encryption for sensitive data
- Secure API key management
- GDPR compliance for data handling
- Regular security audits
- Secure authentication with Firebase Auth

### 5.3 Accessibility Requirements
- WCAG 2.1 AA compliance
- Screen reader support
- High contrast mode support
- Minimum touch target size: 44px
- Keyboard navigation support

This comprehensive feature specification provides detailed requirements for building AuraShift with all requested functionality, from core MVP features to advanced AI integration and future enhancements.
