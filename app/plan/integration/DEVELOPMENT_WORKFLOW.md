# AuraShift Development Workflow & Integration Testing

## 1. Development Environment Setup

### 1.1 Local Development Stack
```
Development Environment:
├── React Native Metro Server     # Frontend development server
├── Expo CLI                     # React Native toolchain
├── Firebase Emulators Suite     # Local backend simulation
│   ├── Auth Emulator           # Authentication testing
│   ├── Firestore Emulator      # Database testing
│   ├── Functions Emulator      # Cloud Functions testing
│   └── Storage Emulator        # File storage testing
├── Android Emulator/iOS Simulator # Mobile testing
├── Flipper                     # React Native debugging
└── VS Code + Extensions        # IDE setup
```

### 1.2 Firebase Emulators Configuration
```json
// firebase.json
{
  "emulators": {
    "auth": {
      "port": 9099,
      "host": "localhost"
    },
    "firestore": {
      "port": 8080,
      "host": "localhost"
    },
    "functions": {
      "port": 5001,
      "host": "localhost"
    },
    "storage": {
      "port": 9199,
      "host": "localhost"
    },
    "ui": {
      "enabled": true,
      "port": 4000
    }
  },
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  },
  "functions": {
    "source": "functions",
    "predeploy": ["npm run build"]
  }
}
```

### 1.3 Development Scripts
```json
// package.json scripts
{
  "scripts": {
    "start": "expo start --dev-client",
    "start:emulators": "firebase emulators:start --import=./emulator-data",
    "dev": "concurrently \"npm run start:emulators\" \"npm run start\"",
    "test": "jest",
    "test:e2e": "detox test",
    "test:integration": "jest --config jest.integration.config.js",
    "lint": "eslint . --ext .js,.jsx,.ts,.tsx",
    "type-check": "tsc --noEmit",
    "build:ios": "eas build --platform ios",
    "build:android": "eas build --platform android",
    "deploy:functions": "firebase deploy --only functions",
    "deploy:rules": "firebase deploy --only firestore:rules",
    "seed:data": "node scripts/seedEmulatorData.js"
  }
}
```

## 2. Integration Testing Strategy

### 2.1 Testing Pyramid

```
                    E2E Tests (Detox)
                   /                 \
              Integration Tests        \
             /                         \
        Unit Tests                     Manual Testing
       /         \                          |
   Frontend     Backend               Exploratory
   (Jest/RTL)   (Jest)                Testing
```

### 2.2 Unit Testing

#### Frontend Unit Tests
```typescript
// __tests__/services/AuthService.test.ts
import { AuthService } from '../src/services/AuthService';
import { auth } from '../src/config/firebase';

jest.mock('../src/config/firebase');

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(() => {
    authService = new AuthService();
    jest.clearAllMocks();
  });

  describe('signUp', () => {
    it('should create user account and profile', async () => {
      const mockUser = {
        uid: 'test-uid',
        email: 'test@example.com',
        displayName: 'Test User'
      };

      (auth.createUserWithEmailAndPassword as jest.Mock)
        .mockResolvedValue({ user: mockUser });

      const result = await authService.signUp(
        'test@example.com',
        'password123',
        'Test User'
      );

      expect(auth.createUserWithEmailAndPassword)
        .toHaveBeenCalledWith('test@example.com', 'password123');

      expect(result.user).toEqual(mockUser);
      expect(result.isNewUser).toBe(true);
    });

    it('should handle authentication errors', async () => {
      const error = new Error('auth/email-already-in-use');
      (auth.createUserWithEmailAndPassword as jest.Mock)
        .mockRejectedValue(error);

      await expect(authService.signUp(
        'test@example.com',
        'password123',
        'Test User'
      )).rejects.toThrow('auth/email-already-in-use');
    });
  });
});

// __tests__/components/TimerDisplay.test.tsx
import React from 'react';
import { render } from '@testing-library/react-native';
import { TimerDisplay } from '../src/components/TimerDisplay';

describe('TimerDisplay', () => {
  it('displays correct time format', () => {
    const startTime = new Date('2023-01-01T00:00:00Z');
    const currentTime = new Date('2023-01-02T03:15:30Z');

    const { getByText } = render(
      <TimerDisplay
        startTime={startTime}
        currentTime={currentTime}
        format="DD:HH:MM:SS"
      />
    );

    expect(getByText('01:03:15:30')).toBeTruthy();
  });

  it('handles zero time correctly', () => {
    const startTime = new Date();
    const currentTime = startTime;

    const { getByText } = render(
      <TimerDisplay
        startTime={startTime}
        currentTime={currentTime}
        format="DD:HH:MM:SS"
      />
    );

    expect(getByText('00:00:00:00')).toBeTruthy();
  });
});
```

