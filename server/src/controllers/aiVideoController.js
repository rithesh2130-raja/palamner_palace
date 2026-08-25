import { aiVideoService } from '../services/ai/aiVideoService.js';
import { getHumanReadableErrorMessage } from '../services/ai/xaiErrors.js';
import { Product } from '../models/Product.js';

export const generateVideo = async (req, res) => {
  try {
    const { prompt, productId, duration, aspectRatio, resolution, inputImageUrl } = req.body;

    const userId = req.user?.id || 'usr_creator_demo';
    const creatorId = req.user?.creatorId || req.user?.id || 'usr_creator_demo';

    let imageToUse = inputImageUrl;

    if (productId) {
      const product = await Product.findById(productId).catch(() => null);
      if (product && product.image && !imageToUse) {
        imageToUse = product.image;
      }
    }

    const job = await aiVideoService.generateVideoJob({
      userId,
      creatorId,
      productId: productId || null,
      rawPrompt: prompt,
      inputImageUrl: imageToUse,
      duration: duration || 5,
      aspectRatio: aspectRatio || '9:16',
      resolution: resolution || '720p',
    });

    return res.status(202).json({
      success: true,
      message: 'xAI Video generation submitted successfully',
      data: {
        jobId: job._id,
        xaiRequestId: job.xaiRequestId || job.requestId,
        requestId: job.xaiRequestId || job.requestId,
        status: job.status,
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
      message: userMessage,
    });
  }
};

export const getJobStatus = async (req, res) => {
  try {
    const { jobId } = req.params;
    const job = await aiVideoService.pollAndSyncJob(jobId);

    const videoUrl = job.videoUrl || job.outputVideoUrl || null;
    const xaiRequestId = job.xaiRequestId || job.requestId || null;

    return res.status(200).json({
      success: true,
      data: {
        _id: job._id,
        jobId: job._id,
        xaiRequestId,
        requestId: xaiRequestId,
        status: job.status,
        progress: job.progress,
        videoUrl,
        outputVideoUrl: videoUrl,
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
        error: job.error || job.errorMessage ? getHumanReadableErrorMessage(job.errorCode, job.errorMessage || job.error) : null,
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
