# AuraShift Deployment & CI/CD Workflow

## 1. Deployment Strategy Overview

### 1.1 Environment Structure
```
Development Environment
├── Local Development (Firebase Emulators)
├── Feature Branch Deployments (Preview)
└── Development Firebase Project

Staging Environment
├── Staging Firebase Project
├── Pre-production Testing
└── User Acceptance Testing

Production Environment
├── Production Firebase Project
├── App Store Releases
└── Live User Base
```

### 1.2 Deployment Principles
- **Automated Deployments**: All deployments triggered by Git events
- **Environment Parity**: Consistent configuration across environments
- **Zero Downtime**: Rolling deployments with health checks
- **Rollback Capability**: Quick rollback to previous versions
- **Security First**: Secrets management and secure deployments

## 2. CI/CD Pipeline Architecture

### 2.1 GitHub Actions Workflow
```yaml
# .github/workflows/ci-cd.yml
name: AuraShift CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]
  release:
    types: [published]

env:
  NODE_VERSION: '18'
  EXPO_CLI_VERSION: 'latest'

jobs:
  # Quality Gates
  quality-checks:
    name: Quality Checks
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install Dependencies
        run: npm ci

      - name: Lint Check
        run: npm run lint

      - name: Type Check
        run: npm run type-check

      - name: Format Check
        run: npm run format:check

  # Unit Tests
  unit-tests:
    name: Unit Tests
    runs-on: ubuntu-latest
    needs: quality-checks
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install Dependencies
        run: npm ci

      - name: Run Unit Tests
        run: npm run test:unit -- --coverage

      - name: Upload Coverage Reports
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info
          flags: unittests
          name: codecov-umbrella

  # Integration Tests
  integration-tests:
    name: Integration Tests
    runs-on: ubuntu-latest
    needs: quality-checks
    services:
      firebase-emulator:
        image: firebase/firebase-tools:latest
        ports:
          - 8080:8080
          - 9099:9099
          - 5001:5001
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install Dependencies
        run: npm ci

      - name: Start Firebase Emulators
        run: |
          npm install -g firebase-tools
          firebase emulators:start --only firestore,auth,functions &
          sleep 10

      - name: Run Integration Tests
        run: npm run test:integration
        env:
          FIRESTORE_EMULATOR_HOST: localhost:8080
          FIREBASE_AUTH_EMULATOR_HOST: localhost:9099

  # Security Scanning
  security-scan:
    name: Security Scan
    runs-on: ubuntu-latest
    needs: quality-checks
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Run Security Audit
        run: npm audit --audit-level moderate

      - name: Dependency Check
        uses: dependency-check/Dependency-Check_Action@main
        with:
          project: 'AuraShift'
          path: '.'
          format: 'JSON'

      - name: SAST Scan
        uses: github/super-linter@v4
        env:
          DEFAULT_BRANCH: main
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          VALIDATE_TYPESCRIPT_ES: true
          VALIDATE_JAVASCRIPT_ES: true

  # Build Mobile App
  build-mobile:
    name: Build Mobile App
    runs-on: ubuntu-latest
    needs: [unit-tests, integration-tests]
    if: github.ref == 'refs/heads/main' || github.ref == 'refs/heads/develop'
    strategy:
      matrix:
        platform: [ios, android]
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Setup Expo CLI
        run: npm install -g @expo/cli

      - name: Install Dependencies
        run: npm ci

      - name: Configure Environment
        run: |
          echo "EXPO_PUBLIC_FIREBASE_API_KEY=${{ secrets.FIREBASE_API_KEY }}" >> .env
          echo "EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=${{ secrets.FIREBASE_AUTH_DOMAIN }}" >> .env
          echo "EXPO_PUBLIC_FIREBASE_PROJECT_ID=${{ secrets.FIREBASE_PROJECT_ID }}" >> .env

      - name: Build for ${{ matrix.platform }}
        run: |
          if [ "${{ matrix.platform }}" == "ios" ]; then
            expo build:ios --non-interactive
          else
            expo build:android --non-interactive
          fi

      - name: Upload Build Artifacts
        uses: actions/upload-artifact@v3
        with:
          name: ${{ matrix.platform }}-build
          path: |
            *.ipa
            *.apk
            *.aab

  # Deploy Firebase Functions
  deploy-functions:
    name: Deploy Firebase Functions
    runs-on: ubuntu-latest
    needs: [unit-tests, integration-tests, security-scan]
    if: github.ref == 'refs/heads/main' || github.ref == 'refs/heads/develop'
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install Dependencies
        run: |
          npm ci
          cd firebase/functions && npm ci

      - name: Build Functions
        run: cd firebase/functions && npm run build

      - name: Deploy to Firebase
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          projectId: '${{ secrets.FIREBASE_PROJECT_ID }}'
          channelId: live

  # E2E Tests
  e2e-tests:
    name: E2E Tests
    runs-on: macos-latest
    needs: [build-mobile, deploy-functions]
    if: github.ref == 'refs/heads/develop'
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install Dependencies
        run: npm ci

      - name: Setup iOS Simulator
        run: |
          sudo xcode-select -s /Applications/Xcode.app
          xcrun simctl boot "iPhone 14"

      - name: Build iOS App for Testing
        run: |
          expo build:ios --simulator
          tar -xzf *.tar.gz

      - name: Run Detox E2E Tests
        run: |
          npx detox build --configuration ios.sim.debug
          npx detox test --configuration ios.sim.debug --cleanup

      - name: Upload E2E Test Results
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: e2e-test-results
          path: |
            e2e/artifacts/
            detox-test-results.xml

  # Production Deployment
  deploy-production:
    name: Deploy to Production
    runs-on: ubuntu-latest
    needs: [build-mobile, deploy-functions, e2e-tests]
    if: github.event_name == 'release' && github.event.action == 'published'
    environment: production
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Deploy Firebase to Production
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT_PROD }}'
          projectId: '${{ secrets.FIREBASE_PROJECT_ID_PROD }}'
          channelId: live

      - name: Submit to App Stores
        run: |
          # iOS App Store submission
          expo submit:ios --latest --apple-id ${{ secrets.APPLE_ID }} --apple-id-password ${{ secrets.APPLE_ID_PASSWORD }}
          
          # Google Play Store submission
          expo submit:android --latest --service-account-key-path ${{ secrets.GOOGLE_SERVICE_ACCOUNT_KEY }}

      - name: Create Release Notes
        run: |
          echo "## AuraShift Release ${{ github.event.release.tag_name }}" > release-notes.md
          echo "${{ github.event.release.body }}" >> release-notes.md

      - name: Notify Team
        uses: 8398a7/action-slack@v3
        with:
          status: success
          text: "🚀 AuraShift ${{ github.event.release.tag_name }} deployed to production!"
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
```

