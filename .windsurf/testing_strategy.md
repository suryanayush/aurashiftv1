# AuraShift Testing Strategy

## 1. Testing Philosophy

### 1.1 Core Principles
- **User-Centric Testing**: All tests should validate user journeys and real-world scenarios
- **Quality Gates**: No feature ships without comprehensive test coverage
- **Continuous Testing**: Tests run automatically on every commit and deployment
- **Risk-Based Testing**: Critical features (timer, scoring, notifications) get priority
- **Accessibility Testing**: Ensure app works for users with disabilities

### 1.2 Testing Pyramid
```
                    E2E Tests (10%)
                 ┌─────────────────┐
                 │  User Journeys  │
                 │  Critical Flows │
                 └─────────────────┘
              
            Integration Tests (20%)
         ┌─────────────────────────┐
         │   Firebase Services     │
         │   API Integrations      │
         │   Component Integration │
         └─────────────────────────┘
      
        Unit Tests (70%)
   ┌─────────────────────────────────┐
   │     Business Logic              │
   │     Utility Functions           │
   │     Component Logic             │
   │     State Management            │
   └─────────────────────────────────┘
```

## 2. Unit Testing Strategy

### 2.1 Coverage Requirements
- **Critical Features**: 95% coverage (timer, scoring, streak calculation)
- **Core Features**: 85% coverage (activity logging, user management)
- **Supporting Features**: 70% coverage (UI components, utilities)
- **Overall Target**: 80% minimum coverage

### 2.2 Unit Test Categories

#### Business Logic Tests
```typescript
// Timer Calculations
describe('TimerUtils', () => {
  describe('calculateTimeDifference', () => {
    it('should calculate correct days, hours, minutes, seconds', () => {
      const startTime = new Date('2024-01-01T00:00:00Z');
      const currentTime = new Date('2024-01-02T12:30:45Z');
      
      const result = calculateTimeDifference(startTime, currentTime);
      
      expect(result.days).toBe(1);
      expect(result.hours).toBe(12);
      expect(result.minutes).toBe(30);
      expect(result.seconds).toBe(45);
    });
    
    it('should handle timezone differences correctly', () => {
      // Test timezone handling
    });
    
    it('should persist across app restarts', () => {
      // Test timer persistence
    });
  });
});

// Aura Score Calculations
describe('AuraScoreService', () => {
  describe('calculateScore', () => {
    it('should deduct 10 points for cigarette activity', () => {
      const activities = [{ type: 'cigarette', points: -10, timestamp: new Date() }];
      const result = calculateAuraScore(activities);
      expect(result.totalPoints).toBe(-10);
    });
    
    it('should award 10 points for 24-hour streak', () => {
      const streakHours = 24;
      const result = calculateStreakBonus(streakHours);
      expect(result).toBe(10);
    });
    
    it('should calculate level progression correctly', () => {
      const totalScore = 250;
      const level = calculateLevel(totalScore);
      expect(level.level).toBe(3);
      expect(level.progress).toBe(0.5); // 50 points into level 3
    });
  });
});

// Notification Logic
describe('NotificationService', () => {
  describe('shouldSendNotification', () => {
    it('should respect quiet hours', () => {
      const quietHours = { enabled: true, startTime: '22:00', endTime: '08:00' };
      const currentTime = new Date('2024-01-01T23:00:00');
      
      const result = shouldSendNotification(currentTime, quietHours);
      expect(result).toBe(false);
    });
    
    it('should send hourly notifications at correct times', () => {
      const preferences = { hourlyEnabled: true, customMessages: { hourly: 'abc' } };
      const currentTime = new Date('2024-01-01T10:00:00');
      
      const result = getScheduledNotifications(preferences, currentTime);
      expect(result).toContain(expect.objectContaining({ 
        type: 'hourly', 
        message: 'abc' 
      }));
    });
  });
});
```

