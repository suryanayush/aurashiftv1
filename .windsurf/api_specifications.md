# AuraShift API Specifications

## 1. API Architecture Overview

### 1.1 API Design Principles
- **RESTful Design**: Follow REST conventions for HTTP endpoints
- **GraphQL for Complex Queries**: Use GraphQL for complex data fetching
- **Real-time Updates**: WebSocket/Firebase listeners for live data
- **Stateless**: Each request contains all necessary information
- **Versioned**: API versioning for backward compatibility
- **Secure**: Authentication and authorization on all endpoints

### 1.2 Technology Stack
- **Backend**: Firebase Cloud Functions (Node.js/TypeScript)
- **Database**: Cloud Firestore (NoSQL)
- **Authentication**: Firebase Auth
- **Real-time**: Firestore listeners
- **External APIs**: OpenAI GPT-4, FCM
- **File Storage**: Firebase Storage

### 1.3 API Base URLs
```
Development: https://us-central1-aurashift-dev.cloudfunctions.net/api
Staging: https://us-central1-aurashift-staging.cloudfunctions.net/api
Production: https://us-central1-aurashift-prod.cloudfunctions.net/api
```

## 2. Authentication & Authorization

### 2.1 Authentication Flow
```typescript
// Firebase Auth Token
interface AuthToken {
  uid: string;
  email: string;
  email_verified: boolean;
  iat: number;
  exp: number;
}

// Request Headers
{
  "Authorization": "Bearer <firebase-id-token>",
  "Content-Type": "application/json",
  "X-Client-Version": "1.0.0"
}
```

### 2.2 Authorization Levels
- **Public**: No authentication required
- **User**: Authenticated user, access to own data only
- **Admin**: Administrative access (future feature)
- **System**: Internal system calls only

## 3. Core API Endpoints

### 3.1 User Management

#### Create User Profile
```http
POST /api/v1/users/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "displayName": "John Doe",
  "smokingHistory": {
    "yearsSmoked": 5,
    "cigarettesPerDay": 10,
    "costPerPack": 12.50,
    "motivations": ["health", "family", "financial"]
  },
  "notificationPreferences": {
    "hourlyEnabled": true,
    "halfHourlyEnabled": true,
    "customMessages": {
      "hourly": "Stay strong! 💪",
      "halfHourly": "You're doing great! 🌟"
    },
    "quietHours": {
      "enabled": true,
      "startTime": "22:00",
      "endTime": "08:00"
    }
  }
}

Response: 201 Created
{
  "success": true,
  "data": {
    "id": "user-123",
    "displayName": "John Doe",
    "auraScore": 0,
    "level": 1,
    "streakStartTime": "2024-01-01T10:00:00Z",
    "onboardingCompleted": true,
    "createdAt": "2024-01-01T10:00:00Z"
  }
}
```

#### Get User Profile
```http
GET /api/v1/users/profile
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "data": {
    "id": "user-123",
    "displayName": "John Doe",
    "email": "john@example.com",
    "auraScore": 150,
    "level": 2,
    "streakStartTime": "2024-01-01T10:00:00Z",
    "lastSmoked": null,
    "smokingHistory": {
      "yearsSmoked": 5,
      "cigarettesPerDay": 10,
      "costPerPack": 12.50,
      "motivations": ["health", "family"]
    },
    "onboardingCompleted": true,
    "createdAt": "2024-01-01T10:00:00Z",
    "updatedAt": "2024-01-15T14:30:00Z"
  }
}
```

#### Update User Profile
```http
PUT /api/v1/users/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "displayName": "John Smith",
  "notificationPreferences": {
    "hourlyEnabled": false,
    "customMessages": {
      "hourly": "Custom hourly message"
    }
  }
}

Response: 200 OK
{
  "success": true,
  "data": {
    "id": "user-123",
    "displayName": "John Smith",
    "updatedAt": "2024-01-15T15:00:00Z"
  }
}
```

### 3.2 Activity Management

