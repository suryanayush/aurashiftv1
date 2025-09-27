# AuraShift UI Design System & Guidelines

## 1. Design Philosophy

### 1.1 Core Design Principles
- **Modern & Clean**: Minimalist interface with purposeful white space
- **Professional**: Medical-grade reliability with consumer-friendly aesthetics  
- **Supportive**: Every visual element reinforces positive user experience
- **Accessible**: WCAG 2.1 AA compliant with high contrast and readable typography
- **Consistent**: Unified visual language across all screens and interactions

### 1.2 Visual Hierarchy
- **Primary Focus**: Smoke-free timer as the hero element
- **Secondary**: Progress indicators and achievements
- **Tertiary**: Navigation and supporting information
- **Background**: Subtle gradients and soft shadows for depth

## 2. Color Palette

### 2.1 Primary Colors
```typescript
export const colors = {
  // Primary Brand Colors (AuraShift Red Theme)
  primary: {
    50: '#FEF2F2',   // Very light red
    100: '#FEE2E2',  // Light red  
    400: '#F87171',  // Medium red
    500: '#EF4444',  // Primary red
    600: '#DC2626',  // Darker red
    700: '#B91C1C',  // Deep red
  },
  
  // Secondary Colors
  secondary: {
    50: '#F8FAFC',   // Very light gray
    100: '#F1F5F9',  // Light gray
    200: '#E2E8F0',  // Medium light gray
    500: '#64748B',  // Medium gray
    600: '#475569',  // Dark gray
    700: '#334155',  // Very dark gray
  },
  
  // Success Colors (for positive activities)
  success: {
    50: '#F0FDF4',   // Very light green
    100: '#DCFCE7',  // Light green
    500: '#22C55E',  // Success green
    600: '#16A34A',  // Darker green
  },
  
  // Warning Colors (for cravings/triggers)
  warning: {
    50: '#FFFBEB',   // Very light amber
    100: '#FEF3C7',  // Light amber
    500: '#F59E0B',  // Warning amber
    600: '#D97706',  // Darker amber
  },
  
  // Error Colors (for relapses - used sparingly)
  error: {
    50: '#FEF2F2',   // Very light red
    100: '#FEE2E2',  // Light red
    500: '#EF4444',  // Error red
    600: '#DC2626',  // Darker red
  },
  
  // Background Colors
  background: {
    primary: '#FFFFFF',    // Pure white
    secondary: '#F8FAFC',  // Off-white
    card: '#FFFFFF',       // Card background
    overlay: 'rgba(0, 0, 0, 0.5)', // Modal overlay
  },
  
  // Text Colors
  text: {
    primary: '#1F2937',    // Dark gray for headings
    secondary: '#6B7280',  // Medium gray for body text
    tertiary: '#9CA3AF',   // Light gray for captions
    inverse: '#FFFFFF',    // White text on dark backgrounds
  }
};
```

### 2.2 Activity-Specific Colors
```typescript
export const activityColors = {
  cigarette: {
    background: '#FEF2F2', // Light red background
    icon: '#DC2626',       // Bright red icon
    border: '#FECACA',     // Light red border
  },
  gym: {
    background: '#FEF3C7', // Light yellow background
    icon: '#EAB308',       // Yellow icon (updated)
    border: '#FDE68A',     // Light yellow border
  },
  healthy_meal: {
    background: '#ECFDF5', // Light emerald background
    icon: '#10B981',       // Emerald icon (updated)
    border: '#A7F3D0',     // Light emerald border
  },
  skincare: {
    background: '#FAF5FF', // Light purple background
    icon: '#8B5CF6',       // Purple icon (updated)
    border: '#E9D5FF',     // Light purple border
  },
  event_social: {
    background: '#EFF6FF', // Light blue background
    icon: '#3B82F6',       // Blue icon (updated)
    border: '#BFDBFE',     // Light blue border
  },
};

// Chart Data Series Colors (Multi-Series Bar Chart)
export const chartColors = {
  aura_score: '#8B7ED8',        // Purple
  cigarettes_avoided: '#22C55E', // Bright Green  
  cigarettes_consumed: '#DC2626', // Bright Red
  money_saved: '#F59E0B',        // Bright Orange
};
```

