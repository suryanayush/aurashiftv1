# AuraShift UI/UX Design Guidelines

## 1. Design Philosophy

### Core Principles
- **Positive Reinforcement**: Every interaction should feel rewarding and encouraging
- **Clarity & Simplicity**: Users should never be confused about what to do next
- **Emotional Connection**: The app should feel like a supportive companion, not a clinical tool
- **Progressive Disclosure**: Show information when users need it, avoid overwhelming them
- **Accessibility First**: Design for all users, including those with disabilities

### Visual Identity
The AuraShift brand represents transformation, wellness, and empowerment. The visual language should convey:
- **Calm & Serenity**: Through soft gradients and gentle animations
- **Growth & Progress**: Through upward visual patterns and positive imagery
- **Energy & Vitality**: Through vibrant accent colors and dynamic elements
- **Trust & Reliability**: Through consistent patterns and professional polish

## 2. Color System

### Primary Palette
```css
/* Primary Brand Colors */
--aura-blue-50: #EEF7FF;
--aura-blue-100: #D9ECFF;
--aura-blue-200: #BCDCff;
--aura-blue-500: #2563EB;
--aura-blue-600: #1D4ED8;
--aura-blue-700: #1E40AF;
--aura-blue-900: #1E3A8A;

/* Secondary Wellness Colors */
--aura-green-50: #ECFDF5;
--aura-green-100: #D1FAE5;
--aura-green-500: #10B981;
--aura-green-600: #059669;

--aura-purple-50: #F3F0FF;
--aura-purple-100: #E5DEFF;
--aura-purple-500: #8B5CF6;
--aura-purple-600: #7C3AED;
```

### Semantic Colors
```css
/* Success States */
--success-light: #ECFDF5;
--success-main: #10B981;
--success-dark: #059669;

/* Warning States */
--warning-light: #FFFBEB;
--warning-main: #F59E0B;
--warning-dark: #D97706;

/* Error States */
--error-light: #FEF2F2;
--error-main: #EF4444;
--error-dark: #DC2626;

/* Neutral Grays */
--gray-50: #F9FAFB;
--gray-100: #F3F4F6;
--gray-200: #E5E7EB;
--gray-400: #9CA3AF;
--gray-500: #6B7280;
--gray-700: #374151;
--gray-900: #111827;
```

### Color Usage Guidelines
- **Primary Blue**: Main actions, navigation, branding
- **Success Green**: Positive achievements, progress indicators
- **Purple**: Premium features, special moments
- **Warning Orange**: Caution states, moderate alerts
- **Error Red**: Destructive actions, critical alerts
- **Neutral Grays**: Text, backgrounds, inactive states

## 3. Typography System

### Font Hierarchy
```typescript
const typography = {
  // Display Text - Hero sections, major headlines
  display: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '700',
    letterSpacing: -0.5,
  },

  // Headings - Section titles, screen headers
  h1: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: '600',
    letterSpacing: -0.3,
  },

  h2: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '600',
    letterSpacing: -0.2,
  },

  h3: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '500',
  },

  // Body Text
  body: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
  },

  bodySmall: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
  },

  // UI Elements
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  button: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '600',
  },
};
```

### Typography Guidelines
- **Readability**: Ensure sufficient contrast (4.5:1 minimum)
- **Hierarchy**: Use size, weight, and color to create clear information hierarchy
- **Consistency**: Stick to defined scales, avoid one-off sizes
- **Accessibility**: Support dynamic text sizing up to 200%

## 4. Spacing & Layout System

### Spacing Scale (Based on 4px grid)
```typescript
const spacing = {
  xs: 4,    // Tight spacing within components
  sm: 8,    // Small gaps between related elements
  md: 16,   // Standard spacing between components
  lg: 24,   // Larger gaps between sections
  xl: 32,   // Major section separation
  '2xl': 48, // Screen-level spacing
  '3xl': 64, // Hero section spacing
};
```

### Layout Principles
- **Consistent Margins**: Use 16px as the default screen margin
- **Vertical Rhythm**: Maintain consistent vertical spacing (8px baseline)
- **Golden Ratio**: Use 1.618 ratio for balanced proportions
- **Grid System**: Base all layouts on 4px grid for pixel-perfect alignment
- **Responsive Design**: Support different screen sizes gracefully

