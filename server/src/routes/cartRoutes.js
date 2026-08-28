import { Router } from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import {
  getCart,
  addItem,
  updateItem,
  removeItem,
  clearCart,
} from '../controllers/cartController.js';

const router = Router();

router.use(requireAuth);

router.get('/', getCart);
router.post('/items', addItem);
router.patch('/items/:productId', updateItem);
router.delete('/items/:productId', removeItem);
router.delete('/', clearCart);

export default router;
