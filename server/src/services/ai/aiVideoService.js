import AIGenerationJob from '../../models/AIGenerationJob.js';
import XAIProvider from './XAIProvider.js';
import MockVideoGenerationProvider from './MockVideoGenerationProvider.js';
import { Product } from '../../models/Product.js';
import { XAI_VIDEO_PRICING, SUPPORTED_ASPECT_RATIOS, SUPPORTED_RESOLUTIONS, SUPPORTED_DURATIONS } from './xaiTypes.js';
import { AIVideoError, ERROR_CODES } from './xaiErrors.js';

class AIVideoService {
  constructor() {
    this.xaiProvider = new XAIProvider();
    this.mockProvider = new MockVideoGenerationProvider();
  }

  getProvider() {
    const configuredProvider = (process.env.VIDEO_PROVIDER || 'xai').toLowerCase();

    if (configuredProvider === 'mock') {
      if (process.env.NODE_ENV === 'production') {
        throw new AIVideoError(
          'INVALID_CONFIGURATION',
          'Production environment cannot use mock video generation provider. Set VIDEO_PROVIDER=xai in environment.',
          500
        );
      }
      return this.mockProvider;
    }

    return this.xaiProvider;
  }

  calculateEstimatedCost(duration = 5, resolution = '720p', model = 'grok-imagine-video-1.5') {
    const modelPricing = XAI_VIDEO_PRICING[model] || XAI_VIDEO_PRICING['grok-imagine-video-1.5'];
    const resPricing = modelPricing[resolution] || modelPricing['720p'];
    return resPricing[duration] || 0.15;
  }

  sanitizePrompt(prompt) {
    if (!prompt || typeof prompt !== 'string') return '';
    return prompt.trim().replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').substring(0, 1000);
  }

  constructProductAwarePrompt(rawPrompt, product) {
    const cleanPrompt = this.sanitizePrompt(rawPrompt);

    const basePrompt = 'Create a premium vertical social-commerce product advertisement featuring the provided product image. Preserve the product\'s visual identity and important physical characteristics. Place the product in a visually appropriate environment. Use smooth cinematic camera movement, realistic lighting, detailed materials, professional advertising composition, and a strong hero shot at the end. Do not add fake specifications, prices, logos, labels, or text that were not provided.';

    if (!product) return `${basePrompt} ${cleanPrompt}`;

    const brand = product.brand ? `${product.brand} ` : '';
    const title = product.title ? product.title.trim() : 'item';

    return `${basePrompt} Product details: ${brand}${title}. ${cleanPrompt}`;
  }

  async generateVideoJob({ userId, creatorId, productId, rawPrompt, inputImageUrl, duration = 5, aspectRatio = '9:16', resolution = '720p' }) {
    if (!userId || !creatorId) {
      throw new AIVideoError(ERROR_CODES.UNAUTHORIZED, 'User authentication required for AI generation');
    }

    const cleanPrompt = this.sanitizePrompt(rawPrompt);
    if (!cleanPrompt || cleanPrompt.length < 5) {
      throw new AIVideoError(ERROR_CODES.GENERATION_FAILED, 'Please provide a descriptive prompt of at least 5 characters');
    }

    // FREE TIER USAGE LIMITER (Only count actual COMPLETED successful video generations)
    const dailyLimit = Number(process.env.XAI_FREE_DAILY_LIMIT) || 5;
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const successfulCompletedJobs = await AIGenerationJob.countDocuments({
      creatorId,
      createdAt: { $gte: twentyFourHoursAgo },
      status: 'COMPLETED',
      xaiRequestId: { $exists: true, $ne: null },
    }).catch(() => 0);

    if (successfulCompletedJobs >= dailyLimit) {
      throw new AIVideoError(
        'FREE_TIER_LIMIT_EXCEEDED',
        `Free Tier Daily Limit Reached (${successfulCompletedJobs}/${dailyLimit} completed generations in 24h). Further requests are strictly blocked to prevent unexpected API usage charges.`,
        429
      );
    }

    // Retrieve product if productId provided
    let productObj = null;
    let finalInputImageUrl = inputImageUrl || null;

    if (productId) {
      try {
        productObj = await Product.findById(productId);
        if (productObj && productObj.image) {
          finalInputImageUrl = productObj.image;
        }
      } catch {
        // If not found in DB, check fallback
      }
    }

    const finalPrompt = this.constructProductAwarePrompt(cleanPrompt, productObj);
    const provider = this.getProvider();
    const model = process.env.XAI_VIDEO_MODEL || 'grok-imagine-video-1.5';
    const estimatedCost = this.calculateEstimatedCost(Number(duration), resolution, model);

    // Initial database job record
    const job = new AIGenerationJob({
      userId,
      creatorId,
      productId: productId || null,
      type: finalInputImageUrl ? 'image-to-video' : 'text-to-video',
      provider: provider.name,
      model,
      prompt: cleanPrompt,
      enhancedPrompt: finalPrompt,
      inputImageUrl: finalInputImageUrl,
      status: 'QUEUED',
      progress: 0,
      estimatedCost,
      actualCost: estimatedCost,
      duration: Number(duration),
      aspectRatio,
      resolution,
    });

    await job.save();

    try {
      // Dispatch generation request to xAI API
      const dispatchResult = await provider.generateVideo({
        prompt: finalPrompt,
        inputImageUrl: finalInputImageUrl,
        duration: Number(duration),
        aspectRatio,
        resolution,
      });

      job.xaiRequestId = dispatchResult.xaiRequestId || dispatchResult.requestId;
      job.requestId = job.xaiRequestId;
      job.status = 'GENERATING';
      await job.save();

      return job;
    } catch (err) {
      job.status = 'FAILED';
      job.errorCode = err.code || ERROR_CODES.GENERATION_FAILED;
      job.errorMessage = err.message;
      job.error = err.message;
      await job.save();
      throw err;
    }
  }

