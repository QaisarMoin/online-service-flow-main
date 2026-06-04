import express from 'express';
const router = express.Router();
import { getMessages, sendMessage, getChatUsers } from '../controllers/messageController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/')
  .get(protect, getMessages)
  .post(protect, sendMessage);

router.route('/users')
  .get(protect, admin, getChatUsers);

router.route('/:userId')
  .get(protect, getMessages);

export default router;
