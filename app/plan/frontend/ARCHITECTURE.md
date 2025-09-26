# AuraShift Frontend Architecture Plan

## 1. Project Structure Overview

```
src/
├── components/           # Reusable UI components
│   ├── common/          # Universal components (Button, Card, Input)
│   ├── forms/           # Form-specific components
│   ├── charts/          # Data visualization components
│   └── modals/          # Modal components
├── screens/             # Screen components
│   ├── auth/           # Authentication screens
│   ├── onboarding/     # User setup screens
│   ├── dashboard/      # Main dashboard screens
│   ├── journal/        # Activity logging screens
│   ├── progress/       # Analytics and insights screens
│   ├── achievements/   # Gamification screens
│   └── profile/        # User profile and settings
├── navigation/          # React Navigation setup
├── store/              # Redux Toolkit store configuration
│   ├── slices/         # Redux slices for each feature
│   └── middleware/     # Custom middleware
├── services/           # API calls and external services
├── utils/              # Helper functions and utilities
├── hooks/              # Custom React hooks
├── constants/          # App constants and configurations
├── assets/             # Images, fonts, and static assets
└── styles/             # Global styles and theme
```

## 2. Technology Stack

### Core Framework
- **React Native**: v0.71+
- **Expo**: v49+ (managed workflow)
- **TypeScript**: For type safety and better development experience

### State Management
- **Redux Toolkit (RTK)**: Primary state management
- **RTK Query**: For API state management and caching
- **React Context**: For simple, localized state (theme, user preferences)

### Navigation
- **React Navigation v6**: Tab navigation with stack navigators

### UI/Styling
- **NativeWind**: Tailwind CSS for React Native
- **React Native Reanimated 3**: Smooth animations
- **React Native Gesture Handler**: Enhanced touch interactions
- **Expo Vector Icons**: Consistent iconography

### Charts & Visualization
- **Victory Native**: Data visualization library
- **React Native SVG**: Custom graphics and icons

### Notifications
- **Expo Notifications**: Local and push notifications

## 3. Screen Architecture

### Authentication Flow
```
AuthNavigator:
├── WelcomeScreen          # App introduction and benefits
├── LoginScreen            # Email/password login
├── RegisterScreen         # Account creation
└── ForgotPasswordScreen   # Password recovery
```

### Onboarding Flow
```
OnboardingNavigator:
├── PersonalInfoScreen     # Name, email collection
├── SmokingHistoryScreen   # Smoking habits assessment
├── GoalsSetupScreen       # Personal goals and motivations
├── NotificationSetupScreen # Permission requests
└── WelcomeCompleteScreen  # Onboarding completion
```

### Main Application Flow
```
TabNavigator:
├── HomeStack:
│   ├── DashboardScreen    # Main dashboard with timer
│   ├── QuickLogScreen     # Quick activity logging
│   └── CravingHelpScreen  # Immediate support tools
├── JournalStack:
│   ├── CalendarScreen     # Calendar view
│   ├── DayDetailScreen    # Daily activity details
│   ├── AddActivityScreen  # Activity logging form
│   └── ActivityHistoryScreen # Activity trends
├── ProgressStack:
│   ├── OverviewScreen     # Progress dashboard
│   ├── AnalyticsScreen    # Detailed charts and insights
│   ├── MilestonesScreen   # Health recovery timeline
│   └── SavingsScreen      # Financial benefits
├── AchievementsStack:
│   ├── BadgesScreen       # Earned achievements
│   ├── LeaderboardScreen  # Community rankings (future)
│   └── ChallengesScreen   # Daily/weekly challenges
└── ProfileStack:
    ├── ProfileScreen      # User profile overview
    ├── SettingsScreen     # App preferences
    ├── NotificationSettingsScreen
    ├── DataExportScreen   # Data backup/export
    └── SupportScreen      # Help and feedback
```

## 4. Component Design System

