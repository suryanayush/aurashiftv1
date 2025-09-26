# AuraShift Data Modeling Plan

## 1. Database Design Philosophy

### Design Principles
- **User Privacy First**: All sensitive data is encrypted and anonymized where possible
- **Scalable Structure**: Design to handle millions of users and billions of activities
- **Real-time Friendly**: Optimized for real-time synchronization
- **Audit Trail**: Comprehensive logging for data integrity and debugging
- **Future-Proof**: Extensible schema for new features

### NoSQL Design Patterns
- **Document-Based**: Each user is a document with sub-collections
- **Denormalization**: Strategic duplication for read performance
- **Event Sourcing**: All user actions are logged as immutable events
- **Aggregation**: Pre-calculated statistics for fast queries

## 2. Core Data Entities

### 2.1 User Profile Entity

```typescript
// users/{userId}
interface UserProfile {
  // Identity
  id: string;                    // Firebase Auth UID
  email: string;                 // User email (from Auth)
  displayName: string;           // User's chosen name
  avatar?: string;               // Profile picture URL

  // Timestamps
  createdAt: FirebaseTimestamp;
  lastLoginAt: FirebaseTimestamp;
  lastActiveAt: FirebaseTimestamp;
  updatedAt: FirebaseTimestamp;

  // Onboarding Data
  onboarding: {
    completed: boolean;
    completedAt?: FirebaseTimestamp;
    currentStep?: OnboardingStep;

    smokingProfile: {
      yearsSmoked: number;         // 0.5, 1, 2, 5, 10+
      cigarettesPerDay: number;    // Average daily consumption
      brandPreference?: string;
      costPerPack: number;         // Local currency
      packSize: number;            // Cigarettes per pack (usually 20)
      startedAge?: number;         // Age when started smoking
      previousQuitAttempts?: number;
    };

    motivations: {
      primary: MotivationType[];   // Main reasons for quitting
      personal: string[];          // Custom user-defined motivations
      priorityRanking: MotivationType[]; // Ordered by importance
    };

    preferences: {
      notificationFrequency: 'low' | 'medium' | 'high';
      supportLevel: 'minimal' | 'moderate' | 'intensive';
      privacyLevel: 'private' | 'anonymous' | 'community';
    };
  };

  // Current Status
  currentStatus: {
    isActive: boolean;           // Is user actively using the app
    streakStartTime: FirebaseTimestamp | null; // Current streak start
    lastRelapseTime?: FirebaseTimestamp; // When last cigarette was logged
    isPaused: boolean;           // Temporarily paused tracking
    pauseReason?: string;
  };

  // Aggregate Statistics (Denormalized for performance)
  stats: UserStats;

  // Settings & Preferences
  settings: UserSettings;

  // Subscription & Features
  subscription: {
    tier: 'free' | 'premium' | 'pro';
    expiresAt?: FirebaseTimestamp;
    features: string[];          // Enabled feature flags
    trialUsed: boolean;
  };

  // Privacy & Compliance
  privacy: {
    dataProcessingConsent: boolean;
    marketingConsent: boolean;
    researchParticipation: boolean;
    lastConsentUpdate: FirebaseTimestamp;
    gdprRequests: GDPRRequest[];
  };

  // Metadata
  version: number;             // Schema version for migrations
  tags: string[];              // Admin tags for segmentation
  flags: string[];             // Feature flags or special markers
}

interface UserStats {
  // Streak Statistics
  currentStreakHours: number;
  longestStreakHours: number;
  totalStreakHours: number;      // Cumulative across all streaks
  averageStreakLength: number;
  streakCount: number;           // Number of streaks started

  // Activity Statistics
  totalActivitiesLogged: number;
  activitiesThisWeek: number;
  activitiesThisMonth: number;

  // Score Statistics
  totalAuraScore: number;        // All-time cumulative
  currentDailyScore: number;
  averageDailyScore: number;
  highestDailyScore: number;
  scoreThisWeek: number;
  scoreThisMonth: number;

  // Health Impact
  cigarettesAvoided: number;
  packsAvoided: number;
  moneySaved: number;            // In user's currency
  healthPointsEarned: number;

  // Relapse Statistics
  totalRelapses: number;
  relapsesThisMonth: number;
  averageTimeBetweenRelapses: number; // in hours
  commonTriggers: TriggerCount[];

  // Engagement Statistics
  daysActive: number;            // Days with at least one activity
  averageSessionDuration: number; // in minutes
  featuresUsed: string[];        // Which features user has accessed

  // Achievement Progress
  achievementsUnlocked: number;
  achievementPoints: number;
  badgesEarned: string[];

  // Last Updated
  lastCalculated: FirebaseTimestamp;
}

interface TriggerCount {
  trigger: TriggerType;
  count: number;
  lastOccurred: FirebaseTimestamp;
}

type MotivationType =
  | 'health_improvement'
  | 'financial_savings'
  | 'family_relationships'
  | 'physical_fitness'
  | 'appearance_enhancement'
  | 'mental_clarity'
  | 'addiction_freedom'
  | 'social_acceptance'
  | 'professional_advancement'
  | 'environmental_consciousness';

type OnboardingStep =
  | 'welcome'
  | 'personal_info'
  | 'smoking_history'
  | 'motivations'
  | 'goals'
  | 'notifications'
  | 'complete';
```

