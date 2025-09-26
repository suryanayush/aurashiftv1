# AuraShift Development Rules & Guidelines

## 1. Core Development Principles

### 1.1 User-Centric Development
- **Rule**: Every feature must serve the primary goal of helping users quit smoking
- **Guideline**: Before implementing any feature, ask "How does this help someone quit smoking?"
- **Validation**: Each feature must have measurable success criteria tied to user outcomes

### 1.2 Privacy-First Approach
- **Rule**: All personal health data must be encrypted and stored securely
- **Rule**: Users must have full control over their data (view, export, delete)
- **Guideline**: Collect only data that directly serves the user's quit-smoking journey
- **Validation**: GDPR compliance review required for all data collection

### 1.3 Supportive, Non-Judgmental Experience
- **Rule**: Never shame users for relapses or setbacks
- **Rule**: Always provide encouragement and actionable next steps
- **Guideline**: Use positive reinforcement language throughout the app
- **Example**: "Your new journey starts now" instead of "You failed"

### 1.4 Scientific Accuracy
- **Rule**: All health claims must be backed by credible medical sources
- **Rule**: Health milestones must reference peer-reviewed research
- **Guideline**: When in doubt, be conservative with health claims
- **Validation**: Medical accuracy review required for health-related content

## 2. Technical Standards & Rules

### 2.1 Code Quality Standards

#### TypeScript Usage
```typescript
// ✅ REQUIRED: All new code must be TypeScript
interface UserProfile {
  id: string;
  smokingHistory: SmokingProfile;
  // ... other properties
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

#### Error Handling Rules
```typescript
// ✅ REQUIRED: All async operations must have error handling
try {
  const result = await someAsyncOperation();
  return result;
} catch (error) {
  // Log error for monitoring
  crashlytics().recordError(error as Error);

  // Show user-friendly error
  showErrorMessage('Something went wrong. Please try again.');

  // Return fallback or throw handled error
  throw new HandledError('User-friendly message');
}
```

### 2.2 Performance Rules

#### Bundle Size Management
- **Rule**: Main bundle must be < 10MB after optimization
- **Rule**: Lazy load non-critical features
- **Guideline**: Use dynamic imports for heavy libraries
- **Validation**: Bundle analyzer report required for each release

#### Image and Asset Rules
```typescript
// ✅ REQUIRED: Optimize all images
import optimizedImage from './image.webp'; // Use WebP when possible

// ✅ REQUIRED: Use appropriate image sizes
<Image
  source={{ uri: imageUrl }}
  style={{ width: 100, height: 100 }}
  resizeMode="cover"
  placeholder={require('./placeholder.png')} // Always provide placeholder
/>
```

#### Database Query Rules
```typescript
// ✅ REQUIRED: Limit query results
const activities = await firestore
  .collection('activities')
  .orderBy('timestamp', 'desc')
  .limit(50) // Always limit queries
  .get();

// ✅ REQUIRED: Use proper indexes for compound queries
// This query requires an index on [userId, timestamp]
const userActivities = await firestore
  .collection('activities')
  .where('userId', '==', userId)
  .orderBy('timestamp', 'desc')
  .limit(20)
  .get();
```

### 2.3 Security Rules

#### Authentication Rules
```typescript
// ✅ REQUIRED: Always verify authentication
if (!auth.currentUser) {
  throw new Error('User must be authenticated');
}

// ✅ REQUIRED: Validate user permissions
const userDoc = await firestore
  .collection('users')
  .doc(auth.currentUser.uid)
  .get();

if (!userDoc.exists || !userDoc.data().isActive) {
  throw new Error('Unauthorized access');
}
```

#### Data Validation Rules
```typescript
// ✅ REQUIRED: Validate all inputs
import Joi from 'joi';

const userProfileSchema = Joi.object({
  displayName: Joi.string().min(1).max(100).required(),
  smokingHistory: Joi.object({
    yearsSmoked: Joi.number().min(0).max(100).required(),
    cigarettesPerDay: Joi.number().min(0).max(200).required(),
  }).required(),
});

const { error, value } = userProfileSchema.validate(inputData);
if (error) {
  throw new ValidationError(error.message);
}
```

#### Firestore Security Rules
```javascript
// ✅ REQUIRED: Implement strict security rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null
        && request.auth.uid == userId;
    }

    // Global data is read-only for authenticated users
    match /achievements/{achievementId} {
      allow read: if request.auth != null;
      allow write: if false; // Only via admin SDK
    }
  }
}
```

## 3. User Experience Rules

### 3.1 Accessibility Requirements
- **Rule**: All interactive elements must have accessibility labels
- **Rule**: Minimum touch target size of 44px x 44px
- **Rule**: Color contrast ratio must meet WCAG 2.1 AA standards
- **Rule**: App must be fully navigable via screen reader

```typescript
// ✅ REQUIRED: Accessibility implementation
<TouchableOpacity
  accessibilityLabel="Log gym workout activity"
  accessibilityHint="Adds 5 points to your Aura score"
  accessibilityRole="button"
  onPress={logGymActivity}
