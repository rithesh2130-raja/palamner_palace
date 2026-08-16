import express from 'express';
import {
  getReelsFeed,
  getReelById,
  createReel,
  recordReelView,
  toggleLikeReel,
  toggleSaveReel,
  generateOmniReel,
} from '../controllers/reelController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/feed', getReelsFeed);
router.post('/generate-omni', generateOmniReel);
router.get('/:id', getReelById);
router.post('/', createReel);
router.post('/:id/view', recordReelView);
router.post('/:id/like', toggleLikeReel);
router.post('/:id/save', toggleSaveReel);

export default router;
