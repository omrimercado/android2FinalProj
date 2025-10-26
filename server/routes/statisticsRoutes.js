import express from 'express';
import {
  getPostsOverTime,
  getPostsPerGroup,
  getPopularGroups,
  getGeneralStats,
  getUserActivity,
} from '../controllers/statisticsController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// All statistics routes require authentication AND admin privileges
router.get('/posts-over-time', protect, adminOnly, getPostsOverTime);
router.get('/posts-per-group', protect, adminOnly, getPostsPerGroup);
router.get('/popular-groups', protect, adminOnly, getPopularGroups);
router.get('/general', protect, adminOnly, getGeneralStats);
router.get('/user-activity', protect, adminOnly, getUserActivity);

export default router;

