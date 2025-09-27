# AuraShift Development Workflow

## 1. Development Environment Setup

### Prerequisites
- Node.js 18+ installed
- Expo CLI installed globally: `npm install -g @expo/cli`
- Firebase CLI installed: `npm install -g firebase-tools`
- Git configured with proper credentials
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

### Initial Setup
```bash
# Clone the repository
git clone <repository-url>
cd my-expo-app

# Install dependencies
npm install

# Start development server
npm start

# Run on specific platforms
npm run android  # Android emulator/device
npm run ios      # iOS simulator/device
npm run web      # Web browser
```

### Firebase Setup
```bash
# Login to Firebase
firebase login

# Initialize Firebase project
firebase init

# Deploy Firebase functions (when ready)
firebase deploy --only functions

# Deploy Firestore rules
firebase deploy --only firestore:rules
```

## 2. Project Structure

```
my-expo-app/
├── .windsurf/                    # Project documentation and rules
│   ├── rules.md                 # Development rules and guidelines
│   ├── project_overview.md      # Project overview and specifications
│   ├── implementation_roadmap.md # Development roadmap
│   ├── feature_specifications.md # Detailed feature specs
│   └── development_workflow.md   # This file
├── src/                         # Source code
│   ├── components/              # Reusable UI components
│   │   ├── ui/                 # Basic UI components (Button, Input, etc.)
│   │   ├── timer/              # Timer-related components
│   │   ├── activities/         # Activity logging components
│   │   └── charts/             # Chart and visualization components
│   ├── screens/                # Screen components
│   │   ├── auth/               # Authentication screens
│   │   ├── onboarding/         # Onboarding flow screens
│   │   ├── home/               # Home/dashboard screens
│   │   ├── calendar/           # Calendar and history screens
│   │   ├── progress/           # Progress and analytics screens
│   │   ├── ai-coach/           # AI coaching screens
│   │   └── profile/            # Profile and settings screens
│   ├── services/               # API and service layer
│   │   ├── firebase/           # Firebase configuration and services
│   │   ├── notifications/      # Notification services
│   │   ├── ai/                 # AI/ChatGPT integration
│   │   └── analytics/          # Analytics and tracking
│   ├── store/                  # Redux store configuration
│   │   ├── slices/             # Redux slices
│   │   └── middleware/         # Custom middleware
│   ├── utils/                  # Utility functions
│   │   ├── calculations/       # Score and streak calculations
│   │   ├── validation/         # Form validation schemas
│   │   └── helpers/            # General helper functions
│   ├── types/                  # TypeScript type definitions
│   ├── constants/              # App constants and configuration
│   └── hooks/                  # Custom React hooks
├── assets/                     # Static assets
├── firebase/                   # Firebase configuration
│   ├── functions/              # Cloud Functions
│   ├── firestore.rules        # Firestore security rules
│   └── firebase.json          # Firebase configuration
└── __tests__/                  # Test files
```

## 3. Development Workflow

### Branch Strategy
```
main                    # Production-ready code
├── develop            # Development branch
├── feature/timer      # Feature branches
├── feature/activities # Feature branches
├── bugfix/login-issue # Bug fix branches
└── hotfix/critical    # Critical hotfixes
```

### Commit Message Convention
```
feat: add smoke-free timer component
fix: resolve activity logging bug
docs: update API documentation
style: format code with prettier
refactor: optimize Aura score calculation
test: add unit tests for timer service
chore: update dependencies
```

### Pull Request Process
1. Create feature branch from `develop`
2. Implement feature following coding standards
3. Write/update tests (minimum 80% coverage)
4. Update documentation if needed
5. Create pull request to `develop`
6. Code review by at least one team member
7. Merge after approval and CI passes

## 4. Coding Standards

### TypeScript Standards
```typescript
// ✅ GOOD: Proper interface definition
interface UserProfile {
  id: string;
  displayName: string;
  smokingHistory: SmokingHistory;
  auraScore: number;
}

// ✅ GOOD: Function with proper typing
const calculateAuraScore = (activities: Activity[]): number => {
  return activities.reduce((total, activity) => total + activity.points, 0);
};

// ❌ AVOID: Using 'any' type
const badFunction = (data: any) => {
  return data.someProperty;
};
```

### Component Standards
```typescript
// ✅ GOOD: Functional component with proper typing
interface TimerProps {
  startTime: Date;
  onReset: () => void;
}

export const Timer: React.FC<TimerProps> = ({ startTime, onReset }) => {
  // Component implementation
  return (
    <View>
      {/* JSX content */}
    </View>
  );
};

// Export types for reuse
export type { TimerProps };
```

### Styling Standards
```typescript
// ✅ GOOD: Using NativeWind classes
<View className="flex-1 bg-gradient-to-br from-blue-500 to-purple-600 p-4">
  <Text className="text-white text-2xl font-bold text-center">
    AuraShift
  </Text>
</View>

// ✅ GOOD: Custom styles when needed
const styles = StyleSheet.create({
  customGradient: {
    // Custom styles that can't be achieved with NativeWind
  }
});
```

## 5. Testing Strategy

