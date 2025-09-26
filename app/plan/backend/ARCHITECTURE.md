# AuraShift Backend Architecture Plan

## 1. Backend Technology Stack

### Core Infrastructure
- **Firebase Suite**: Comprehensive backend-as-a-service solution
  - **Firebase Authentication**: User management and security
  - **Cloud Firestore**: NoSQL document database
  - **Firebase Cloud Functions**: Serverless compute
  - **Firebase Cloud Messaging**: Push notifications
  - **Firebase Analytics**: User behavior tracking
  - **Firebase Crashlytics**: Error tracking and monitoring

### Additional Services
- **OpenAI API**: AI coaching integration (future phase)
- **SendGrid**: Email service for important communications
- **Firebase Storage**: File storage for user photos/documents
- **Firebase Remote Config**: Dynamic feature flags and configuration

### Development & Monitoring
- **Firebase Emulators**: Local development environment
- **Firebase Performance Monitoring**: App performance tracking
- **Firebase Security Rules**: Database access control
- **GitHub Actions**: CI/CD pipeline

## 2. Database Architecture (Cloud Firestore)

### Data Model Overview
```
firestore/
├── users/                    # User profiles and settings
│   ├── {userId}/
│   │   ├── profile: UserProfile
│   │   ├── settings: UserSettings
│   │   ├── timeline: Timeline[]
│   │   └── activities/       # Sub-collection
│   │       └── {activityId}: Activity
├── achievements/             # Achievement definitions
│   └── {achievementId}: Achievement
├── milestones/              # Health recovery milestones
│   └── {milestoneId}: HealthMilestone
├── notifications/           # Notification templates
│   └── {notificationId}: NotificationTemplate
└── app-config/             # Global app configuration
    ├── features: FeatureFlags
    ├── content: AppContent
    └── scoring: ScoringRules
```

### Detailed Data Models

#### User Profile
```typescript
interface UserProfile {
  id: string;                    // Firebase Auth UID
  email: string;
  name: string;
  createdAt: Timestamp;
  lastActiveAt: Timestamp;

  // Onboarding Data
  smokingHistory: {
    yearsSmoked: number;
    cigarettesPerDay: number;
    costPerPack: number;
    packSize: number;
    startedSmokingAge?: number;
  };

  // Current Status
  currentStreak: {
    startTime: Timestamp;        // When current streak started
    isActive: boolean;           // Is currently smoke-free
  };

  // Goals & Motivation
  motivations: string[];         // ["health", "money", "family"]
  personalGoals: string[];       // User-defined goals

  // Achievements
  totalAuraScore: number;        // All-time cumulative score
  longestStreak: number;         // Longest streak in hours
  totalRelapses: number;
  achievementIds: string[];      // Unlocked achievements

  // Statistics
  stats: {
    totalCigarettesAvoided: number;
    totalMoneySaved: number;
    totalActivitiesLogged: number;
    averageDailyScore: number;
  };

  // Preferences
  notificationSettings: NotificationSettings;
  privacySettings: PrivacySettings;

  // Metadata
  version: number;               // Data structure version
  lastUpdated: Timestamp;
}
```

#### User Settings
```typescript
interface UserSettings {
  userId: string;

  // Notification Preferences
  notifications: {
    enabled: boolean;
    hourlyReminders: boolean;
    achievementAlerts: boolean;
    milestoneNotifications: boolean;
    supportReminders: boolean;
    quietHours: {
      enabled: boolean;
      startTime: string;         // "22:00"
      endTime: string;           // "08:00"
    };
  };

  // App Preferences
  ui: {
    theme: "light" | "dark" | "auto";
    language: string;
    currency: string;
    timeFormat: "12h" | "24h";
    firstDayOfWeek: "sunday" | "monday";
  };

  // Privacy Settings
  privacy: {
    analyticsEnabled: boolean;
    crashReportingEnabled: boolean;
    dataSharingEnabled: boolean;
  };

  // Feature Flags (User-specific)
  features: {
    aiCoachEnabled: boolean;
    communityFeaturesEnabled: boolean;
    advancedAnalyticsEnabled: boolean;
  };
}
```

