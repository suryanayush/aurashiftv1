import { Router } from 'express';
import authRoutes from './auth';
import onboardingRoutes from './onboarding';
import dashboardRoutes from './dashboard';
import activitiesRoutes from './activities';
import chartRoutes from './chart';

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
router.use('/dashboard', dashboardRoutes);
router.use('/activities', activitiesRoutes);
router.use('/chart', chartRoutes);

export default router;
