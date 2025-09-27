import { Router } from 'express';
import { register, login, getProfile } from '../controllers/authController';
import { validateRegister, validateLogin, authenticateToken } from '../middleware';

const router = Router();

// Public routes
router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);

// Protected routes
router.get('/profile', authenticateToken, getProfile);

export default router;
