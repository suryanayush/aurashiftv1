# AuraShift User Flow Documentation

## 1. User Journey Overview

### Primary User Personas

**Primary Persona: Sarah (28, Office Worker)**
- Smokes 10-15 cigarettes/day for 5+ years
- Tech-savvy, uses fitness apps
- Motivated by data and visual progress
- Previous quit attempts failed after 2-3 weeks
- Values community support and positive reinforcement

**Secondary Persona: Mike (35, Construction Worker)**
- Smokes 1+ pack/day for 15+ years
- Moderate tech user, prefers simple interfaces
- Motivated by financial savings
- Concerned about health impact on family
- Needs immediate support during cravings

## 2. Critical User Flows

### Flow 1: First-Time User Onboarding
```
Start → App Download → Welcome → Registration → Assessment → Setup → Dashboard
```

**Detailed Flow:**
1. **App Store Landing**
   - User discovers app through search/recommendation
   - Reads description emphasizing positive, supportive approach
   - Downloads and opens app

2. **Welcome Screen**
   ```
   ┌─────────────────────────────────┐
   │ AuraShift Logo                  │
   │                                 │
   │ "Transform your life,           │
   │  one smoke-free hour at a time" │
   │                                 │
   │ [Get Started] [I Have Account]  │
   └─────────────────────────────────┘
   ```
   - Compelling value proposition
   - Social proof (testimonials/stats)
   - Clear primary action

3. **Registration Screen**
   ```
   ┌─────────────────────────────────┐
   │ ← Back                          │
   │                                 │
   │ Create Your Account             │
   │                                 │
   │ [Name Input Field]              │
   │ [Email Input Field]             │
   │ [Password Input Field]          │
   │ [Confirm Password]              │
   │                                 │
   │ □ I agree to Terms & Privacy    │
   │                                 │
   │ [Create Account]                │
   │                                 │
   │ Already have an account? Login  │
   └─────────────────────────────────┘
   ```

4. **Smoking History Assessment**
   ```
   ┌─────────────────────────────────┐
   │ Step 1 of 4                     │
   │ ████████░░░░░░░░░░░░░░░░░░░░░░░ │
   │                                 │
   │ Let's understand your habits    │
   │                                 │
   │ How long have you been smoking? │
   │ ┌─────┬─────┬─────┬─────┬─────┐ │
   │ │ <1  │ 1-3 │ 4-7 │ 8-15│ 15+ │ │
   │ │ year│years│years│years│years│ │
   │ └─────┴─────┴─────┴─────┴─────┘ │
   │                                 │
   │ How many cigarettes per day?    │
   │ [Number Input: ___ cigarettes]  │
   │                                 │
   │ [Continue]                      │
   └─────────────────────────────────┘
   ```

5. **Goals & Motivation Setup**
   ```
   ┌─────────────────────────────────┐
   │ Step 2 of 4                     │
   │ ████████████░░░░░░░░░░░░░░░░░░░ │
   │                                 │
   │ What motivates you most?        │
   │                                 │
   │ □ Better health                 │
   │ □ Save money                    │
   │ □ Family/relationships          │
   │ □ Physical fitness              │
   │ □ Appearance (skin, teeth)      │
   │ □ Mental clarity               │
   │ □ Breaking addiction           │
   │                                 │
   │ [Continue]                      │
   └─────────────────────────────────┘
   ```

6. **Notification Permissions**
   ```
   ┌─────────────────────────────────┐
   │ Step 3 of 4                     │
   │ ████████████████░░░░░░░░░░░░░░░ │
   │                                 │
   │ 🔔 Stay Motivated               │
   │                                 │
   │ Get gentle reminders and        │
   │ encouragement throughout your   │
   │ journey. You can customize      │
   │ these later.                    │
   │                                 │
   │ [Enable Notifications]          │
   │ [Maybe Later]                   │
   └─────────────────────────────────┘
   ```

7. **Timer Initialization**
   ```
   ┌─────────────────────────────────┐
   │ Step 4 of 4                     │
   │ ████████████████████████████░░░ │
   │                                 │
   │ When did you last smoke?        │
   │                                 │
   │ ○ Right now (starting fresh)    │
   │ ○ A few hours ago              │
   │ ○ Yesterday                    │
   │ ○ Custom time/date             │
   │                                 │
   │ [Start My Journey]              │
   └─────────────────────────────────┘
   ```

### Flow 2: Daily Usage - Successful Day
```
App Open → Dashboard → Activity Logging → Achievement → Progress Review
```

**Detailed Flow:**
1. **App Launch**
   - Quick splash screen with current streak
   - Smooth transition to dashboard
   - Display any earned badges/milestones

2. **Dashboard Review**
   ```
   ┌─────────────────────────────────┐
   │ Good morning, Sarah! ☀️         │
   │                                 │
   │ Smoke-Free Timer                │
   │ ┌─────────────────────────────┐ │
   │ │      03:14:27:43            │ │
   │ │   Days Hours Mins Secs      │ │
   │ └─────────────────────────────┘ │
   │                                 │
   │ Today's Aura Score: 15 ⚡       │
   │ ┌─────┬─────┬─────┬─────┬─────┐ │
   │ │💪   │🥗   │✨   │💧   │🧘   │ │
   │ │Gym  │Meal │Skin │H2O  │Calm │ │
   │ │ +5  │ +3  │ +2  │ +2  │ +3  │ │
   │ └─────┴─────┴─────┴─────┴─────┘ │
   │                                 │
   │ [I Had a Cigarette]             │
   │ [Quick Log Activity]            │
   └─────────────────────────────────┘
   ```

