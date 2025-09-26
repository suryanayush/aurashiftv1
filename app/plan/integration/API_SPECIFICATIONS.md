# AuraShift Integration & API Specifications

## 1. Integration Architecture Overview

### System Integration Map
```
Mobile App (React Native)
├── Firebase Authentication      # User management
├── Firestore Database          # Real-time data sync
├── Firebase Cloud Functions    # Business logic API
├── Firebase Cloud Messaging    # Push notifications
├── Firebase Analytics          # User behavior tracking
├── Firebase Crashlytics        # Error monitoring
├── Firebase Remote Config      # Feature flags
├── OpenAI API                  # AI coaching (future)
├── Expo Notifications          # Local notifications
├── Device APIs                 # Camera, location, etc.
└── Third-party Services        # Email, SMS, etc.
```

### Data Flow Patterns
```
User Action → Frontend State → Firebase SDK → Cloud Function → Database Update
                    ↓                                              ↓
            Real-time UI Update ←─── Firestore Listener ←──────────┘
```

## 2. Authentication Integration

### 2.1 Auth Flow Specification

```typescript
// Authentication service interface
interface AuthService {
  // Sign up flow
  signUp(email: string, password: string, displayName: string): Promise<AuthResult>;

  // Sign in flow
  signIn(email: string, password: string): Promise<AuthResult>;

  // Social authentication
  signInWithGoogle(): Promise<AuthResult>;
  signInWithApple(): Promise<AuthResult>;

  // Password management
  resetPassword(email: string): Promise<void>;
  updatePassword(newPassword: string): Promise<void>;

  // Profile management
  updateProfile(profile: Partial<UserProfile>): Promise<void>;

  // Session management
  signOut(): Promise<void>;
  refreshToken(): Promise<string>;

  // Auth state
  getCurrentUser(): User | null;
  onAuthStateChanged(callback: (user: User | null) => void): Unsubscribe;
}

interface AuthResult {
  user: User;
  isNewUser: boolean;
  needsOnboarding: boolean;
  customClaims?: CustomClaims;
}

interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  emailVerified: boolean;
  createdAt: Date;
  lastLoginAt: Date;
}
```

### 2.2 Security Token Management

```typescript
// Custom claims for role-based access
interface CustomClaims {
  role: 'user' | 'admin' | 'moderator';
  subscriptionTier: 'free' | 'premium' | 'pro';
  features: string[];
  premiumExpiresAt?: number;
}

// Token refresh service
class TokenManager {
  private refreshTimer?: NodeJS.Timeout;

  async ensureValidToken(): Promise<string> {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    const tokenResult = await user.getIdTokenResult();

    // Refresh if token expires in less than 5 minutes
    if (tokenResult.expirationTime.getTime() - Date.now() < 5 * 60 * 1000) {
      return await user.getIdToken(true);
    }

    return tokenResult.token;
  }

  startAutoRefresh(): void {
    // Refresh token every 50 minutes
    this.refreshTimer = setInterval(() => {
      this.ensureValidToken().catch(console.error);
    }, 50 * 60 * 1000);
  }

  stopAutoRefresh(): void {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
      this.refreshTimer = undefined;
    }
  }
}
```

## 3. Real-time Data Synchronization

### 3.1 Firestore Integration Patterns

