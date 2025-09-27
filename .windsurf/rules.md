# AuraShift Development Rules & Guidelines

## 1. Core Development Principles

### 1.1 Code Quality Standards
- **TypeScript First**: All new code must be written in TypeScript with strict type checking
- **Functional Components**: Use React functional components with hooks exclusively
- **Immutable State**: All state updates must be immutable using Redux Toolkit
- **Error Boundaries**: Implement error boundaries for all major feature components
- **Performance**: Optimize for 60fps animations and smooth user interactions

### 1.2 Architecture Patterns
- **Clean Architecture**: Separate business logic from UI components
- **Repository Pattern**: Abstract data access through service layers
- **Dependency Injection**: Use context providers for service dependencies
- **Single Responsibility**: Each component/function should have one clear purpose
- **SOLID Principles**: Follow SOLID design principles throughout the codebase

## 1.3 User Experience Principles
- **Supportive & Non-Judgmental**: Every interaction should encourage and support the user's journey
- **Positive Reinforcement**: Focus on achievements and progress rather than failures
- **Scientific Accuracy**: All health information must be backed by credible sources
- **Accessibility First**: Design for users with disabilities from day one
- **Privacy Focused**: User data privacy and security is paramount
- **Modern & Professional**: Clean, medical-grade UI with consumer-friendly aesthetics

### 1.4 Supportive, Non-Judgmental Experience
- **Rule**: Never shame users for relapses or setbacks
- **Rule**: Always provide encouragement and actionable next steps
- **Rule**: Use "journey" language instead of "failure" language
- **Guideline**: Use positive reinforcement language throughout the app
- **Example**: "Your new journey starts now" instead of "You failed"
- **Example**: "Every moment smoke-free is a victory" instead of "Don't give up"

### 1.5 Scientific Accuracy
- **Rule**: All health claims must be backed by credible medical sources
- **Rule**: Health milestones must reference peer-reviewed research
- **Guideline**: When in doubt, be conservative with health claims
- **Validation**: Medical accuracy review required for health-related content

## 1.6 Storyline & Narrative Rules

### 1.6.1 User Journey Narrative
- **Rule**: Frame the experience as a personal transformation journey, not a restriction
- **Rule**: Use empowering language that positions the user as the hero of their story
- **Rule**: Celebrate small wins as meaningful milestones in their larger story
- **Example**: "You're writing a new chapter" instead of "You're quitting smoking"
- **Example**: "Your wellness journey" instead of "Your quit attempt"

### 1.6.2 Progress Storytelling
- **Rule**: Present data as chapters in their success story
- **Rule**: Use narrative elements to connect past, present, and future progress
- **Rule**: Frame setbacks as plot twists, not endings
- **Guideline**: "Your story so far..." sections in progress views
- **Example**: "In your first week, you've already..." instead of just showing numbers

### 1.6.3 Motivational Messaging
- **Rule**: Messages should feel personal and contextual to user's journey stage
- **Rule**: Use future-focused language that builds anticipation
- **Rule**: Reference user's specific motivations from onboarding
- **Example**: "Your family will see the difference in 2 weeks" (if family was selected as motivation)
- **Example**: "Your skin is already starting to heal" (if appearance was a motivation)

### 1.6.4 Achievement Storytelling
- **Rule**: Frame achievements as story milestones, not just numbers
- **Rule**: Connect achievements to user's personal motivations
- **Rule**: Use celebratory language that acknowledges the difficulty of the journey
- **Example**: "24 hours - Your first chapter is complete!" instead of "24 hour achievement unlocked"
- **Example**: "You've saved $30 - That's a step closer to [user's financial goal]"

### 1.6.5 Contextual Encouragement Rules
- **Rule**: Tailor encouragement based on time of day and user patterns
- **Rule**: Reference user's progress in encouraging messages
- **Rule**: Provide specific, actionable next steps
- **Example**: Morning: "Good morning! You're starting day 8 of your journey strong"
- **Example**: Evening: "Another smoke-free day complete - you're building something amazing"

### 1.6.6 Relapse Recovery Narrative
- **Rule**: Frame relapses as temporary detours, not journey endings
- **Rule**: Immediately redirect focus to the next positive step
- **Rule**: Acknowledge the difficulty without dwelling on the setback
- **Rule**: Reference user's previous progress as proof of capability
- **Example**: "Your journey continues. You've proven you can do this - let's start your next chapter"
- **Example**: "Every expert was once a beginner. Your [previous streak] days showed your strength"