## 3. Typography

### 3.1 Font System
```typescript
export const typography = {
  // Font Families
  fontFamily: {
    primary: 'SF Pro Display', // iOS
    secondary: 'Roboto',       // Android
    mono: 'SF Mono',           // Monospace for timer
  },
  
  // Font Sizes
  fontSize: {
    xs: 12,    // Small captions
    sm: 14,    // Body text small
    base: 16,  // Body text
    lg: 18,    // Large body text
    xl: 20,    // Small headings
    '2xl': 24, // Medium headings
    '3xl': 30, // Large headings
    '4xl': 36, // Extra large headings
    '5xl': 48, // Hero text (timer display)
  },
  
  // Font Weights
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  
  // Line Heights
  lineHeight: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
  }
};
```

### 3.2 Text Styles
```typescript
export const textStyles = {
  // Headings
  h1: {
    fontSize: typography.fontSize['4xl'],
    fontWeight: typography.fontWeight.bold,
    lineHeight: typography.lineHeight.tight,
    color: colors.text.primary,
  },
  h2: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.semibold,
    lineHeight: typography.lineHeight.tight,
    color: colors.text.primary,
  },
  h3: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.semibold,
    lineHeight: typography.lineHeight.normal,
    color: colors.text.primary,
  },
  
  // Body Text
  body: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.normal,
    lineHeight: typography.lineHeight.normal,
    color: colors.text.secondary,
  },
  bodyLarge: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.normal,
    lineHeight: typography.lineHeight.normal,
    color: colors.text.secondary,
  },
  
  // Special Text
  timer: {
    fontSize: typography.fontSize['5xl'],
    fontWeight: typography.fontWeight.bold,
    fontFamily: typography.fontFamily.mono,
    lineHeight: typography.lineHeight.tight,
    color: colors.text.primary,
  },
  caption: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.normal,
    lineHeight: typography.lineHeight.normal,
    color: colors.text.tertiary,
  },
};
```

## 4. Iconography

### 4.1 Icon System Rules
- **Use Vector Icons Only**: SVG or icon fonts (React Native Vector Icons)
- **Consistent Style**: Outline style icons with 2px stroke width
- **Size Standards**: 16px, 20px, 24px, 32px, 48px
- **No Emoji in UI**: Replace all emoji with professional icons
- **Accessibility**: All icons must have accessible labels

### 4.2 Icon Library
```typescript
export const iconMap = {
  // Navigation Icons
  home: 'home-outline',
  calendar: 'calendar-outline', 
  statistics: 'bar-chart-outline',
  profile: 'person-outline',
  settings: 'settings-outline',
  
  // Activity Icons
  cigarette: 'ban-outline',           // Crossed out cigarette
  gym: 'fitness-outline',             // Dumbbell icon
  healthy_meal: 'restaurant-outline', // Fork and knife
  skincare: 'water-outline',          // Water drop
  event_social: 'people-outline',     // Group of people
  
  // Progress Icons
  timer: 'time-outline',
  streak: 'flame-outline',
  achievement: 'trophy-outline',
  level: 'star-outline',
  money_saved: 'wallet-outline',
  
  // Action Icons
  add: 'add-circle-outline',
  edit: 'create-outline',
  delete: 'trash-outline',
  save: 'checkmark-circle-outline',
  cancel: 'close-circle-outline',
  
  // Status Icons
  success: 'checkmark-circle',
  warning: 'warning-outline',
  error: 'alert-circle-outline',
  info: 'information-circle-outline',
  
  // UI Icons
  chevron_right: 'chevron-forward-outline',
  chevron_left: 'chevron-back-outline',
  chevron_up: 'chevron-up-outline',
  chevron_down: 'chevron-down-outline',
  search: 'search-outline',
  filter: 'filter-outline',
  more: 'ellipsis-horizontal-outline',
};
```