### 2.2 Environment-Specific Configurations

#### Development Environment
```yaml
# .github/workflows/development.yml
name: Development Deployment

on:
  push:
    branches: [develop]

jobs:
  deploy-dev:
    runs-on: ubuntu-latest
    environment: development
    steps:
      - name: Deploy to Development
        run: |
          firebase use development
          firebase deploy --only functions,firestore:rules
        env:
          FIREBASE_TOKEN: ${{ secrets.FIREBASE_TOKEN_DEV }}
```

#### Staging Environment
```yaml
# .github/workflows/staging.yml
name: Staging Deployment

on:
  push:
    branches: [main]

jobs:
  deploy-staging:
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - name: Deploy to Staging
        run: |
          firebase use staging
          firebase deploy --only functions,firestore:rules,hosting
        env:
          FIREBASE_TOKEN: ${{ secrets.FIREBASE_TOKEN_STAGING }}
```

## 3. Environment Management

### 3.1 Firebase Project Configuration
```json
// .firebaserc
{
  "projects": {
    "development": "aurashift-dev-12345",
    "staging": "aurashift-staging-12345",
    "production": "aurashift-prod-12345"
  },
  "targets": {
    "aurashift-prod-12345": {
      "hosting": {
        "web": ["aurashift-web"],
        "admin": ["aurashift-admin"]
      }
    }
  }
}
```

