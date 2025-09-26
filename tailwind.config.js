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
        // Light theme colors - Vibrant purple with coral
        light: {
          background: '#FAFAFA',
          'background-secondary': '#F3F4F6',
          'background-tertiary': '#E5E7EB',
          surface: '#FFFFFF',
          'surface-secondary': 'rgba(255, 255, 255, 0.8)',
          text: '#1F2937',
          'text-secondary': '#4B5563',
          'text-tertiary': '#6B7280',
          primary: '#6B46C1',
          'primary-foreground': '#FFFFFF',
          'primary-light': '#A855F7',
          accent: '#F97316',
          'accent-foreground': '#FFFFFF',
          border: '#D1D5DB',
          divider: '#E5E7EB',
        },
        // Dark theme colors - Navy to purple with neon accents
        dark: {
          background: '#0F0F23',
          'background-secondary': '#1A1B3A',
          'background-tertiary': '#2D1B69',
          surface: 'rgba(26, 27, 58, 0.8)',
          'surface-secondary': 'rgba(45, 27, 105, 0.6)',
          text: '#FFFFFF',
          'text-secondary': '#E2E8F0',
          'text-tertiary': '#CBD5E1',
          primary: '#A855F7',
          'primary-foreground': '#FFFFFF',
          'primary-light': '#C084FC',
          accent: '#FB7185',
          'accent-foreground': '#FFFFFF',
          border: 'rgba(168, 85, 247, 0.2)',
          divider: 'rgba(168, 85, 247, 0.15)',
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