### 2.2 Activity Logging Entity

```typescript
// users/{userId}/activities/{activityId}
interface Activity {
  id: string;                    // Auto-generated document ID
  userId: string;                // Reference to user (denormalized)
  timestamp: FirebaseTimestamp;

  // Core Activity Data
  type: ActivityType;
  category: ActivityCategory;
  title: string;                 // Display name
  description?: string;          // Optional user notes

  // Scoring
  baseAuraPoints: number;        // Base points for this activity
  bonusPoints: number;           // Any bonus points applied
  totalAuraPoints: number;       // baseAuraPoints + bonusPoints
  multiplier: number;            // Score multiplier (default 1.0)

  // Activity Metadata
  duration?: number;             // Duration in minutes
  intensity?: IntensityLevel;
  confidence?: number;           // User confidence in logging (1-5)
  source: 'manual' | 'auto' | 'imported'; // How was this logged

  // Location & Context
  location?: {
    type: 'home' | 'work' | 'gym' | 'restaurant' | 'social' | 'other';
    name?: string;               // Optional location name
    coordinates?: GeoPoint;       // For location-based insights
  };

  // Mood & Emotional State
  mood?: {
    before?: MoodRating;         // Mood before activity
    after?: MoodRating;          // Mood after activity
    energy?: EnergyLevel;        // Energy level
    stress?: StressLevel;        // Stress level
  };

  // Social Context
  social?: {
    isAlone: boolean;
    companionCount?: number;
    companionTypes?: ('family' | 'friends' | 'colleagues' | 'strangers')[];
    influenceLevel?: number;     // How much others influenced this (1-5)
  };

  // Relapse-Specific Data
  relapse?: RelapseData;

  // Goal Connection
  linkedGoals?: string[];        // References to user goals
  progressContribution?: number; // How much this contributes to goals

  // Media Attachments
  attachments?: ActivityAttachment[];

  // Verification & Quality
  isVerified: boolean;           // Has this been validated
  confidenceScore: number;       // System confidence in accuracy
  flaggedForReview: boolean;

  // Metadata
  version: number;
  tags: string[];
  lastModified: FirebaseTimestamp;
  createdVia: 'mobile_app' | 'web_app' | 'api' | 'webhook';
}

interface RelapseData {
  // Previous streak information
  previousStreak: {
    duration: number;            // Previous streak in hours
    startTime: FirebaseTimestamp;
    endTime: FirebaseTimestamp;
    activitiesDuring: number;    // Activities logged during streak
    scoreEarned: number;         // Points earned during streak
  };

  // Trigger Analysis
  trigger: {
    primary: TriggerType;
    secondary?: TriggerType[];
    description?: string;        // User's description of what happened
    intensity: number;           // How strong was the trigger (1-5)
    duration: number;            // How long did craving last (minutes)
  };

  // Context
  context: {
    timeOfDay: number;           // Hour of day (0-23)
    dayOfWeek: number;           // Day of week (0-6)
    weather?: WeatherCondition;
    situation?: SituationType;
    hadAlcohol: boolean;
    hadCaffeine: boolean;
    sleepQuality?: number;       // Previous night's sleep (1-5)
    stressEvents?: string[];     // Recent stressful events
  };

  // Recovery Planning
  recovery: {
    lessonLearned?: string;      // What user learned from this
    preventionStrategy?: string; // How to prevent next time
    supportNeeded?: string[];    // What support would help
    confidenceLevel?: number;    // Confidence in recovery (1-5)
  };

  // Follow-up
  followUp?: {
    checkedInAt?: FirebaseTimestamp;
    moodAfterHour?: MoodRating;
    regretLevel?: number;        // How much they regret it (1-5)
    motivationToQuit?: number;   // Renewed motivation (1-5)
  };
}

type SituationType =
  | 'work_break'
  | 'after_meal'
  | 'social_event'
  | 'driving'
  | 'drinking_alcohol'
  | 'on_phone'
  | 'boredom'
  | 'argument'
  | 'celebration'
  | 'other';

type WeatherCondition =
  | 'sunny'
  | 'rainy'
  | 'cloudy'
  | 'cold'
  | 'hot'
  | 'windy'
  | 'other';

interface ActivityAttachment {
  id: string;
  type: 'photo' | 'video' | 'audio' | 'document';
  url: string;                   // Firebase Storage URL
  thumbnailUrl?: string;
  filename: string;
  size: number;                  // File size in bytes
  uploadedAt: FirebaseTimestamp;
}
```

