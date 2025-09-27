# AuraShift - Quit Smoking & Wellness App

## 📋 Project Overview

AuraShift is a comprehensive quit-smoking and wellness companion app built with React Native Expo and Firebase. The app gamifies the quit-smoking journey through a sophisticated scoring system, real-time progress tracking, AI-powered coaching, and a supportive user experience focused on holistic lifestyle improvement.

### 🎯 Core Mission
Transform the difficult journey of quitting smoking into an engaging, rewarding, and positive experience that motivates users through data-driven insights, positive reinforcement, and holistic wellness tracking including gym activities, healthy eating, skincare routines, and lifestyle events.

## 🚀 Key Features & Functionality

### Core Features (MVP)
1. **Smoke-Free Timer**: Real-time tracking with precision down to seconds, displayed as Days:Hours:Minutes:Seconds
2. **"I Smoked" Button**: Resets timer, logs cigarette activity, deducts 10 points from Aura score
3. **Activity Logging System**: Comprehensive tracking with Aura Score gamification
   - Cigarette: -10 points 🚬
   - Gym/Workout: +5 points 💪
   - Healthy Meal: +3 points 🥗
   - Skincare Routine: +2 points ✨
   - Event/Social: 0 points (for context)
   - Automatic +10 points for every 24-hour smoke-free period
4. **User Onboarding**: Personalized setup collecting name, email, password, smoking history (years smoked, cigarettes per day)
5. **Calendar View**: Interactive calendar showing daily activities with visual indicators
6. **Smart Notifications**: 
   - Hourly (8:00, 9:00, etc.): Custom message "abc"
   - Half-hourly (8:30, 9:30, etc.): Custom message "xyz"
7. **Progress Dashboard**: Real-time insights and motivation with Aura score display

### Advanced Features
1. **AI Coaching (ChatGPT Integration)**: 
   - Personalized support using user's onboarding data and current progress
   - Daily feedback based on activities and progress
   - Craving support and coping mechanisms
   - Projection analysis and goal setting
2. **Advanced Analytics**: 
   - Progress graphs and trend analysis
   - Financial savings calculator
   - Health milestone tracking
   - Projected skin health improvements
3. **Health Milestones**: Science-backed recovery timeline with referenced research
4. **Calorie & Wellness Tracking**: Integration with food database for comprehensive health tracking
5. **Community Foundation**: Anonymous support and sharing (future feature)
6. **Offline Capability**: Full functionality without internet connection

## 🛠 Technology Stack

### Frontend
- **Framework**: React Native with Expo (managed workflow)
- **Language**: TypeScript for type safety
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **State Management**: Redux Toolkit with RTK Query
- **Navigation**: React Navigation v6
- **Charts**: Victory Native for data visualization
- **Testing**: Jest, React Native Testing Library, Detox

### Backend
- **Platform**: Firebase (comprehensive BaaS solution)
- **Database**: Cloud Firestore (NoSQL document database)
- **Authentication**: Firebase Auth with custom claims
- **Functions**: Firebase Cloud Functions (serverless compute)
- **Notifications**: Firebase Cloud Messaging (FCM)
- **Analytics**: Firebase Analytics + Custom tracking
- **Storage**: Firebase Storage for media assets

### Additional Services
- **AI Integration**: OpenAI API (ChatGPT) for coaching features
- **Monitoring**: Firebase Crashlytics & Performance Monitoring
- **CI/CD**: GitHub Actions with automated testing
- **Development**: Firebase Emulators for local development

## 📊 Data Architecture

### User Profile Structure
```typescript
interface UserProfile {
  id: string;
  displayName: string;
  email: string;
  smokingHistory: {
    yearsSmoked: number;
    cigarettesPerDay: number;
    costPerPack: number;
    motivations: string[];
  };
  auraScore: number;
  streakStartTime: Date;
  lastSmoked?: Date;
  onboardingCompleted: boolean;
  notificationPreferences: {
    hourlyEnabled: boolean;
    halfHourlyEnabled: boolean;
    quietHoursStart: string;
    quietHoursEnd: string;
    customMessages: {
      hourly: string;
      halfHourly: string;
    };
  };
  createdAt: Date;
  updatedAt: Date;
}
```

