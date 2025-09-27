# AuraShift Complete Storyline & Implementation Guide

## 🌅 Introduction

AuraShift is not just a quit smoking app — it's a personal wellness companion built to shift users toward a smoke-free, healthier, more radiant life. The journey begins with understanding the individual, tracking their choices, and motivating progress through a gamified system. AuraShift empowers users to reclaim control over their habits, their health, and their confidence — one hour, one activity, and one breath at a time.

---

## 🛫 Onboarding Experience

### 📌 Step 1: Welcome to AuraShift

**Implementation Rules:**
- **Rule**: Clean, calming UI with professional design (no emoji in interface)
- **Rule**: Use gradient background with AuraShift branding colors
- **Rule**: Collect exactly three fields: Name, Email, Password
- **Rule**: Firebase Authentication handles all registration securely
- **Validation**: Email format validation, password strength requirements (8+ chars)

**Technical Implementation:**
```typescript
interface OnboardingStep1Data {
  displayName: string;
  email: string;
  password: string;
}

// Firebase Auth registration
const registerUser = async (data: OnboardingStep1Data) => {
  const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
  await updateProfile(userCredential.user, { displayName: data.displayName });
  return userCredential.user;
};
```

### 📌 Step 2: Smoking Profile Setup

**Implementation Rules:**
- **Rule**: Two mandatory questions with numeric input validation
- **Rule**: Store data in user's Firestore profile metadata
- **Rule**: Use slider inputs for better UX (years: 0-50, cigarettes: 0-100)
- **Rule**: Calculate baseline cost estimation (default $10/pack, 20 cigarettes/pack)

**Questions:**
1. "How many years have you been smoking?"
2. "How many cigarettes do you smoke per day on average?"

**Technical Implementation:**
```typescript
interface SmokingProfile {
  yearsSmoked: number;
  cigarettesPerDay: number;
  costPerPack: number; // Default $10
  estimatedDailyCost: number; // Calculated
  onboardingCompleted: boolean;
}

const saveSmokingProfile = async (userId: string, profile: SmokingProfile) => {
  await setDoc(doc(firestore, 'users', userId), {
    smokingHistory: profile,
    auraScore: 0,
    streakStartTime: serverTimestamp(),
    onboardingCompleted: true,
    createdAt: serverTimestamp()
  });
};
```

---

## 🏠 Main Dashboard (Home Tab)

### ⏱️ Smoke-Free Stopwatch

**Implementation Rules:**
- **Rule**: Display format: `Days : Hours : Minutes : Seconds Smoke-Free`
- **Rule**: Update every second with precision timing
- **Rule**: Persist across app restarts and device reboots
- **Rule**: Use monospace font for consistent digit alignment
- **Rule**: Show encouraging message below timer

**Technical Implementation:**
```typescript
interface TimerState {
  startTime: Date;
  isActive: boolean;
  displayText: string;
}

const formatTimer = (startTime: Date): string => {
  const now = new Date();
  const diff = now.getTime() - startTime.getTime();
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  
  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
};
```

### 🚨 "I Smoked" Button

**Implementation Rules:**
- **Rule**: Red/warning color button with clear labeling
- **Rule**: Require confirmation dialog: "Are you sure? This will reset your timer and deduct 10 points."
- **Rule**: Perform four actions on confirmation:
  1. Reset timer to current timestamp
  2. Log cigarette activity in Firestore
  3. Deduct 10 points from Aura Score
  4. Optional trigger analysis prompt

**Technical Implementation:**
```typescript
const handleSmokeReset = async (userId: string, triggerNote?: string) => {
  const batch = writeBatch(firestore);
  
  // Reset timer
  const userRef = doc(firestore, 'users', userId);
  batch.update(userRef, {
    streakStartTime: serverTimestamp(),
    lastSmoked: serverTimestamp(),
    auraScore: increment(-10)
  });
  
  // Log cigarette activity
  const activityRef = doc(collection(firestore, 'activities'));
  batch.set(activityRef, {
    userId,
    type: 'cigarette',
    points: -10,
    timestamp: serverTimestamp(),
    notes: triggerNote,
    source: 'user_reported'
  });
  
  await batch.commit();
};
```