#### Activity Log
```typescript
interface Activity {
  id: string;
  userId: string;
  type: ActivityType;
  timestamp: Timestamp;
  auraPoints: number;

  // Activity Details
  title: string;
  description?: string;
  category: ActivityCategory;

  // Relapse-specific data
  relapseData?: {
    previousStreakDuration: number; // in hours
    triggerType: TriggerType;
    triggerDescription?: string;
    moodBefore?: MoodRating;
    locationContext?: string;
  };

  // General activity metadata
  metadata?: {
    duration?: number;           // Activity duration in minutes
    intensity?: IntensityLevel;
    location?: string;
    notes?: string;
    mood?: MoodRating;
  };
}

type ActivityType =
  | "cigarette"      // -10 points
  | "gym"           // +5 points
  | "healthy_meal"  // +3 points
  | "skincare"      // +2 points
  | "meditation"    // +3 points
  | "hydration"     // +2 points
  | "social_event"  // +5 points
  | "streak_bonus"; // +10 points (automated)

type ActivityCategory =
  | "health"
  | "fitness"
  | "nutrition"
  | "mental_wellness"
  | "social"
  | "relapse";

type TriggerType =
  | "stress"
  | "social_pressure"
  | "boredom"
  | "habit"
  | "alcohol"
  | "after_meal"
  | "work_break"
  | "emotional"
  | "other";

type MoodRating = 1 | 2 | 3 | 4 | 5; // 1=terrible, 5=excellent
type IntensityLevel = "light" | "moderate" | "intense";
```

#### Achievement System
```typescript
interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: AchievementCategory;

  // Unlock Conditions
  conditions: AchievementCondition[];

  // Rewards
  auraPointsReward: number;
  badgeColor: string;
  unlocksFeature?: string;

  // Metadata
  rarity: "common" | "rare" | "epic" | "legendary";
  isHidden: boolean;            // Hidden until unlocked
  relatedAchievements?: string[]; // Achievement chains

  createdAt: Timestamp;
  version: number;
}

interface AchievementCondition {
  type: "streak" | "activity_count" | "score_total" | "time_based" | "savings";
  operator: "equals" | "greater_than" | "less_than" | "greater_equal";
  value: number;
  timeframe?: "daily" | "weekly" | "monthly" | "all_time";
  activityType?: ActivityType;
}

type AchievementCategory =
  | "streaks"
  | "activities"
  | "health_milestones"
  | "financial"
  | "social"
  | "special";
```

#### Health Milestones
```typescript
interface HealthMilestone {
  id: string;
  title: string;
  description: string;
  medicalBenefit: string;
  timeRequired: number;         // Hours smoke-free to unlock
  icon: string;
  category: MilestoneCategory;

  // Scientific backing
  sources: string[];            // Medical research references
  confidenceLevel: "high" | "medium" | "low";

  // Display settings
  priority: number;             // Display order
  isVisible: boolean;

  createdAt: Timestamp;
}

type MilestoneCategory =
  | "immediate"      // 0-24 hours
  | "short_term"     // 1-7 days
  | "medium_term"    // 1-4 weeks
  | "long_term"      // 1-12 months
  | "lifetime";      // 1+ years
```

## 3. Firebase Cloud Functions

### Function Categories

#### 1. Timer & Streak Management
```typescript
// Automated streak bonus awarding
export const awardDailyStreakBonus = functions.pubsub
  .schedule('0 0 * * *')  // Daily at midnight
  .onRun(async (context) => {
    // Award +10 points for each active 24-hour streak
    const users = await getActiveUsers();

    for (const user of users) {
      if (await hasActiveStreak(user.id)) {
        await awardActivity(user.id, {
          type: 'streak_bonus',
          auraPoints: 10,
          timestamp: admin.firestore.Timestamp.now()
        });
      }
    }
  });

// Handle streak breaks/resets
export const handleStreakReset = functions.firestore
  .document('users/{userId}/activities/{activityId}')
  .onCreate(async (snap, context) => {
    const activity = snap.data() as Activity;

    if (activity.type === 'cigarette') {
      await resetUserStreak(context.params.userId, snap.id);
      await updateUserStats(context.params.userId);
      await checkForRecoveryAchievements(context.params.userId);
    }
  });
```

#### 2. Achievement Processing
```typescript
// Real-time achievement checking
export const checkAchievements = functions.firestore
  .document('users/{userId}/activities/{activityId}')
  .onWrite(async (change, context) => {
    const userId = context.params.userId;

    // Get user's current stats and activities
    const userStats = await getUserStats(userId);
    const achievements = await getUnlockedAchievements(userId);

    // Check all achievement conditions
    const newAchievements = await evaluateAchievements(userStats, achievements);

    // Award new achievements
    for (const achievement of newAchievements) {
      await awardAchievement(userId, achievement.id);
      await sendAchievementNotification(userId, achievement);
    }
  });

// Calculate and update user statistics
async function updateUserStats(userId: string) {
  const activities = await getUserActivities(userId);
  const stats = calculateUserStats(activities);

  await admin.firestore()
    .collection('users')
    .doc(userId)
    .update({ stats });
}
```