## 2. AuraShift Specific Rules

### 2.1 Aura Score System Rules
- **Rule**: Cigarette logging always deducts exactly 10 points
- **Rule**: 24-hour smoke-free streak automatically awards 10 points
- **Rule**: Activity points must be consistent: Gym (+5), Healthy Meal (+3), Skincare (+2), Event/Social (0)
- **Rule**: Score calculations must be real-time and persistent across sessions
- **Validation**: All score changes must be logged for audit purposes

### 2.2 Timer Functionality Rules
- **Rule**: Smoke-free timer must be accurate to the second
- **Rule**: Timer must persist across app restarts and device reboots
- **Rule**: "I Smoked" button must require confirmation before resetting
- **Rule**: Timer reset must automatically log cigarette activity and deduct points
- **Guideline**: Timer should show multiple formats (Days:Hours:Minutes:Seconds)

### 2.3 Notification System Rules
- **Rule**: Hourly notifications (8:00, 9:00, etc.) send message "abc"
- **Rule**: Half-hourly notifications (8:30, 9:30, etc.) send message "xyz"
- **Rule**: Notifications must respect user's quiet hours and preferences
- **Rule**: All notifications must be contextual and personalized when possible
- **Guideline**: Use Firebase Cloud Messaging for reliable delivery

### 2.4 Calendar & Activity Logging Rules
- **Rule**: Users can log multiple activities per day
- **Rule**: Activities must be categorized: Cigarette, Gym, Healthy Meal, Skincare, Event/Social
- **Rule**: Each activity must have timestamp, points impact, and optional notes
- **Rule**: Calendar must show visual indicators for different activity types
- **Guideline**: Allow editing/deletion of activities within 24 hours

## 3. Technical Standards & Rules

### 3.1 Code Quality Standards

#### TypeScript Usage
```typescript
// ✅ REQUIRED: All new code must be TypeScript
interface UserProfile {
  id: string;
  displayName: string;
  email: string;
  smokingHistory: SmokingProfile;
  auraScore: number;
  streakStartTime: Date;
  lastSmoked?: Date;
}

interface SmokingProfile {
  yearsSmoked: number;
  cigarettesPerDay: number;
  costPerPack: number;
  motivations: string[];
}

// ❌ FORBIDDEN: No 'any' types except in very specific cases
const badExample: any = someFunction();

// ✅ GOOD: Proper typing
const goodExample: UserProfile = getUserProfile();
```

#### Component Structure Rules
```typescript
// ✅ REQUIRED: All components must follow this structure
interface ComponentProps {
  // Props interface required
}

export const ComponentName: React.FC<ComponentProps> = ({ prop1, prop2 }) => {
  // Component logic here
  return (
    // JSX here
  );
};

// ✅ REQUIRED: Export component and props interface
export type { ComponentProps };
```

### 3.2 Firebase Integration Rules

#### Authentication Rules
```typescript
// ✅ REQUIRED: Always verify authentication
if (!auth.currentUser) {
  throw new Error('User must be authenticated');
}

// ✅ REQUIRED: Store user metadata during onboarding
const userMetadata = {
  smokingHistory: {
    yearsSmoked: formData.yearsSmoked,
    cigarettesPerDay: formData.cigarettesPerDay,
    costPerPack: formData.costPerPack || 10, // Default value
  },
  onboardingCompleted: true,
  streakStartTime: new Date(),
  auraScore: 0,
};

await firestore.collection('users').doc(auth.currentUser.uid).set(userMetadata);
```

#### Firestore Data Structure Rules
```typescript
// ✅ REQUIRED: User document structure
interface UserDocument {
  displayName: string;
  email: string;
  smokingHistory: SmokingProfile;
  auraScore: number;
  streakStartTime: Timestamp;
  lastSmoked?: Timestamp;
  onboardingCompleted: boolean;
  notificationPreferences: NotificationSettings;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ✅ REQUIRED: Activity document structure
interface ActivityDocument {
  userId: string;
  type: 'cigarette' | 'gym' | 'healthy_meal' | 'skincare' | 'event_social';
  points: number;
  timestamp: Timestamp;
  notes?: string;
  location?: string;
  mood?: string;
}
```