#### Log Activity
```http
POST /api/v1/activities
Authorization: Bearer <token>
Content-Type: application/json

{
  "type": "gym",
  "notes": "30 minutes cardio workout",
  "mood": "motivated",
  "duration": 30,
  "metadata": {
    "workoutType": "cardio",
    "intensity": "moderate"
  }
}

Response: 201 Created
{
  "success": true,
  "data": {
    "id": "activity-456",
    "userId": "user-123",
    "type": "gym",
    "points": 5,
    "timestamp": "2024-01-15T16:00:00Z",
    "notes": "30 minutes cardio workout",
    "mood": "motivated",
    "duration": 30,
    "metadata": {
      "workoutType": "cardio",
      "intensity": "moderate"
    }
  },
  "auraScoreUpdate": {
    "previousScore": 150,
    "newScore": 155,
    "pointsEarned": 5
  }
}
```

#### Get User Activities
```http
GET /api/v1/activities?limit=50&offset=0&type=gym&startDate=2024-01-01&endDate=2024-01-31
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "data": {
    "activities": [
      {
        "id": "activity-456",
        "type": "gym",
        "points": 5,
        "timestamp": "2024-01-15T16:00:00Z",
        "notes": "30 minutes cardio workout",
        "mood": "motivated"
      }
    ],
    "pagination": {
      "total": 125,
      "limit": 50,
      "offset": 0,
      "hasMore": true
    },
    "summary": {
      "totalPoints": 75,
      "totalActivities": 25,
      "averagePointsPerDay": 2.5
    }
  }
}
```

#### Update Activity
```http
PUT /api/v1/activities/{activityId}
Authorization: Bearer <token>
Content-Type: application/json

{
  "notes": "Updated workout notes",
  "mood": "proud"
}

Response: 200 OK
{
  "success": true,
  "data": {
    "id": "activity-456",
    "notes": "Updated workout notes",
    "mood": "proud",
    "updatedAt": "2024-01-15T17:00:00Z"
  }
}
```

#### Delete Activity
```http
DELETE /api/v1/activities/{activityId}
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "message": "Activity deleted successfully",
  "auraScoreUpdate": {
    "previousScore": 155,
    "newScore": 150,
    "pointsDeducted": 5
  }
}
```

### 3.3 Timer Management

#### Reset Timer (I Smoked)
```http
POST /api/v1/timer/reset
Authorization: Bearer <token>
Content-Type: application/json

{
  "notes": "Stressful day at work",
  "mood": "disappointed",
  "triggers": ["stress", "work"]
}

Response: 200 OK
{
  "success": true,
  "data": {
    "newStreakStartTime": "2024-01-15T18:00:00Z",
    "previousStreakDuration": {
      "days": 14,
      "hours": 8,
      "minutes": 30,
      "totalHours": 344.5
    }
  },
  "auraScoreUpdate": {
    "previousScore": 155,
    "newScore": 145,
    "pointsDeducted": 10
  },
  "activityLogged": {
    "id": "activity-789",
    "type": "cigarette",
    "points": -10,
    "timestamp": "2024-01-15T18:00:00Z"
  }
}
```

#### Get Timer Status
```http
GET /api/v1/timer/status
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "data": {
    "streakStartTime": "2024-01-01T10:00:00Z",
    "currentTime": "2024-01-15T18:00:00Z",
    "duration": {
      "days": 14,
      "hours": 8,
      "minutes": 0,
      "seconds": 0,
      "totalSeconds": 1238400,
      "totalHours": 344,
      "formatted": "14d 8h 0m 0s"
    },
    "milestones": {
      "next": {
        "type": "15_days",
        "hoursRemaining": 16,
        "title": "15 Day Champion"
      },
      "recent": {
        "type": "2_weeks",
        "achievedAt": "2024-01-15T10:00:00Z",
        "title": "Two Week Warrior"
      }
    }
  }
}
```

### 3.4 Achievement System