#### 3. Notification Management
```typescript
// Scheduled hourly notifications
export const sendHourlyReminders = functions.pubsub
  .schedule('0 * * * *')  // Every hour
  .onRun(async (context) => {
    const users = await getNotificationEnabledUsers();

    for (const user of users) {
      if (await shouldSendNotification(user)) {
        await sendNotification(user.id, {
          title: "Stay strong! 💪",
          body: await getPersonalizedMessage(user),
          data: { type: 'hourly_reminder' }
        });
      }
    }
  });

// Half-hourly motivational messages
export const sendHalfHourlyMessages = functions.pubsub
  .schedule('30 * * * *')  // Every half hour
  .onRun(async (context) => {
    const users = await getActiveUsers();

    for (const user of users) {
      if (await shouldSendHalfHourlyMessage(user)) {
        await sendNotification(user.id, {
          title: "You've got this! ⚡",
          body: await getMotivationalMessage(user),
          data: { type: 'motivational_reminder' }
        });
      }
    }
  });
```

#### 4. Data Analytics & Insights
```typescript
// Generate weekly insights
export const generateWeeklyInsights = functions.pubsub
  .schedule('0 9 * * 1')  // Mondays at 9 AM
  .onRun(async (context) => {
    const users = await getAllActiveUsers();

    for (const user of users) {
      const insights = await calculateWeeklyInsights(user.id);
      await saveInsights(user.id, insights);

      if (insights.hasSignificantProgress) {
        await sendInsightNotification(user.id, insights);
      }
    }
  });

// Calculate personalized insights
async function calculateWeeklyInsights(userId: string) {
  const activities = await getRecentActivities(userId, 7); // Last 7 days
  const previousWeekActivities = await getRecentActivities(userId, 14, 7);

  return {
    totalAuraScore: activities.reduce((sum, a) => sum + a.auraPoints, 0),
    scoreChange: calculateScoreChange(activities, previousWeekActivities),
    longestStreak: calculateLongestStreak(activities),
    mostCommonActivity: getMostCommonActivity(activities),
    improvementAreas: identifyImprovementAreas(activities),
    hasSignificantProgress: hasSignificantImprovement(activities, previousWeekActivities)
  };
}
```

#### 5. AI Integration Functions (Future Phase)
```typescript
// AI coach conversation
export const aiCoachChat = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const userId = context.auth.uid;
  const userContext = await getUserContextForAI(userId);

  const aiResponse = await callOpenAI({
    messages: [
      { role: 'system', content: generateAISystemPrompt(userContext) },
      { role: 'user', content: data.message }
    ],
    max_tokens: 150,
    temperature: 0.7
  });

  // Log conversation for improvement
  await logAIConversation(userId, data.message, aiResponse);

  return { response: aiResponse };
});

// Generate personalized AI coaching prompts
function generateAISystemPrompt(userContext: UserContext): string {
  return `You are AuraAI, a supportive quit-smoking coach.

  User Context:
  - Name: ${userContext.name}
  - Smoking history: ${userContext.smokingHistory}
  - Current streak: ${userContext.currentStreak} hours
  - Recent activities: ${userContext.recentActivities}
  - Primary motivations: ${userContext.motivations.join(', ')}

  Be encouraging, specific, and focus on positive reinforcement.
  Reference their progress and suggest concrete next steps.
  Keep responses under 150 words.`;
}
```

## 4. Security Architecture

### Firebase Security Rules

#### Firestore Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;

      // User activities sub-collection
      match /activities/{activityId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }

    // Global read-only data
    match /achievements/{achievementId} {
      allow read: if request.auth != null;
      allow write: if false; // Only via admin SDK
    }

    match /milestones/{milestoneId} {
      allow read: if request.auth != null;
      allow write: if false; // Only via admin SDK
    }

    match /notifications/{notificationId} {
      allow read: if request.auth != null;
      allow write: if false; // Only via admin SDK
    }

    // App configuration (read-only for clients)
    match /app-config/{configId} {
      allow read: if request.auth != null;
      allow write: if false; // Only via admin SDK
    }
  }
}
```

#### Authentication Rules
```typescript
// Custom claims for user roles
interface CustomClaims {
  role?: 'user' | 'admin' | 'moderator';
  subscriptionTier?: 'free' | 'premium' | 'pro';
  betaTester?: boolean;
}