  async pollAndSyncJob(jobId) {
    const job = await AIGenerationJob.findById(jobId);
    if (!job) {
      throw new AIVideoError(ERROR_CODES.JOB_NOT_FOUND, 'Generation job not found', 404);
    }

    if (['COMPLETED', 'FAILED', 'EXPIRED', 'CANCELLED'].includes(job.status)) {
      return job;
    }

    if (!job.xaiRequestId && !job.requestId) {
      return job;
    }

    const provider = this.getProvider();
    const targetRequestId = job.xaiRequestId || job.requestId;

    try {
      const providerStatus = await provider.getGenerationStatus(targetRequestId);

      job.status = providerStatus.status;

      if (providerStatus.outputVideoUrl || providerStatus.videoUrl) {
        const finalUrl = providerStatus.outputVideoUrl || providerStatus.videoUrl;
        job.outputVideoUrl = finalUrl;
        job.videoUrl = finalUrl;
      }

      if (providerStatus.thumbnailUrl) {
        job.thumbnailUrl = providerStatus.thumbnailUrl;
      }

      if (providerStatus.status === 'COMPLETED') {
        job.completedAt = new Date();
        job.progress = 100;
      } else if (providerStatus.status === 'FAILED') {
        job.errorCode = providerStatus.errorCode || ERROR_CODES.GENERATION_FAILED;
        job.errorMessage = providerStatus.errorMessage || 'AI video generation failed on provider side';
        job.error = job.errorMessage;
      }

      await job.save();
      return job;
    } catch (err) {
      return job;
    }
  }

  async enhancePrompt(prompt, productContext) {
    const provider = this.getProvider();
    return provider.enhancePrompt(prompt, productContext);
  }

  async getCreatorHistory(creatorId, limit = 20) {
    return AIGenerationJob.find({ creatorId }).sort({ createdAt: -1 }).limit(limit);
  }

  async getAdminAIAnalytics() {
    const jobs = await AIGenerationJob.find({});
    const totalGenerations = jobs.length;
    const completedJobs = jobs.filter((j) => j.status === 'COMPLETED');
    const failedJobs = jobs.filter((j) => j.status === 'FAILED');
    const totalSpend = jobs.reduce((sum, j) => sum + (j.actualCost || 0.15), 0);

    return {
      totalGenerations,
      successfulGenerations: completedJobs.length,
      failedGenerations: failedJobs.length,
      successRate: totalGenerations > 0 ? Math.round((completedJobs.length / totalGenerations) * 100) : 100,
      totalSpend: Number(totalSpend.toFixed(2)),
      provider: this.getProvider().name,
    };
  }
}

export const aiVideoService = new AIVideoService();
export default aiVideoService;