#### Get User Achievements
```http
GET /api/v1/achievements?category=streak&status=unlocked
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "data": {
    "achievements": [
      {
        "id": "achievement-001",
        "title": "First 24 Hours",
        "description": "Completed your first 24 hours smoke-free",
        "category": "streak",
        "rarity": "common",
        "points": 25,
        "badge": "🏆",
        "unlockedAt": "2024-01-02T10:00:00Z",
        "progress": 1.0
      }
    ],
    "summary": {
      "totalUnlocked": 15,
      "totalAvailable": 50,
      "pointsEarned": 375,
      "nextAchievement": {
        "id": "achievement-015",
        "title": "One Month Master",
        "progress": 0.47,
        "daysRemaining": 16
      }
    }
  }
}
```

### 3.5 Analytics & Insights

#### Get Progress Analytics
```http
GET /api/v1/analytics/progress?period=30d&metrics=aura_score,activities,streak
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "data": {
    "period": {
      "startDate": "2023-12-16T00:00:00Z",
      "endDate": "2024-01-15T23:59:59Z",
      "days": 30
    },
    "metrics": {
      "auraScore": {
        "current": 155,
        "startValue": 50,
        "change": 105,
        "changePercent": 210,
        "trend": "increasing",
        "chartData": {
          "labels": ["Dec 16", "Dec 23", "Dec 30", "Jan 6", "Jan 13"],
          "values": [50, 75, 100, 125, 155]
        }
      },
      "activities": {
        "total": 45,
        "breakdown": {
          "gym": 12,
          "healthy_meal": 20,
          "skincare": 10,
          "event_social": 3
        },
        "averagePerDay": 1.5,
        "mostActiveDay": "2024-01-10T00:00:00Z"
      },
      "streak": {
        "current": {
          "days": 14,
          "hours": 8,
          "totalHours": 344
        },
        "longest": {
          "days": 21,
          "startDate": "2023-12-01T00:00:00Z",
          "endDate": "2023-12-22T00:00:00Z"
        },
        "totalStreakDays": 35
      }
    },
    "insights": [
      {
        "type": "positive",
        "title": "Great Progress!",
        "message": "Your Aura score has increased by 210% this month. Keep up the excellent work!"
      },
      {
        "type": "suggestion",
        "title": "Consistency Tip",
        "message": "You're most active on weekdays. Try scheduling weekend activities to maintain momentum."
      }
    ]
  }
}
```

#### Get Health Milestones
```http
GET /api/v1/analytics/health-milestones
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "data": {
    "milestones": [
      {
        "id": "milestone-001",
        "timeframe": "20 minutes",
        "title": "Heart Rate Normalizes",
        "description": "Your heart rate and blood pressure have returned to normal levels",
        "benefits": [
          "Reduced heart rate",
          "Lower blood pressure",
          "Improved circulation"
        ],
        "scientificSource": "American Heart Association, 2023",
        "achieved": true,
        "achievedAt": "2024-01-01T10:20:00Z",
        "category": "immediate"
      },
      {
        "id": "milestone-015",
        "timeframe": "1 year",
        "title": "Heart Disease Risk Halved",
        "description": "Your risk of coronary heart disease is now half that of a smoker",
        "benefits": [
          "50% reduced heart disease risk",
          "Improved cardiovascular health",
          "Better exercise tolerance"
        ],
        "scientificSource": "WHO Tobacco Control Guidelines, 2023",
        "achieved": false,
        "estimatedDate": "2025-01-01T10:00:00Z",
        "progress": 0.04,
        "category": "long_term"
      }
    ],
    "summary": {
      "totalAchieved": 8,
      "totalMilestones": 15,
      "nextMilestone": {
        "timeframe": "1 month",
        "daysRemaining": 16,
        "title": "Lung Function Improves"
      }
    }
  }
}
```

### 3.6 AI Coaching Integration

