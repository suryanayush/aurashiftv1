import { Router } from 'express';
import { 
  completeOnboarding, 
  updateOnboarding, 
  getOnboardingStatus 
} from '../controllers/onboardingController';
import { validateOnboarding, authenticateToken } from '../middleware';

const router = Router();

// All onboarding routes require authentication
router.use(authenticateToken);

// Onboarding routes
router.post('/complete', validateOnboarding, completeOnboarding);
router.put('/update', validateOnboarding, updateOnboarding);
router.get('/status', getOnboardingStatus);

export default router;
