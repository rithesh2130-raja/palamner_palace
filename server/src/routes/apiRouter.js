import { Router } from 'express';
import { getHealthStatus } from '../controllers/healthController.js';
import productRoutes from './productRoutes.js';
import categoryRoutes from './categoryRoutes.js';
import reelRoutes from './reelRoutes.js';
import advertisementRoutes from './advertisementRoutes.js';
import aiVideoRoutes from './aiVideoRoutes.js';

const apiRouter = Router();

// GET /api/v1/health
apiRouter.get('/health', getHealthStatus);

// Resource Endpoints
apiRouter.use('/products', productRoutes);
apiRouter.use('/categories', categoryRoutes);
apiRouter.use('/reels', reelRoutes);
apiRouter.use('/advertisements', advertisementRoutes);

// AI Reel Studio Endpoints (/api/v1/ai)
apiRouter.use('/ai', aiVideoRoutes);

export default apiRouter;
