import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

// Validation middleware to handle express-validator results
export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array()
    });
    return;
  }
  
  next();
};

// Auth validation rules
export const validateRegister = [
  body('displayName')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Display name is required and must be less than 100 characters'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),
  
  handleValidationErrors
];

export const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  
  handleValidationErrors
];

// Onboarding validation rules
export const validateOnboarding = [
  body('yearsSmoked')
    .isNumeric()
    .isFloat({ min: 0 })
    .withMessage('Years smoked must be a positive number'),
  
  body('cigarettesPerDay')
    .isNumeric()
    .isFloat({ min: 0 })
    .withMessage('Cigarettes per day must be a positive number'),
  
  body('costPerCigarette')
    .isNumeric()
    .isFloat({ min: 0 })
    .withMessage('Cost per cigarette must be a positive number'),
  
  body('motivations')
    .isArray({ min: 1 })
    .withMessage('At least one motivation is required')
    .custom((motivations: string[]) => {
      if (!Array.isArray(motivations) || motivations.length === 0) {
        throw new Error('At least one motivation is required');
      }
      
      const validMotivations = [
        'Health & Wellness',
        'Save Money',
        'Family & Relationships',
        'Physical Appearance',
        'Fitness & Performance',
        'Social Reasons',
        'Self-Control',
        'Medical Advice'
      ];
      
      for (const motivation of motivations) {
        if (!validMotivations.includes(motivation)) {
          throw new Error(`Invalid motivation: ${motivation}`);
        }
      }
      
      return true;
    }),
  
  handleValidationErrors
];
