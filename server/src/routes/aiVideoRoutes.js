import { Router } from 'express';
import {
  generateVideo,
  getJobStatus,
  cancelJob,
  enhancePrompt,
  getGenerationHistory,
  getAdminAIAnalytics,
} from '../controllers/aiVideoController.js';

const router = Router();

// POST /api/v1/ai/videos/generate
router.post('/videos/generate', generateVideo);

// GET /api/v1/ai/videos/jobs/:jobId
router.get('/videos/jobs/:jobId', getJobStatus);

// POST /api/v1/ai/videos/jobs/:jobId/cancel
router.post('/videos/jobs/:jobId/cancel', cancelJob);

// GET /api/v1/ai/videos/history
router.get('/videos/history', getGenerationHistory);

// POST /api/v1/ai/prompts/enhance
router.post('/prompts/enhance', enhancePrompt);

// GET /api/v1/ai/analytics
router.get('/analytics', getAdminAIAnalytics);

export default router;