---

## 🗓️ Calendar & Lifestyle Journal

### 📅 Calendar View

**Implementation Rules:**
- **Rule**: Monthly calendar view with activity indicators
- **Rule**: Color-coded dots for different activity types
- **Rule**: Tap day to open Daily Journal
- **Rule**: Show Aura score changes on calendar dates
- **Rule**: Highlight smoke-free days with special indicator

### 📝 Loggable Activities

**Activity Points System:**
```typescript
const ACTIVITY_POINTS = {
  cigarette: -10,
  gym: 5,
  healthy_meal: 3,
  skincare: 2,
  event_social: 0
} as const;

const ACTIVITY_ICONS = {
  cigarette: 'ban-outline',           // Professional icon, no emoji
  gym: 'fitness-outline',
  healthy_meal: 'restaurant-outline',
  skincare: 'water-outline',
  event_social: 'people-outline'
};
```

**Implementation Rules:**
- **Rule**: One-tap logging for each activity type
- **Rule**: Immediate visual feedback showing points earned/lost
- **Rule**: Timestamp all activities automatically
- **Rule**: Allow optional notes for context
- **Rule**: Use professional icons instead of emoji

### ⏳ Automatic 24-Hour Bonus

**Implementation Rules:**
- **Rule**: Award +10 points for every complete 24-hour smoke-free period
- **Rule**: Check and award bonus via Cloud Function (scheduled)
- **Rule**: Reset bonus calculation if cigarette is logged
- **Rule**: Show celebration animation when bonus is awarded

**Technical Implementation:**
```typescript
// Cloud Function - runs every hour
export const checkStreakBonus = functions.pubsub
  .schedule('every 1 hours')
  .onRun(async (context) => {
    const users = await firestore.collection('users')
      .where('onboardingCompleted', '==', true)
      .get();
    
    for (const userDoc of users.docs) {
      const userData = userDoc.data();
      const streakHours = calculateStreakHours(userData.streakStartTime);
      const completedDays = Math.floor(streakHours / 24);
      
      // Award bonus for each completed day not yet rewarded
      if (completedDays > userData.lastBonusDay || 0) {
        const bonusPoints = (completedDays - (userData.lastBonusDay || 0)) * 10;
        
        await userDoc.ref.update({
          auraScore: admin.firestore.FieldValue.increment(bonusPoints),
          lastBonusDay: completedDays
        });
        
        // Log bonus activity
        await firestore.collection('activities').add({
          userId: userDoc.id,
          type: 'streak_bonus',
          points: bonusPoints,
          timestamp: admin.firestore.FieldValue.serverTimestamp(),
          notes: `${completedDays} day streak bonus`
        });
      }
    }
  });
```

---

## 🔔 Smart Notification System

**Implementation Rules:**
- **Rule**: Use Firebase Cloud Messaging (FCM) for reliable delivery
- **Rule**: Two notification types with different schedules
- **Rule**: Respect user's quiet hours and preferences
- **Rule**: Include user's current streak in notification when possible

### Notification Schedule:
- **Hourly (8:00, 9:00, 10:00, etc.)**: Default message "abc"
- **Half-hourly (8:30, 9:30, 10:30, etc.)**: Default message "xyz"

**Technical Implementation:**
```typescript
// Cloud Function - scheduled notifications
export const sendHourlyNotifications = functions.pubsub
  .schedule('every 1 hours from 08:00 to 22:00')
  .onRun(async (context) => {
    await sendNotificationsToActiveUsers('hourly', 'abc');
  });

export const sendHalfHourlyNotifications = functions.pubsub
  .schedule('30 8-22 * * *') // Every 30 minutes past the hour
  .onRun(async (context) => {
    await sendNotificationsToActiveUsers('half_hourly', 'xyz');
  });

const sendNotificationsToActiveUsers = async (type: string, defaultMessage: string) => {
  const users = await firestore.collection('users')
    .where('notificationPreferences.${type}Enabled', '==', true)
    .get();
    
  for (const userDoc of users.docs) {
    const userData = userDoc.data();
    const customMessage = userData.notificationPreferences?.customMessages?.[type] || defaultMessage;
    const streakHours = calculateStreakHours(userData.streakStartTime);
    
    const message = {
      notification: {
        title: type === 'hourly' ? 'Stay Strong! 💪' : 'You\'re Amazing! 🌟',
        body: customMessage
      },
      data: {
        type,
        streakHours: streakHours.toString()
      },
      token: userData.fcmToken
    };
    
    await admin.messaging().send(message);
  }
};
```