3. **Activity Logging**
   ```
   ┌─────────────────────────────────┐
   │ ← Back     Quick Log Activity   │
   │                                 │
   │ What did you do?                │
   │                                 │
   │ ┌─────┬─────┬─────┬─────┬─────┐ │
   │ │💪   │🥗   │✨   │💧   │🧘   │ │
   │ │Gym  │Meal │Skin │H2O  │Calm │ │
   │ │ +5  │ +3  │ +2  │ +2  │ +3  │ │
   │ └─────┴─────┴─────┴─────┴─────┘ │
   │                                 │
   │ Selected: Gym Workout (+5)      │
   │                                 │
   │ Add a note (optional):          │
   │ [Text input...]                 │
   │                                 │
   │ [Log Activity]                  │
   └─────────────────────────────────┘
   ```

4. **Achievement Celebration**
   ```
   ┌─────────────────────────────────┐
   │                                 │
   │           🏆                    │
   │                                 │
   │    Achievement Unlocked!        │
   │                                 │
   │   "Fitness Enthusiast"          │
   │                                 │
   │   5 gym sessions this week      │
   │                                 │
   │   Aura Score: +10 Bonus!        │
   │                                 │
   │        [Awesome!]               │
   └─────────────────────────────────┘
   ```

### Flow 3: Relapse Handling (Critical Flow)
```
Craving → Support → Decision Point → [Recovery OR Relapse] → Re-engagement
```

**Detailed Flow:**
1. **Craving State**
   - User opens app during a difficult moment
   - Dashboard shows current progress (motivation)
   - Immediate access to support tools

2. **Immediate Support Options**
   ```
   ┌─────────────────────────────────┐
   │ ⚠️ Need Support?                 │
   │                                 │
   │ You've got this! Try one of:    │
   │                                 │
   │ 🫁 [4-7-8 Breathing Exercise]   │
   │ 🏃 [Quick 2-Min Walk]           │
   │ 💰 [See Money Saved: $127]      │
   │ 📞 [Call Support Buddy]         │
   │ 💬 [Chat with AuraAI]           │
   │                                 │
   │ Still struggling?               │
   │ [I had a cigarette]             │
   └─────────────────────────────────┘
   ```

3. **Relapse Confirmation**
   ```
   ┌─────────────────────────────────┐
   │ We understand - it happens      │
   │                                 │
   │ Before we reset your timer,     │
   │ you were smoke-free for:        │
   │                                 │
   │      03:14:27:43                │
   │   Days Hours Mins Secs          │
   │                                 │
   │ That's incredible progress!     │
   │                                 │
   │ What triggered this moment?     │
   │ ○ Stress at work               │
   │ ○ Social situation             │
   │ ○ Boredom                      │
   │ ○ After meal                   │
   │ ○ Other                        │
   │                                 │
   │ [Reset & Start Fresh] [Cancel]  │
   └─────────────────────────────────┘
   ```

4. **Post-Relapse Recovery**
   ```
   ┌─────────────────────────────────┐
   │ Your new journey starts now     │
   │                                 │
   │        00:00:00:01              │
   │     Days Hours Mins Secs        │
   │                                 │
   │ Remember:                       │
   │ • You quit for 3+ days before   │
   │ • Each attempt teaches you      │
   │ • Your body is already healing  │
   │                                 │
   │ Let's plan for next time:       │
   │ [Set Trigger Alert] [Add Coping Strategy] │
   │                                 │
   │ [Continue to Dashboard]         │
   └─────────────────────────────────┘
   ```

### Flow 4: Progress Review & Insights
```
Dashboard → Progress Tab → Detailed Analytics → Goal Adjustment
```

**Detailed Flow:**
1. **Progress Dashboard**
   ```
   ┌─────────────────────────────────┐
   │ 📊 Your Progress               │
   │                                 │
   │ This Week Summary:              │
   │ ✅ 4 smoke-free days            │
   │ ⚡ 67 total Aura points         │
   │ 💰 $28 saved                    │
   │ 🫁 18 cigarettes avoided        │
   │                                 │
   │ [Week View] [Month View] [All]  │
   │                                 │
   │ ┌─────────────────────────────┐ │
   │ │    Aura Score Trend         │ │
   │ │     /\    /\               │ │
   │ │    /  \  /  \              │ │
   │ │   /    \/    \             │ │
   │ │  /           \             │ │
   │ └─────────────────────────────┘ │
   │                                 │
   │ [Detailed Analytics]            │
   └─────────────────────────────────┘
   ```

## 3. Edge Cases & Error Flows

### Network Connectivity Issues
```
Action Attempt → Network Check → [Online: Sync] → [Offline: Queue] → Retry Logic
```

### App Crash Recovery
```
App Crash → Restart → State Recovery → Data Validation → User Notification
```

### Notification Handling
```
Notification Received → App State Check → [Background: Quick Action] → [Foreground: Navigate]
```

## 4. Accessibility User Flows

### Screen Reader Navigation
```
App Launch → Voice Announcement → Sequential Navigation → Action Confirmation
```

### Voice Control Usage
```
Voice Command → Intent Recognition → Action Execution → Audio Feedback
```

## 5. Flow Optimization Principles

### Reduce Friction
- Minimize taps required for common actions
- Pre-fill forms with intelligent defaults
- Provide quick shortcuts for power users

### Progressive Enhancement
- Core functionality works without premium features
- Advanced features unlock naturally through usage
- Learning curve is gentle and guided

### Error Prevention
- Validate inputs in real-time
- Confirm destructive actions
- Provide clear undo mechanisms

### Motivation Maintenance
- Celebrate small wins immediately
- Show progress even during setbacks
- Provide context for why actions matter

This comprehensive user flow documentation ensures every interaction in AuraShift is purposeful, supportive, and optimized for user success in their quit-smoking journey.