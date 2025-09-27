import { Router } from 'express';
import authRoutes from './auth';
import onboardingRoutes from './onboarding';

const router = Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'AuraShift API is running',
    timestamp: new Date().toISOString(),
  });
});

// API routes
router.use('/auth', authRoutes);
router.use('/onboarding', onboardingRoutes);

export default router;