---

## 🧠 AI Coaching & Personal Insights (AuraAI)

### 🧑‍🏫 AuraAI Chat Coach

**Implementation Rules:**
- **Rule**: Use OpenAI GPT-4 API with user context
- **Rule**: Provide supportive, non-judgmental responses
- **Rule**: Include user's smoking history and current progress in context
- **Rule**: Never provide medical advice
- **Rule**: Implement rate limiting to prevent API abuse

**Technical Implementation:**
```typescript
interface AIContext {
  userProfile: {
    smokingHistory: SmokingProfile;
    currentStreak: number;
    auraScore: number;
    motivations: string[];
  };
  recentActivities: Activity[];
  conversationHistory: ChatMessage[];
}

const generateAIResponse = async (userId: string, message: string): Promise<string> => {
  const context = await prepareAIContext(userId);
  
  const systemPrompt = `You are AuraAI, a supportive quit-smoking coach for the AuraShift app.
  
  User Context:
  - Smoking History: ${context.userProfile.smokingHistory.yearsSmoked} years, ${context.userProfile.smokingHistory.cigarettesPerDay} cigarettes/day
  - Current Streak: ${context.userProfile.currentStreak} hours smoke-free
  - Aura Score: ${context.userProfile.auraScore}
  - Recent Activities: ${context.recentActivities.map(a => a.type).join(', ')}
  
  Guidelines:
  - Be supportive, encouraging, and non-judgmental
  - Provide actionable, specific advice
  - Reference the user's specific progress
  - Never provide medical advice
  - Focus on motivation and coping strategies`;
  
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: message }
    ],
    max_tokens: 300,
    temperature: 0.7
  });
  
  return response.choices[0].message.content;
};
```

### ✨ Personalized Daily Feedback

**Implementation Rules:**
- **Rule**: Send daily summary at user's preferred time (default 9 PM)
- **Rule**: Analyze day's activities and provide contextual feedback
- **Rule**: Use positive framing even for difficult days
- **Rule**: Include specific achievements and next steps

**Examples:**
- Positive: "You earned 13 points today! 1 day smoke-free. Your body thanks you!"
- Supportive: "Relapses happen. You smoked today, but tomorrow is a clean slate. Let's aim for progress, not perfection."

### 📈 Projection Engine

**Implementation Rules:**
- **Rule**: Use user's historical data to generate realistic projections
- **Rule**: Show multiple scenarios (current pace, improved pace, setback recovery)
- **Rule**: Include financial savings, health milestones, and score projections
- **Rule**: Update projections weekly based on actual progress

---

## 📊 Analytics & Graphs (Progress Tab)

### 🎯 Key Visualizations

**Implementation Rules:**
- **Rule**: Use Victory Native for all charts
- **Rule**: Support multiple time periods (daily, weekly, monthly, yearly)
- **Rule**: Interactive charts with touch gestures
- **Rule**: Export functionality for sharing progress

**Chart Types:**
1. **Aura Score Over Time** - Line chart showing score progression
2. **Daily Point Chart** - Bar chart showing daily point gains/losses
3. **Cigarettes Avoided** - Counter with visual representation
4. **Money Saved** - Financial tracker with projections
5. **Activity Breakdown** - Pie chart of activity types
6. **Mood Correlation** - Scatter plot of mood vs activities

**Technical Implementation:**
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
    metric: string;
  };
}