### Design Tokens
```typescript
export const theme = {
  colors: {
    primary: {
      50: '#E6F3FF',
      100: '#B3DAFF',
      500: '#2563EB',
      600: '#1D4ED8',
      900: '#1E3A8A'
    },
    success: {
      50: '#ECFDF5',
      500: '#10B981',
      600: '#059669'
    },
    warning: {
      50: '#FFFBEB',
      500: '#F59E0B',
      600: '#D97706'
    },
    danger: {
      50: '#FEF2F2',
      500: '#EF4444',
      600: '#DC2626'
    },
    neutral: {
      50: '#F9FAFB',
      100: '#F3F4F6',
      200: '#E5E7EB',
      500: '#6B7280',
      900: '#111827'
    }
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    '2xl': 48
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16
  },
  typography: {
    fonts: {
      regular: 'System',
      medium: 'System',
      bold: 'System'
    },
    sizes: {
      xs: 12,
      sm: 14,
      base: 16,
      lg: 18,
      xl: 20,
      '2xl': 24,
      '3xl': 30
    }
  }
}
```

### Core Components
```typescript
// Button Component Variants
<Button variant="primary" size="lg" onPress={handlePress}>
<Button variant="secondary" size="md" loading={isLoading}>
<Button variant="ghost" size="sm" icon="plus">

// Card Component
<Card variant="elevated" padding="lg">
<Card variant="outlined" borderRadius="xl">

// Input Component
<Input label="Email" error={errors.email} />
<Input type="password" placeholder="Password" />

// Timer Component (Custom)
<Timer
  startTime={smokeFreeSince}
  format="DD:HH:MM:SS"
  size="large"
  showLabels={true}
/>

// Score Display
<ScoreDisplay
  score={auraScore}
  change={dailyChange}
  animated={true}
/>

// Activity Badge
<ActivityBadge
  type="gym"
  points={5}
  timestamp={Date.now()}
/>
```

## 5. State Management Architecture

### Redux Store Structure
```typescript
interface RootState {
  auth: AuthState;
  user: UserState;
  timer: TimerState;
  journal: JournalState;
  progress: ProgressState;
  achievements: AchievementsState;
  notifications: NotificationState;
  ui: UIState;
}

// Auth Slice
interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}

// User Slice
interface UserState {
  profile: UserProfile;
  preferences: UserPreferences;
  onboardingComplete: boolean;
}

// Timer Slice
interface TimerState {
  smokeFreeSince: number | null;
  isRunning: boolean;
  totalRelapses: number;
  longestStreak: number;
}

// Journal Slice
interface JournalState {
  activities: Activity[];
  currentDate: string;
  auraScore: number;
  loading: boolean;
}
```

### Data Flow Patterns
1. **Component → Action → Reducer → Component**: Standard Redux flow
2. **RTK Query**: For server state management and caching
3. **Optimistic Updates**: For immediate UI feedback
4. **Background Sync**: For offline capability

## 6. Navigation Strategy

### Navigation Structure
```typescript
// Root Navigator
function RootNavigator() {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const onboardingComplete = useSelector(selectOnboardingComplete);

  if (!isAuthenticated) {
    return <AuthNavigator />;
  }

  if (!onboardingComplete) {
    return <OnboardingNavigator />;
  }

  return <MainTabNavigator />;
}

// Deep Linking Configuration
const linking = {
  prefixes: ['aurashift://'],
  config: {
    screens: {
      Home: 'home',
      Journal: {
        screens: {
          Calendar: 'journal',
          DayDetail: 'journal/:date',
        },
      },
      Progress: 'progress',
      Achievements: 'achievements',
      Profile: 'profile',
    },
  },
};
```

### Navigation Features
- **Tab Badge**: Show notification count on tabs
- **Gesture Navigation**: Smooth transitions between screens
- **Deep Linking**: Support for notifications and sharing
- **Navigation Guards**: Prevent access to protected screens

## 7. Performance Optimization