### Unit Testing
```typescript
// Example: Timer calculation test
describe('TimerUtils', () => {
  describe('calculateTimeDifference', () => {
    it('should calculate correct time difference', () => {
      const startTime = new Date('2024-01-01T00:00:00Z');
      const currentTime = new Date('2024-01-02T12:30:45Z');
      
      const result = calculateTimeDifference(startTime, currentTime);
      
      expect(result.days).toBe(1);
      expect(result.hours).toBe(12);
      expect(result.minutes).toBe(30);
      expect(result.seconds).toBe(45);
    });
  });
});
```

### Integration Testing
```typescript
// Example: Firebase service test
describe('ActivityService', () => {
  beforeEach(() => {
    // Setup test environment
    initializeTestApp();
  });

  it('should log activity and update Aura score', async () => {
    const userId = 'test-user-id';
    const activity = {
      type: 'gym',
      points: 5,
      timestamp: new Date()
    };

    await logActivity(userId, activity);
    const updatedScore = await getAuraScore(userId);

    expect(updatedScore).toBe(5);
  });
});
```

### E2E Testing
```typescript
// Example: Detox E2E test
describe('Onboarding Flow', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  it('should complete onboarding successfully', async () => {
    // Test complete onboarding flow
    await element(by.id('welcome-continue-button')).tap();
    await element(by.id('name-input')).typeText('Test User');
    await element(by.id('email-input')).typeText('test@example.com');
    // ... continue testing flow
  });
});
```

## 6. Firebase Development

### Firestore Rules Development
```javascript
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null 
        && request.auth.uid == userId;
    }
    
    // Activities belong to authenticated users
    match /activities/{activityId} {
      allow read, write: if request.auth != null 
        && request.auth.uid == resource.data.userId;
    }
  }
}
```

### Cloud Functions Development
```typescript
// functions/src/index.ts
import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import { onSchedule } from 'firebase-functions/v2/scheduler';

// Trigger when activity is created
export const onActivityCreated = onDocumentCreated(
  'activities/{activityId}',
  async (event) => {
    const activity = event.data?.data();
    if (!activity) return;

    // Update user's Aura score
    await updateAuraScore(activity.userId, activity.points);
    
    // Check for achievements
    await checkAchievements(activity.userId);
  }
);

// Scheduled function for notifications
export const sendHourlyNotifications = onSchedule(
  'every 1 hours from 08:00 to 22:00',
  async (event) => {
    await sendNotificationsToActiveUsers('hourly');
  }
);
```

## 7. Performance Optimization

### Bundle Size Optimization
```typescript
// Use dynamic imports for heavy features
const AICoachScreen = lazy(() => import('../screens/ai-coach/AICoachScreen'));
const ProgressScreen = lazy(() => import('../screens/progress/ProgressScreen'));

// Optimize images
import optimizedImage from '../assets/images/logo.webp';
```

### Memory Management
```typescript
// Proper cleanup in useEffect
useEffect(() => {
  const subscription = firestore
    .collection('activities')
    .where('userId', '==', userId)
    .onSnapshot(handleActivitiesUpdate);

  return () => subscription(); // Cleanup subscription
}, [userId]);
```

## 8. Deployment Process

### Development Deployment
```bash
# Build development version
expo build:android --type apk
expo build:ios --type simulator

# Deploy Firebase functions
firebase deploy --only functions --project development

# Deploy Firestore rules
firebase deploy --only firestore:rules --project development
```

### Production Deployment
```bash
# Build production version
expo build:android --type app-bundle
expo build:ios --type archive

# Deploy to Firebase production
firebase deploy --project production

# Submit to app stores
expo submit:android
expo submit:ios
```

## 9. Monitoring and Analytics

### Performance Monitoring
```typescript
// Firebase Performance Monitoring
import perf from '@react-native-firebase/perf';

const trace = perf().newTrace('timer_calculation');
await trace.start();

// Perform timer calculation
const result = calculateTimeDifference(startTime, currentTime);

await trace.stop();
```

### Crash Reporting
```typescript
// Firebase Crashlytics
import crashlytics from '@react-native-firebase/crashlytics';

try {
  await logActivity(userId, activity);
} catch (error) {
  crashlytics().recordError(error);
  throw error;
}
```

### Custom Analytics
```typescript
// Firebase Analytics
import analytics from '@react-native-firebase/analytics';

// Track user actions
await analytics().logEvent('activity_logged', {
  activity_type: activity.type,
  points_earned: activity.points,
  user_level: userLevel
});
```

## 10. Security Best Practices

### API Key Management
```typescript
// Use environment variables for sensitive data
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const FIREBASE_CONFIG = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  // ... other config
};
```

### Data Validation
```typescript
// Validate all inputs
import Joi from 'joi';

const activitySchema = Joi.object({
  type: Joi.string().valid('cigarette', 'gym', 'healthy_meal', 'skincare', 'event_social').required(),
  notes: Joi.string().max(500).optional(),
  mood: Joi.string().valid('happy', 'stressed', 'motivated', 'neutral', 'anxious').optional()
});

const { error, value } = activitySchema.validate(activityData);
if (error) {
  throw new ValidationError(error.message);
}
```

This development workflow ensures consistent, high-quality development of the AuraShift application while maintaining security, performance, and user experience standards.
