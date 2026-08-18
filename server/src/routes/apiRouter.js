import { Router } from 'express';
import { getHealthStatus } from '../controllers/healthController.js';
import productRoutes from './productRoutes.js';
import categoryRoutes from './categoryRoutes.js';
import reelRoutes from './reelRoutes.js';

const apiRouter = Router();

// GET /api/v1/health
apiRouter.get('/health', getHealthStatus);

// API v1 Resource Endpoints
apiRouter.use('/products', productRoutes);
apiRouter.use('/categories', categoryRoutes);
apiRouter.use('/reels', reelRoutes);

export default apiRouter;