#### Generate AI Response
```http
POST /api/v1/ai/chat
Authorization: Bearer <token>
Content-Type: application/json

{
  "message": "I'm having strong cravings today. What should I do?",
  "context": {
    "mood": "anxious",
    "location": "work",
    "triggers": ["stress", "coworkers_smoking"]
  }
}

Response: 200 OK
{
  "success": true,
  "data": {
    "response": "I understand you're experiencing strong cravings, especially in a stressful work environment. Based on your 14-day streak and 155 Aura score, you've already proven your strength! Here are some immediate strategies:\n\n1. Take 5 deep breaths - this activates your parasympathetic nervous system\n2. Step away from the smoking area for 10 minutes\n3. Remember your motivations: health and family\n4. Consider that you've already saved $70 by not smoking\n\nYou've got this! Your body is healing every minute you stay smoke-free.",
    "suggestions": [
      {
        "type": "breathing_exercise",
        "title": "4-7-8 Breathing",
        "description": "Inhale for 4, hold for 7, exhale for 8"
      },
      {
        "type": "activity",
        "title": "Quick Walk",
        "description": "Take a 5-minute walk to change your environment"
      }
    ],
    "encouragement": {
      "streakReminder": "You're 14 days smoke-free - that's incredible progress!",
      "moneySaved": "$70.00",
      "healthBenefit": "Your lung function has already started improving"
    }
  },
  "conversationId": "conv-789",
  "usage": {
    "tokensUsed": 245,
    "remainingQuota": 755
  }
}
```

#### Get AI Conversation History
```http
GET /api/v1/ai/conversations?limit=20&offset=0
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "data": {
    "conversations": [
      {
        "id": "conv-789",
        "userMessage": "I'm having strong cravings today. What should I do?",
        "aiResponse": "I understand you're experiencing strong cravings...",
        "timestamp": "2024-01-15T18:30:00Z",
        "context": {
          "auraScore": 155,
          "streakHours": 344,
          "mood": "anxious"
        }
      }
    ],
    "pagination": {
      "total": 45,
      "limit": 20,
      "offset": 0,
      "hasMore": true
    }
  }
}
```

### 3.7 Notification Management

#### Schedule Notifications
```http
POST /api/v1/notifications/schedule
Authorization: Bearer <token>
Content-Type: application/json

{
  "preferences": {
    "hourlyEnabled": true,
    "halfHourlyEnabled": true,
    "customMessages": {
      "hourly": "Stay strong! You've got this! 💪",
      "halfHourly": "Every moment smoke-free is a victory! 🌟"
    },
    "quietHours": {
      "enabled": true,
      "startTime": "22:00",
      "endTime": "08:00"
    }
  },
  "fcmToken": "fcm-token-123"
}

Response: 200 OK
{
  "success": true,
  "data": {
    "scheduledNotifications": 30,
    "nextNotification": {
      "type": "hourly",
      "scheduledTime": "2024-01-15T19:00:00Z",
      "message": "Stay strong! You've got this! 💪"
    }
  }
}
```

#### Send Emergency Support Notification
```http
POST /api/v1/notifications/emergency-support
Authorization: Bearer <token>
Content-Type: application/json

{
  "type": "craving_support",
  "urgency": "high",
  "context": {
    "location": "work",
    "mood": "anxious",
    "triggers": ["stress"]
  }
}

Response: 200 OK
{
  "success": true,
  "data": {
    "notificationSent": true,
    "supportResources": [
      {
        "type": "breathing_exercise",
        "title": "Immediate Calm",
        "action": "Start 4-7-8 breathing exercise"
      },
      {
        "type": "distraction",
        "title": "5-Minute Break",
        "action": "Take a quick walk or call a friend"
      }
    ]
  }
}
```

## 4. Error Handling

### 4.1 Error Response Format
```typescript
interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
    timestamp: string;
    requestId: string;
  };
}

// Example Error Response
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid activity type provided",
    "details": {
      "field": "type",
      "value": "invalid_type",
      "allowedValues": ["cigarette", "gym", "healthy_meal", "skincare", "event_social"]
    },
    "timestamp": "2024-01-15T18:45:00Z",
    "requestId": "req-abc123"
  }
}
```