>
  <Text>💪 Gym</Text>
</TouchableOpacity>
```

### 3.2 Loading States & Feedback
```typescript
// ✅ REQUIRED: Show loading states for async operations
const [isLoading, setIsLoading] = useState(false);

const handleSubmit = async () => {
  setIsLoading(true);
  try {
    await submitData();
    showSuccessMessage('Activity logged successfully!');
  } catch (error) {
    showErrorMessage('Failed to log activity. Please try again.');
  } finally {
    setIsLoading(false);
  }
};

return (
  <Button
    onPress={handleSubmit}
    disabled={isLoading}
    loading={isLoading}
  >
    {isLoading ? 'Saving...' : 'Save Activity'}
  </Button>
);
```

### 3.3 Error Handling UX Rules
- **Rule**: Never show technical error messages to users
- **Rule**: Always provide actionable next steps when errors occur
- **Rule**: Implement graceful degradation for network issues

```typescript
// ✅ GOOD: User-friendly error handling
const ERROR_MESSAGES = {
  network: 'Please check your internet connection and try again.',
  validation: 'Please fill in all required fields.',
  server: 'Something went wrong on our end. Please try again in a moment.',
  unauthorized: 'Please log in to continue.',
};

const handleError = (error: Error) => {
  const userMessage = ERROR_MESSAGES[error.type] || ERROR_MESSAGES.server;

  showErrorMessage(userMessage, {
    action: {
      label: 'Try Again',
      onPress: retryOperation
    }
  });
};
```

## 4. Content & Communication Rules

### 4.1 Tone and Voice Guidelines
- **Rule**: Use encouraging, supportive language
- **Rule**: Avoid medical jargon; use simple, clear terms
- **Rule**: Be specific with praise ("You've been smoke-free for 3 days" vs "Good job")
- **Guideline**: Use "we" language to create partnership feeling

#### Approved Language Examples
```
✅ GOOD:
- "Your new journey starts now"
- "Every hour smoke-free helps your body heal"
- "You're building a powerful new habit"
- "What can we try differently next time?"

❌ AVOID:
- "You failed"
- "Try not to smoke"
- "Smoking is bad for you"
- "You should quit"
```

### 4.2 Notification Content Rules
- **Rule**: Notifications must be contextual to user's current state
- **Rule**: Avoid generic motivational quotes
- **Rule**: Include specific progress milestones when possible

```typescript
// ✅ GOOD: Contextual notification
const notification = {
  title: `24 hours strong, ${userName}! 💪`,
  body: `Your sense of taste is already improving. You've saved $${savedAmount} too!`,
  data: { milestone: '24_hours', userId }
};

// ❌ AVOID: Generic message
const badNotification = {
  title: 'Keep going!',
  body: 'You can do it!',
  data: {}
};
```

### 4.3 Achievement & Milestone Content
- **Rule**: Achievements must celebrate specific behaviors, not just time passed
- **Rule**: Include health benefits when relevant
- **Rule**: Connect achievements to user's personal motivations

```typescript
// ✅ GOOD: Specific achievement
{
  title: "Fitness Champion",
  description: "Logged 5 gym sessions this week while staying smoke-free",
  celebration: "Your lung capacity is improving, and you're building an amazing healthy routine!"
}

// ❌ AVOID: Generic achievement
{
  title: "Good Job",
  description: "You did well this week",
  celebration: "Keep it up!"
}
```

## 5. Data & Analytics Rules

### 5.1 Data Collection Ethics
- **Rule**: Only collect data that directly serves the user's goals
- **Rule**: Always obtain explicit consent for data collection
- **Rule**: Allow users to opt out of non-essential data collection

```typescript
// ✅ REQUIRED: Consent management
interface ConsentSettings {
  analytics: boolean;          // App usage analytics
  personalization: boolean;    // Personalized content
  research: boolean;          // Anonymous research participation
  marketing: boolean;         // Marketing communications
}

