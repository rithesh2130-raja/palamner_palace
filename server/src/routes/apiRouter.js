import { Router } from 'express';
import { getHealthStatus } from '../controllers/healthController.js';

const apiRouter = Router();

// GET /api/v1/health
apiRouter.get('/health', getHealthStatus);

export default apiRouter;