```typescript
// Real-time data subscription service
class FirestoreService {
  private subscriptions = new Map<string, Unsubscribe>();

  // Subscribe to user profile changes
  subscribeToUserProfile(userId: string, callback: (profile: UserProfile) => void): string {
    const unsubscribe = firestore
      .collection('users')
      .doc(userId)
      .onSnapshot(
        (doc) => {
          if (doc.exists) {
            callback(doc.data() as UserProfile);
          }
        },
        (error) => {
          console.error('User profile subscription error:', error);
          this.handleSubscriptionError(error);
        }
      );

    const subscriptionId = `user-profile-${userId}`;
    this.subscriptions.set(subscriptionId, unsubscribe);
    return subscriptionId;
  }

  // Subscribe to user activities
  subscribeToActivities(
    userId: string,
    limit: number = 50,
    callback: (activities: Activity[]) => void
  ): string {
    const unsubscribe = firestore
      .collection('users')
      .doc(userId)
      .collection('activities')
      .orderBy('timestamp', 'desc')
      .limit(limit)
      .onSnapshot(
        (snapshot) => {
          const activities = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          } as Activity));
          callback(activities);
        },
        (error) => {
          console.error('Activities subscription error:', error);
          this.handleSubscriptionError(error);
        }
      );

    const subscriptionId = `activities-${userId}`;
    this.subscriptions.set(subscriptionId, unsubscribe);
    return subscriptionId;
  }

  // Unsubscribe from real-time updates
  unsubscribe(subscriptionId: string): void {
    const unsubscribe = this.subscriptions.get(subscriptionId);
    if (unsubscribe) {
      unsubscribe();
      this.subscriptions.delete(subscriptionId);
    }
  }

  // Clean up all subscriptions
  unsubscribeAll(): void {
    this.subscriptions.forEach(unsubscribe => unsubscribe());
    this.subscriptions.clear();
  }

  private handleSubscriptionError(error: any): void {
    // Implement retry logic and error reporting
    if (error.code === 'permission-denied') {
      // Handle authentication issues
      auth.signOut();
    }

    // Log error for monitoring
    crashlytics().recordError(error);
  }
}
```

### 3.2 Optimistic Updates

```typescript
// Optimistic update pattern for activities
class ActivityService {
  async logActivity(activity: Omit<Activity, 'id' | 'timestamp'>): Promise<void> {
    const optimisticId = `temp-${Date.now()}`;
    const optimisticActivity: Activity = {
      ...activity,
      id: optimisticId,
      timestamp: new Date(),
    };

    // 1. Immediately update UI (optimistic)
    store.dispatch(addActivityOptimistic(optimisticActivity));

    try {
      // 2. Send to backend
      const docRef = await firestore
        .collection('users')
        .doc(auth.currentUser!.uid)
        .collection('activities')
        .add({
          ...activity,
          timestamp: firestore.FieldValue.serverTimestamp(),
          userId: auth.currentUser!.uid,
        });

      // 3. Update with real data (includes server timestamp)
      store.dispatch(updateActivityId({
        tempId: optimisticId,
        realId: docRef.id
      }));

    } catch (error) {
      // 4. Rollback on error
      store.dispatch(removeActivity(optimisticId));

      // 5. Show error to user
      store.dispatch(showError('Failed to log activity. Please try again.'));

      throw error;
    }
  }
}
```

## 4. Cloud Functions API

### 4.1 HTTP Functions (REST API)

