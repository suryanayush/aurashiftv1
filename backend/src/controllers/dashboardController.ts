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
    
    if (user.streakStartTime) {
      smokeFreeTime = Math.floor((now.getTime() - user.streakStartTime.getTime()) / (1000 * 60 * 60 * 24)); // days
    }

    // Calculate level based on aura score (every 100 points = 1 level)
    const level = Math.floor(user.auraScore / 100) + 1;

    const dashboardData = {
      ...user.toJSON(),
      cigarettesAvoided: user.cigarettesAvoided,
      totalMoneySaved: user.totalMoneySaved,
      stats: {
        smokeFreeTime,
        level,
        moneySaved: user.totalMoneySaved,
        cigarettesAvoided: user.cigarettesAvoided,
        daysSmokeFree: smokeFreeTime,
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