### Activity Tracking System
```typescript
interface Activity {
  id: string;
  userId: string;
  type: 'cigarette' | 'gym' | 'healthy_meal' | 'skincare' | 'event_social';
  points: number;
  timestamp: Date;
  notes?: string;
  location?: string;
  mood?: string;
  context?: string; // What triggered this activity
}
```

## 🎮 Gamification System - Aura Score

### Scoring Mechanics
- **Positive Activities**: 
  - Gym/Workout: +5 points
  - Healthy Meal: +3 points
  - Skincare Routine: +2 points
- **Milestone Bonuses**: 
  - 24-hour smoke-free streak: +10 automatic bonus
  - Weekly streaks: Additional bonus multipliers
- **Negative Impact**: 
  - Cigarette logging: -10 points
- **Achievement Multipliers**: Bonus points for special accomplishments

### Achievement Categories
- **Streaks**: Time-based smoke-free achievements (24h, 48h, 1 week, 1 month, etc.)
- **Activities**: Behavior-based accomplishments (gym streaks, healthy eating, etc.)
- **Health**: Medical milestone celebrations (improved lung function, etc.)
- **Financial**: Money-saving achievements
- **Social**: Community engagement rewards (future)
- **Special**: Limited-time and seasonal achievements

## 📱 User Experience Flow

### Onboarding Journey
1. **Welcome Screen**: Introduction to AuraShift concept
2. **Registration**: Name, email, password collection
3. **Smoking Assessment**: Years smoked, cigarettes per day, cost analysis
4. **Motivation Selection**: Personal reasons for quitting
5. **Goal Setting**: Initial targets and preferences
6. **Notification Setup**: Permission and customization
7. **Dashboard Introduction**: Feature walkthrough

### Main App Navigation
1. **Home Tab**: 
   - Smoke-free timer (prominent display)
   - "I Smoked" button with confirmation
   - Current Aura score
   - Quick activity logging buttons
   - Daily progress summary
2. **Calendar Tab**:
   - Monthly calendar view with activity indicators
   - Day detail view with activity timeline
   - Activity editing and management
3. **Progress Tab**:
   - Charts and analytics
   - Health milestones
   - Financial savings
   - Achievement gallery
4. **AI Coach Tab**:
   - Chat interface with AI
   - Daily insights and feedback
   - Craving support
   - Progress projections
5. **Profile Tab**:
   - User settings and preferences
   - Notification management
   - Data export/import
   - Account management

## 🔔 Notification System

### Scheduled Notifications
- **Hourly Notifications** (8:00, 9:00, 10:00, etc.):
  - Default message: "abc" (user customizable)
  - Contextual content based on current streak
  - Motivational reminders
- **Half-hourly Notifications** (8:30, 9:30, 10:30, etc.):
  - Default message: "xyz" (user customizable)
  - Progress updates and encouragement
  - Activity suggestions

### Smart Features
- Quiet hours respect (user-defined)
- Context-aware messaging
- Streak milestone celebrations
- Emergency craving support
- Achievement unlock notifications

## 🤖 AI Integration Features

### Personalized Coaching
- **Daily Feedback**: Analysis of user's activities and progress
- **Contextual Support**: Responses based on current situation and history
- **Craving Management**: Immediate support during difficult moments
- **Progress Insights**: Data-driven observations and recommendations
- **Goal Adjustment**: Dynamic goal setting based on progress patterns

### AI Context Data
- User's onboarding information (smoking history, motivations)
- Current progress metrics (streak length, Aura score, recent activities)
- Historical patterns and trends
- Recent challenges and successes
- Personal preferences and goals

## 📈 Analytics & Insights

### Progress Tracking
- **Aura Score Trends**: Daily, weekly, monthly progression
- **Activity Patterns**: Most common activities, timing, success factors
- **Streak Analysis**: Length trends, relapse patterns, recovery time
- **Financial Impact**: Money saved, cost avoidance calculations
- **Health Milestones**: Science-based recovery timeline tracking