### 2.3 Achievement System

```typescript
// achievements/{achievementId}
interface Achievement {
  id: string;
  title: string;
  description: string;
  longDescription?: string;      // Detailed explanation

  // Visual Design
  icon: string;                  // Icon name or URL
  badgeUrl?: string;             // Custom badge image
  color: string;                 // Brand color for this achievement
  animation?: string;            // Special animation for unlocking

  // Categorization
  category: AchievementCategory;
  subcategory?: string;
  tags: string[];

  // Difficulty & Rarity
  rarity: AchievementRarity;
  difficulty: number;            // 1-10 scale
  estimatedTimeToComplete?: number; // Hours/days estimate

  // Unlock Conditions
  conditions: AchievementCondition[];
  prerequisiteAchievements?: string[]; // Must unlock these first

  // Rewards
  rewards: AchievementReward;

  // Progression
  isProgressive: boolean;        // Can be partially completed
  progressSteps?: ProgressStep[];
  repeatable: boolean;           // Can be earned multiple times

  // Visibility & Availability
  isHidden: boolean;             // Hidden until unlocked
  isSecret: boolean;             // Not shown in achievement list
  availableFrom?: FirebaseTimestamp; // When this becomes available
  availableUntil?: FirebaseTimestamp; // Limited time achievements

  // Social Features
  isShareable: boolean;
  shareText?: string;            // Pre-written share message
  celebrationMessage?: string;   // Message shown when unlocked

  // Metadata
  createdAt: FirebaseTimestamp;
  createdBy: string;             // Admin who created it
  version: number;
  isActive: boolean;
}

interface AchievementCondition {
  id: string;
  type: ConditionType;
  operator: 'equals' | 'greater_than' | 'less_than' | 'greater_equal' | 'less_equal' | 'contains';
  value: number | string | boolean;

  // Time constraints
  timeframe?: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'all_time' | 'current_streak';
  consecutiveRequired?: boolean; // Must be consecutive days/activities

  // Activity-specific conditions
  activityType?: ActivityType;
  activityCategory?: ActivityCategory;
  minimumScore?: number;

  // Advanced conditions
  customQuery?: string;          // For complex conditions
  dependencies?: string[];       // Other conditions that must be met
}

type ConditionType =
  | 'streak_length'              // Hours/days smoke-free
  | 'activity_count'             // Number of specific activities
  | 'total_score'                // Cumulative Aura score
  | 'money_saved'                // Financial milestone
  | 'days_active'                // Days using the app
  | 'consecutive_days'           // Consecutive days with activities
  | 'avoid_triggers'             // Avoiding specific triggers
  | 'social_engagement'          // Community participation
  | 'health_milestone'           // Physical health improvements
  | 'custom'                     // Custom logic in Cloud Function
  | 'time_based'                 // Simply time passing
  | 'combination';               // Multiple conditions combined

interface AchievementReward {
  auraPoints: number;
  unlocksFeature?: string;       // Feature flag to enable
  unlocksContent?: string[];     // New content/tips/articles
  unlocksTheme?: string;         // UI theme or color scheme
  badge?: string;                // Special badge to display
  title?: string;                // Profile title user can display

  // Premium rewards
  premiumDaysGranted?: number;   // Free premium access
  customization?: CustomizationReward;
}

interface CustomizationReward {
  avatarParts?: string[];        // New avatar customization options
  themes?: string[];             // App theme options
  quotes?: string[];             // Motivational quote collections
  sounds?: string[];             // Notification sounds
}

type AchievementCategory =
  | 'streaks'                    // Smoke-free streak achievements
  | 'activities'                 // Activity logging achievements
  | 'health'                     // Health milestone achievements
  | 'financial'                  // Money saving achievements
  | 'social'                     // Community engagement achievements
  | 'personal_growth'            // Self-improvement achievements
  | 'special_events'             // Holiday/event-based achievements
  | 'challenges'                 // Temporary challenge achievements
  | 'meta';                      // App usage achievements

type AchievementRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

// User achievement tracking
// users/{userId}/achievements/{achievementId}
interface UserAchievement {
  id: string;                    // Achievement ID
  userId: string;
  unlockedAt: FirebaseTimestamp;
  progress: number;              // Current progress (0-100)
  isCompleted: boolean;
  completedAt?: FirebaseTimestamp;

  // Progress tracking
  currentStep?: number;          // For progressive achievements
  stepProgress?: ProgressStepStatus[];

  // Context when unlocked
  triggeringActivity?: string;   // Activity that triggered unlock
  streakLength?: number;         // Streak length when unlocked
  totalScore?: number;           // Total score when unlocked

  // Social sharing
  wasShared: boolean;
  shareCount: number;
  reactionCount: number;

  // Metadata
  version: number;
  lastUpdated: FirebaseTimestamp;
}
```

