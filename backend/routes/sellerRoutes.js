import express from 'express';
import { getSellers, createSeller, updateSeller, deleteSeller } from '../controllers/sellerController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, admin, getSellers).post(protect, admin, createSeller);
router.route('/:id').put(protect, admin, updateSeller).delete(protect, admin, deleteSeller);

export default router;
