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
  // Light theme: white and dark blue
  background: '#FFFFFF',
  backgroundSecondary: '#F8FAFC',
  backgroundTertiary: '#F1F5F9',

  surface: '#FFFFFF',
  surfaceSecondary: '#F8FAFC',

  text: '#1E293B',
  textSecondary: '#475569',
  textTertiary: '#64748B',

  primary: '#1E3A8A', // Dark blue
  primaryForeground: '#FFFFFF',
  primaryLight: '#3B82F6',

  accent: '#2563EB',
  accentForeground: '#FFFFFF',

  border: '#E2E8F0',
  divider: '#E2E8F0',

  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',

  overlay: 'rgba(0, 0, 0, 0.5)',
  shadow: 'rgba(0, 0, 0, 0.1)',
};

const darkTheme: ThemeColors = {
  // Dark theme: dark blue and gray
  background: '#0F172A',
  backgroundSecondary: '#1E293B',
  backgroundTertiary: '#334155',

  surface: '#1E293B',
  surfaceSecondary: '#334155',

  text: '#F8FAFC',
  textSecondary: '#CBD5E1',
  textTertiary: '#94A3B8',

  primary: '#3B82F6', // Lighter blue for dark mode
  primaryForeground: '#FFFFFF',
  primaryLight: '#60A5FA',

  accent: '#60A5FA',
  accentForeground: '#FFFFFF',

  border: '#475569',
  divider: '#475569',

  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#60A5FA',

  overlay: 'rgba(0, 0, 0, 0.7)',
  shadow: 'rgba(0, 0, 0, 0.3)',
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