### Component Spacing
```typescript
// Card Component Spacing
const cardStyles = {
  padding: spacing.lg,        // 24px internal padding
  margin: spacing.md,         // 16px between cards
  borderRadius: 12,           // Rounded corners
  gap: spacing.sm,           // 8px between internal elements
};

// Button Spacing
const buttonStyles = {
  paddingVertical: spacing.md,    // 16px vertical padding
  paddingHorizontal: spacing.lg,  // 24px horizontal padding
  marginVertical: spacing.sm,     // 8px vertical margin
};
```

## 5. Component Design Patterns

### Cards
Cards are the primary content container in AuraShift:

```typescript
// Elevated Card (Primary content)
<Card variant="elevated" className="bg-white shadow-lg rounded-xl p-6 mb-4">
  <CardHeader>
    <Icon name="trophy" size={24} color="primary" />
    <Title>Achievement Unlocked!</Title>
  </CardHeader>
  <CardContent>
    <Text>You've completed 7 days smoke-free</Text>
  </CardContent>
</Card>

// Outlined Card (Secondary content)
<Card variant="outlined" className="border border-gray-200 rounded-lg p-4">
  <StatisticDisplay value="156" label="Cigarettes Avoided" />
</Card>
```

### Buttons
Button hierarchy for different action priorities:

```typescript
// Primary Button - Main actions
<Button variant="primary" size="lg" className="bg-blue-500 text-white">
  Reset Timer
</Button>

// Secondary Button - Supporting actions
<Button variant="secondary" size="md" className="border border-blue-500 text-blue-500">
  View Details
</Button>

// Ghost Button - Tertiary actions
<Button variant="ghost" size="sm" className="text-gray-600">
  Skip for Now
</Button>
```

### Input Fields
Consistent form styling across the app:

```typescript
<InputField
  label="How many cigarettes per day?"
  placeholder="Enter number"
  error={errors.cigarettesPerDay}
  helperText="This helps us calculate your progress"
  className="mb-4"
/>
```

## 6. Screen Layout Templates

### Dashboard Layout
```
┌─────────────────────────────────┐
│ Header (Status Bar + Title)     │
├─────────────────────────────────┤
│ Hero Section (Timer Display)    │
├─────────────────────────────────┤
│ Quick Stats Cards (3-column)    │
├─────────────────────────────────┤
│ Daily Progress Card             │
├─────────────────────────────────┤
│ Quick Actions (Button Group)    │
├─────────────────────────────────┤
│ Recent Achievements             │
└─────────────────────────────────┘
```

### Form Layout
```
┌─────────────────────────────────┐
│ Navigation Header               │
├─────────────────────────────────┤
│ Progress Indicator (Steps)      │
├─────────────────────────────────┤
│ Form Title & Description        │
├─────────────────────────────────┤
│ Input Fields (Stacked)          │
│ - Field 1                      │
│ - Field 2                      │
│ - Field 3                      │
├─────────────────────────────────┤
│ Action Buttons (Bottom Fixed)   │
└─────────────────────────────────┘
```

### List Layout
```
┌─────────────────────────────────┐
│ Header + Search/Filter          │
├─────────────────────────────────┤
│ ┌─────────────────────────────┐ │
│ │ List Item Card              │ │
│ │ - Icon + Title + Subtitle   │ │
│ │ - Metadata + Action         │ │
│ └─────────────────────────────┘ │
│ ┌─────────────────────────────┐ │
│ │ List Item Card              │ │
│ └─────────────────────────────┘ │
│ ...                             │
└─────────────────────────────────┘
```

## 7. Animation & Motion Design

### Micro-Animations
```typescript
// Score Update Animation
const scoreAnimation = {
  from: { scale: 1, opacity: 0.7 },
  to: { scale: 1.1, opacity: 1 },
  duration: 300,
  easing: 'easeOutQuart',
};

// Achievement Badge Animation
const badgeAnimation = {
  from: { scale: 0, rotate: -45 },
  to: { scale: 1, rotate: 0 },
  duration: 500,
  easing: 'easeOutBack',
  delay: 200,
};

// Timer Tick Animation
const timerTickAnimation = {
  from: { opacity: 0.5 },
  to: { opacity: 1 },
  duration: 150,
  easing: 'linear',
};
```

### Page Transitions
- **Slide Transition**: Left/right for tab navigation
- **Fade Transition**: For modal presentations
- **Scale Transition**: For drill-down navigation
- **Push Transition**: For hierarchical navigation

