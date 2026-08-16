import express from 'express';
import {
  getCreatorByUsername,
  toggleFollowCreator,
  getCreatorAnalytics,
} from '../controllers/creatorController.js';

const router = express.Router();

router.get('/:username', getCreatorByUsername);
router.post('/:id/follow', toggleFollowCreator);
router.get('/:id/analytics', getCreatorAnalytics);

export default router;