### 3.2 Environment Variables
```typescript
// config/environments.ts
interface Environment {
  firebase: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
  };
  openai: {
    apiKey: string;
    model: string;
  };
  app: {
    version: string;
    environment: 'development' | 'staging' | 'production';
    debugMode: boolean;
  };
}

export const environments: Record<string, Environment> = {
  development: {
    firebase: {
      apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY_DEV!,
      authDomain: 'aurashift-dev.firebaseapp.com',
      projectId: 'aurashift-dev-12345',
      storageBucket: 'aurashift-dev-12345.appspot.com',
      messagingSenderId: '123456789',
      appId: '1:123456789:web:abcdef123456'
    },
    openai: {
      apiKey: process.env.OPENAI_API_KEY_DEV!,
      model: 'gpt-4'
    },
    app: {
      version: '1.0.0-dev',
      environment: 'development',
      debugMode: true
    }
  },
  production: {
    firebase: {
      apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY_PROD!,
      authDomain: 'aurashift.firebaseapp.com',
      projectId: 'aurashift-prod-12345',
      storageBucket: 'aurashift-prod-12345.appspot.com',
      messagingSenderId: '987654321',
      appId: '1:987654321:web:fedcba654321'
    },
    openai: {
      apiKey: process.env.OPENAI_API_KEY_PROD!,
      model: 'gpt-4'
    },
    app: {
      version: '1.0.0',
      environment: 'production',
      debugMode: false
    }
  }
};
```

## 4. Mobile App Deployment

### 4.1 iOS App Store Deployment
```yaml
# iOS deployment configuration
ios_deployment:
  steps:
    - name: Build iOS App
      run: |
        expo build:ios --release-channel production
        
    - name: Download IPA
      run: |
        expo download:ios --output ./build/
        
    - name: Upload to App Store Connect
      uses: apple-actions/upload-testflight-build@v1
      with:
        app-path: './build/AuraShift.ipa'
        issuer-id: ${{ secrets.APPSTORE_ISSUER_ID }}
        api-key-id: ${{ secrets.APPSTORE_API_KEY_ID }}
        api-private-key: ${{ secrets.APPSTORE_API_PRIVATE_KEY }}
        
    - name: Submit for Review
      run: |
        # Automated submission to App Store review
        xcrun altool --upload-app -f "./build/AuraShift.ipa" \
          -u "${{ secrets.APPLE_ID }}" \
          -p "${{ secrets.APPLE_ID_PASSWORD }}"
```

### 4.2 Android Play Store Deployment
```yaml
# Android deployment configuration
android_deployment:
  steps:
    - name: Build Android App Bundle
      run: |
        expo build:android --type app-bundle --release-channel production
        
    - name: Download AAB
      run: |
        expo download:android --output ./build/
        
    - name: Upload to Google Play Console
      uses: r0adkll/upload-google-play@v1
      with:
        serviceAccountJsonPlainText: ${{ secrets.GOOGLE_SERVICE_ACCOUNT_JSON }}
        packageName: com.aurashift.app
        releaseFiles: ./build/AuraShift.aab
        track: production
        status: completed
        
    - name: Create Release Notes
      run: |
        echo "New features and improvements in this release" > release-notes.txt
```

### 4.3 Over-the-Air (OTA) Updates
```typescript
// OTA update configuration
import * as Updates from 'expo-updates';

export const checkForUpdates = async () => {
  try {
    const update = await Updates.checkForUpdateAsync();
    
    if (update.isAvailable) {
      await Updates.fetchUpdateAsync();
      
      // Show user-friendly update prompt
      Alert.alert(
        'Update Available',
        'A new version of AuraShift is ready. Would you like to restart the app to apply the update?',
        [
          { text: 'Later', style: 'cancel' },
          { 
            text: 'Update Now', 
            onPress: () => Updates.reloadAsync() 
          }
        ]
      );
    }
  } catch (error) {
    console.error('Error checking for updates:', error);
  }
};

// Update channels for different environments
export const updateChannels = {
  development: 'dev',
  staging: 'staging',
  production: 'production'
};
```

## 5. Database Migrations & Schema Updates

### 5.1 Firestore Migration Strategy
```typescript
// migrations/migration-runner.ts
interface Migration {
  version: string;
  description: string;
  up: () => Promise<void>;
  down: () => Promise<void>;
}

const migrations: Migration[] = [
  {
    version: '1.1.0',
    description: 'Add notification preferences to user profiles',
    up: async () => {
      const batch = admin.firestore().batch();
      const users = await admin.firestore().collection('users').get();
      
      users.docs.forEach(doc => {
        batch.update(doc.ref, {
          notificationPreferences: {
            hourlyEnabled: true,
            halfHourlyEnabled: true,
            customMessages: {
              hourly: 'abc',
              halfHourly: 'xyz'
            },
            quietHours: {
              enabled: false,
              startTime: '22:00',
              endTime: '08:00'
            }
          }
        });
      });
      
      await batch.commit();
    },
    down: async () => {
      // Rollback logic
    }
  }
];

export const runMigrations = async () => {
  for (const migration of migrations) {
    console.log(`Running migration: ${migration.description}`);
    await migration.up();
    console.log(`Completed migration: ${migration.version}`);
  }
};
```