#### Notification Rules
```typescript
// ✅ REQUIRED: Notification scheduling
const scheduleHourlyNotifications = async (userId: string) => {
  const notifications = [];
  
  // Hourly notifications (00 minutes)
  for (let hour = 8; hour <= 22; hour++) {
    notifications.push({
      userId,
      title: "Stay Strong! 💪",
      body: "abc", // User can customize this
      scheduledTime: { hour, minute: 0 },
      type: 'hourly'
    });
  }
  
  // Half-hourly notifications (30 minutes)
  for (let hour = 8; hour <= 22; hour++) {
    notifications.push({
      userId,
      title: "You're Doing Great! 🌟",
      body: "xyz", // User can customize this
      scheduledTime: { hour, minute: 30 },
      type: 'half_hourly'
    });
  }
  
  await scheduleNotifications(notifications);
};
```

### 3.3 Performance Rules

#### Bundle Size Management
- **Rule**: Main bundle must be < 15MB after optimization (increased for AI features)
- **Rule**: Lazy load non-critical features (AI chat, advanced analytics)
- **Guideline**: Use dynamic imports for heavy libraries
- **Validation**: Bundle analyzer report required for each release

#### Database Query Rules
```typescript
// ✅ REQUIRED: Limit query results and use proper indexes
const getRecentActivities = async (userId: string) => {
  return await firestore
    .collection('activities')
    .where('userId', '==', userId)
    .orderBy('timestamp', 'desc')
    .limit(50)
    .get();
};

// ✅ REQUIRED: Use composite indexes for complex queries
const getActivitiesByDateRange = async (userId: string, startDate: Date, endDate: Date) => {
  return await firestore
    .collection('activities')
    .where('userId', '==', userId)
    .where('timestamp', '>=', startDate)
    .where('timestamp', '<=', endDate)
    .orderBy('timestamp', 'desc')
    .get();
};
```

## 4. UI Design & Visual Rules

### 4.1 Modern Professional UI Standards
- **Rule**: NO EMOJI in user interface - use professional vector icons only
- **Rule**: Use consistent icon library (Ionicons) with outline style and 2px stroke width
- **Rule**: Follow the AuraShift UI Design System (see `.windsurf/ui_design_system.md`)
- **Rule**: Maintain visual hierarchy: Timer (primary), Progress (secondary), Navigation (tertiary)
- **Validation**: All UI components must pass accessibility audit (WCAG 2.1 AA)

### 4.2 Icon Usage Rules
```typescript
// ✅ CORRECT: Professional icon usage
<Icon name="fitness-outline" size={24} color={colors.success[500]} />

// ❌ FORBIDDEN: Using emoji in UI
<Text>💪 Gym</Text>

// ✅ CORRECT: Activity type icons
const activityIcons = {
  cigarette: 'ban-outline',           // Crossed out cigarette
  gym: 'fitness-outline',             // Dumbbell
  healthy_meal: 'restaurant-outline', // Fork and knife
  skincare: 'water-outline',          // Water drop
  event_social: 'people-outline',     // Group of people
};
```

### 4.3 Color System Rules
- **Rule**: Use defined color palette from UI Design System
- **Rule**: Maintain 4.5:1 contrast ratio for text
- **Rule**: Activity-specific colors must be consistent across all screens
- **Rule**: Support both light and dark mode
- **Guideline**: Use semantic colors (success for positive actions, warning for cravings)

### 4.4 Typography Rules
- **Rule**: Use SF Pro Display (iOS) / Roboto (Android) for all text
- **Rule**: Timer display must use monospace font for consistency
- **Rule**: Maintain consistent font sizes and weights across components
- **Rule**: Support dynamic type for accessibility

### 4.5 Layout & Spacing Rules
- **Rule**: Use 8px grid system for consistent spacing
- **Rule**: Minimum touch target size: 44x44 points
- **Rule**: Cards must use consistent border radius (16px for secondary, 24px for primary)
- **Rule**: Maintain consistent padding and margins across similar components

### 4.6 Screen-Specific UI Rules (Based on Implementation)

