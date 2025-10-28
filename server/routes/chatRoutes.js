import express from 'express';
import {
  getConversation,
  getUserConversations,
  markAsRead,
  deleteConversation
} from '../controllers/chatController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
router.use(protect);
router.get('/conversations', getUserConversations);
router.get('/conversation/:userId/:targetUserId', getConversation);
router.put('/conversation/:conversationId/read', markAsRead);
router.delete('/conversation/:conversationId', deleteConversation);

export default router;

