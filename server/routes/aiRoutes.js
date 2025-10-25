import express from 'express';
import { generatePostWithAI } from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validateAIPostGeneration } from '../middleware/validationMiddleware.js';

const router = express.Router();
router.post('/generate-post', protect, validateAIPostGeneration, generatePostWithAI);

export default router;