#### Backend Unit Tests
```typescript
// functions/__tests__/userProfileFunctions.test.ts
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions-test';
import { createUserProfile } from '../src/userProfileFunctions';

const testEnv = functions();

describe('createUserProfile', () => {
  let db: admin.firestore.Firestore;

  beforeAll(async () => {
    db = admin.firestore();
  });

  beforeEach(async () => {
    // Clean up test data
    const collections = await db.listCollections();
    const deletePromises = collections.map(collection =>
      db.recursiveDelete(collection)
    );
    await Promise.all(deletePromises);
  });

  afterAll(() => {
    testEnv.cleanup();
  });

  it('should create user profile with valid data', async () => {
    const userData = {
      displayName: 'Test User',
      smokingProfile: {
        yearsSmoked: 5,
        cigarettesPerDay: 20,
        costPerPack: 10,
        packSize: 20
      },
      motivations: {
        primary: ['health_improvement', 'financial_savings'],
        personal: ['For my family']
      }
    };

    const context = {
      auth: {
        uid: 'test-uid',
        token: { email: 'test@example.com' }
      }
    };

    const result = await createUserProfile(userData, context);

    expect(result.success).toBe(true);
    expect(result.profile.id).toBe('test-uid');
    expect(result.profile.displayName).toBe('Test User');

    // Verify document was created in Firestore
    const doc = await db.collection('users').doc('test-uid').get();
    expect(doc.exists).toBe(true);
  });

  it('should validate required fields', async () => {
    const invalidData = {
      // Missing displayName
      smokingProfile: {
        yearsSmoked: 5
        // Missing other required fields
      }
    };

    const context = {
      auth: {
        uid: 'test-uid',
        token: { email: 'test@example.com' }
      }
    };

    await expect(createUserProfile(invalidData, context))
      .rejects.toThrow('invalid-argument');
  });
});
```

### 2.3 Integration Testing

#### Firebase Integration Tests
```typescript
// __tests__/integration/firestore.integration.test.ts
import { initializeApp, getApps, deleteApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator, collection, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth, connectAuthEmulator, createUserWithEmailAndPassword } from 'firebase/auth';

describe('Firestore Integration', () => {
  let app: any;
  let db: any;
  let auth: any;

  beforeAll(async () => {
    // Connect to Firebase emulators
    app = initializeApp({
      projectId: 'demo-project',
      apiKey: 'demo-key'
    });

    db = getFirestore(app);
    auth = getAuth(app);

    if (!getApps().find(app => app.name === '[DEFAULT]')) {
      connectFirestoreEmulator(db, 'localhost', 8080);
      connectAuthEmulator(auth, 'http://localhost:9099');
    }
  });

  afterAll(async () => {
    if (app) {
      await deleteApp(app);
    }
  });

  test('should create and retrieve user activity', async () => {
    // Create test user
    const userCred = await createUserWithEmailAndPassword(
      auth,
      'test@example.com',
      'password123'
    );

    const userId = userCred.user.uid;

    // Create activity document
    const activityData = {
      type: 'gym',
      category: 'fitness',
      title: 'Morning Workout',
      totalAuraPoints: 5,
      timestamp: new Date(),
      userId
    };

    const activityRef = doc(collection(db, 'users', userId, 'activities'));
    await setDoc(activityRef, activityData);

    // Retrieve and verify
    const retrievedDoc = await getDoc(activityRef);
    expect(retrievedDoc.exists()).toBe(true);

    const retrievedData = retrievedDoc.data();
    expect(retrievedData.type).toBe('gym');
    expect(retrievedData.totalAuraPoints).toBe(5);
  });

  test('should respect Firestore security rules', async () => {
    // Try to access another user's data (should fail)
    const userCred1 = await createUserWithEmailAndPassword(
      auth,
      'user1@example.com',
      'password123'
    );

    const userCred2 = await createUserWithEmailAndPassword(
      auth,
      'user2@example.com',
      'password123'
    );

    // Create document for user1
    const activityRef = doc(collection(db, 'users', userCred1.user.uid, 'activities'));
    await setDoc(activityRef, {
      type: 'gym',
      userId: userCred1.user.uid
    });

    // Try to read user1's data while authenticated as user2
    // This should fail due to security rules
    try {
      await getDoc(activityRef);
      // If we reach here, security rules are not working
      fail('Should not be able to access another user\'s data');
    } catch (error) {
      expect(error).toMatch(/permission-denied/);
    }
  });
});
```