### Loading States
```typescript
// Skeleton Loading
<SkeletonLoader>
  <SkeletonRect width="100%" height={20} />
  <SkeletonRect width="60%" height={16} />
  <SkeletonRect width="40%" height={16} />
</SkeletonLoader>

// Shimmer Effect
<ShimmerPlaceholder
  width={200}
  height={100}
  shimmerColors={['#E5E7EB', '#F3F4F6', '#E5E7EB']}
/>
```

## 8. Iconography System

### Icon Library
Primary icon set: **Feather Icons** (consistent, minimal style)

### Icon Usage
```typescript
// System Icons (Feather)
import { Clock, Heart, Trophy, Calendar, User } from 'react-feather';

// Custom Activity Icons
const activityIcons = {
  cigarette: '🚬',
  gym: '💪',
  meal: '🥗',
  skincare: '✨',
  meditation: '🧘',
  water: '💧',
};

// Icon Sizes
const iconSizes = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
  '2xl': 48,
};
```

### Icon Guidelines
- **Consistent Style**: Use the same icon family throughout
- **Appropriate Sizing**: Match icon size to text size
- **Color Coordination**: Icons should use semantic colors
- **Accessibility**: Provide alternative text for screen readers

## 9. Data Visualization Style

### Chart Color Palette
```typescript
const chartColors = {
  primary: ['#2563EB', '#3B82F6', '#60A5FA'],
  success: ['#10B981', '#34D399', '#6EE7B7'],
  warning: ['#F59E0B', '#FBBF24', '#FCD34D'],
  neutral: ['#6B7280', '#9CA3AF', '#D1D5DB'],
};
```

### Chart Types
- **Line Charts**: Progress over time (Aura score, streak length)
- **Bar Charts**: Activity comparison, daily summaries
- **Pie Charts**: Activity distribution, time allocation
- **Progress Rings**: Goal completion, milestone tracking
- **Sparklines**: Mini trend indicators in cards

### Chart Guidelines
- **Readable Labels**: Use clear, concise axis labels
- **Color Accessibility**: Ensure charts work for colorblind users
- **Interactive Elements**: Support tap-to-view details
- **Responsive Design**: Adapt to different screen sizes

## 10. Dark Mode Design

### Color Adaptations
```css
/* Light Mode */
--background-primary: #FFFFFF;
--background-secondary: #F9FAFB;
--text-primary: #111827;
--text-secondary: #6B7280;

/* Dark Mode */
--background-primary: #111827;
--background-secondary: #1F2937;
--text-primary: #F9FAFB;
--text-secondary: #D1D5DB;
```

### Dark Mode Guidelines
- **Automatic Detection**: Respect system preference
- **Manual Override**: Allow user to choose preference
- **Consistent Experience**: All screens should support both modes
- **Accessibility**: Maintain contrast ratios in both modes
- **Brand Colors**: Adjust brand colors for dark backgrounds

## 11. Accessibility Standards

### WCAG 2.1 AA Compliance
- **Color Contrast**: 4.5:1 ratio for normal text, 3:1 for large text
- **Focus Indicators**: Clear focus states for all interactive elements
- **Screen Reader Support**: Proper semantic markup and ARIA labels
- **Keyboard Navigation**: Full app functionality via keyboard
- **Text Scaling**: Support up to 200% text size increase

### Implementation Checklist
- [ ] All images have alternative text
- [ ] Interactive elements have accessible labels
- [ ] Color is not the only way to convey information
- [ ] Focus order is logical and predictable
- [ ] Error messages are clear and helpful
- [ ] Time-sensitive content has controls
- [ ] Motion can be disabled for vestibular disorders

## 12. Responsive Design Breakpoints

### Screen Size Categories
```typescript
const breakpoints = {
  small: 320,    // Small phones
  medium: 375,   // Standard phones
  large: 414,    // Large phones
  tablet: 768,   // Small tablets
  desktop: 1024, // Large tablets/desktop
};
```

### Responsive Patterns
- **Flexible Grids**: Use percentages and flex layouts
- **Adaptive Typography**: Scale font sizes appropriately
- **Touch Targets**: Minimum 44px for touch elements
- **Content Priority**: Show most important content first
- **Navigation Adaptation**: Transform navigation for different sizes

This comprehensive UI/UX guide ensures AuraShift provides a consistent, accessible, and delightful user experience that motivates users on their quit-smoking journey.