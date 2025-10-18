import express from 'express';
import {
  getConversation,
  getUserConversations,
  markAsRead,
  deleteConversation
} from '../controllers/chatController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// כל ה-routes דורשים אימות
router.use(protect);

// קבלת כל השיחות של המשתמש
router.get('/conversations', getUserConversations);

// קבלת שיחה ספציפית
router.get('/conversation/:userId/:targetUserId', getConversation);

// סימון הודעות כנקראו
router.put('/conversation/:conversationId/read', markAsRead);

// מחיקת שיחה
router.delete('/conversation/:conversationId', deleteConversation);

export default router;