### React Native Performance
```typescript
// Memoized Components
const TimerDisplay = React.memo(({ startTime }: TimerProps) => {
  // Component implementation
});

// Virtualized Lists
<FlatList
  data={activities}
  renderItem={renderActivityItem}
  getItemLayout={(data, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  })}
  removeClippedSubviews={true}
  maxToRenderPerBatch={10}
  windowSize={10}
/>

// Image Optimization
<Image
  source={{ uri: imageUrl }}
  style={styles.image}
  resizeMode="cover"
  fadeDuration={200}
  placeholder={require('../../assets/placeholder.png')}
/>
```

### State Optimization
- **Selector Memoization**: Use `createSelector` for complex computations
- **Component-level State**: Keep local state for UI-only concerns
- **Debounced Actions**: For search and input handling

## 8. Accessibility Guidelines

### Accessibility Features
```typescript
// Semantic Labels
<TouchableOpacity
  accessibilityLabel="Record smoking relapse"
  accessibilityHint="Resets the smoke-free timer"
  accessibilityRole="button"
>

// Focus Management
const buttonRef = useRef<TouchableOpacity>(null);
useEffect(() => {
  if (isVisible) {
    buttonRef.current?.focus();
  }
}, [isVisible]);

// Screen Reader Support
<Text accessibilityRole="header">
  Days Smoke Free: {dayCount}
</Text>
```

### Accessibility Checklist
- [ ] All interactive elements have accessibility labels
- [ ] Proper focus management for screen readers
- [ ] Sufficient color contrast (WCAG 2.1 AA)
- [ ] Text scaling support (up to 200%)
- [ ] Voice control support
- [ ] Reduced motion preferences

## 9. Animation & Interaction Patterns

### Animation Library
```typescript
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

// Score Counter Animation
const ScoreCounter = ({ score }: { score: number }) => {
  const animatedScore = useSharedValue(0);

  useEffect(() => {
    animatedScore.value = withSpring(score);
  }, [score]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(animatedScore.value > 0 ? 1.1 : 1) }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Text>{score}</Text>
    </Animated.View>
  );
};
```

### Interaction Patterns
- **Haptic Feedback**: For button presses and achievements
- **Pull-to-Refresh**: On data screens
- **Swipe Gestures**: For quick actions
- **Long Press**: For context menus
- **Pinch-to-Zoom**: For charts and graphs

## 10. Testing Strategy

### Testing Pyramid
```typescript
// Unit Tests (Jest + React Native Testing Library)
describe('TimerUtils', () => {
  it('calculates smoke-free duration correctly', () => {
    const startTime = Date.now() - (25 * 60 * 60 * 1000); // 25 hours ago
    const duration = calculateSmokeFreeTime(startTime);
    expect(duration.days).toBe(1);
    expect(duration.hours).toBe(1);
  });
});

// Integration Tests
describe('Activity Logging', () => {
  it('updates aura score when activity is logged', async () => {
    const { getByText, getByTestId } = render(<AddActivityScreen />);

    fireEvent.press(getByText('Gym Workout'));
    fireEvent.press(getByText('Save'));

    await waitFor(() => {
      expect(getByTestId('aura-score')).toHaveTextContent('5');
    });
  });
});

// E2E Tests (Detox)
describe('Smoke-Free Timer', () => {
  it('should reset timer when relapse button is pressed', async () => {
    await element(by.id('relapse-button')).tap();
    await element(by.text('Yes, I smoked')).tap();
    await expect(element(by.id('timer-display'))).toHaveText('00:00:00:00');
  });
});
```

## 11. Development Workflow

### Code Quality
- **ESLint + Prettier**: Code formatting and linting
- **TypeScript**: Type checking
- **Husky**: Pre-commit hooks
- **Conventional Commits**: Commit message standards

### Development Phases
1. **Phase 1**: Core screens and basic functionality
2. **Phase 2**: Data persistence and analytics
3. **Phase 3**: Gamification and achievements
4. **Phase 4**: Advanced features and AI integration

This architecture provides a solid foundation for building a scalable, maintainable, and user-friendly quit-smoking application with room for future enhancements.