#### Component Tests
```typescript
// Timer Component
describe('TimerComponent', () => {
  it('should display timer in correct format', () => {
    const startTime = new Date(Date.now() - 90061000); // 1 day, 1 hour, 1 minute, 1 second ago
    
    render(<Timer startTime={startTime} />);
    
    expect(screen.getByText('1d 1h 1m 1s')).toBeInTheDocument();
  });
  
  it('should show reset confirmation dialog', async () => {
    const onReset = jest.fn();
    render(<Timer startTime={new Date()} onReset={onReset} />);
    
    fireEvent.press(screen.getByText('I Smoked'));
    
    expect(screen.getByText(/Are you sure?/)).toBeInTheDocument();
  });
});

// Activity Logging Component
describe('ActivityLogger', () => {
  it('should log gym activity with correct points', async () => {
    const onActivityLogged = jest.fn();
    render(<ActivityLogger onActivityLogged={onActivityLogged} />);
    
    fireEvent.press(screen.getByText('💪 Gym'));
    
    expect(onActivityLogged).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'gym', points: 5 })
    );
  });
});
```

### 2.3 Redux/State Management Tests
```typescript
describe('userSlice', () => {
  it('should update Aura score when activity is logged', () => {
    const initialState = { auraScore: 50 };
    const activity = { type: 'gym', points: 5 };
    
    const newState = userSlice.reducer(initialState, logActivity(activity));
    
    expect(newState.auraScore).toBe(55);
  });
  
  it('should reset streak when cigarette is logged', () => {
    const initialState = { streakStartTime: new Date('2024-01-01') };
    const activity = { type: 'cigarette', points: -10 };
    
    const newState = userSlice.reducer(initialState, logActivity(activity));
    
    expect(newState.streakStartTime).not.toEqual(initialState.streakStartTime);
  });
});
```

## 3. Integration Testing Strategy

### 3.1 Firebase Integration Tests
```typescript
describe('Firebase Services', () => {
  beforeEach(() => {
    // Setup Firebase emulators
    initializeTestApp({
      projectId: 'aurashift-test',
      auth: { uid: 'test-user', email: 'test@example.com' }
    });
  });
  
  describe('UserService', () => {
    it('should create user profile with smoking history', async () => {
      const userData = {
        displayName: 'Test User',
        smokingHistory: { yearsSmoked: 5, cigarettesPerDay: 10 }
      };
      
      await createUserProfile('test-user', userData);
      const profile = await getUserProfile('test-user');
      
      expect(profile.smokingHistory.yearsSmoked).toBe(5);
    });
  });
  
  describe('ActivityService', () => {
    it('should log activity and update Firestore', async () => {
      const activity = { type: 'gym', points: 5, timestamp: new Date() };
      
      await logActivity('test-user', activity);
      const activities = await getUserActivities('test-user');
      
      expect(activities).toHaveLength(1);
      expect(activities[0].type).toBe('gym');
    });
    
    it('should trigger Cloud Function when activity is created', async () => {
      // Test Cloud Function triggers
    });
  });
  
  describe('NotificationService', () => {
    it('should schedule FCM notifications', async () => {
      const preferences = { hourlyEnabled: true, customMessages: { hourly: 'abc' } };
      
      await scheduleNotifications('test-user', preferences);
      
      // Verify notifications are scheduled
    });
  });
});
```

### 3.2 API Integration Tests
```typescript
describe('OpenAI Integration', () => {
  it('should generate AI response with user context', async () => {
    const userContext = {
      smokingHistory: { yearsSmoked: 5 },
      currentStreak: 48, // hours
      auraScore: 75
    };
    
    const response = await generateAIResponse('Help me with cravings', userContext);
    
    expect(response).toContain('48 hour');
    expect(response).toContain('75');
    expect(response.length).toBeGreaterThan(50);
  });
  
  it('should handle API rate limits gracefully', async () => {
    // Test rate limiting scenarios
  });
});
```

### 3.3 Navigation Integration Tests
```typescript
describe('Navigation Flow', () => {
  it('should navigate through onboarding screens', () => {
    const { getByText, queryByText } = render(<OnboardingFlow />);
    
    // Screen 1: Welcome
    expect(getByText('Welcome to AuraShift')).toBeInTheDocument();
    fireEvent.press(getByText('Continue'));
    
    // Screen 2: Registration
    expect(getByText('Create Account')).toBeInTheDocument();
    // ... continue testing flow
  });
  
  it('should redirect unauthenticated users to login', () => {
    // Test authentication guards
  });
});
```

## 4. End-to-End Testing Strategy

### 4.1 Critical User Journeys