```typescript
// User management functions
export const createUserProfile = functions.https.onCall(async (data, context) => {
  // Validate authentication
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  // Validate input
  const { error } = createUserProfileSchema.validate(data);
  if (error) {
    throw new functions.https.HttpsError('invalid-argument', error.message);
  }

  try {
    const userId = context.auth.uid;
    const userProfile: UserProfile = {
      id: userId,
      email: context.auth.token.email!,
      displayName: data.displayName,
      createdAt: admin.firestore.Timestamp.now(),
      onboarding: {
        completed: false,
        smokingProfile: data.smokingProfile,
        motivations: data.motivations,
        preferences: data.preferences,
      },
      currentStatus: {
        isActive: true,
        streakStartTime: admin.firestore.Timestamp.now(),
        isPaused: false,
      },
      stats: initializeUserStats(),
      settings: getDefaultSettings(),
      subscription: {
        tier: 'free',
        features: [],
        trialUsed: false,
      },
      privacy: {
        dataProcessingConsent: data.dataProcessingConsent,
        marketingConsent: data.marketingConsent || false,
        researchParticipation: data.researchParticipation || false,
        lastConsentUpdate: admin.firestore.Timestamp.now(),
        gdprRequests: [],
      },
      version: 1,
      tags: [],
      flags: [],
    };

    await admin.firestore()
      .collection('users')
      .doc(userId)
      .set(userProfile);

    // Set custom claims
    await admin.auth().setCustomUserClaims(userId, {
      role: 'user',
      subscriptionTier: 'free',
      features: [],
    });

    return { success: true, profile: userProfile };

  } catch (error) {
    console.error('Error creating user profile:', error);
    throw new functions.https.HttpsError('internal', 'Failed to create user profile');
  }
});

// Activity logging with business logic
export const logActivity = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const userId = context.auth.uid;
  const activity: Omit<Activity, 'id'> = {
    ...data,
    userId,
    timestamp: admin.firestore.Timestamp.now(),
  };

  // Start transaction for consistency
  return await admin.firestore().runTransaction(async (transaction) => {
    // Add activity
    const activityRef = admin.firestore()
      .collection('users')
      .doc(userId)
      .collection('activities')
      .doc();

    transaction.set(activityRef, activity);

    // Update user stats
    const userRef = admin.firestore().collection('users').doc(userId);
    const userDoc = await transaction.get(userRef);

    if (userDoc.exists) {
      const userData = userDoc.data() as UserProfile;
      const updatedStats = calculateUpdatedStats(userData.stats, activity);

      transaction.update(userRef, {
        stats: updatedStats,
        'currentStatus.lastActiveAt': admin.firestore.Timestamp.now(),
      });

      // Handle streak logic
      if (activity.type === 'cigarette') {
        transaction.update(userRef, {
          'currentStatus.streakStartTime': admin.firestore.Timestamp.now(),
          'currentStatus.lastRelapseTime': admin.firestore.Timestamp.now(),
        });
      }
    }

    return { success: true, activityId: activityRef.id };
  });
});

// Achievement checking
export const checkAchievements = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const userId = context.auth.uid;
  const newAchievements = await evaluateUserAchievements(userId);

  if (newAchievements.length > 0) {
    // Award achievements
    for (const achievement of newAchievements) {
      await awardAchievement(userId, achievement);
    }

    return {
      success: true,
      newAchievements: newAchievements.map(a => a.id)
    };
  }

  return { success: true, newAchievements: [] };
});
```

### 4.2 Triggered Functions (Event-driven)

```typescript
// Real-time achievement processing
export const onActivityCreated = functions.firestore
  .document('users/{userId}/activities/{activityId}')
  .onCreate(async (snap, context) => {
    const activity = snap.data() as Activity;
    const userId = context.params.userId;

    // Update aggregated statistics
    await updateUserAggregates(userId, activity);

    // Check for new achievements
    const newAchievements = await evaluateUserAchievements(userId);

    // Award new achievements
    for (const achievement of newAchievements) {
      await awardAchievement(userId, achievement);

      // Send achievement notification
      await sendNotification(userId, {
        title: 'Achievement Unlocked! 🏆',
        body: `You earned "${achievement.title}"!`,
        data: {
          type: 'achievement',
          achievementId: achievement.id,
        },
      });
    }

    // Check health milestones
    if (activity.type !== 'cigarette') {
      await checkHealthMilestones(userId);
    }
  });

// Scheduled functions for maintenance
export const dailyMaintenanceTasks = functions.pubsub
  .schedule('0 2 * * *') // 2 AM daily
  .timeZone('UTC')
  .onRun(async (context) => {
    console.log('Starting daily maintenance tasks...');

    // Award streak bonuses
    await awardDailyStreakBonuses();

    // Clean up expired data
    await cleanupExpiredSessions();
    await cleanupOldNotifications();

    // Generate daily insights
    await generateDailyInsights();

    // Health checks
    await performHealthChecks();

    console.log('Daily maintenance tasks completed');
  });
```

## 5. Notification Integration

### 5.1 Push Notification Service