### 5.2 Schema Validation
```typescript
// Schema validation for database updates
import Joi from 'joi';

export const userProfileSchema = Joi.object({
  displayName: Joi.string().min(1).max(100).required(),
  email: Joi.string().email().required(),
  smokingHistory: Joi.object({
    yearsSmoked: Joi.number().min(0).max(100).required(),
    cigarettesPerDay: Joi.number().min(0).max(200).required(),
    costPerPack: Joi.number().min(0).max(100).default(10),
    motivations: Joi.array().items(Joi.string()).min(1).required()
  }).required(),
  auraScore: Joi.number().integer().default(0),
  onboardingCompleted: Joi.boolean().default(false)
});

export const validateUserProfile = (data: any) => {
  const { error, value } = userProfileSchema.validate(data);
  if (error) {
    throw new Error(`Validation error: ${error.message}`);
  }
  return value;
};
```

## 6. Monitoring & Observability

### 6.1 Application Monitoring
```typescript
// monitoring/performance.ts
import * as Sentry from '@sentry/react-native';
import crashlytics from '@react-native-firebase/crashlytics';
import analytics from '@react-native-firebase/analytics';

// Initialize monitoring
export const initializeMonitoring = () => {
  // Sentry for error tracking
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV,
    enableAutoSessionTracking: true,
    sessionTrackingIntervalMillis: 30000
  });
  
  // Firebase Crashlytics
  crashlytics().setCrashlyticsCollectionEnabled(true);
  
  // Firebase Analytics
  analytics().setAnalyticsCollectionEnabled(true);
};

// Performance monitoring
export const trackPerformance = async (operation: string, fn: () => Promise<any>) => {
  const startTime = Date.now();
  
  try {
    const result = await fn();
    const duration = Date.now() - startTime;
    
    // Track successful operations
    await analytics().logEvent('operation_completed', {
      operation,
      duration,
      success: true
    });
    
    return result;
  } catch (error) {
    const duration = Date.now() - startTime;
    
    // Track failed operations
    await analytics().logEvent('operation_failed', {
      operation,
      duration,
      success: false,
      error: error.message
    });
    
    // Report to Crashlytics
    crashlytics().recordError(error);
    
    throw error;
  }
};
```

### 6.2 Health Checks
```typescript
// health-check endpoint
export const healthCheck = functions.https.onRequest(async (req, res) => {
  const checks = {
    timestamp: new Date().toISOString(),
    status: 'healthy',
    version: process.env.APP_VERSION,
    environment: process.env.NODE_ENV,
    services: {
      firestore: 'unknown',
      auth: 'unknown',
      openai: 'unknown'
    }
  };
  
  try {
    // Check Firestore
    await admin.firestore().collection('health').doc('check').get();
    checks.services.firestore = 'healthy';
  } catch (error) {
    checks.services.firestore = 'unhealthy';
    checks.status = 'degraded';
  }
  
  try {
    // Check Firebase Auth
    await admin.auth().listUsers(1);
    checks.services.auth = 'healthy';
  } catch (error) {
    checks.services.auth = 'unhealthy';
    checks.status = 'degraded';
  }
  
  try {
    // Check OpenAI API
    const response = await fetch('https://api.openai.com/v1/models', {
      headers: { 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` }
    });
    checks.services.openai = response.ok ? 'healthy' : 'unhealthy';
  } catch (error) {
    checks.services.openai = 'unhealthy';
    checks.status = 'degraded';
  }
  
  const statusCode = checks.status === 'healthy' ? 200 : 503;
  res.status(statusCode).json(checks);
});
```

## 7. Rollback Procedures

### 7.1 Automated Rollback
```yaml
# Automated rollback on failure
rollback_on_failure:
  steps:
    - name: Monitor Deployment
      run: |
        # Wait for deployment to stabilize
        sleep 300
        
        # Check health endpoint
        HEALTH_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://api.aurashift.com/health)
        
        if [ "$HEALTH_STATUS" != "200" ]; then
          echo "Health check failed, initiating rollback"
          exit 1
        fi
        
    - name: Rollback on Failure
      if: failure()
      run: |
        # Rollback Firebase deployment
        firebase functions:config:unset --project production
        firebase deploy --only functions --project production
        
        # Rollback mobile app (OTA)
        expo publish --release-channel production-rollback