### Predictive Analytics
- **Success Probability**: Based on current patterns and historical data
- **Risk Assessment**: Identifying potential relapse triggers
- **Optimal Timing**: Best times for activities and interventions
- **Goal Achievement**: Projected timeline for reaching milestones

## 🔒 Privacy & Security

### Data Protection
- **Encryption**: All sensitive data encrypted at rest and in transit
- **Access Control**: Strict Firestore security rules
- **GDPR Compliance**: Full user data control (view, export, delete)
- **Consent Management**: Granular permissions for different data types
- **Audit Logging**: Complete access history for compliance

### User Privacy Rights
- Right to access personal data
- Right to rectification (data correction)
- Right to erasure (account deletion)
- Right to data portability (export functionality)
- Right to restrict processing
- Right to object to data processing

## 🎨 Design System

### Color Palette & Themes
- **Primary Colors**: Calming gradients (darkblues, lightblues, white/black)
- **Accent Colors**: Motivational highlights (gold, green for achievements)
- **Dark Mode**: Full support with automatic system detection
- **Accessibility**: WCAG 2.1 AA compliance

### Typography & Layout
- **Clear Hierarchy**: Excellent readability across all screen sizes
- **Consistent Spacing**: Design token system for uniformity
- **Intuitive Navigation**: Tab-based structure with clear visual cues
- **Micro-interactions**: Subtle, purposeful animations for engagement

## 📅 Development Phases

### Phase 1: MVP Foundation (6-8 weeks)
- Core user authentication and onboarding
- Smoke-free timer and "I Smoked" functionality with a timer (realtime, localstorage for now)
- Basic activity logging with Aura score calculation
- Modern dashboard and calendar view
- Firebase backend setup
- Basic notification system

### Phase 2: Enhanced Features (4-6 weeks)
- Complete achievement and gamification system
- Advanced progress analytics with charts
- Smart notification system with customization
- Performance optimization
- Comprehensive testing

### Phase 3: AI & Advanced Analytics (4-5 weeks)
- OpenAI integration for personalized coaching
- Predictive analytics and insights
- Advanced health milestone tracking
- Community features foundation
- Performance optimization

### Phase 4: Launch Preparation (2-3 weeks)
- Comprehensive testing and quality assurance
- App store submission preparation
- Launch strategy execution
- Monitoring and support systems setup

## 🎯 Success Metrics

### User Engagement
- User retention rate > 60% after 30 days
- Daily active users growth > 10% month-over-month
- Average session duration > 3 minutes
- Achievement unlock rate > 80%
- Notification engagement rate > 40%

### App Quality
- App store rating > 4.5 stars
- Crash rate < 1% of sessions
- App loading time < 2 seconds
- Offline functionality success rate > 95%
- AI response satisfaction > 85%

### Business Objectives
- 10,000+ downloads within first 3 months
- 1,000+ daily active users within 6 months
- Premium conversion rate > 5% (future monetization)
- User-generated content engagement > 30%
- Average user streak length > 7 days

## 🔮 Future Enhancements

### Short-term (3-6 months post-launch)
- Premium subscription tier with advanced AI features
- Integration with popular health apps (Apple Health, Google Fit)
- Multi-language support for international expansion
- Advanced AI coaching with conversation memory
- Social sharing and support groups

### Medium-term (6-12 months)
- Full community features with user groups
- Web application version for desktop access
- Telehealth integration for professional support
- Advanced predictive analytics and machine learning
- Wearable device integration

### Long-term (12+ months)
- Clinical research partnerships for data insights
- Corporate wellness program integration
- Advanced AI with voice interaction
- Global expansion with localized content
- Integration with smoking cessation programs

---

This comprehensive overview provides the foundation for building AuraShift from concept to successful launch, with clear specifications, implementation guidelines, and success criteria to ensure the final product meets the highest standards of quality, user experience, and business success.

**Ready to help people quit smoking and transform their lives? Let's build AuraShift! 🌟**
