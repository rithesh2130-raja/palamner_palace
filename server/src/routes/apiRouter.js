import { Router } from 'express';
import { getHealthStatus } from '../controllers/healthController.js';
import productRoutes from './productRoutes.js';
import categoryRoutes from './categoryRoutes.js';
import reelRoutes from './reelRoutes.js';
import advertisementRoutes from './advertisementRoutes.js';

const apiRouter = Router();

// GET /api/v1/health
apiRouter.get('/health', getHealthStatus);

// Resource Endpoints
apiRouter.use('/products', productRoutes);
apiRouter.use('/categories', categoryRoutes);
apiRouter.use('/reels', reelRoutes);
apiRouter.use('/advertisements', advertisementRoutes);

export default apiRouter;