#### API Integration Tests
```typescript
// __tests__/integration/api.integration.test.ts
import { httpsCallable, getFunctions, connectFunctionsEmulator } from 'firebase/functions';
import { initializeApp } from 'firebase/app';

describe('Cloud Functions Integration', () => {
  let functions: any;

  beforeAll(() => {
    const app = initializeApp({
      projectId: 'demo-project'
    });

    functions = getFunctions(app);
    connectFunctionsEmulator(functions, 'localhost', 5001);
  });

  test('should create user profile via cloud function', async () => {
    const createProfile = httpsCallable(functions, 'createUserProfile');

    const profileData = {
      displayName: 'Integration Test User',
      smokingProfile: {
        yearsSmoked: 3,
        cigarettesPerDay: 15,
        costPerPack: 8,
        packSize: 20
      },
      motivations: {
        primary: ['health_improvement'],
        personal: ['Test motivation']
      },
      dataProcessingConsent: true
    };

    const result = await createProfile(profileData);

    expect(result.data.success).toBe(true);
    expect(result.data.profile.displayName).toBe('Integration Test User');
    expect(result.data.profile.onboarding.smokingProfile.yearsSmoked).toBe(3);
  });

  test('should log activity and update user stats', async () => {
    const logActivity = httpsCallable(functions, 'logActivity');

    const activityData = {
      type: 'gym',
      category: 'fitness',
      title: 'Test Workout',
      totalAuraPoints: 5,
      duration: 60
    };

    const result = await logActivity(activityData);

    expect(result.data.success).toBe(true);
    expect(result.data.activityId).toBeDefined();
  });

  test('should handle validation errors', async () => {
    const createProfile = httpsCallable(functions, 'createUserProfile');

    const invalidData = {
      // Missing required fields
      smokingProfile: {}
    };

    try {
      await createProfile(invalidData);
      fail('Should throw validation error');
    } catch (error: any) {
      expect(error.code).toBe('functions/invalid-argument');
    }
  });
});
```

### 2.4 End-to-End Testing

#### Detox E2E Tests
```typescript
// e2e/onboarding.e2e.ts
import { device, element, by, expect } from 'detox';

describe('Onboarding Flow', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should complete full onboarding flow', async () => {
    // Welcome screen
    await expect(element(by.id('welcome-screen'))).toBeVisible();
    await element(by.id('get-started-button')).tap();

    // Registration screen
    await expect(element(by.id('registration-screen'))).toBeVisible();

    await element(by.id('name-input')).typeText('Test User');
    await element(by.id('email-input')).typeText('test@example.com');
    await element(by.id('password-input')).typeText('password123');
    await element(by.id('confirm-password-input')).typeText('password123');

    await element(by.id('terms-checkbox')).tap();
    await element(by.id('create-account-button')).tap();

    // Smoking history screen
    await expect(element(by.id('smoking-history-screen'))).toBeVisible();

    await element(by.id('years-smoked-5')).tap();
    await element(by.id('cigarettes-input')).typeText('20');
    await element(by.id('continue-button')).tap();

    // Goals screen
    await expect(element(by.id('goals-screen'))).toBeVisible();

    await element(by.id('motivation-health')).tap();
    await element(by.id('motivation-money')).tap();
    await element(by.id('continue-button')).tap();

    // Notifications screen
    await expect(element(by.id('notifications-screen'))).toBeVisible();
    await element(by.id('enable-notifications-button')).tap();

    // Timer initialization
    await expect(element(by.id('timer-init-screen'))).toBeVisible();
    await element(by.id('starting-fresh-option')).tap();
    await element(by.id('start-journey-button')).tap();

    // Should reach dashboard
    await expect(element(by.id('dashboard-screen'))).toBeVisible();
    await expect(element(by.id('smoke-free-timer'))).toBeVisible();
  });

  it('should handle validation errors', async () => {
    await expect(element(by.id('welcome-screen'))).toBeVisible();
    await element(by.id('get-started-button')).tap();

    // Try to submit form without required fields
    await element(by.id('create-account-button')).tap();

    // Should show validation errors
    await expect(element(by.text('Name is required'))).toBeVisible();
    await expect(element(by.text('Email is required'))).toBeVisible();
    await expect(element(by.text('Password is required'))).toBeVisible();
  });
});

// e2e/smokeFreTimer.e2e.ts
describe('Smoke-Free Timer', () => {
  beforeAll(async () => {
    await device.launchApp();
    // Assume user is already logged in and onboarded
  });

  it('should display and update timer correctly', async () => {
    await expect(element(by.id('dashboard-screen'))).toBeVisible();

    // Check timer is visible
    const timer = element(by.id('smoke-free-timer'));
    await expect(timer).toBeVisible();

    // Check timer format (should be DD:HH:MM:SS)
    const timerText = await timer.getAttributes();
    expect(timerText.text).toMatch(/\d{2}:\d{2}:\d{2}:\d{2}/);
  });

  it('should reset timer when relapse button is pressed', async () => {
    await expect(element(by.id('dashboard-screen'))).toBeVisible();

    // Get initial timer value
    const initialTimer = await element(by.id('smoke-free-timer')).getAttributes();

    // Press relapse button
    await element(by.id('relapse-button')).tap();

    // Confirm relapse
    await expect(element(by.id('relapse-confirmation-modal'))).toBeVisible();
    await element(by.id('confirm-relapse-button')).tap();

    // Timer should reset to 00:00:00:00
    await expect(element(by.id('smoke-free-timer'))).toHaveText('00:00:00:00');

    // Should show encouragement message
    await expect(element(by.id('reset-encouragement'))).toBeVisible();
  });
});
```