```typescript
class NotificationService {
  private fcmToken: string | null = null;

  async initialize(): Promise<void> {
    // Request permission
    const permission = await messaging().requestPermission();

    if (permission === messaging.AuthorizationStatus.AUTHORIZED ||
        permission === messaging.AuthorizationStatus.PROVISIONAL) {

      // Get FCM token
      this.fcmToken = await messaging().getToken();

      // Save token to user profile
      if (auth.currentUser && this.fcmToken) {
        await firestore
          .collection('users')
          .doc(auth.currentUser.uid)
          .update({
            fcmToken: this.fcmToken,
            lastTokenUpdate: firestore.FieldValue.serverTimestamp(),
          });
      }

      // Listen for token refresh
      messaging().onTokenRefresh(async (newToken) => {
        this.fcmToken = newToken;
        if (auth.currentUser) {
          await firestore
            .collection('users')
            .doc(auth.currentUser.uid)
            .update({
              fcmToken: newToken,
              lastTokenUpdate: firestore.FieldValue.serverTimestamp(),
            });
        }
      });

      // Handle foreground messages
      messaging().onMessage(this.handleForegroundMessage);

      // Handle background messages
      messaging().setBackgroundMessageHandler(this.handleBackgroundMessage);
    }
  }

  private handleForegroundMessage = (message: any) => {
    // Show in-app notification or update UI
    store.dispatch(showInAppNotification({
      title: message.notification?.title,
      body: message.notification?.body,
      data: message.data,
    }));
  };

  private handleBackgroundMessage = async (message: any) => {
    // Handle background processing
    console.log('Background message received:', message);

    // Update badge count, sync data, etc.
    if (message.data?.type === 'achievement') {
      // Pre-load achievement data for smooth UX when app opens
      await preloadAchievementData(message.data.achievementId);
    }
  };

  async scheduleLocalNotification(notification: LocalNotification): Promise<string> {
    return await Notifications.scheduleNotificationAsync({
      content: {
        title: notification.title,
        body: notification.body,
        data: notification.data,
        sound: notification.sound || 'default',
        badge: notification.badge,
      },
      trigger: notification.trigger,
    });
  }

  async cancelLocalNotification(notificationId: string): Promise<void> {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  }

  async cancelAllLocalNotifications(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }
}
```

### 5.2 Notification Scheduling

```typescript
// Cloud function for sending scheduled notifications
export const sendScheduledNotifications = functions.pubsub
  .schedule('0,30 * * * *') // Every hour and half-hour
  .onRun(async (context) => {
    const now = admin.firestore.Timestamp.now();
    const currentHour = now.toDate().getHours();
    const currentMinute = now.toDate().getMinutes();

    // Determine notification type
    const isHourly = currentMinute === 0;
    const isHalfHourly = currentMinute === 30;

    if (!isHourly && !isHalfHourly) return;

    // Get users who should receive notifications
    const users = await admin.firestore()
      .collection('users')
      .where('settings.notifications.enabled', '==', true)
      .where('settings.notifications.hourlyReminders', '==', isHourly)
      .get();

    const notifications: Promise<void>[] = [];

    for (const userDoc of users.docs) {
      const user = userDoc.data() as UserProfile;

      // Check quiet hours
      if (isInQuietHours(user.settings, currentHour)) {
        continue;
      }

      // Personalize message
      const message = await getPersonalizedMessage(user, isHourly);

      notifications.push(
        sendNotificationToUser(user.id, {
          title: message.title,
          body: message.body,
          data: {
            type: isHourly ? 'hourly_reminder' : 'motivational',
            userId: user.id,
          },
        })
      );
    }

    await Promise.allSettled(notifications);
  });

async function getPersonalizedMessage(user: UserProfile, isHourly: boolean): Promise<NotificationMessage> {
  const streakHours = calculateCurrentStreak(user);
  const userName = user.displayName;

  if (isHourly) {
    // Hourly reminder messages
    if (streakHours < 24) {
      return {
        title: `Keep it up, ${userName}! 💪`,
        body: `You're ${streakHours} hours smoke-free. Every hour counts!`,
      };
    } else if (streakHours < 168) { // Less than a week
      const days = Math.floor(streakHours / 24);
      return {
        title: `${days} days strong! 🌟`,
        body: `Your body is already healing. Keep going, ${userName}!`,
      };
    } else {
      const weeks = Math.floor(streakHours / 168);
      return {
        title: `${weeks} weeks smoke-free! 🎉`,
        body: `You're becoming unstoppable, ${userName}!`,
      };
    }
  } else {
    // Half-hourly motivational messages
    const motivationalMessages = [
      `You've got this, ${userName}! ⚡`,
      `Stay strong! Your future self will thank you 🙏`,
      `Every moment smoke-free is a victory! 🏆`,
      `Your lungs are thanking you right now 🫁`,
    ];

    return {
      title: 'AuraShift',
      body: motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)],
    };
  }
}
```

## 6. Third-party Integrations

### 6.1 AI Service Integration (Future Phase)

```typescript
// OpenAI integration for AI coaching
class AICoachService {
  private openai: OpenAI;