### 4.3 Icon Usage Examples
```typescript
// ✅ CORRECT: Professional icon usage
<Icon 
  name="fitness-outline" 
  size={24} 
  color={colors.success[500]} 
  accessibilityLabel="Gym activity"
/>

// ❌ INCORRECT: Using emoji
<Text>💪 Gym</Text>

// ✅ CORRECT: Icon with text
<View className="flex-row items-center">
  <Icon name="time-outline" size={20} color={colors.primary[500]} />
  <Text className="ml-2">Smoke-free for</Text>
</View>
```

## 5. Component Design Patterns

### 5.1 Card Components
```typescript
// Primary Card (for main content like timer)
export const PrimaryCard = ({ children, className = '' }) => (
  <View className={`bg-white rounded-3xl p-6 shadow-lg ${className}`}>
    {children}
  </View>
);

// Secondary Card (for progress items)
export const SecondaryCard = ({ children, className = '' }) => (
  <View className={`bg-white rounded-2xl p-4 shadow-sm ${className}`}>
    {children}
  </View>
);

// Activity Card (for activity logging)
export const ActivityCard = ({ type, onPress, className = '' }) => {
  const colors = activityColors[type];
  return (
    <TouchableOpacity 
      className={`rounded-2xl p-4 ${className}`}
      style={{ backgroundColor: colors.background }}
      onPress={onPress}
    >
      <View className="items-center">
        <View 
          className="w-12 h-12 rounded-xl items-center justify-center mb-2"
          style={{ backgroundColor: colors.icon + '20' }}
        >
          <Icon name={iconMap[type]} size={24} color={colors.icon} />
        </View>
        <Text className="text-sm font-medium text-gray-700">
          {getActivityLabel(type)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
```

### 5.2 Button Components
```typescript
// Primary Button
export const PrimaryButton = ({ title, onPress, disabled = false, className = '' }) => (
  <TouchableOpacity
    className={`bg-indigo-500 rounded-2xl py-4 px-6 ${disabled ? 'opacity-50' : ''} ${className}`}
    onPress={onPress}
    disabled={disabled}
  >
    <Text className="text-white text-center font-semibold text-lg">
      {title}
    </Text>
  </TouchableOpacity>
);

// Secondary Button
export const SecondaryButton = ({ title, onPress, className = '' }) => (
  <TouchableOpacity
    className={`bg-gray-100 rounded-2xl py-4 px-6 ${className}`}
    onPress={onPress}
  >
    <Text className="text-gray-700 text-center font-semibold text-lg">
      {title}
    </Text>
  </TouchableOpacity>
);

// Danger Button (for "I Smoked" action)
export const DangerButton = ({ title, onPress, className = '' }) => (
  <TouchableOpacity
    className={`bg-red-500 rounded-2xl py-4 px-6 ${className}`}
    onPress={onPress}
  >
    <Text className="text-white text-center font-semibold text-lg">
      {title}
    </Text>
  </TouchableOpacity>
);
```

### 5.3 Progress Indicators
```typescript
// Progress Ring (for timer display)
export const ProgressRing = ({ progress, size = 200, strokeWidth = 8 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = `${circumference} ${circumference}`;
  const strokeDashoffset = circumference - (progress * circumference);
  
  return (
    <Svg width={size} height={size}>
      {/* Background circle */}
      <Circle
        stroke={colors.secondary[200]}
        fill="transparent"
        strokeWidth={strokeWidth}
        r={radius}
        cx={size / 2}
        cy={size / 2}
      />
      {/* Progress circle */}
      <Circle
        stroke={colors.primary[500]}
        fill="transparent"
        strokeWidth={strokeWidth}
        strokeDasharray={strokeDasharray}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        r={radius}
        cx={size / 2}
        cy={size / 2}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
    </Svg>
  );
};

// Linear Progress Bar
export const ProgressBar = ({ progress, height = 8, className = '' }) => (
  <View className={`bg-gray-200 rounded-full ${className}`} style={{ height }}>
    <View 
      className="bg-indigo-500 rounded-full h-full"
      style={{ width: `${progress * 100}%` }}
    />
  </View>
);
```

