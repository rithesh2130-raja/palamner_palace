import { Router } from 'express';
import { getHealthStatus } from '../controllers/healthController.js';
import productRoutes from './productRoutes.js';
import categoryRoutes from './categoryRoutes.js';
import reelRoutes from './reelRoutes.js';
import advertisementRoutes from './advertisementRoutes.js';
import aiVideoRoutes from './aiVideoRoutes.js';
import cartRoutes from './cartRoutes.js';
import wishlistRoutes from './wishlistRoutes.js';
import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';
import addressRoutes from './addressRoutes.js';
import checkoutRoutes from './checkoutRoutes.js';
import orderRoutes from './orderRoutes.js';

const apiRouter = Router();

// GET /api/v1/health
apiRouter.get('/health', getHealthStatus);

// Auth, User Profile & Addresses Endpoints
apiRouter.use('/auth', authRoutes);
apiRouter.use('/users', userRoutes);
apiRouter.use('/addresses', addressRoutes);

// Resource Endpoints
apiRouter.use('/products', productRoutes);
apiRouter.use('/categories', categoryRoutes);
apiRouter.use('/reels', reelRoutes);
apiRouter.use('/advertisements', advertisementRoutes);
apiRouter.use('/cart', cartRoutes);
apiRouter.use('/wishlist', wishlistRoutes);
apiRouter.use('/checkout', checkoutRoutes);
apiRouter.use('/orders', orderRoutes);

// AI Reel Studio Endpoints (/api/v1/ai)
apiRouter.use('/ai', aiVideoRoutes);

export default apiRouter;