#### Complete Onboarding Flow
```typescript
describe('Onboarding E2E', () => {
  it('should complete full onboarding process', async () => {
    await device.launchApp();
    
    // Welcome screen
    await element(by.id('welcome-continue-button')).tap();
    
    // Registration
    await element(by.id('name-input')).typeText('Test User');
    await element(by.id('email-input')).typeText('test@example.com');
    await element(by.id('password-input')).typeText('password123');
    await element(by.id('register-button')).tap();
    
    // Smoking history
    await element(by.id('years-smoked-input')).typeText('5');
    await element(by.id('cigarettes-per-day-input')).typeText('10');
    await element(by.id('continue-button')).tap();
    
    // Motivations
    await element(by.id('motivation-health')).tap();
    await element(by.id('motivation-family')).tap();
    await element(by.id('complete-onboarding-button')).tap();
    
    // Verify main dashboard is shown
    await expect(element(by.id('smoke-free-timer'))).toBeVisible();
    await expect(element(by.id('aura-score-display'))).toBeVisible();
  });
});
```

#### Activity Logging Flow
```typescript
describe('Activity Logging E2E', () => {
  it('should log gym activity and update score', async () => {
    await device.launchApp();
    await authenticateUser();
    
    // Navigate to home screen
    await element(by.id('home-tab')).tap();
    
    // Log gym activity
    await element(by.id('gym-activity-button')).tap();
    await element(by.id('activity-notes-input')).typeText('30 min cardio');
    await element(by.id('log-activity-button')).tap();
    
    // Verify score update
    await expect(element(by.text('+5 points'))).toBeVisible();
    
    // Check calendar
    await element(by.id('calendar-tab')).tap();
    await expect(element(by.id('gym-indicator'))).toBeVisible();
  });
});
```

#### Timer Reset Flow
```typescript
describe('Timer Reset E2E', () => {
  it('should reset timer when "I Smoked" is pressed', async () => {
    await device.launchApp();
    await authenticateUser();
    
    // Verify timer is running
    await expect(element(by.id('smoke-free-timer'))).toBeVisible();
    
    // Press "I Smoked" button
    await element(by.id('i-smoked-button')).tap();
    
    // Confirm reset
    await expect(element(by.text(/Are you sure?/))).toBeVisible();
    await element(by.id('confirm-reset-button')).tap();
    
    // Verify timer reset and score deduction
    await expect(element(by.text('0d 0h 0m'))).toBeVisible();
    await expect(element(by.text('-10 points'))).toBeVisible();
  });
});
```

### 4.2 Cross-Platform Testing
```typescript
describe('Cross-Platform Compatibility', () => {
  it('should work consistently on iOS and Android', async () => {
    // Test platform-specific behaviors
    if (device.getPlatform() === 'ios') {
      // iOS-specific tests
    } else {
      // Android-specific tests
    }
  });
  
  it('should handle different screen sizes', async () => {
    // Test responsive design
  });
});
```

## 5. Performance Testing

### 5.1 Load Testing
```typescript
describe('Performance Tests', () => {
  it('should handle large activity datasets', async () => {
    // Create 1000+ activities
    const activities = Array.from({ length: 1000 }, (_, i) => ({
      id: `activity-${i}`,
      type: 'gym',
      points: 5,
      timestamp: new Date(Date.now() - i * 86400000) // One per day
    }));
    
    const startTime = performance.now();
    await loadUserActivities(activities);
    const endTime = performance.now();
    
    expect(endTime - startTime).toBeLessThan(2000); // Under 2 seconds
  });
  
  it('should maintain 60fps during animations', async () => {
    // Test animation performance
  });
});
```

### 5.2 Memory Testing
```typescript
describe('Memory Usage', () => {
  it('should not have memory leaks in timer component', async () => {
    // Test for memory leaks
  });
  
  it('should efficiently handle large calendar datasets', async () => {
    // Test memory usage with large datasets
  });
});
```

## 6. Security Testing

### 6.1 Authentication Tests
```typescript
describe('Security Tests', () => {
  it('should prevent unauthorized access to user data', async () => {
    // Test Firestore security rules
    const unauthorizedApp = initializeTestApp({ projectId: 'test' });
    
    await expect(
      unauthorizedApp.firestore().collection('users').doc('test-user').get()
    ).rejects.toThrow('Permission denied');
  });
  
  it('should validate all user inputs', async () => {
    // Test input validation
    const maliciousInput = '<script>alert("xss")</script>';
    
    await expect(
      createUserProfile({ displayName: maliciousInput })
    ).rejects.toThrow('Invalid input');
  });
});
```

