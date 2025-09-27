import { Router } from 'express';
import { getChartData } from '../controllers/chartController';
import { authenticateToken } from '../middleware';

const router = Router();

// Chart routes require authentication
router.get('/data', authenticateToken, getChartData);

export default router;