### 4.2 HTTP Status Codes
- `200 OK`: Successful request
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Access denied
- `404 Not Found`: Resource not found
- `409 Conflict`: Resource conflict
- `422 Unprocessable Entity`: Validation error
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error
- `503 Service Unavailable`: Service temporarily unavailable

### 4.3 Common Error Codes
```typescript
enum ErrorCodes {
  // Authentication
  UNAUTHORIZED = 'UNAUTHORIZED',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  INVALID_TOKEN = 'INVALID_TOKEN',
  
  // Validation
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  MISSING_REQUIRED_FIELD = 'MISSING_REQUIRED_FIELD',
  INVALID_DATA_TYPE = 'INVALID_DATA_TYPE',
  
  // Business Logic
  ACTIVITY_NOT_FOUND = 'ACTIVITY_NOT_FOUND',
  CANNOT_EDIT_OLD_ACTIVITY = 'CANNOT_EDIT_OLD_ACTIVITY',
  INVALID_ACTIVITY_TYPE = 'INVALID_ACTIVITY_TYPE',
  
  // Rate Limiting
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  AI_QUOTA_EXCEEDED = 'AI_QUOTA_EXCEEDED',
  
  // System
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  DATABASE_ERROR = 'DATABASE_ERROR'
}
```

## 5. Rate Limiting

### 5.1 Rate Limit Rules
```typescript
interface RateLimits {
  // General API calls
  general: {
    requests: 1000;
    window: '1h';
  };
  
  // AI chat requests
  aiChat: {
    requests: 50;
    window: '1h';
  };
  
  // Activity logging
  activityLogging: {
    requests: 100;
    window: '1h';
  };
  
  // Notification requests
  notifications: {
    requests: 10;
    window: '1h';
  };
}
```

### 5.2 Rate Limit Headers
```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1642262400
X-RateLimit-Window: 3600
```

## 6. Webhooks & Real-time Updates

### 6.1 Firestore Listeners
```typescript
// Real-time activity updates
const unsubscribe = firestore
  .collection('activities')
  .where('userId', '==', currentUserId)
  .orderBy('timestamp', 'desc')
  .limit(50)
  .onSnapshot((snapshot) => {
    const activities = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    updateActivitiesInState(activities);
  });
```

### 6.2 Achievement Notifications
```typescript
// Listen for achievement unlocks
const unsubscribeAchievements = firestore
  .collection('user_achievements')
  .doc(currentUserId)
  .onSnapshot((doc) => {
    const achievements = doc.data()?.achievements || [];
    const newAchievements = achievements.filter(a => 
      !previousAchievements.includes(a.id)
    );
    
    if (newAchievements.length > 0) {
      showAchievementUnlockedNotification(newAchievements);
    }
  });
```

## 7. API Versioning

### 7.1 Versioning Strategy
- **URL Versioning**: `/api/v1/`, `/api/v2/`
- **Backward Compatibility**: Maintain previous versions for 12 months
- **Deprecation Warnings**: Include deprecation headers
- **Migration Guides**: Provide clear upgrade paths

### 7.2 Version Headers
```http
API-Version: 1.0
X-Deprecated-Version: false
X-Sunset-Date: null
```

## 8. Security Considerations

### 8.1 Input Validation
- Validate all input parameters
- Sanitize user-generated content
- Use parameterized queries
- Implement request size limits

### 8.2 Authentication Security
- Use Firebase Auth tokens
- Implement token refresh logic
- Validate token on every request
- Log security events

### 8.3 Data Privacy
- Encrypt sensitive data at rest
- Use HTTPS for all communications
- Implement proper CORS policies
- Follow GDPR requirements

This comprehensive API specification provides the foundation for building AuraShift's backend services with proper security, scalability, and maintainability.
