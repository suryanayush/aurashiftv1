import { Router } from 'express';
import { register, login, getProfile, verifyToken } from '../controllers/authController';
import { validateRegister, validateLogin, authenticateToken } from '../middleware';

const router = Router();

// Public routes
router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);

// Protected routes
router.get('/profile', authenticateToken, getProfile);
router.get('/verify', authenticateToken, verifyToken);

export default router;
