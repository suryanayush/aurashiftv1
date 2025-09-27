import { Router } from 'express';
import { getDashboardStats } from '../controllers/dashboardController';
import { authenticateToken } from '../middleware';

const router = Router();

router.get('/stats', authenticateToken, getDashboardStats);

export default router;
