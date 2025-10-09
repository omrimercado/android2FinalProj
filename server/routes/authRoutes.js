import express from 'express';
import {
  register,
  login,
  verifyToken,
  logout,
  forgotPassword,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import {
  validateRegister,
  validateLogin,
} from '../middleware/validationMiddleware.js';

const router = express.Router();

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.post('/forgot-password', forgotPassword);

router.post('/verify-token', protect, verifyToken);
router.post('/logout', protect, logout);

export default router;