  constructor(apiKey: string) {
    this.openai = new OpenAI({ apiKey });
  }

  async generateCoachingResponse(
    userContext: UserContext,
    userMessage: string
  ): Promise<CoachingResponse> {
    try {
      const systemPrompt = this.buildSystemPrompt(userContext);

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage },
        ],
        max_tokens: 200,
        temperature: 0.7,
        presence_penalty: 0.1,
        frequency_penalty: 0.1,
      });

      const response = completion.choices[0]?.message?.content;

      if (!response) {
        throw new Error('No response from AI service');
      }

      // Log for improvement
      await this.logConversation(userContext.userId, userMessage, response);

      return {
        message: response,
        confidence: this.calculateConfidence(completion),
        suggestions: await this.extractSuggestions(response),
      };

    } catch (error) {
      console.error('AI coaching error:', error);

      // Fallback to pre-written responses
      return await this.getFallbackResponse(userContext, userMessage);
    }
  }

  private buildSystemPrompt(context: UserContext): string {
    return `You are AuraAI, a supportive and knowledgeable quit-smoking coach.

User Context:
- Name: ${context.displayName}
- Smoking History: ${context.smokingHistory.yearsSmoked} years, ${context.smokingHistory.cigarettesPerDay} per day
- Current Streak: ${context.currentStreakHours} hours smoke-free
- Longest Streak: ${context.longestStreakHours} hours
- Recent Activities: ${context.recentActivities.join(', ')}
- Primary Motivations: ${context.motivations.join(', ')}
- Recent Relapses: ${context.recentRelapses}

Guidelines:
- Be encouraging and supportive, never judgmental
- Reference their specific progress and context
- Provide actionable, concrete suggestions
- Focus on positive reinforcement
- Keep responses under 150 words
- Use a warm, friend-like tone
- If they mention a relapse, be understanding and help them refocus`;
  }

  private async getFallbackResponse(context: UserContext, message: string): Promise<CoachingResponse> {
    // Pre-written responses based on common patterns
    const patterns = [
      {
        keywords: ['craving', 'want', 'need', 'urge'],
        responses: [
          `I understand you're having a craving, ${context.displayName}. You've been smoke-free for ${context.currentStreakHours} hours - that's amazing! Try the 4-7-8 breathing technique: breathe in for 4, hold for 7, exhale for 8. This feeling will pass in a few minutes.`,
          `Cravings are tough, but you're tougher! Remember why you started - ${context.motivations[0]}. You've already proven you can do this for ${context.currentStreakHours} hours. What's one healthy activity you can do right now?`,
        ],
      },
      {
        keywords: ['relapse', 'smoked', 'gave in', 'failed'],
        responses: [
          `I hear you, and I want you to know that setbacks don't erase your progress. You were smoke-free for ${context.currentStreakHours} hours - that's real healing that happened. What can we learn from this moment to make tomorrow stronger?`,
          `You're not starting from zero, ${context.displayName}. Every quit attempt teaches you something valuable. Your body benefits from every smoke-free hour. Let's focus on your next smoke-free moment - what's one thing that will help you right now?`,
        ],
      },
    ];

    // Find matching pattern
    const lowerMessage = message.toLowerCase();
    for (const pattern of patterns) {
      if (pattern.keywords.some(keyword => lowerMessage.includes(keyword))) {
        const response = pattern.responses[Math.floor(Math.random() * pattern.responses.length)];
        return {
          message: response,
          confidence: 0.8,
          suggestions: ['Try breathing exercises', 'Go for a walk', 'Call a friend'],
        };
      }
    }

    // Default encouraging response
    return {
      message: `Thanks for reaching out, ${context.displayName}! You're doing great with ${context.currentStreakHours} hours smoke-free. Every moment is progress. What's on your mind today?`,
      confidence: 0.7,
      suggestions: ['Log your activities', 'Check your progress', 'Set a new goal'],
    };
  }
}
```

### 6.2 Analytics Integration

```typescript
// Firebase Analytics integration
class AnalyticsService {
  async trackEvent(eventName: string, parameters: Record<string, any>): Promise<void> {
    // Firebase Analytics
    await analytics().logEvent(eventName, {
      ...parameters,
      timestamp: Date.now(),
      user_id: auth.currentUser?.uid,
      app_version: Constants.expoConfig?.version,
      platform: Platform.OS,
    });

    // Custom analytics if needed
    if (__DEV__) {
      console.log(`Analytics Event: ${eventName}`, parameters);
    }
  }

