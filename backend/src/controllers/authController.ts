import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models';
import { LoginRequest, RegisterRequest, AuthResponse } from '../types';
import config from '../config/env';

// Generate JWT token
const generateToken = (userId: string, email: string): string => {
  return jwt.sign(
    { userId, email },
    config.JWT_SECRET,
    { expiresIn: config.JWT_EXPIRE } as jwt.SignOptions
  );
};

// Register user
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { displayName, email, password }: RegisterRequest = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({
        success: false,
        error: 'User with this email already exists'
      } as AuthResponse);
      return;
    }

    // Create new user
    const user = new User({
      displayName: displayName.trim(),
      email: email.toLowerCase().trim(),
      password,
      onboardingCompleted: false,
      auraScore: 0,
      cigarettesAvoided: 0,
      totalMoneySaved: 0,
    });

    await user.save();

    // Generate token
    const token = generateToken(user.id, user.email);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        onboardingCompleted: user.onboardingCompleted,
      }
    } as AuthResponse);
  } catch (error: any) {
    console.error('Registration error:', error);
    
    if (error.code === 11000) {
      res.status(400).json({
        success: false,
        error: 'User with this email already exists'
      } as AuthResponse);
      return;
    }

    res.status(500).json({
      success: false,
      error: 'Registration failed. Please try again.'
    } as AuthResponse);
  }
};

// Login user
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password }: LoginRequest = req.body;

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      res.status(400).json({
        success: false,
        error: 'Invalid credentials'
      } as AuthResponse);
      return;
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      res.status(400).json({
        success: false,
        error: 'Invalid credentials'
      } as AuthResponse);
      return;
    }

    // Generate token
    const token = generateToken(user.id, user.email);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        onboardingCompleted: user.onboardingCompleted,
      }
    } as AuthResponse);
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Login failed. Please try again.'
    } as AuthResponse);
  }
};

// Get current user profile
export const getProfile = async (req: Request, res: Response): Promise<void> => {
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

    res.status(200).json({
      success: true,
      user: user.toJSON()
    });
  } catch (error: any) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch profile'
    });
  }
};

// Verify token and get user data
export const verifyToken = async (req: Request, res: Response): Promise<void> => {
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

    res.status(200).json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        onboardingCompleted: user.onboardingCompleted,
      }
    } as AuthResponse);
  } catch (error: any) {
    console.error('Token verification error:', error);
    res.status(500).json({
      success: false,
      error: 'Token verification failed'
    });
  }
};
