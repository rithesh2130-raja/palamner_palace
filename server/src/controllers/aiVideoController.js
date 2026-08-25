import { aiVideoService } from '../services/ai/aiVideoService.js';
import { getHumanReadableErrorMessage } from '../services/ai/xaiErrors.js';
import Product from '../models/Product.js';

export const generateVideo = async (req, res) => {
  try {
    const { prompt, productId, duration, aspectRatio, resolution, inputImageUrl } = req.body;

    // Default creator and user context (from Auth or fallback for testing)
    const userId = req.user?.id || 'usr_creator_demo';
    const creatorId = req.user?.creatorId || req.user?.id || 'usr_creator_demo';

    let productContext = null;
    let imageToUse = inputImageUrl;

    if (productId) {
      const product = await Product.findById(productId).catch(() => null);
      if (product) {
        productContext = {
          title: product.title,
          brand: product.brand,
          category: product.category,
          price: product.price,
          description: product.description,
        };
        if (!imageToUse && product.image) {
          imageToUse = product.image;
        }
      }
    }

    const job = await aiVideoService.generateVideoJob({
      userId,
      creatorId,
      productId: productId || null,
      rawPrompt: prompt,
      inputImageUrl: imageToUse,
      duration: duration || 6,
      aspectRatio: aspectRatio || '9:16',
      resolution: resolution || '720p',
      productContext,
    });

    return res.status(202).json({
      success: true,
      message: 'Video generation submitted successfully',
      data: {
        jobId: job._id,
        requestId: job.requestId,
        status: job.status,
        progress: job.progress,
        estimatedCost: job.estimatedCost,
        provider: job.provider,
        model: job.model,
      },
    });
  } catch (err) {
    const userMessage = getHumanReadableErrorMessage(err.code, err.message);
    return res.status(err.status || 500).json({
      success: false,
      code: err.code || 'GENERATION_ERROR',
      error: userMessage,
    });
  }
};

export const getJobStatus = async (req, res) => {
  try {
    const { jobId } = req.params;
    const job = await aiVideoService.pollAndSyncJob(jobId);

    return res.status(200).json({
      success: true,
      data: {
        jobId: job._id,
        requestId: job.requestId,
        status: job.status,
        progress: job.progress,
        outputVideoUrl: job.outputVideoUrl,
        thumbnailUrl: job.thumbnailUrl,
        prompt: job.prompt,
        enhancedPrompt: job.enhancedPrompt,
        duration: job.duration,
        aspectRatio: job.aspectRatio,
        resolution: job.resolution,
        productId: job.productId,
        provider: job.provider,
        model: job.model,
        errorCode: job.errorCode,
        errorMessage: job.errorMessage ? getHumanReadableErrorMessage(job.errorCode, job.errorMessage) : null,
        createdAt: job.createdAt,
        completedAt: job.completedAt,
      },
    });
  } catch (err) {
    return res.status(err.status || 500).json({
      success: false,
      error: err.message || 'Failed to retrieve generation status',
    });
  }
};

export const cancelJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const job = await aiVideoService.pollAndSyncJob(jobId);
    return res.status(200).json({
      success: true,
      message: 'Job cancellation requested',
      data: { jobId: job._id, status: 'CANCELLED' },
    });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
};

export const enhancePrompt = async (req, res) => {
  try {
    const { prompt, productContext } = req.body;
    const enhanced = await aiVideoService.enhancePrompt(prompt, productContext || {});
    return res.status(200).json({
      success: true,
      data: { enhancedPrompt: enhanced },
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to enhance prompt' });
  }
};

export const getGenerationHistory = async (req, res) => {
  try {
    const creatorId = req.user?.creatorId || req.user?.id || 'usr_creator_demo';
    const history = await aiVideoService.getCreatorHistory(creatorId);
    return res.status(200).json({
      success: true,
      data: history,
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const getAdminAIAnalytics = async (req, res) => {
  try {
    const analytics = await aiVideoService.getAdminAIAnalytics();
    return res.status(200).json({
      success: true,
      data: analytics,
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};