const generateAuraScoreChart = (activities: Activity[], period: string): ChartData => {
  // Process activities into chart data
  const groupedData = groupActivitiesByPeriod(activities, period);
  
  return {
    labels: groupedData.map(d => d.label),
    datasets: [{
      data: groupedData.map(d => d.cumulativeScore),
      color: '#6366F1',
      strokeWidth: 3
    }],
    metadata: {
      period: period as any,
      metric: 'aura_score'
    }
  };
};
```

### 💰 Financial Tracker

**Implementation Rules:**
- **Rule**: Calculate savings based on user's cigarette cost data
- **Rule**: Show daily, weekly, monthly, and total savings
- **Rule**: Include projections for future savings
- **Rule**: Visual representation of savings milestones

**Technical Implementation:**
```typescript
const calculateSavings = (user: UserProfile, activities: Activity[]): FinancialData => {
  const dailyCost = (user.smokingHistory.cigarettesPerDay / 20) * user.smokingHistory.costPerPack;
  const cigarettesAvoided = calculateCigarettesAvoided(user.streakStartTime, activities);
  const totalSaved = (cigarettesAvoided / 20) * user.smokingHistory.costPerPack;
  
  return {
    dailyCost,
    cigarettesAvoided,
    totalSaved,
    projectedMonthlySavings: dailyCost * 30,
    projectedYearlySavings: dailyCost * 365
  };
};
```

---

## 🎮 Gamification Layer

### 🧬 Aura Score System

**Implementation Rules:**
- **Rule**: Real-time score updates with visual feedback
- **Rule**: Score displayed prominently on home screen
- **Rule**: Animated score changes with haptic feedback
- **Rule**: Score history tracking for analytics

### 🏆 Achievements & Badges

**Achievement Categories:**
1. **Streak Achievements**: 24 hours, 48 hours, 1 week, 1 month, etc.
2. **Activity Achievements**: Gym streaks, healthy eating, skincare consistency
3. **Financial Achievements**: Money saved milestones
4. **Health Achievements**: Based on scientific recovery timeline

**Technical Implementation:**
```typescript
interface Achievement {
  id: string;
  title: string;
  description: string;
  category: 'streak' | 'activity' | 'financial' | 'health';
  criteria: {
    type: string;
    value: number;
    timeframe?: string;
  };
  points: number;
  badge: string;
  unlockedAt?: Date;
}

