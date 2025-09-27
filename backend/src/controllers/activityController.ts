import { Request, Response } from 'express';
import { Activity, ACTIVITY_POINTS, ActivityType } from '../models/Activity';
import { User } from '../models';
import mongoose from 'mongoose';

// Helper function to recalculate user's total aura score
const recalculateUserScore = async (userId: string): Promise<number> => {
  const activities = await Activity.find({ userId });
  const totalScore = activities.reduce((sum, activity) => sum + activity.points, 0);
  
  // Update user's aura score
  await User.findByIdAndUpdate(userId, { auraScore: Math.max(0, totalScore) });
  
  return Math.max(0, totalScore);
};

// Helper function to calculate and update cigarettes avoided and money saved
const updateCigarettesAvoidedAndMoneySaved = async (userId: string, activityType: ActivityType): Promise<void> => {
  const user = await User.findById(userId);
  if (!user || !user.smokingHistory) return;

  const { cigarettesPerDay, costPerCigarette } = user.smokingHistory;

  // Calculate daily expenditure baseline: cigarettesPerDay * costPerCigarette
  const dailyExpectedExpenditure = cigarettesPerDay * costPerCigarette;

  // Get today's start time (12 AM) 
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Get all cigarette activities for today
  const todayCigarettes = await Activity.find({
    userId,
    type: 'cigarette_consumed',
    createdAt: { $gte: today }
  });

  // Calculate today's actual consumption and savings
  const cigarettesConsumedToday = todayCigarettes.length;
  const actualExpenditureToday = cigarettesConsumedToday * costPerCigarette;
  const moneySavedToday = Math.max(0, dailyExpectedExpenditure - actualExpenditureToday);
  const cigarettesAvoidedToday = Math.max(0, cigarettesPerDay - cigarettesConsumedToday);

  // Calculate total savings since user started tracking
  const startDate = user.streakStartTime || user.createdAt;
  const daysSinceStart = Math.max(1, Math.floor((Date.now() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
  
  // Get total cigarettes consumed since start
  const totalCigarettesConsumed = await Activity.countDocuments({
    userId,
    type: 'cigarette_consumed',
    createdAt: { $gte: startDate }
  });

  // Calculate total expected vs actual expenditure
  const totalExpectedExpenditure = daysSinceStart * dailyExpectedExpenditure;
  const totalActualExpenditure = totalCigarettesConsumed * costPerCigarette;
  const totalMoneySaved = Math.max(0, totalExpectedExpenditure - totalActualExpenditure);
  const totalCigarettesAvoided = Math.max(0, (daysSinceStart * cigarettesPerDay) - totalCigarettesConsumed);

  // Update user model with calculated values
  await User.findByIdAndUpdate(userId, {
    cigarettesAvoided: totalCigarettesAvoided,
    totalMoneySaved: Math.round(totalMoneySaved * 100) / 100 // Round to 2 decimal places
  });
};

// Create activity
export const createActivity = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.userId;
    const { type, metadata = {} } = req.body;

    if (!userId) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized'
      });
      return;
    }

    // Validate activity type
    if (!Object.keys(ACTIVITY_POINTS).includes(type)) {
      res.status(400).json({
        success: false,
        error: 'Invalid activity type'
      });
      return;
    }

    // Create activity
    const activity = new Activity({
      userId,
      type: type as ActivityType,
      metadata,
    });

    await activity.save();

    // Recalculate and update user's aura score
    const newScore = await recalculateUserScore(userId);

    // Calculate and update cigarettes avoided and money saved
    await updateCigarettesAvoidedAndMoneySaved(userId, type);

    // Update user model based on activity type
    const updateData: any = {};
    
    if (type === 'cigarette_consumed') {
      // Update last smoked time
      updateData.lastSmoked = new Date();
    }

    // Update user fields if needed
    if (Object.keys(updateData).length > 0) {
      await User.findByIdAndUpdate(userId, updateData);
    }

    res.status(201).json({
      success: true,
      data: {
        activity: activity.toJSON(),
        newAuraScore: newScore
      }
    });
  } catch (error: any) {
    console.error('Create activity error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create activity'
    });
  }
};

// Get user activities (paginated with filters)
export const getUserActivities = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.userId;
    const { 
      page = 1, 
      limit = 20, 
      type, 
      startDate, 
      endDate 
    } = req.query;

    if (!userId) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized'
      });
      return;
    }

    // Build query filters
    const query: any = { userId };

    if (type) {
      query.type = type;
    }

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate as string);
      }
      if (endDate) {
        query.createdAt.$lte = new Date(endDate as string);
      }
    }

    // Calculate pagination
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Get activities with pagination
    const [activities, total] = await Promise.all([
      Activity.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Activity.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      data: {
        activities: activities.map(activity => activity.toJSON()),
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum)
        }
      }
    });
  } catch (error: any) {
    console.error('Get activities error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch activities'
    });
  }
};

// Update activity
export const updateActivity = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.userId;
    const { activityId } = req.params;
    const { type, metadata } = req.body;

    if (!userId) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized'
      });
      return;
    }

    // Find and verify ownership
    const activity = await Activity.findOne({ _id: activityId, userId });
    if (!activity) {
      res.status(404).json({
        success: false,
        error: 'Activity not found'
      });
      return;
    }

    // Update activity
    if (type && Object.keys(ACTIVITY_POINTS).includes(type)) {
      activity.type = type as ActivityType;
      activity.points = ACTIVITY_POINTS[type as ActivityType];
    }

    if (metadata) {
      activity.metadata = { ...activity.metadata, ...metadata };
    }

    await activity.save();

    // Recalculate user's aura score
    const newScore = await recalculateUserScore(userId);

    res.status(200).json({
      success: true,
      data: {
        activity: activity.toJSON(),
        newAuraScore: newScore
      }
    });
  } catch (error: any) {
    console.error('Update activity error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update activity'
    });
  }
};

// Delete activity
export const deleteActivity = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.userId;
    const { activityId } = req.params;

    if (!userId) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized'
      });
      return;
    }

    // Find and verify ownership
    const activity = await Activity.findOne({ _id: activityId, userId });
    if (!activity) {
      res.status(404).json({
        success: false,
        error: 'Activity not found'
      });
      return;
    }

    await Activity.findByIdAndDelete(activityId);

    // Recalculate user's aura score
    const newScore = await recalculateUserScore(userId);

    res.status(200).json({
      success: true,
      data: {
        deletedActivityId: activityId,
        newAuraScore: newScore
      }
    });
  } catch (error: any) {
    console.error('Delete activity error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete activity'
    });
  }
};