const requestConsent = async (consentType: keyof ConsentSettings) => {
  const userChoice = await showConsentDialog({
    title: `Help us improve AuraShift`,
    description: getConsentDescription(consentType),
    benefits: getConsentBenefits(consentType),
    allowDecline: true
  });

  await updateUserConsent(consentType, userChoice);
};
```

### 5.2 Analytics Implementation Rules
```typescript
// ✅ REQUIRED: Sanitize analytics data
const trackActivityLogged = (activity: Activity) => {
  analytics.track('activity_logged', {
    activity_type: activity.type,
    activity_category: activity.category,
    points_earned: activity.totalAuraPoints,
    // ❌ NEVER include: personal identifiers, specific content
    // user_email: activity.userId, // DON'T DO THIS
    // activity_notes: activity.description, // DON'T DO THIS
  });
};
```

### 5.3 Performance Monitoring Rules
- **Rule**: Monitor app performance metrics continuously
- **Rule**: Set up alerts for critical performance degradation
- **Rule**: Track user experience metrics (loading times, error rates)

## 6. Testing & Quality Assurance Rules

### 6.1 Test Coverage Requirements
- **Rule**: Minimum 80% test coverage for critical paths
- **Rule**: All new features must include unit tests
- **Rule**: Integration tests required for all API interactions

```typescript
// ✅ REQUIRED: Test structure
describe('ActivityService', () => {
  describe('logActivity', () => {
    it('should create activity with correct score', async () => {
      // Arrange
      const activityData = createMockActivity();

      // Act
      const result = await activityService.logActivity(activityData);

      // Assert
      expect(result.totalAuraPoints).toBe(5);
      expect(result.timestamp).toBeInstanceOf(Date);
    });

    it('should handle network errors gracefully', async () => {
      // Test error scenarios
    });
  });
});
```

### 6.2 Testing Strategy Rules
- **Rule**: Test critical user paths with E2E tests
- **Rule**: Mock external dependencies in unit tests
- **Rule**: Test offline scenarios for all critical features

## 7. Deployment & Release Rules

### 7.1 Pre-Release Checklist
- [ ] All automated tests pass
- [ ] Performance benchmarks meet requirements
- [ ] Security scan passes with no critical issues
- [ ] Accessibility audit passes
- [ ] Content review completed
- [ ] Privacy policy updated if needed
- [ ] App store metadata reviewed

### 7.2 Release Process Rules
- **Rule**: Never deploy directly to production
- **Rule**: All changes must go through staging environment first
- **Rule**: Rollback plan must be prepared before each release

```yaml
# ✅ REQUIRED: Deployment pipeline
stages:
  - test
  - security_scan
  - staging_deploy
  - performance_test
  - production_deploy
```

### 7.3 Monitoring & Alerting Rules
```typescript
// ✅ REQUIRED: Production monitoring
const criticalAlerts = {
  error_rate: { threshold: '5%', window: '5m' },
  response_time: { threshold: '2s', window: '5m' },
  crash_rate: { threshold: '1%', window: '10m' },
};

const setupMonitoring = () => {
  Object.entries(criticalAlerts).forEach(([metric, config]) => {
    monitoring.createAlert({
      metric,
      threshold: config.threshold,
      window: config.window,
      notification: 'team-slack-channel'
    });
  });
};
```

## 8. Team Collaboration Rules

### 8.1 Code Review Requirements
- **Rule**: All code must be reviewed by at least one team member
- **Rule**: No direct commits to main branch
- **Rule**: Reviews must check for functionality, performance, and user experience

### 8.2 Documentation Rules
- **Rule**: All public APIs must be documented
- **Rule**: Complex business logic must include inline comments
- **Rule**: README files must be kept up-to-date

```typescript
/**
 * Calculates the user's Aura score based on their activities
 *
 * @param activities - Array of user activities
 * @param streakHours - Current smoke-free streak in hours
 * @returns Calculated Aura score with breakdown
 *
 * @example
 * const score = calculateAuraScore([gymActivity, mealActivity], 48);
 * console.log(score.total); // 15
 */
export const calculateAuraScore = (
  activities: Activity[],
  streakHours: number
): AuraScoreResult => {
  // Implementation here
};
```

### 8.3 Communication Rules
- **Rule**: All breaking changes must be communicated in advance
- **Rule**: Sprint goals must be clearly defined and agreed upon
- **Rule**: Daily standup format: What I did, what I'm doing, any blockers

## 9. Compliance & Legal Rules

### 9.1 Health Data Regulations
- **Rule**: Comply with HIPAA guidelines where applicable
- **Rule**: Implement appropriate data retention policies
- **Rule**: Provide clear data handling transparency to users

### 9.2 App Store Compliance
- **Rule**: Follow Apple App Store Review Guidelines
- **Rule**: Comply with Google Play Policy requirements
- **Rule**: Ensure age-appropriate content ratings

### 9.3 International Compliance
- **Rule**: GDPR compliance for EU users
- **Rule**: CCPA compliance for California users
- **Rule**: Appropriate data localization where required

## 10. Emergency Procedures

### 10.1 Security Incident Response
1. Immediately contain the threat
2. Assess the scope of the incident
3. Notify relevant stakeholders
4. Document the incident and response
5. Implement preventive measures

### 10.2 Production Issue Response
1. Identify and assess the severity
2. Implement immediate mitigation
3. Communicate with users if necessary
4. Fix the root cause
5. Conduct post-mortem analysis

### 10.3 Data Breach Response
1. Stop the breach immediately
2. Assess what data was affected
3. Notify users within 72 hours
4. Report to relevant authorities
5. Implement additional security measures

---

These rules and guidelines ensure that AuraShift is built with the highest standards of quality, security, user experience, and ethical responsibility. All team members must familiarize themselves with these guidelines and adhere to them throughout the development process.