### 2.4 Health Milestone System

```typescript
// milestones/{milestoneId}
interface HealthMilestone {
  id: string;
  title: string;
  description: string;
  detailedDescription: string;

  // Medical Information
  medicalBenefit: string;        // What health benefit occurs
  scientificExplanation: string; // Why this happens
  sources: MedicalSource[];      // Scientific references

  // Timing
  timeRequiredHours: number;     // Hours smoke-free to unlock
  timeRequiredDisplay: string;   // Human-readable time (e.g., "20 minutes")
  category: MilestoneTimeCategory;

  // Visual Presentation
  icon: string;
  color: string;
  illustration?: string;         // Optional illustration
  beforeAfterImages?: string[];  // Visual comparison images

  // Content
  tips?: string[];               // Related health tips
  whatToExpect?: string[];       // What user might experience
  encouragement: string;         // Motivational message

  // Validation & Credibility
  confidenceLevel: 'high' | 'medium' | 'low';
  lastReviewed: FirebaseTimestamp;
  reviewedBy?: string;           // Medical professional who reviewed

  // Metadata
  priority: number;              // Display order
  isVisible: boolean;
  language: string;              // For internationalization
  createdAt: FirebaseTimestamp;
  version: number;
}

interface MedicalSource {
  title: string;
  authors: string[];
  journal: string;
  year: number;
  doi?: string;
  url?: string;
  credibilityScore: number;      // 1-5 rating
}

type MilestoneTimeCategory =
  | 'immediate'      // 0-1 hours
  | 'hours'          // 1-24 hours
  | 'days'           // 1-7 days
  | 'weeks'          // 1-4 weeks
  | 'months'         // 1-12 months
  | 'years';         // 1+ years

// User milestone progress
// users/{userId}/milestones/{milestoneId}
interface UserMilestone {
  id: string;                    // Milestone ID
  userId: string;
  achievedAt?: FirebaseTimestamp;
  isAchieved: boolean;

  // Progress
  hoursWhenAchieved?: number;
  currentProgress: number;       // 0-100 percentage

  // User Experience
  wasNotified: boolean;
  notifiedAt?: FirebaseTimestamp;
  userReaction?: 'excited' | 'motivated' | 'skeptical' | 'indifferent';
  userNotes?: string;

  // Sharing & Social
  wasShared: boolean;
  shareCount: number;

  version: number;
  lastUpdated: FirebaseTimestamp;
}
```

### 2.5 Notification Management

