import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/authMiddleware.js';
import {
  placeOrder,
  getOrders,
  getOrder,
  cancelOrder,
  getAdminOrders,
  updateOrderStatusAdmin,
} from '../controllers/orderController.js';

const router = Router();

// Customer Order Endpoints (All require authentication)
router.post('/', requireAuth, placeOrder);
router.get('/', requireAuth, getOrders);

// Admin-only endpoints (declared before :orderId to prevent parameter route collision)
router.get('/admin/all', requireAuth, requireRole('admin'), getAdminOrders);
router.patch('/admin/:orderId/status', requireAuth, requireRole('admin'), updateOrderStatusAdmin);

// Detailed single order endpoints
router.get('/:orderId', requireAuth, getOrder);
router.post('/:orderId/cancel', requireAuth, cancelOrder);

export default router;