### 6.2 Data Privacy Tests
```typescript
describe('Privacy Tests', () => {
  it('should encrypt sensitive data', async () => {
    // Test data encryption
  });
  
  it('should allow data export (GDPR)', async () => {
    const exportedData = await exportUserData('test-user');
    
    expect(exportedData).toHaveProperty('profile');
    expect(exportedData).toHaveProperty('activities');
    expect(exportedData).toHaveProperty('exportDate');
  });
  
  it('should completely delete user data', async () => {
    await deleteUserAccount('test-user');
    
    const userData = await getUserProfile('test-user');
    expect(userData).toBeNull();
  });
});
```

## 7. Accessibility Testing

### 7.1 Screen Reader Tests
```typescript
describe('Accessibility Tests', () => {
  it('should have proper accessibility labels', () => {
    render(<Timer startTime={new Date()} />);
    
    const timerElement = screen.getByLabelText(/smoke-free for/i);
    expect(timerElement).toBeInTheDocument();
  });
  
  it('should support keyboard navigation', async () => {
    render(<ActivityLogger />);
    
    // Test tab navigation
    fireEvent.keyDown(document, { key: 'Tab' });
    expect(screen.getByRole('button', { name: /gym/i })).toHaveFocus();
  });
  
  it('should meet WCAG 2.1 AA standards', async () => {
    // Test color contrast, text size, etc.
  });
});
```

## 8. Notification Testing

### 8.1 FCM Testing
```typescript
describe('Notification Tests', () => {
  it('should send hourly notifications', async () => {
    const mockFCM = jest.fn();
    
    await scheduleHourlyNotifications('test-user', {
      hourlyEnabled: true,
      customMessages: { hourly: 'abc' }
    });
    
    expect(mockFCM).toHaveBeenCalledWith(
      expect.objectContaining({ body: 'abc' })
    );
  });
  
  it('should respect quiet hours', async () => {
    // Test quiet hours functionality
  });
});
```

## 9. Testing Tools and Setup

### 9.1 Testing Stack
- **Unit Tests**: Jest + React Native Testing Library
- **Integration Tests**: Firebase Emulators + Jest
- **E2E Tests**: Detox + Jest
- **Performance Tests**: React Native Performance Monitor
- **Accessibility Tests**: @testing-library/jest-native + axe-core

### 9.2 CI/CD Integration
```yaml
# GitHub Actions workflow
name: Test Suite
on: [push, pull_request]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run Unit Tests
        run: npm run test:unit
      - name: Upload Coverage
        uses: codecov/codecov-action@v1

  integration-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Start Firebase Emulators
        run: npm run firebase:emulators
      - name: Run Integration Tests
        run: npm run test:integration

  e2e-tests:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v2
      - name: Build iOS App
        run: npm run build:ios
      - name: Run E2E Tests
        run: npm run test:e2e:ios
```

### 9.3 Test Data Management
```typescript
// Test data factories
export const createMockUser = (overrides = {}) => ({
  id: 'test-user-id',
  displayName: 'Test User',
  email: 'test@example.com',
  auraScore: 50,
  smokingHistory: {
    yearsSmoked: 5,
    cigarettesPerDay: 10,
    costPerPack: 10,
    motivations: ['health', 'family']
  },
  ...overrides
});

export const createMockActivity = (overrides = {}) => ({
  id: 'test-activity-id',
  userId: 'test-user-id',
  type: 'gym',
  points: 5,
  timestamp: new Date(),
  ...overrides
});
```

## 10. Quality Gates

### 10.1 Pre-Commit Hooks
- Lint checks pass
- Unit tests pass
- Coverage threshold met (80%)
- TypeScript compilation succeeds

### 10.2 Pre-Merge Requirements
- All tests pass (unit, integration, E2E)
- Code review approved
- Performance benchmarks met
- Security scan passes
- Accessibility audit passes

### 10.3 Pre-Release Checklist
- [ ] Full test suite passes
- [ ] Performance tests pass
- [ ] Security audit complete
- [ ] Accessibility compliance verified
- [ ] Cross-platform testing complete
- [ ] User acceptance testing complete

This comprehensive testing strategy ensures AuraShift maintains high quality, security, and user experience standards throughout development and after launch.
