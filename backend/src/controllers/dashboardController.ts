import { Request, Response } from 'express';
import { User } from '../models';

export const getDashboardStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized'
      });
      return;
    }
    const user = await User.findById(userId).select('-password');
    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found'
      });
      return;
    }

    const now = new Date();
    let smokeFreeTime = 0;
    let level = 1;
    let moneySaved = 0;
    
    if (user.streakStartTime) {
      smokeFreeTime = Math.floor((now.getTime() - user.streakStartTime.getTime()) / (1000 * 60 * 60 * 24)); // days
    }

    level = Math.floor(user.auraScore / 100) + 1;

    if (user.smokingHistory) {
      const { cigarettesPerDay, costPerPack } = user.smokingHistory;
      const cigarettesPerPack = 20; // Standard pack size
      const dailyCost = (cigarettesPerDay / cigarettesPerPack) * costPerPack;
      moneySaved = Math.round(dailyCost * smokeFreeTime * 100) / 100; // Round to 2 decimal places
    }

    const dashboardData = {
      ...user.toJSON(),
      stats: {
        smokeFreeTime,
        level,
        moneySaved,
        cigarettesAvoided: user.smokingHistory ? user.smokingHistory.cigarettesPerDay * smokeFreeTime : 0,
      }
    };

    res.status(200).json({
      success: true,
      data: dashboardData
    });
  } catch (error: any) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch dashboard stats'
    });
  }
};