```

### 7.2 Manual Rollback Procedures
```bash
#!/bin/bash
# scripts/rollback.sh

set -e

ENVIRONMENT=${1:-staging}
VERSION=${2}

echo "Rolling back $ENVIRONMENT to version $VERSION"

# Rollback Firebase Functions
firebase use $ENVIRONMENT
firebase functions:config:set app.version="$VERSION"
firebase deploy --only functions

# Rollback Firestore rules (if needed)
git checkout $VERSION -- firestore.rules
firebase deploy --only firestore:rules

# Rollback mobile app (OTA update)
expo publish --release-channel $ENVIRONMENT-rollback

echo "Rollback completed successfully"
```

## 8. Security & Compliance

### 8.1 Secrets Management
```yaml
# GitHub Secrets Configuration
secrets:
  # Firebase
  FIREBASE_SERVICE_ACCOUNT_DEV: "base64-encoded-service-account"
  FIREBASE_SERVICE_ACCOUNT_STAGING: "base64-encoded-service-account"
  FIREBASE_SERVICE_ACCOUNT_PROD: "base64-encoded-service-account"
  
  # App Store
  APPLE_ID: "developer-apple-id"
  APPLE_ID_PASSWORD: "app-specific-password"
  APPSTORE_API_KEY_ID: "api-key-id"
  APPSTORE_ISSUER_ID: "issuer-id"
  APPSTORE_API_PRIVATE_KEY: "base64-encoded-private-key"
  
  # Google Play
  GOOGLE_SERVICE_ACCOUNT_JSON: "base64-encoded-service-account"
  
  # External APIs
  OPENAI_API_KEY_DEV: "dev-api-key"
  OPENAI_API_KEY_PROD: "prod-api-key"
  
  # Monitoring
  SENTRY_DSN: "sentry-dsn-url"
  SLACK_WEBHOOK_URL: "slack-webhook-url"
```

### 8.2 Compliance Checks
```yaml
# Compliance and security scanning
compliance_checks:
  steps:
    - name: GDPR Compliance Check
      run: |
        # Check for proper data handling
        grep -r "personal.*data" src/ || true
        grep -r "gdpr\|privacy" src/ || true
        
    - name: Security Headers Check
      run: |
        # Check security headers in API responses
        curl -I https://api.aurashift.com/health | grep -E "(X-Content-Type-Options|X-Frame-Options|X-XSS-Protection)"
        
    - name: SSL Certificate Check
      run: |
        # Verify SSL certificate validity
        echo | openssl s_client -servername aurashift.com -connect aurashift.com:443 2>/dev/null | openssl x509 -noout -dates
```

## 9. Disaster Recovery

### 9.1 Backup Strategy
```typescript
// Automated backup procedures
export const backupFirestore = functions.pubsub
  .schedule('every 24 hours')
  .onRun(async (context) => {
    const projectId = process.env.GCLOUD_PROJECT;
    const client = new v1.FirestoreAdminClient();
    
    const databaseName = client.databasePath(projectId, '(default)');
    const bucket = `gs://${projectId}-backups`;
    
    const responses = await client.exportDocuments({
      name: databaseName,
      outputUriPrefix: `${bucket}/${new Date().toISOString()}`,
      collectionIds: ['users', 'activities', 'achievements']
    });
    
    console.log(`Backup operation: ${responses[0].name}`);
  });
```

### 9.2 Recovery Procedures
```bash
#!/bin/bash
# scripts/disaster-recovery.sh

BACKUP_DATE=${1}
PROJECT_ID=${2:-aurashift-prod-12345}

echo "Starting disaster recovery for $PROJECT_ID from backup $BACKUP_DATE"

# Restore Firestore from backup
gcloud firestore import gs://$PROJECT_ID-backups/$BACKUP_DATE \
  --project=$PROJECT_ID \
  --async

# Restore Firebase Functions
firebase deploy --only functions --project=$PROJECT_ID

# Verify restoration
curl -f https://api.aurashift.com/health || exit 1

echo "Disaster recovery completed successfully"
```

This comprehensive deployment and CI/CD workflow ensures AuraShift can be deployed reliably, monitored effectively, and recovered quickly in case of issues, while maintaining high security and compliance standards.
