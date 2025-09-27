import { Request, Response } from 'express';
import { Activity } from '../models/Activity';
import { User } from '../models';

// Chart data interfaces - exactly matching frontend
export interface ChartDataPoint {
  label: string;
  aura_score: number;
  cigarettes_avoided: number;
  cigarettes_consumed: number;
  money_saved: number;
}

export interface MultiSeriesData {
  labels: string[];
  series: {
    aura_score: number[];
    cigarettes_avoided: number[];
    cigarettes_consumed: number[];
    money_saved: number[];
  };
}

export type TimeRange = '4d' | '30d' | '90d';

// Helper function to get date range and labels
const getDateRangeAndLabels = (timeRange: TimeRange) => {
  const now = new Date();
  let startDate: Date;
  let labels: string[];

  switch (timeRange) {
    case '4d':
      startDate = new Date(now.getTime() - (4 * 24 * 60 * 60 * 1000));
      labels = ['Day 1', 'Day 2', 'Day 3', 'Day 4'];
      break;
    case '30d':
      startDate = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
      labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
      break;
    case '90d':
      startDate = new Date(now.getTime() - (90 * 24 * 60 * 60 * 1000));
      labels = ['Month 1', 'Month 2', 'Month 3'];
      break;
    default:
      startDate = new Date(now.getTime() - (4 * 24 * 60 * 60 * 1000));
      labels = ['Day 1', 'Day 2', 'Day 3', 'Day 4'];
  }

  return { startDate, labels, endDate: now };
};

// Helper function to group activities by time periods
const groupActivitiesByPeriod = (activities: any[], timeRange: TimeRange, startDate: Date, endDate: Date) => {
  const periods: any[][] = [];
  const now = endDate;

  switch (timeRange) {
    case '4d':
      // Group by days
      for (let i = 0; i < 4; i++) {
        const dayStart = new Date(startDate.getTime() + (i * 24 * 60 * 60 * 1000));
        const dayEnd = new Date(dayStart.getTime() + (24 * 60 * 60 * 1000));
        
        const dayActivities = activities.filter(activity => {
          const activityDate = new Date(activity.createdAt);
          return activityDate >= dayStart && activityDate < dayEnd;
        });
        
        periods.push(dayActivities);
      }
      break;

    case '30d':
      // Group by weeks
      for (let i = 0; i < 4; i++) {
        const weekStart = new Date(startDate.getTime() + (i * 7 * 24 * 60 * 60 * 1000));
        const weekEnd = new Date(weekStart.getTime() + (7 * 24 * 60 * 60 * 1000));
        
        const weekActivities = activities.filter(activity => {
          const activityDate = new Date(activity.createdAt);
          return activityDate >= weekStart && activityDate < weekEnd;
        });
        
        periods.push(weekActivities);
      }
      break;

    case '90d':
      // Group by months
      for (let i = 0; i < 3; i++) {
        const monthStart = new Date(startDate.getTime() + (i * 30 * 24 * 60 * 60 * 1000));
        const monthEnd = new Date(monthStart.getTime() + (30 * 24 * 60 * 60 * 1000));
        
        const monthActivities = activities.filter(activity => {
          const activityDate = new Date(activity.createdAt);
          return activityDate >= monthStart && activityDate < monthEnd;
        });
        
        periods.push(monthActivities);
      }
      break;
  }

  return periods;
};

// Get chart data for user
export const getChartData = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.userId;
    const { timeRange = '4d' } = req.query;

    if (!userId) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized'
      });
      return;
    }

    // Validate timeRange
    if (!['4d', '30d', '90d'].includes(timeRange as string)) {
      res.status(400).json({
        success: false,
        error: 'Invalid time range. Must be 4d, 30d, or 90d'
      });
      return;
    }

    const { startDate, labels, endDate } = getDateRangeAndLabels(timeRange as TimeRange);

    // Get user activities in the date range
    const activities = await Activity.find({
      userId,
      createdAt: {
        $gte: startDate,
        $lte: endDate
      }
    }).sort({ createdAt: 1 });

    // Get user data for baseline calculations
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found'
      });
      return;
    }

    // Group activities by time periods
    const periods = groupActivitiesByPeriod(activities, timeRange as TimeRange, startDate, endDate);

    // Calculate series data
    const series = {
      aura_score: [] as number[],
      cigarettes_avoided: [] as number[],
      cigarettes_consumed: [] as number[],
      money_saved: [] as number[],
    };

    // Calculate baseline score from activities before the time range
    const activitiesBeforeRange = await Activity.find({
      userId,
      createdAt: { $lt: startDate }
    });
    
    const baselineScore = Math.max(0, activitiesBeforeRange.reduce((sum: number, a: any) => sum + a.points, 0));
    let runningScore = baselineScore;
    
    // Get user's smoking pattern for calculations
    const dailyCigarettes = user.smokingHistory?.cigarettesPerDay || 20;
    const costPerCigarette = user.smokingHistory?.costPerCigarette || 5; // Default 5 rupees per cigarette

    // Calculate progressive score for each period
    periods.forEach((periodActivities) => {
      // Calculate points for this period
      const periodPoints = periodActivities.reduce((sum, activity) => sum + activity.points, 0);
      
      // Update running score
      runningScore += periodPoints;
      
      // Push the score (ensure it doesn't go below 0)
      series.aura_score.push(Math.max(0, runningScore));

      // Count cigarettes consumed in this period
      const cigarettesConsumed = periodActivities.filter(a => a.type === 'cigarette_consumed').length;
      series.cigarettes_consumed.push(cigarettesConsumed);

      // Calculate cigarettes avoided and money saved for this period
      let cigarettesAvoidedInPeriod = 0;
      let moneySavedInPeriod = 0;

      if (timeRange === '4d') {
        // For daily view: expected daily expenditure - actual expenditure
        const expectedDailyExpenditure = dailyCigarettes * costPerCigarette;
        const actualDailyExpenditure = cigarettesConsumed * costPerCigarette;
        cigarettesAvoidedInPeriod = Math.max(0, dailyCigarettes - cigarettesConsumed);
        moneySavedInPeriod = Math.max(0, expectedDailyExpenditure - actualDailyExpenditure);
      } else if (timeRange === '30d') {
        // For weekly view: expected weekly expenditure - actual expenditure
        const expectedWeeklyExpenditure = (dailyCigarettes * 7) * costPerCigarette;
        const actualWeeklyExpenditure = cigarettesConsumed * costPerCigarette;
        cigarettesAvoidedInPeriod = Math.max(0, (dailyCigarettes * 7) - cigarettesConsumed);
        moneySavedInPeriod = Math.max(0, expectedWeeklyExpenditure - actualWeeklyExpenditure);
      } else if (timeRange === '90d') {
        // For monthly view: expected monthly expenditure - actual expenditure
        const expectedMonthlyExpenditure = (dailyCigarettes * 30) * costPerCigarette;
        const actualMonthlyExpenditure = cigarettesConsumed * costPerCigarette;
        cigarettesAvoidedInPeriod = Math.max(0, (dailyCigarettes * 30) - cigarettesConsumed);
        moneySavedInPeriod = Math.max(0, expectedMonthlyExpenditure - actualMonthlyExpenditure);
      }

      series.cigarettes_avoided.push(cigarettesAvoidedInPeriod);
      series.money_saved.push(Math.round(moneySavedInPeriod * 100) / 100); // Round to 2 decimal places
    });

    const chartData: MultiSeriesData = {
      labels,
      series
    };

    res.status(200).json({
      success: true,
      data: chartData
    });
  } catch (error: any) {
    console.error('Chart data error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch chart data'
    });
  }
};