```typescript
// notifications/{notificationId}
interface NotificationTemplate {
  id: string;
  type: NotificationType;
  category: NotificationCategory;

  // Content
  title: string;
  body: string;
  actionText?: string;           // CTA button text

  // Personalization
  isPersonalized: boolean;
  personalizationFields: string[]; // Fields to substitute

  // Targeting
  targetAudience: AudienceSelector;

  // Scheduling
  schedule: NotificationSchedule;

  // Behavior
  priority: 'low' | 'normal' | 'high';
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  ledEnabled: boolean;

  // Deep Linking
  deepLink?: string;             // Where to navigate when tapped
  data?: Record<string, any>;    // Custom data payload

  // A/B Testing
  variant?: string;              // A/B test variant
  testGroup?: string;

  // Metadata
  createdBy: string;
  createdAt: FirebaseTimestamp;
  isActive: boolean;
  version: number;
}

type NotificationType =
  | 'hourly_reminder'            // Regular hourly check-ins
  | 'half_hourly_motivational'   // Half-hour motivational messages
  | 'achievement_unlocked'       // Achievement notifications
  | 'milestone_reached'          // Health milestone notifications
  | 'streak_milestone'           // Streak achievements
  | 'daily_summary'              // End of day summary
  | 'weekly_insights'            // Weekly progress report
  | 'relapse_support'            // Post-relapse encouragement
  | 'craving_support'            // During-craving assistance
  | 'social_notification'       // Community interactions
  | 'system_announcement'       // App updates/news
  | 'promotional';              // Marketing messages

interface AudienceSelector {
  streakRange?: {
    min?: number;                // Minimum streak hours
    max?: number;                // Maximum streak hours
  };

  scoreRange?: {
    min?: number;
    max?: number;
  };

  demographics?: {
    ageRange?: { min: number; max: number; };
    smokingHistoryYears?: { min: number; max: number; };
    cigarettesPerDay?: { min: number; max: number; };
  };

  behavior?: {
    lastActiveWithin?: number;   // Hours since last activity
    hasAchievements?: boolean;
    relapseInLast?: number;      // Hours since last relapse
    engagementLevel?: 'low' | 'medium' | 'high';
  };

  preferences?: {
    notificationFrequency?: 'low' | 'medium' | 'high';
    hasOptedIn?: boolean;
  };

  location?: {
    timezone?: string[];
    country?: string[];
  };

  subscription?: {
    tier?: ('free' | 'premium' | 'pro')[];
  };
}

interface NotificationSchedule {
  type: 'immediate' | 'scheduled' | 'recurring';

  // For scheduled notifications
  scheduledFor?: FirebaseTimestamp;

  // For recurring notifications
  recurring?: {
    frequency: 'hourly' | 'daily' | 'weekly' | 'monthly';
    interval?: number;           // Every X hours/days/weeks
    daysOfWeek?: number[];       // For weekly: [0,1,2,3,4,5,6]
    hoursOfDay?: number[];       // For daily: [9,12,15,18]
    timezone?: string;
  };

  // Quiet hours
  respectQuietHours: boolean;
  customQuietHours?: {
    start: string;               // "22:00"
    end: string;                 // "08:00"
  };
}

// User notification history
// users/{userId}/notifications/{notificationId}
interface UserNotification {
  id: string;
  userId: string;
  templateId: string;            // Reference to template

  // Content (personalized)
  title: string;
  body: string;

  // Delivery
  sentAt: FirebaseTimestamp;
  deliveredAt?: FirebaseTimestamp;
  deliveryStatus: 'sent' | 'delivered' | 'failed' | 'bounced';

  // User Interaction
  isRead: boolean;
  readAt?: FirebaseTimestamp;
  wasTapped: boolean;
  tappedAt?: FirebaseTimestamp;
  wasDismissed: boolean;
  dismissedAt?: FirebaseTimestamp;

  // Context
  userStreakHours?: number;      // User's streak when sent
  userScore?: number;            // User's score when sent
  triggeringEvent?: string;      // What triggered this notification

  // Metadata
  platform: 'ios' | 'android' | 'web';
  appVersion: string;
  notificationSettings: any;     // User's settings when sent
}
```

## 3. Data Relationships & Indexes

### 3.1 Query Optimization

```typescript
// Firestore indexes for optimal performance
const firestoreIndexes = [
  // User activities by timestamp (recent first)
  {
    collectionGroup: 'activities',
    fields: [
      { fieldPath: 'userId', order: 'ASCENDING' },
      { fieldPath: 'timestamp', order: 'DESCENDING' }
    ]
  },

  // Activities by type and timestamp
  {
    collectionGroup: 'activities',
    fields: [
      { fieldPath: 'userId', order: 'ASCENDING' },
      { fieldPath: 'type', order: 'ASCENDING' },
      { fieldPath: 'timestamp', order: 'DESCENDING' }
    ]
  },

  // Activities by category and date
  {
    collectionGroup: 'activities',
    fields: [
      { fieldPath: 'userId', order: 'ASCENDING' },
      { fieldPath: 'category', order: 'ASCENDING' },
      { fieldPath: 'timestamp', order: 'DESCENDING' }
    ]
  },

  // User achievements by completion date
  {
    collectionGroup: 'achievements',
    fields: [
      { fieldPath: 'userId', order: 'ASCENDING' },
      { fieldPath: 'isCompleted', order: 'ASCENDING' },
      { fieldPath: 'completedAt', order: 'DESCENDING' }
    ]
  },

  // Notification delivery tracking
  {
    collectionGroup: 'notifications',
    fields: [
      { fieldPath: 'userId', order: 'ASCENDING' },
      { fieldPath: 'sentAt', order: 'DESCENDING' },
      { fieldPath: 'deliveryStatus', order: 'ASCENDING' }
    ]
  }
];
```