  async trackScreenView(screenName: string): Promise<void> {
    await analytics().logScreenView({
      screen_name: screenName,
      screen_class: screenName,
    });
  }

  async trackUserProperty(property: string, value: string): Promise<void> {
    await analytics().setUserProperty(property, value);
  }

  async trackPurchase(purchaseData: PurchaseData): Promise<void> {
    await analytics().logPurchase({
      currency: purchaseData.currency,
      value: purchaseData.value,
      transaction_id: purchaseData.transactionId,
      items: purchaseData.items,
    });
  }

  // Custom events for AuraShift
  async trackActivityLogged(activity: Activity): Promise<void> {
    await this.trackEvent('activity_logged', {
      activity_type: activity.type,
      activity_category: activity.category,
      aura_points: activity.totalAuraPoints,
      user_streak_hours: activity.userId ? await getCurrentStreak(activity.userId) : 0,
    });
  }

  async trackAchievementUnlocked(achievement: Achievement, userContext: UserContext): Promise<void> {
    await this.trackEvent('achievement_unlocked', {
      achievement_id: achievement.id,
      achievement_category: achievement.category,
      achievement_rarity: achievement.rarity,
      user_streak_hours: userContext.currentStreakHours,
      user_total_score: userContext.totalAuraScore,
    });
  }

  async trackRelapseEvent(relapseData: RelapseData): Promise<void> {
    await this.trackEvent('relapse_occurred', {
      previous_streak_hours: relapseData.previousStreak.duration,
      trigger_type: relapseData.trigger.primary,
      trigger_intensity: relapseData.trigger.intensity,
      time_of_day: relapseData.context.timeOfDay,
      day_of_week: relapseData.context.dayOfWeek,
    });
  }
}
```

## 7. Error Handling & Resilience

### 7.1 Network Error Handling

```typescript
class NetworkService {
  private retryConfig = {
    maxRetries: 3,
    baseDelay: 1000,
    maxDelay: 10000,
    backoffFactor: 2,
  };

