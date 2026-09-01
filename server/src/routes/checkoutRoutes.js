import { Router } from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import { getCheckoutPreview } from '../controllers/checkoutController.js';

const router = Router();

// POST /api/v1/checkout/preview
router.post('/preview', requireAuth, getCheckoutPreview);

export default router;
