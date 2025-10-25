import express from 'express';
import {
  createPost,
  getPosts,
  getUserPosts,
  likePost,
  addComment,
  getComments,
} from '../controllers/postController.js';
import { protect } from '../middleware/authMiddleware.js';
import {
  validatePost,
  validateComment,
} from '../middleware/validationMiddleware.js';

const router = express.Router();

router.post('/', protect, validatePost, createPost);
router.get('/', protect, getPosts);
router.get('/user/:userId', protect, getUserPosts);

router.post('/:postId/like', protect, likePost);
router.post('/:postId/comment', protect, validateComment, addComment);
router.get('/:postId/comments', protect, getComments);

export default router;
