import { Router } from 'express';
import { getReels } from '../controllers/reelController.js';

const router = Router();

router.get('/', getReels);

export default router;
