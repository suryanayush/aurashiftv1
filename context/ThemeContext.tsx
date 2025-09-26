import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';

export type ThemeMode = 'light' | 'dark' | 'system';
export type ActiveTheme = 'light' | 'dark';

export interface ThemeColors {
  // Background colors
  background: string;
  backgroundSecondary: string;
  backgroundTertiary: string;

  // Surface colors
  surface: string;
  surfaceSecondary: string;

  // Text colors
  text: string;
  textSecondary: string;
  textTertiary: string;

  // Primary colors (dark blue in light mode, lighter blue in dark mode)
  primary: string;
  primaryForeground: string;
  primaryLight: string;

  // Accent colors
  accent: string;
  accentForeground: string;

  // Border and divider colors
  border: string;
  divider: string;

  // Status colors
  success: string;
  warning: string;
  error: string;
  info: string;

  // Interactive colors
  overlay: string;
  shadow: string;
}

const lightTheme: ThemeColors = {
  // Light theme: Vibrant purple with coral accents
  background: '#FAFAFA',
  backgroundSecondary: '#F3F4F6',
  backgroundTertiary: '#E5E7EB',

  surface: '#FFFFFF',
  surfaceSecondary: 'rgba(255, 255, 255, 0.8)',

  text: '#1F2937',
  textSecondary: '#4B5563',
  textTertiary: '#6B7280',

  primary: '#6B46C1', // Deep purple
  primaryForeground: '#FFFFFF',
  primaryLight: '#A855F7',

  accent: '#F97316', // Warm orange
  accentForeground: '#FFFFFF',

  border: '#D1D5DB',
  divider: '#E5E7EB',

  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#0EA5E9',

  overlay: 'rgba(107, 70, 193, 0.2)',
  shadow: 'rgba(107, 70, 193, 0.15)',
};

const darkTheme: ThemeColors = {
  // Dark theme: Deep navy to purple gradient with neon accents
  background: '#0F0F23', // Deep navy
  backgroundSecondary: '#1A1B3A', // Navy purple
  backgroundTertiary: '#2D1B69', // Deep purple

  surface: 'rgba(26, 27, 58, 0.8)', // Glass-morphism
  surfaceSecondary: 'rgba(45, 27, 105, 0.6)',

  text: '#FFFFFF',
  textSecondary: '#E2E8F0',
  textTertiary: '#CBD5E1',

  primary: '#A855F7', // Electric purple
  primaryForeground: '#FFFFFF',
  primaryLight: '#C084FC',

  accent: '#FB7185', // Warm pink-coral
  accentForeground: '#FFFFFF',

  border: 'rgba(168, 85, 247, 0.2)',
  divider: 'rgba(168, 85, 247, 0.15)',

  success: '#22D3EE', // Electric cyan
  warning: '#FBBF24',
  error: '#F87171',
  info: '#60A5FA',

  overlay: 'rgba(15, 15, 35, 0.8)',
  shadow: 'rgba(168, 85, 247, 0.3)',
};

interface ThemeContextType {
  themeMode: ThemeMode;
  activeTheme: ActiveTheme;
  colors: ThemeColors;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [themeMode, setThemeMode] = useState<ThemeMode>('system');
  const [systemTheme, setSystemTheme] = useState<ColorSchemeName>(Appearance.getColorScheme());

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemTheme(colorScheme);
    });

    return () => subscription?.remove();
  }, []);

  const activeTheme: ActiveTheme =
    themeMode === 'system' ? (systemTheme === 'dark' ? 'dark' : 'light') : themeMode;

  const colors = activeTheme === 'dark' ? darkTheme : lightTheme;

  const toggleTheme = () => {
    setThemeMode((current) => {
      switch (current) {
        case 'light':
          return 'dark';
        case 'dark':
          return 'system';
        default:
          return 'light';
      }
    });
  };

  const value = {
    themeMode,
    activeTheme,
    colors,
    setThemeMode,
    toggleTheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