const checkAchievements = async (userId: string, activity: Activity) => {
  const userProgress = await getUserProgress(userId);
  const achievements = await getAvailableAchievements();
  
  for (const achievement of achievements) {
    if (meetsAchievementCriteria(userProgress, achievement)) {
      await unlockAchievement(userId, achievement.id);
      await showAchievementCelebration(achievement);
    }
  }
};
```

### 📈 Levels & Progression

**Implementation Rules:**
- **Rule**: Every 100 points = 1 level up
- **Rule**: Level progression unlocks new features/themes
- **Rule**: Visual level indicator with progress bar
- **Rule**: Celebration animation on level up

---

## 🧘 Wellness Expansion Features

### 🥤 Hydration Tracker

**Implementation Rules:**
- **Rule**: Simple one-tap water logging (250ml increments)
- **Rule**: Daily goal of 8 glasses (2000ml)
- **Rule**: Visual progress indicator
- **Rule**: Optional reminder notifications

### 📊 Calorie & Macro Logger

**Implementation Rules:**
- **Rule**: Integration with food database API (e.g., Nutritionix)
- **Rule**: Barcode scanning capability
- **Rule**: Quick-add for common foods
- **Rule**: Daily calorie goal based on user profile

### 😌 Mood Journal

**Implementation Rules:**
- **Rule**: Daily mood rating (1-5 scale with descriptive labels)
- **Rule**: Optional mood notes
- **Rule**: Correlation analysis with activities
- **Rule**: Mood trends in analytics section

---

## 👥 Community & Support Features

### 🤝 Support Circle

**Implementation Rules:**
- **Rule**: Invite trusted contacts as support buddies
- **Rule**: Emergency "Craving SOS" button
- **Rule**: Automatic notification to support buddy with user's location and status
- **Rule**: Privacy controls for shared information

### 🌍 Anonymous Community Feed

**Implementation Rules:**
- **Rule**: Anonymous posting with generated usernames
- **Rule**: Content moderation for inappropriate content
- **Rule**: Upvote/downvote system for helpful content
- **Rule**: Categories: Victories, Struggles, Tips, Questions

---

## 🛣️ Complete User Journey Flow

### Day 1: The Beginning
1. Downloads AuraShift from app store
2. Completes onboarding (name, email, password)
3. Inputs smoking history (5 years, 10 cigarettes/day)
4. Sees timer: 00:00:00 - feels weight of beginning
5. Receives first notification at 8:00 AM: "abc"
6. Logs first gym visit - earns +5 points
7. Aura Score: 5 points, Level 1

### Week 1: Building Habits
8. Daily notifications keep app top-of-mind
9. Logs various activities throughout week
10. Has one relapse on day 4 - timer resets, -10 points
11. AuraAI provides supportive message: "Relapses happen. Your 3-day streak showed your strength."
12. Continues logging activities, rebuilds streak
13. Week 1 summary: 5 cigarettes vs usual 70, +25 Aura points

### Month 1: Seeing Progress
14. Reaches 1-week smoke-free milestone - achievement unlocked
15. Financial tracker shows $50 saved
16. AI projection: "At this pace, you'll save $600 this year"
17. Takes first skin progress photo
18. Joins anonymous community, shares 1-week victory
19. Receives encouragement from other users

### Month 3: Transformation
20. Consistent 30+ day streaks
21. Aura Score reaches 300+ (Level 3)
22. Skin comparison shows visible improvement
23. AI insights: "Your lung capacity is improving significantly"
24. Becomes support buddy for new user
25. Shares success story in community

### Month 6: New Lifestyle
26. Smoking becomes rare exception, not habit
27. Focus shifts to overall wellness tracking
28. Uses calorie tracking and mood journal regularly
29. Mentors other users in community
30. Celebrates 6-month milestone with family

---

## 🔧 Technical Architecture Summary

### Frontend (React Native Expo)
- **Navigation**: React Navigation v6 with tab-based structure
- **State Management**: Redux Toolkit with RTK Query
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **Charts**: Victory Native for data visualization
- **Notifications**: Expo Notifications + Firebase Cloud Messaging

### Backend (Firebase)
- **Authentication**: Firebase Auth (email/password)
- **Database**: Cloud Firestore for user data and activities
- **Functions**: Cloud Functions for scheduled tasks and AI integration
- **Storage**: Firebase Storage for user photos
- **Messaging**: Firebase Cloud Messaging for notifications

### External Integrations
- **AI**: OpenAI GPT-4 API for coaching features
- **Food Data**: Nutritionix API for calorie tracking
- **Analytics**: Firebase Analytics for app usage insights

---

## 🌟 Success Metrics & KPIs

### User Engagement
- Daily Active Users (DAU)
- Session duration and frequency
- Feature adoption rates
- Notification engagement rates

### Health Outcomes
- Average smoke-free streak length
- Percentage of users maintaining 30+ day streaks
- Activity logging consistency
- User-reported health improvements

### App Performance
- User retention rates (1-day, 7-day, 30-day)
- App store ratings and reviews
- Crash rates and performance metrics
- Support ticket volume and resolution time

---

## 🎯 Final Implementation Priorities

### Phase 1: Core MVP (Weeks 1-4)
1. User authentication and onboarding
2. Smoke-free timer with reset functionality
3. Basic activity logging system
4. Aura score calculation and display
5. Simple notification system

### Phase 2: Enhanced Features (Weeks 5-8)
1. Calendar view and activity history
2. Basic analytics and charts
3. Achievement system
4. Improved notifications with customization
5. Profile management

### Phase 3: AI & Advanced Features (Weeks 9-12)
1. AI coaching integration
2. Advanced analytics and projections
3. Community features
4. Wellness tracking expansion
5. Performance optimization

### Phase 4: Polish & Launch (Weeks 13-16)
1. UI/UX refinements
2. Comprehensive testing
3. App store optimization
4. Marketing materials
5. Launch preparation

---

This comprehensive storyline and implementation guide ensures AuraShift delivers on its promise of being more than just a quit-smoking app — it's a complete wellness transformation companion that empowers users through positive reinforcement, scientific accuracy, and supportive community engagement.
