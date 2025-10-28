import express from 'express';
import {
  searchPosts,
  searchGroups,
} from '../controllers/searchController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/posts', searchPosts);
router.get('/groups', searchGroups);

export default router;