import { Router } from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import {
  getReels,
  getReelById,
  toggleLikeReel,
  toggleSaveReel,
  addReelComment,
  recordReelView,
} from '../controllers/reelController.js';

const router = Router();

// Public feed & details
router.get('/', getReels);
router.get('/:id', getReelById);
router.post('/:id/view', recordReelView);

// Authenticated interactions
router.post('/:id/like', requireAuth, toggleLikeReel);
router.post('/:id/save', requireAuth, toggleSaveReel);
router.post('/:id/comments', requireAuth, addReelComment);

export default router;