#### 4.6.1 Home Screen Rules
- **Rule**: Display personalized greeting with user avatar and name: "Hi, [Name]!"
- **Rule**: User profile icon in top-right corner using TouchableOpacity with User icon from Lucide React Native
- **Rule**: Timer must be the hero element with large, readable format (Days:Hours:Minutes:Seconds)
- **Rule**: "I Smoked" button positioned directly below timer with reset icon (RotateCcw) and red background
- **Rule**: Show encouraging message below timer: "You're doing a really great job! Keep doing it."
- **Rule**: Progress cards must show icons, numbers, and descriptive labels with INR currency (₹)
- **Rule**: Multi-series bar chart with 4 data series: Aura Score (purple), Cigarettes Avoided (green), Cigarettes Consumed (red), Money Saved (orange)
- **Rule**: Chart timeframes: 4 Days, 30 Days, 90 Days with interactive filter toggles
- **Rule**: "Other Progresses" section with grid layout for key metrics
- **Rule**: Daily Activities section with light red header background and horizontal card layout

#### 4.6.2 Statistics Screen Rules
- **Rule**: Use date range selector at top: "This week [date range]"
- **Rule**: Large metric displays with icons and contextual messages
- **Rule**: "Cigarettes avoided" with encouraging message: "This is your best continuous streak. Well done!"
- **Rule**: "Triggers and cravings" tracking with specific counts and context
- **Rule**: Maintain card-based layout with consistent spacing

#### 4.6.3 Profile Screen Rules
- **Rule**: Large circular profile photo with edit indicator
- **Rule**: User name and location display
- **Rule**: Two-button layout: "Edit" (dark) and "Log Out" (light purple)
- **Rule**: Achievements section with visual badges/icons
- **Rule**: Achievement descriptions with specific metrics: "24 hours", "Total 15"

### 4.7 Navigation Rules
- **Rule**: Bottom tab navigation with 5 tabs maximum
- **Rule**: Use outline icons for inactive tabs, filled for active
- **Rule**: Tab icons: Home, Calendar, Statistics, Notifications, Profile
- **Rule**: Active tab indicator with purple accent color
- **Rule**: Maintain consistent tab bar height and styling

## 5. User Experience Rules

### 5.1 Onboarding Flow Rules
- **Rule**: Onboarding must collect: Name, Email, Password, Years Smoked, Cigarettes per Day
- **Rule**: Onboarding data must be stored in user's metadata in Firestore
- **Rule**: Users cannot access main app without completing onboarding
- **Rule**: Onboarding must be resumable if interrupted
- **Rule**: Use professional greeting with user's name and avatar (like mockup)
- **Guideline**: Use progressive disclosure to avoid overwhelming users

### 4.2 Timer Display Rules
```typescript
// ✅ REQUIRED: Timer display format
const formatTimer = (milliseconds: number) => {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  return {
    days: days,
    hours: hours % 24,
    minutes: minutes % 60,
    seconds: seconds % 60,
    formatted: `${days}d ${hours % 24}h ${minutes % 60}m ${seconds % 60}s`
  };
};
```

### 4.3 Activity Logging UX Rules
- **Rule**: Activity logging must be quick (< 3 taps)
- **Rule**: Provide visual feedback for all logged activities
- **Rule**: Show immediate point impact when logging activities
- **Rule**: Allow bulk activity logging for convenience
- **Guideline**: Use haptic feedback for important actions

## 5. AI Integration Rules

### 5.1 ChatGPT Integration Rules
- **Rule**: AI must have access to user's onboarding data and current progress
- **Rule**: AI responses must be contextual to user's quit-smoking journey
- **Rule**: AI must provide constructive, supportive feedback only
- **Rule**: Implement rate limiting to prevent API abuse
- **Guideline**: Use conversation memory to maintain context

```typescript
// ✅ REQUIRED: AI context preparation
const prepareAIContext = (user: UserProfile, recentActivities: Activity[]) => {
  return {
    userProfile: {
      smokingHistory: user.smokingHistory,
      currentStreak: calculateStreak(user.streakStartTime),
      auraScore: user.auraScore,
    },
    recentProgress: {
      activitiesLast7Days: recentActivities.slice(0, 7),
      lastRelapse: findLastCigarette(recentActivities),
      positiveActivities: recentActivities.filter(a => a.points > 0),
    },
    context: "User is on a quit-smoking journey. Provide supportive, non-judgmental guidance."
  };
};
```

