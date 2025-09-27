import AsyncStorage from '@react-native-async-storage/async-storage';
import { StoredUserData } from '../types';

// Storage keys
export const STORAGE_KEYS = {
  USER_DATA: 'aurashift_user_data',
  ONBOARDING_COMPLETED: 'aurashift_onboarding_completed',
  AUTH_TOKEN: 'aurashift_auth_token',
  TIMER_START: 'aurashift_timer_start',
  AURA_SCORE: 'aurashift_aura_score',
  ACTIVITIES: 'aurashift_activities',
} as const;

// Storage utility functions
export const storage = {
  // Set item in storage
  async setItem(key: string, value: any): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error('Error storing data:', error);
      throw error;
    }
  },

  // Get item from storage
  async getItem<T>(key: string): Promise<T | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error('Error retrieving data:', error);
      return null;
    }
  },

  // Remove item from storage
  async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing data:', error);
      throw error;
    }
  },

  // Clear all storage
  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw error;
    }
  },

  // User-specific methods
  async saveUserData(userData: StoredUserData): Promise<void> {
    await this.setItem(STORAGE_KEYS.USER_DATA, userData);
  },

  async getUserData(): Promise<StoredUserData | null> {
    return await this.getItem<StoredUserData>(STORAGE_KEYS.USER_DATA);
  },

  async setOnboardingCompleted(completed: boolean): Promise<void> {
    await this.setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, completed);
  },

  async isOnboardingCompleted(): Promise<boolean> {
    const completed = await this.getItem<boolean>(STORAGE_KEYS.ONBOARDING_COMPLETED);
    return completed === true;
  },

  async setAuthToken(token: string): Promise<void> {
    await this.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  },

  async getAuthToken(): Promise<string | null> {
    return await this.getItem<string>(STORAGE_KEYS.AUTH_TOKEN);
  },

  async setTimerStart(startTime: Date): Promise<void> {
    await this.setItem(STORAGE_KEYS.TIMER_START, startTime.toISOString());
  },

  async getTimerStart(): Promise<Date | null> {
    const timeString = await this.getItem<string>(STORAGE_KEYS.TIMER_START);
    return timeString ? new Date(timeString) : null;
  },

  async setAuraScore(score: number): Promise<void> {
    await this.setItem(STORAGE_KEYS.AURA_SCORE, score);
  },

  async getAuraScore(): Promise<number> {
    const score = await this.getItem<number>(STORAGE_KEYS.AURA_SCORE);
    return score || 0;
  },

  // Initialize sample data for development
  async initializeSampleData(): Promise<void> {
    try {
      const existingUserData = await this.getUserData();
      if (existingUserData) {
        return;
      }

      // Sample user data
      const sampleUserData: StoredUserData = {
        displayName: 'John Doe',
        email: 'john.doe@example.com',
        smokingHistory: {
          yearsSmoked: 5,
          cigarettesPerDay: 10,
          costPerPack: 15, // INR
          motivations: ['health', 'money', 'family'],
        },
        createdAt: new Date().toISOString(),
      };

      const timerStart = new Date();
      timerStart.setDate(timerStart.getDate() - 3);
      timerStart.setHours(timerStart.getHours() - 5);

      // Save sample data
      await this.saveUserData(sampleUserData);
      await this.setTimerStart(timerStart);
      await this.setAuraScore(45); // Sample aura score
      await this.setOnboardingCompleted(true);

      console.log('Sample data initialized successfully');
    } catch (error) {
      console.error('Error initializing sample data:', error);
    }
  },
};