### 3.2 Data Aggregation Strategy

```typescript
// Pre-calculated aggregations for performance
interface DailyAggregation {
  date: string;                  // YYYY-MM-DD
  userId: string;

  activities: {
    total: number;
    byType: Record<ActivityType, number>;
    byCategory: Record<ActivityCategory, number>;
  };

  scores: {
    daily: number;
    cumulative: number;
    average: number;
  };

  streaks: {
    isActive: boolean;
    currentLength: number;
    dayOfStreak: number;
  };

  health: {
    cigarettesAvoided: number;
    moneySaved: number;
    hoursSmokeFree: number;
  };

  mood: {
    average?: number;
    entries: number;
  };

  achievements: {
    unlocked: string[];
    totalPoints: number;
  };
}

// Weekly/Monthly rollups
interface WeeklyAggregation {
  week: string;                  // YYYY-WW format
  userId: string;

  summary: {
    activeDays: number;
    totalActivities: number;
    totalScore: number;
    averageDailyScore: number;
    streakDays: number;
    smokeFreePercentage: number;
  };

  trends: {
    scoreChange: number;         // vs previous week
    activityChange: number;
    moodTrend: 'improving' | 'stable' | 'declining';
  };

  highlights: {
    bestDay: string;
    longestStreak: number;
    topActivities: ActivityType[];
    achievementsUnlocked: number;
  };

  insights: {
    strengths: string[];
    areasForImprovement: string[];
    recommendations: string[];
  };
}
```

## 4. Data Privacy & Security

### 4.1 Encryption Strategy

```typescript
// Sensitive data encryption
interface EncryptedUserData {
  // Always encrypted at rest
  personalIdentifiers: {
    email: string;               // Encrypted with user key
    displayName: string;         // Encrypted with user key
    phoneNumber?: string;        // Encrypted with user key
  };

  // Anonymized for analytics
  analyticsId: string;           // Non-reversible hash

  // Pseudonymized for research
  researchId?: string;           // Reversible only with consent
}

// Data access logging
interface DataAccessLog {
  id: string;
  userId: string;
  accessedBy: string;           // Admin user ID or system
  accessType: 'read' | 'write' | 'delete' | 'export';
  dataType: string;             // What type of data
  reason: string;               // Reason for access
  timestamp: FirebaseTimestamp;
  ipAddress?: string;
  userAgent?: string;
}
```

### 4.2 GDPR Compliance

```typescript
interface GDPRRequest {
  id: string;
  userId: string;
  requestType: 'access' | 'rectification' | 'erasure' | 'portability' | 'restriction';
  status: 'pending' | 'processing' | 'completed' | 'denied';

  requestedAt: FirebaseTimestamp;
  processedAt?: FirebaseTimestamp;
  completedAt?: FirebaseTimestamp;

  requestDetails: string;
  adminNotes?: string;

  // For data export requests
  exportUrl?: string;           // Temporary download URL
  exportExpiresAt?: FirebaseTimestamp;

  // For deletion requests
  deletionComplete: boolean;
  dataTypesDeleted?: string[];
  retentionExceptions?: string[]; // Legal reasons to retain certain data
}

interface ConsentRecord {
  userId: string;
  consentType: 'data_processing' | 'marketing' | 'research' | 'cookies';
  consented: boolean;
  consentedAt: FirebaseTimestamp;
  withdrawnAt?: FirebaseTimestamp;

  // Legal basis
  legalBasis: 'consent' | 'contract' | 'legal_obligation' | 'vital_interests' | 'public_task' | 'legitimate_interests';

  // Consent mechanism
  consentMethod: 'explicit_opt_in' | 'implied' | 'pre_ticked' | 'continued_use';

  // Context
  ipAddress: string;
  userAgent: string;
  appVersion: string;

  version: number;
}
```

This comprehensive data modeling plan ensures AuraShift can scale to millions of users while maintaining data integrity, privacy, and performance.