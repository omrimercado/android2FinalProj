import express from 'express';
import {
  createPost,
  getPosts,
  getUserPosts,
  getGroupPosts,
  updatePost,
  deletePost,
  likePost,
  addComment,
  getComments,
} from '../controllers/postController.js';
import { protect } from '../middleware/authMiddleware.js';
import {
  validatePost,
  validatePostUpdate,
  validateComment,
} from '../middleware/validationMiddleware.js';

const router = express.Router();

router.post('/', protect, validatePost, createPost);
router.get('/', protect, getPosts);
router.get('/user/:userId', protect, getUserPosts);
router.get('/group/:groupId', protect, getGroupPosts);
router.put('/:postId', protect, validatePostUpdate, updatePost);
router.delete('/:postId', protect, deletePost);

router.post('/:postId/like', protect, likePost);
router.post('/:postId/comment', protect, validateComment, addComment);
router.get('/:postId/comments', protect, getComments);

export default router;