// User creation hook
export const setInitialClaims = functions.auth.user().onCreate(async (user) => {
  const customClaims: CustomClaims = {
    role: 'user',
    subscriptionTier: 'free',
    betaTester: false
  };

  await admin.auth().setCustomUserClaims(user.uid, customClaims);
});
```

### Data Privacy & Compliance

#### GDPR Compliance
```typescript
// User data export
export const exportUserData = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const userId = context.auth.uid;
  const userData = await collectAllUserData(userId);

  return {
    exportedAt: admin.firestore.Timestamp.now(),
    data: userData
  };
});

// User data deletion
export const deleteUserData = functions.auth.user().onDelete(async (user) => {
  await deleteAllUserData(user.uid);
});

// Data anonymization for research (with user consent)
export const anonymizeUserData = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const userId = context.auth.uid;
  const hasConsent = await userHasResearchConsent(userId);

  if (hasConsent) {
    return await anonymizeAndAggregateData(userId);
  }

  throw new functions.https.HttpsError('permission-denied', 'User consent required');
});
```

## 5. Performance & Scalability

### Database Optimization
```typescript
// Compound indexes for efficient queries
const indexes = [
  // User activities by timestamp
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

  // Achievement lookups
  {
    collection: 'achievements',
    fields: [
      { fieldPath: 'category', order: 'ASCENDING' },
      { fieldPath: 'rarity', order: 'ASCENDING' }
    ]
  }
];
```

### Caching Strategy
```typescript
// Cache frequently accessed data
const cache = new Map();

export const getCachedAchievements = functions.https.onCall(async (data, context) => {
  const cacheKey = 'achievements';

  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  const achievements = await admin.firestore()
    .collection('achievements')
    .get();

  const result = achievements.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  // Cache for 1 hour
  cache.set(cacheKey, result);
  setTimeout(() => cache.delete(cacheKey), 60 * 60 * 1000);

  return result;
});
```

### Rate Limiting
```typescript
// Rate limiting for API calls
const rateLimiter = new Map();

export const rateLimitedFunction = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Authentication required');
  }

  const userId = context.auth.uid;
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxRequests = 10;

  if (!rateLimiter.has(userId)) {
    rateLimiter.set(userId, []);
  }

  const userRequests = rateLimiter.get(userId);
  const recentRequests = userRequests.filter((time: number) => now - time < windowMs);

  if (recentRequests.length >= maxRequests) {
    throw new functions.https.HttpsError('resource-exhausted', 'Rate limit exceeded');
  }

  recentRequests.push(now);
  rateLimiter.set(userId, recentRequests);

  // Execute actual function logic here
  return await executeFunction(data, context);
});
```

## 6. Monitoring & Analytics

### Custom Analytics Events
```typescript
// Track user engagement
export const trackEngagementEvent = functions.https.onCall(async (data, context) => {
  if (!context.auth) return;

  await admin.analytics().logEvent({
    name: data.eventName,
    parameters: {
      user_id: context.auth.uid,
      timestamp: admin.firestore.Timestamp.now(),
      ...data.parameters
    }
  });
});

// Custom performance monitoring
export const monitorAppPerformance = functions.pubsub
  .schedule('*/15 * * * *')  // Every 15 minutes
  .onRun(async (context) => {
    const metrics = await collectPerformanceMetrics();
    await logMetricsToMonitoring(metrics);

    // Alert on anomalies
    if (metrics.errorRate > 0.05) {
      await sendAlertToTeam('High error rate detected', metrics);
    }
  });
```

### Health Checks
```typescript
// System health monitoring
export const healthCheck = functions.https.onRequest(async (req, res) => {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      firestore: await checkFirestoreHealth(),
      authentication: await checkAuthHealth(),
      functions: await checkFunctionsHealth(),
      messaging: await checkMessagingHealth()
    }
  };

  const isHealthy = Object.values(health.services).every(service => service.status === 'healthy');

  res.status(isHealthy ? 200 : 503).json(health);
});
```

This comprehensive backend architecture provides a scalable, secure, and maintainable foundation for the AuraShift application, with room for future enhancements and AI integration.