## 3. Continuous Integration Pipeline

### 3.1 GitHub Actions Workflow
```yaml
# .github/workflows/ci.yml
name: CI Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  lint-and-typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linter
        run: npm run lint

      - name: Run type check
        run: npm run type-check

  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run unit tests
        run: npm run test -- --coverage --watchAll=false

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3

  integration-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Start Firebase Emulators
        run: |
          npm install -g firebase-tools
          firebase emulators:start --detached --import=./emulator-data
        env:
          GOOGLE_APPLICATION_CREDENTIALS: ${{ secrets.FIREBASE_SERVICE_ACCOUNT }}

      - name: Run integration tests
        run: npm run test:integration

      - name: Stop Firebase Emulators
        run: firebase emulators:stop

  build-android:
    runs-on: ubuntu-latest
    needs: [lint-and-typecheck, unit-tests]
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Setup Expo CLI
        run: npm install -g @expo/cli

      - name: Install dependencies
        run: npm ci

      - name: Build Android APK
        run: eas build --platform android --non-interactive
        env:
          EXPO_TOKEN: ${{ secrets.EXPO_TOKEN }}

  build-ios:
    runs-on: macos-latest
    needs: [lint-and-typecheck, unit-tests]
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Setup Expo CLI
        run: npm install -g @expo/cli

      - name: Install dependencies
        run: npm ci

      - name: Build iOS IPA
        run: eas build --platform ios --non-interactive
        env:
          EXPO_TOKEN: ${{ secrets.EXPO_TOKEN }}

  deploy-functions:
    runs-on: ubuntu-latest
    needs: [lint-and-typecheck, unit-tests, integration-tests]
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Deploy Firebase Functions
        run: |
          npm install -g firebase-tools
          firebase deploy --only functions --token ${{ secrets.FIREBASE_TOKEN }}
```

### 3.2 Quality Gates

```typescript
// jest.config.js - Coverage requirements
module.exports = {
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/index.tsx',
    '!src/config/*',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.{spec,test}.{js,jsx,ts,tsx}',
  ],
};
```

## 4. Development Workflow

### 4.1 Git Workflow (GitFlow)
```
main (production)
├── develop (integration)
│   ├── feature/user-onboarding
│   ├── feature/activity-logging
│   ├── feature/achievement-system
│   └── hotfix/timer-display-bug
└── release/v1.0.0
```

### 4.2 Branch Protection Rules
- **main**: Requires PR review, all checks passing
- **develop**: Requires PR review, unit tests passing
- **feature/***: No special requirements (developer discretion)

### 4.3 Development Process
1. Create feature branch from `develop`
2. Implement feature with tests
3. Run local validation (`npm run validate`)
4. Create PR to `develop`
5. Code review and approval
6. Merge to `develop`
7. Integration testing on staging
8. Create release branch when ready
9. Deploy to production
10. Merge release to `main` and `develop`

This comprehensive development workflow ensures code quality, integration reliability, and smooth deployment processes for the AuraShift application.