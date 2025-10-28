import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

export const protect = async (req, res, next) => {
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith('Bearer')
  ) {
    return res.status(401).json({
      success: false,
      message: 'Token verification failed',
      error: 'No token provided',
    });
  }

  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Token verification failed',
        error: 'User not found',
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token verification failed',
      error: 'Invalid or expired token',
    });
  }
};

export const adminOnly = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized',
      error: 'User not authenticated',
    });
  }

  if (req.user.email !== 'admin@master.com') {
    return res.status(403).json({
      success: false,
      message: 'Access denied',
      error: 'Admin privileges required',
    });
  }

  next();
};