## 6. Layout Patterns

### 6.1 Screen Layout Structure
```typescript
// Standard Screen Layout
export const ScreenLayout = ({ children, title, showHeader = true }) => (
  <SafeAreaView className="flex-1 bg-gray-50">
    {showHeader && (
      <View className="px-6 py-4 bg-white">
        <Text className="text-2xl font-bold text-gray-900">{title}</Text>
      </View>
    )}
    <ScrollView className="flex-1 px-6 py-4">
      {children}
    </ScrollView>
  </SafeAreaView>
);

// Home Screen Layout (special case)
export const HomeScreenLayout = ({ children }) => (
  <SafeAreaView className="flex-1 bg-gray-50">
    <View className="px-6 py-4">
      {/* Header with greeting */}
      <View className="flex-row items-center justify-between mb-6">
        <View className="flex-row items-center">
          <Image 
            source={{ uri: userAvatar }} 
            className="w-10 h-10 rounded-full mr-3"
          />
          <Text className="text-lg font-medium text-gray-900">
            Hi, {userName}!
          </Text>
        </View>
        <TouchableOpacity>
          <Icon name="settings-outline" size={24} color={colors.text.secondary} />
        </TouchableOpacity>
      </View>
      
      {children}
    </View>
  </SafeAreaView>
);
```

### 6.2 Grid Systems
```typescript
// Activity Grid (2 columns)
export const ActivityGrid = ({ activities }) => (
  <View className="flex-row flex-wrap -mx-2">
    {activities.map((activity, index) => (
      <View key={index} className="w-1/2 px-2 mb-4">
        <ActivityCard type={activity.type} onPress={activity.onPress} />
      </View>
    ))}
  </View>
);

// Progress Stats Grid (3 columns)
export const StatsGrid = ({ stats }) => (
  <View className="flex-row -mx-2">
    {stats.map((stat, index) => (
      <View key={index} className="flex-1 px-2">
        <SecondaryCard>
          <View className="items-center">
            <View className="w-12 h-12 rounded-xl bg-indigo-100 items-center justify-center mb-2">
              <Icon name={stat.icon} size={24} color={colors.primary[500]} />
            </View>
            <Text className="text-2xl font-bold text-gray-900">{stat.value}</Text>
            <Text className="text-sm text-gray-500">{stat.label}</Text>
          </View>
        </SecondaryCard>
      </View>
    ))}
  </View>
);
```

## 7. Animation Guidelines

### 7.1 Animation Principles
- **Purposeful**: Every animation should serve a functional purpose
- **Fast**: Animations should be snappy (200-300ms for most transitions)
- **Natural**: Use easing curves that feel natural (ease-out for entrances, ease-in for exits)
- **Consistent**: Use the same timing and easing across similar interactions

### 7.2 Animation Patterns
```typescript
// Fade In Animation
export const fadeIn = {
  from: { opacity: 0 },
  to: { opacity: 1 },
  duration: 300,
  easing: 'ease-out',
};

// Scale In Animation (for buttons)
export const scaleIn = {
  from: { scale: 0.95, opacity: 0 },
  to: { scale: 1, opacity: 1 },
  duration: 200,
  easing: 'ease-out',
};

// Slide Up Animation (for modals)
export const slideUp = {
  from: { translateY: 100, opacity: 0 },
  to: { translateY: 0, opacity: 1 },
  duration: 300,
  easing: 'ease-out',
};

// Achievement Celebration Animation
export const celebrationBounce = {
  from: { scale: 0 },
  to: { scale: 1 },
  duration: 600,
  easing: 'bounce',
};
```