  async executeWithRetry<T>(
    operation: () => Promise<T>,
    options?: Partial<typeof this.retryConfig>
  ): Promise<T> {
    const config = { ...this.retryConfig, ...options };

    for (let attempt = 1; attempt <= config.maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        if (attempt === config.maxRetries || !this.isRetryableError(error)) {
          throw error;
        }

        const delay = Math.min(
          config.baseDelay * Math.pow(config.backoffFactor, attempt - 1),
          config.maxDelay
        );

        await this.sleep(delay);
      }
    }

    throw new Error('Max retries exceeded');
  }

  private isRetryableError(error: any): boolean {
    // Retry on network errors, timeouts, and 5xx responses
    return error.code === 'unavailable' ||
           error.code === 'deadline-exceeded' ||
           error.code === 'internal' ||
           error.message?.includes('network') ||
           error.message?.includes('timeout');
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Global error boundary for API calls
class APIClient {
  private networkService = new NetworkService();

  async call<T>(operation: () => Promise<T>): Promise<T> {
    try {
      return await this.networkService.executeWithRetry(operation);
    } catch (error) {
      // Log error for monitoring
      crashlytics().recordError(error as Error);

      // Transform error for user-friendly display
      throw this.transformError(error);
    }
  }

  private transformError(error: any): Error {
    if (error.code === 'permission-denied') {
      return new Error('You don\'t have permission to perform this action');
    }

    if (error.code === 'unauthenticated') {
      return new Error('Please log in to continue');
    }

    if (error.code === 'unavailable') {
      return new Error('Service temporarily unavailable. Please try again');
    }

    return new Error('Something went wrong. Please try again');
  }
}
```

### 7.2 Offline Support

```typescript
// Offline queue for actions
class OfflineQueue {
  private queue: QueuedAction[] = [];
  private isProcessing = false;

  async addAction(action: QueuedAction): Promise<void> {
    this.queue.push({
      ...action,
      id: uuid(),
      timestamp: Date.now(),
      retryCount: 0,
    });

    await this.saveQueueToStorage();

    // Try to process immediately if online
    if (await NetInfo.fetch().then(state => state.isConnected)) {
      this.processQueue();
    }
  }

  async processQueue(): Promise<void> {
    if (this.isProcessing || this.queue.length === 0) return;

    this.isProcessing = true;

    while (this.queue.length > 0) {
      const action = this.queue[0];

      try {
        await this.executeAction(action);
        this.queue.shift(); // Remove successful action

      } catch (error) {
        action.retryCount++;

        if (action.retryCount >= 3) {
          console.error('Action failed after 3 retries, removing:', action);
          this.queue.shift();
        } else {
          // Move failed action to end of queue
          this.queue.push(this.queue.shift()!);
        }

        // Break on network error to avoid processing entire queue
        if (!await NetInfo.fetch().then(state => state.isConnected)) {
          break;
        }
      }
    }

    await this.saveQueueToStorage();
    this.isProcessing = false;
  }

  private async executeAction(action: QueuedAction): Promise<void> {
    switch (action.type) {
      case 'log_activity':
        await firestore
          .collection('users')
          .doc(action.userId)
          .collection('activities')
          .add(action.data);
        break;

      case 'update_profile':
        await firestore
          .collection('users')
          .doc(action.userId)
          .update(action.data);
        break;

      default:
        console.warn('Unknown action type:', action.type);
    }
  }

  private async saveQueueToStorage(): Promise<void> {
    await AsyncStorage.setItem('offline_queue', JSON.stringify(this.queue));
  }

  private async loadQueueFromStorage(): Promise<void> {
    const queueData = await AsyncStorage.getItem('offline_queue');
    if (queueData) {
      this.queue = JSON.parse(queueData);
    }
  }
}

interface QueuedAction {
  id: string;
  type: 'log_activity' | 'update_profile' | 'award_achievement';
  userId: string;
  data: any;
  timestamp: number;
  retryCount: number;
}
```

This comprehensive integration plan ensures seamless communication between all components of the AuraShift application while maintaining reliability, performance, and user experience.