### 5.2 AI Response Guidelines
- **Rule**: Never provide medical advice
- **Rule**: Always encourage and support, never criticize
- **Rule**: Provide actionable suggestions based on user data
- **Rule**: Reference user's specific progress and achievements
- **Guideline**: Use motivational language aligned with user's goals

## 6. Data & Analytics Rules

### 6.1 Progress Tracking Rules
- **Rule**: Track all user interactions for analytics (anonymized)
- **Rule**: Generate daily, weekly, and monthly progress reports
- **Rule**: Calculate financial savings based on cigarettes avoided using INR currency (₹)
- **Rule**: Track health milestones based on scientific research
- **Rule**: All financial displays must use Indian Rupee symbol (₹) instead of USD ($)
- **Guideline**: Provide predictive insights based on user patterns

### 6.2 Graph and Visualization Rules
```typescript
// ✅ REQUIRED: Multi-series chart data structure
interface MultiSeriesData {
  labels: string[];
  series: {
    aura_score: number[];
    cigarettes_avoided: number[];
    cigarettes_consumed: number[];
    money_saved: number[];
  };
}

// ✅ REQUIRED: Chart color scheme
export const TREND_COLORS = {
  aura_score: () => '#8b7ed8', // Purple
  cigarettes_avoided: () => '#22c55e', // Bright Green
  cigarettes_consumed: () => '#dc2626', // Bright Red
  money_saved: () => '#f59e0b', // Bright Orange
} as const;

// ✅ REQUIRED: Chart timeframes
export type TimeRange = '4d' | '30d' | '90d';
export type FilterType = 'aura_score' | 'cigarettes_avoided' | 'cigarettes_consumed' | 'money_saved';
```

#### 6.2.1 Multi-Series Bar Chart Rules
- **Rule**: Display maximum 4 data series simultaneously
- **Rule**: Individual series scaling for optimal visibility of all data types
- **Rule**: Interactive filter toggles with minimum 1 filter active
- **Rule**: Value labels above bars for small values (< 20px height)
- **Rule**: Consistent bar spacing using gap property instead of margins
- **Rule**: React Native compatible shadows using style prop, not CSS classes

## 7. Security & Privacy Rules

### 7.1 Data Protection Rules
- **Rule**: All sensitive data must be encrypted at rest and in transit
- **Rule**: Implement proper Firestore security rules
- **Rule**: Never store API keys in client-side code
- **Rule**: Implement proper session management
- **Validation**: Security audit required before production deployment

### 7.2 GDPR Compliance Rules
```typescript
// ✅ REQUIRED: Data export functionality
const exportUserData = async (userId: string) => {
  const userData = await firestore.collection('users').doc(userId).get();
  const activities = await firestore.collection('activities')
    .where('userId', '==', userId).get();
  
  return {
    profile: userData.data(),
    activities: activities.docs.map(doc => doc.data()),
    exportDate: new Date().toISOString(),
  };
};

// ✅ REQUIRED: Data deletion functionality
const deleteUserData = async (userId: string) => {
  const batch = firestore.batch();
  
  // Delete user profile
  batch.delete(firestore.collection('users').doc(userId));
  
  // Delete all user activities
  const activities = await firestore.collection('activities')
    .where('userId', '==', userId).get();
  
  activities.docs.forEach(doc => {
    batch.delete(doc.ref);
  });
  
  await batch.commit();
};
```

## 8. Testing & Quality Assurance Rules

### 8.1 Test Coverage Requirements
- **Rule**: Minimum 85% test coverage for critical paths (timer, scoring, notifications)
- **Rule**: All new features must include unit tests
- **Rule**: Integration tests required for all Firebase interactions
- **Rule**: E2E tests for complete user journeys

### 8.2 Testing Strategy Rules
```typescript
// ✅ REQUIRED: Test structure for core features
describe('AuraScoreService', () => {
  describe('calculateScore', () => {
    it('should deduct 10 points for cigarette activity', () => {
      const activity: Activity = { type: 'cigarette', timestamp: new Date() };
      const result = calculateAuraScore([activity], 0);
      expect(result.totalPoints).toBe(-10);
    });
    
    it('should award 10 points for 24-hour streak', () => {
      const streakHours = 24;
      const result = calculateStreakBonus(streakHours);
      expect(result).toBe(10);
    });
  });
});
```

## 9. Deployment & Release Rules