## 8. Responsive Design

### 8.1 Breakpoints
```typescript
export const breakpoints = {
  sm: 375,  // iPhone SE
  md: 414,  // iPhone Pro
  lg: 768,  // iPad Mini
  xl: 1024, // iPad Pro
};
```

### 8.2 Adaptive Components
```typescript
// Responsive Timer Display
export const ResponsiveTimer = ({ time }) => {
  const { width } = useWindowDimensions();
  const isLarge = width >= breakpoints.lg;
  
  return (
    <View className={`items-center ${isLarge ? 'py-12' : 'py-8'}`}>
      <Text 
        className="font-bold text-gray-900"
        style={{ 
          fontSize: isLarge ? 64 : 48,
          fontFamily: typography.fontFamily.mono 
        }}
      >
        {time.formatted}
      </Text>
    </View>
  );
};
```

## 9. Accessibility Guidelines

### 9.1 Accessibility Requirements
- **Minimum Touch Target**: 44x44 points
- **Color Contrast**: 4.5:1 for normal text, 3:1 for large text
- **Screen Reader Support**: All interactive elements must have accessibility labels
- **Focus Indicators**: Clear focus states for keyboard navigation
- **Dynamic Type**: Support for system font size preferences

### 9.2 Accessibility Implementation
```typescript
// Accessible Button Example
export const AccessibleButton = ({ title, onPress, icon, ...props }) => (
  <TouchableOpacity
    onPress={onPress}
    accessibilityRole="button"
    accessibilityLabel={title}
    accessibilityHint="Double tap to activate"
    style={{ minHeight: 44, minWidth: 44 }}
    {...props}
  >
    <View className="flex-row items-center justify-center px-4 py-3">
      {icon && <Icon name={icon} size={20} className="mr-2" />}
      <Text className="font-semibold">{title}</Text>
    </View>
  </TouchableOpacity>
);

// Accessible Timer Display
export const AccessibleTimer = ({ time }) => (
  <View 
    accessible={true}
    accessibilityRole="timer"
    accessibilityLabel={`Smoke-free for ${time.days} days, ${time.hours} hours, ${time.minutes} minutes`}
    accessibilityValue={{ text: time.formatted }}
  >
    <Text className="text-5xl font-bold text-center">
      {time.formatted}
    </Text>
  </View>
);
```

## 10. Dark Mode Support

### 10.1 Dark Mode Colors
```typescript
export const darkColors = {
  background: {
    primary: '#000000',
    secondary: '#1C1C1E',
    card: '#2C2C2E',
  },
  text: {
    primary: '#FFFFFF',
    secondary: '#EBEBF5',
    tertiary: '#8E8E93',
  },
  // ... other dark mode colors
};
```

### 10.2 Theme Implementation
```typescript
// Theme Context
export const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

// Themed Component Example
export const ThemedCard = ({ children, className = '' }) => {
  const { colors } = useTheme();
  
  return (
    <View 
      className={`rounded-3xl p-6 shadow-lg ${className}`}
      style={{ backgroundColor: colors.background.card }}
    >
      {children}
    </View>
  );
};
```

## 11. Performance Optimization

### 11.1 Image Optimization
- **Use WebP format** when possible
- **Implement lazy loading** for images
- **Provide multiple resolutions** (@1x, @2x, @3x)
- **Cache images** appropriately

### 11.2 Animation Performance
- **Use native driver** for animations when possible
- **Avoid animating layout properties** (width, height, padding)
- **Prefer transform and opacity** animations
- **Use InteractionManager** for complex animations

This comprehensive UI design system ensures AuraShift maintains a modern, professional, and accessible interface that supports users on their quit-smoking journey with visual consistency and emotional support.
