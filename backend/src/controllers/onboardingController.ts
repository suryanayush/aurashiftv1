import { Request, Response } from 'express';
import { User } from '../models';
import { OnboardingRequest, OnboardingResponse } from '../types';

interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
  };
}

// Complete onboarding process
export const completeOnboarding = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    
    if (!userId) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized'
      } as OnboardingResponse);
      return;
    }

    const { yearsSmoked, cigarettesPerDay, costPerCigarette, motivations }: OnboardingRequest = req.body;

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found'
      } as OnboardingResponse);
      return;
    }

    // Check if onboarding is already completed
    if (user.onboardingCompleted) {
      res.status(400).json({
        success: false,
        error: 'Onboarding already completed'
      } as OnboardingResponse);
      return;
    }

    // Update user with smoking history
    user.smokingHistory = {
      yearsSmoked,
      cigarettesPerDay,
      costPerCigarette,
      motivations,
    };
    user.onboardingCompleted = true;
    user.streakStartTime = new Date(); // Start the streak timer
    user.auraScore = 0; // Reset aura score for fresh start

    await user.save();

    res.status(200).json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        smokingHistory: user.smokingHistory,
        onboardingCompleted: user.onboardingCompleted,
      }
    } as OnboardingResponse);
  } catch (error: any) {
    console.error('Onboarding completion error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to complete onboarding. Please try again.'
    } as OnboardingResponse);
  }
};

// Update onboarding data (for partial updates)
export const updateOnboarding = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    
    if (!userId) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized'
      } as OnboardingResponse);
      return;
    }

    const { yearsSmoked, cigarettesPerDay, costPerCigarette, motivations }: OnboardingRequest = req.body;

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found'
      } as OnboardingResponse);
      return;
    }

    // Update smoking history
    user.smokingHistory = {
      yearsSmoked,
      cigarettesPerDay,
      costPerCigarette,
      motivations,
    };

    // If this is the first time completing onboarding
    if (!user.onboardingCompleted) {
      user.onboardingCompleted = true;
      user.streakStartTime = new Date();
      user.auraScore = 0;
    }

    await user.save();

    res.status(200).json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        smokingHistory: user.smokingHistory,
        onboardingCompleted: user.onboardingCompleted,
      }
    } as OnboardingResponse);
  } catch (error: any) {
    console.error('Onboarding update error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update onboarding data. Please try again.'
    } as OnboardingResponse);
  }
};

// Get onboarding status
export const getOnboardingStatus = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    
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

    res.status(200).json({
      success: true,
      data: {
        onboardingCompleted: user.onboardingCompleted,
        smokingHistory: user.smokingHistory || null,
      }
    });
  } catch (error: any) {
    console.error('Get onboarding status error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get onboarding status'
    });
  }
};