### 9.1 Pre-Release Checklist
- [ ] All automated tests pass
- [ ] Firebase security rules tested
- [ ] Notification system tested on both platforms
- [ ] AI integration tested with rate limits
- [ ] Performance benchmarks meet requirements
- [ ] Privacy policy updated
- [ ] App store metadata reviewed

### 9.2 Firebase Configuration Rules
```typescript
// ✅ REQUIRED: Environment-specific Firebase config
const firebaseConfig = {
  development: {
    // Development Firebase project
  },
  staging: {
    // Staging Firebase project
  },
  production: {
    // Production Firebase project
  }
};
```

## 10. Feature-Specific Rules

### 10.1 Calendar Implementation Rules
- **Rule**: Calendar must show activity indicators for each day
- **Rule**: Support date range selection for bulk operations
- **Rule**: Show Aura score trends on calendar view
- **Rule**: Allow activity editing from calendar interface

### 10.2 Health Milestone Rules
- **Rule**: Display scientifically-backed health improvements
- **Rule**: Milestones must be based on user's quit date
- **Rule**: Include sources for all health claims
- **Guideline**: Celebrate milestones with animations and notifications

### 10.3 Community Features (Future)
- **Rule**: All community interactions must be anonymous by default
- **Rule**: Implement content moderation for user-generated content
- **Rule**: Allow users to opt-out of community features entirely
- **Guideline**: Focus on support and encouragement, not competition

## 11. Content & Messaging Rules

### 11.1 Notification Content Rules
- **Rule**: Hourly notifications must use customizable "abc" default message
- **Rule**: Half-hourly notifications must use customizable "xyz" default message
- **Rule**: All notifications must include user's current streak context when possible
- **Rule**: Notification titles should be encouraging: "Stay Strong! 💪", "You're Amazing! 🌟"
- **Guideline**: Allow users to customize notification messages for personalization

### 11.2 Progress Messaging Rules
- **Rule**: Always lead with positive framing: "Cigarettes avoided: 40!" not "You didn't smoke 40 cigarettes"
- **Rule**: Include encouraging context: "This is your best continuous streak. Well done!"
- **Rule**: Use specific, meaningful numbers: "Total money saved: $30" not just "$30"
- **Rule**: Reference user's journey stage: "This week" vs "In your first month"

### 11.3 Achievement Messaging Rules
- **Rule**: Achievement titles must be empowering: "24 hours", "Total 15"
- **Rule**: Use milestone language that builds on previous achievements
- **Rule**: Include forward-looking encouragement
- **Rule**: Connect achievements to health benefits when scientifically appropriate

### 11.4 Error and Edge Case Messaging
- **Rule**: Network errors: "We'll sync your progress when you're back online"
- **Rule**: Data loading: "Loading your journey..." not just "Loading..."
- **Rule**: Empty states: "Your story starts here" not "No data available"
- **Rule**: Maintenance: "We're making AuraShift even better for you"

## 12. Emergency Procedures

### 12.1 Critical Bug Response
1. Immediately assess impact on user data and safety
2. Implement hotfix if user data is at risk
3. Communicate with users if necessary
4. Document incident and implement preventive measures

### 12.2 Firebase Service Disruption
1. Switch to offline mode gracefully
2. Queue operations for when service returns
3. Notify users of temporary limitations
4. Implement backup strategies for critical features

## 13. Quality Assurance Rules

### 13.1 Pre-Release UI Checklist
- [ ] All emoji replaced with professional icons
- [ ] Color contrast meets WCAG 2.1 AA standards
- [ ] Touch targets meet 44x44 minimum size
- [ ] Typography follows design system
- [ ] Cards use consistent border radius
- [ ] Spacing follows 8px grid system
- [ ] Dark mode support implemented
- [ ] Accessibility labels on all interactive elements

### 13.2 Content Review Checklist
- [ ] All messaging uses positive, supportive language
- [ ] No shame-based or negative reinforcement language
- [ ] Scientific claims have credible sources
- [ ] Achievement descriptions are empowering
- [ ] Error messages are helpful and encouraging
- [ ] Notification content is customizable
- [ ] User journey narrative is consistent

---

These comprehensive rules ensure AuraShift is built with the highest standards of quality, security, user experience, and ethical responsibility while maintaining a modern, professional interface that supports users on their quit-smoking and wellness journey through positive storytelling and visual excellence.
