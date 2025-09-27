import { storage } from './storage';
import { DashboardData, TimerData } from '../types';

// Calculate time difference
const calculateTimeDifference = (startTime: Date, currentTime: Date = new Date()) => {
  const diffInMilliseconds = currentTime.getTime() - startTime.getTime();
  
  if (diffInMilliseconds < 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, formatted: '0d 0h 0m 0s' };
  }

  const seconds = Math.floor(diffInMilliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  const remainingHours = hours % 24;
  const remainingMinutes = minutes % 60;
  const remainingSeconds = seconds % 60;

  return {
    days,
    hours: remainingHours,
    minutes: remainingMinutes,
    seconds: remainingSeconds,
    formatted: `${days}d ${remainingHours}h ${remainingMinutes}m ${remainingSeconds}s`
  };
};

// Calculate level from aura score
const calculateLevel = (auraScore: number): number => {
  return Math.floor(Math.max(0, auraScore) / 100) + 1;
};

// Get motivational message based on progress
const getMotivationalMessage = (days: number, auraScore: number): string => {
  if (days === 0) {
    return "Every moment smoke-free is a victory.";
  } else if (days === 1) {
    return "Amazing! You've completed your first day. You're building something incredible!";
  } else if (days < 7) {
    return `Day ${days} complete! You're proving to yourself that you can do this.`;
  } else if (days < 30) {
    return `${days} days strong! Your body is already healing and thanking you.`;
  } else {
    return `${days} days of freedom! You're an inspiration and proof that transformation is possible.`;
  }
};

// Generate dashboard data
export const generateDashboardData = async (): Promise<DashboardData> => {
  try {
    // Get stored data
    const userData = await storage.getUserData();
    const timerStart = await storage.getTimerStart();
    const auraScore = await storage.getAuraScore();

    if (!userData || !timerStart) {
      throw new Error('Required data not found');
    }

    // Calculate timer
    const timerData = calculateTimeDifference(timerStart);
    const level = calculateLevel(auraScore);

    // Calculate progress metrics
    const cigarettesPerDay = userData.smokingHistory.cigarettesPerDay;
    const costPerPack = userData.smokingHistory.costPerPack || 10;
    const cigarettesPerPack = 20; // Standard pack size
    
    const totalHours = (timerData.days * 24) + timerData.hours + (timerData.minutes / 60);
    const cigarettesAvoided = Math.floor((totalHours / 24) * cigarettesPerDay);
    const moneySaved = Math.floor((cigarettesAvoided / cigarettesPerPack) * costPerPack);

    // Quick actions for activity logging
    const quickActions = [
      {
        id: 'gym',
        title: 'Gym Workout',
        icon: 'fitness-outline',
        points: 5,
        color: 'bg-green-500'
      },
      {
        id: 'healthy_meal',
        title: 'Healthy Meal',
        icon: 'restaurant-outline',
        points: 3,
        color: 'bg-blue-500'
      },
      {
        id: 'skincare',
        title: 'Skincare',
        icon: 'water-outline',
        points: 2,
        color: 'bg-purple-500'
      },
      {
        id: 'event_social',
        title: 'Social Event',
        icon: 'people-outline',
        points: 0,
        color: 'bg-orange-500'
      }
    ];

    // Generate recent achievements
    const recentAchievements = [];
    if (timerData.days >= 1) recentAchievements.push('24 Hours Smoke-Free');
    if (timerData.days >= 3) recentAchievements.push('3 Day Warrior');
    if (timerData.days >= 7) recentAchievements.push('One Week Champion');
    if (auraScore >= 50) recentAchievements.push('Aura Builder');

    const dashboardData: DashboardData = {
      user: {
        displayName: userData.displayName,
        email: userData.email,
        level,
        auraScore
      },
      timer: {
        ...timerData,
        startTime: timerStart
      },
      progress: {
        cigarettesAvoided,
        moneySaved,
        healthScore: Math.min(100, Math.floor((totalHours / (24 * 30)) * 100)), // Health score based on days
        streakDays: timerData.days
      },
      activities: {
        today: 0, // Will be calculated from actual activity data later
        thisWeek: 0,
        totalPositive: Math.floor(auraScore / 5) // Estimate positive activities
      },
      achievements: {
        recent: recentAchievements.slice(-3),
        total: recentAchievements.length,
        nextMilestone: timerData.days < 7 ? '7 Day Milestone' : timerData.days < 30 ? '30 Day Milestone' : '90 Day Milestone'
      },
      motivationalMessage: getMotivationalMessage(timerData.days, auraScore),
      quickActions
    };

    return dashboardData;
  } catch (error) {
    console.error('Error generating dashboard data:', error);
    throw error;
  }
};

// Save dashboard data to storage (for caching)
export const saveDashboardData = async (data: DashboardData): Promise<void> => {
  try {
    await storage.setItem('dashboard_data', data);
  } catch (error) {
    console.error('Error saving dashboard data:', error);
  }
};

// Get cached dashboard data
export const getCachedDashboardData = async (): Promise<DashboardData | null> => {
  try {
    return await storage.getItem<DashboardData>('dashboard_data');
  } catch (error) {
    console.error('Error getting cached dashboard data:', error);
    return null;
  }
};
