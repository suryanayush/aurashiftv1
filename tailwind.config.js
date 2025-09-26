/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.{js,ts,tsx}',
    './components/**/*.{js,ts,tsx}',
    './screens/**/*.{js,ts,tsx}',
    './context/**/*.{js,ts,tsx}',
    './navigation/**/*.{js,ts,tsx}',
  ],

  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Light theme colors
        light: {
          background: '#FFFFFF',
          'background-secondary': '#F8FAFC',
          'background-tertiary': '#F1F5F9',
          surface: '#FFFFFF',
          'surface-secondary': '#F8FAFC',
          text: '#1E293B',
          'text-secondary': '#475569',
          'text-tertiary': '#64748B',
          primary: '#1E3A8A',
          'primary-foreground': '#FFFFFF',
          'primary-light': '#3B82F6',
          accent: '#2563EB',
          'accent-foreground': '#FFFFFF',
          border: '#E2E8F0',
          divider: '#E2E8F0',
        },
        // Dark theme colors
        dark: {
          background: '#0F172A',
          'background-secondary': '#1E293B',
          'background-tertiary': '#334155',
          surface: '#1E293B',
          'surface-secondary': '#334155',
          text: '#F8FAFC',
          'text-secondary': '#CBD5E1',
          'text-tertiary': '#94A3B8',
          primary: '#3B82F6',
          'primary-foreground': '#FFFFFF',
          'primary-light': '#60A5FA',
          accent: '#60A5FA',
          'accent-foreground': '#FFFFFF',
          border: '#475569',
          divider: '#475569',
        },
      },
      fontFamily: {
        sans: ['System'],
      },
      spacing: {
        18: '4.5rem',
        88: '22rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      shadow: {
        soft: '0 2px 8px rgba(0, 0, 0, 0.1)',
        medium: '0 4px 16px rgba(0, 0, 0, 0.1)',
        large: '0 8px 32px rgba(0, 0, 0, 0.15)',
      },
    },
  },
  plugins: [],
};
