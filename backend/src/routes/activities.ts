import { Router } from 'express';
import { 
  createActivity, 
  getUserActivities, 
  updateActivity, 
  deleteActivity 
} from '../controllers/activityController';
import { authenticateToken } from '../middleware';

const router = Router();

// All activity routes require authentication
router.use(authenticateToken);

// Activity CRUD routes
router.post('/', createActivity);
router.get('/', getUserActivities);
router.put('/:activityId', updateActivity);
router.delete('/:activityId', deleteActivity);

export default router;
