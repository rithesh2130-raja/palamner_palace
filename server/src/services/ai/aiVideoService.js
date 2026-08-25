import AIGenerationJob from '../../models/AIGenerationJob.js';
import XAIProvider from './XAIProvider.js';
import MockVideoGenerationProvider from './MockVideoGenerationProvider.js';
import { XAI_VIDEO_PRICING, SUPPORTED_ASPECT_RATIOS, SUPPORTED_RESOLUTIONS, SUPPORTED_DURATIONS } from './xaiTypes.js';
import { AIVideoError, ERROR_CODES } from './xaiErrors.js';

class AIVideoService {
  constructor() {
    this.xaiProvider = new XAIProvider();
    this.mockProvider = new MockVideoGenerationProvider();
  }

  getProvider() {
    const apiKey = process.env.XAI_API_KEY;
    if (apiKey && apiKey !== 'your_xai_api_key_placeholder' && apiKey !== 'xai_demo_key_placeholder') {
      return this.xaiProvider;
    }
    // Fall back to Mock Provider for local development if xAI key is missing or set to placeholder
    return this.mockProvider;
  }

  calculateEstimatedCost(duration = 6, resolution = '720p', model = 'grok-imagine-video-1.5') {
    const modelPricing = XAI_VIDEO_PRICING[model] || XAI_VIDEO_PRICING['grok-imagine-video-1.5'];
    const resPricing = modelPricing[resolution] || modelPricing['720p'];
    return resPricing[duration] || 0.15;
  }

  sanitizePrompt(prompt) {
    if (!prompt || typeof prompt !== 'string') return '';
    // Strip control characters & excessive whitespace
    return prompt.trim().replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').substring(0, 1000);
  }

  constructProductAwarePrompt(rawPrompt, product) {
    const cleanPrompt = this.sanitizePrompt(rawPrompt);
    if (!product) return cleanPrompt;

    const brand = product.brand ? `${product.brand} ` : '';
    const title = product.title ? product.title.trim() : 'item';
    const category = product.category ? ` in ${product.category}` : '';

    return `Create a high-impact cinematic 9:16 vertical commercial advertisement featuring the ${brand}${title}${category}. ${cleanPrompt}. Keep the product visually consistent with the primary reference asset. Professional studio rim lighting, macro focus, smooth camera motion, realistic materials. No extraneous text overlays or logos.`;
  }

  async generateVideoJob({ userId, creatorId, productId, rawPrompt, inputImageUrl, duration = 6, aspectRatio = '9:16', resolution = '720p', productContext = null }) {
    if (!userId || !creatorId) {
      throw new AIVideoError(ERROR_CODES.UNAUTHORIZED, 'User authentication required for AI generation');
    }

    const cleanPrompt = this.sanitizePrompt(rawPrompt);
    if (!cleanPrompt || cleanPrompt.length < 5) {
      throw new AIVideoError(ERROR_CODES.GENERATION_FAILED, 'Please provide a descriptive prompt of at least 5 characters');
    }

    // Validate parameters
    if (!SUPPORTED_ASPECT_RATIOS.includes(aspectRatio)) {
      throw new AIVideoError(ERROR_CODES.UNSUPPORTED_RESOLUTION, `Invalid aspect ratio: ${aspectRatio}`);
    }
    if (!SUPPORTED_RESOLUTIONS.includes(resolution)) {
      throw new AIVideoError(ERROR_CODES.UNSUPPORTED_RESOLUTION, `Invalid resolution: ${resolution}`);
    }
    if (!SUPPORTED_DURATIONS.includes(Number(duration))) {
      throw new AIVideoError(ERROR_CODES.UNSUPPORTED_DURATION, `Invalid duration: ${duration}`);
    }

    const finalPrompt = this.constructProductAwarePrompt(cleanPrompt, productContext);
    const provider = this.getProvider();
    const model = 'grok-imagine-video-1.5';
    const estimatedCost = this.calculateEstimatedCost(Number(duration), resolution, model);

    // Create database job record
    const job = new AIGenerationJob({
      userId,
      creatorId,
      productId: productId || null,
      type: inputImageUrl ? 'image-to-video' : 'text-to-video',
      provider: provider.name,
      model,
      mode: inputImageUrl ? 'image-to-video' : 'text-to-video',
      prompt: cleanPrompt,
      enhancedPrompt: finalPrompt,
      inputImageUrl: inputImageUrl || null,
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
      // Dispatch generation request to xAI or mock provider
      const dispatchResult = await provider.generateVideo({
        prompt: finalPrompt,
        inputImageUrl,
        duration: Number(duration),
        aspectRatio,
        resolution,
      });

      job.requestId = dispatchResult.requestId;
      job.status = dispatchResult.status || 'GENERATING';
      job.progress = 10;
      await job.save();

      return job;
    } catch (err) {
      job.status = 'FAILED';
      job.errorCode = err.code || ERROR_CODES.GENERATION_FAILED;
      job.errorMessage = err.message;
      await job.save();
      throw err;
    }
  }

  async pollAndSyncJob(jobId) {
    const job = await AIGenerationJob.findById(jobId);
    if (!job) {
      throw new AIVideoError(ERROR_CODES.JOB_NOT_FOUND, 'Generation job not found', 404);
    }

    // If job is already in terminal state, return directly
    if (['COMPLETED', 'FAILED', 'EXPIRED', 'CANCELLED'].includes(job.status)) {
      return job;
    }

    const provider = this.getProvider();

    try {
      const providerStatus = await provider.getGenerationStatus(job.requestId);

      job.status = providerStatus.status;
      job.progress = providerStatus.progress;

      if (providerStatus.outputVideoUrl) {
        job.outputVideoUrl = providerStatus.outputVideoUrl;
      }
      if (providerStatus.thumbnailUrl) {
        job.thumbnailUrl = providerStatus.thumbnailUrl;
      }

      if (providerStatus.status === 'COMPLETED') {
        job.completedAt = new Date();
      } else if (providerStatus.status === 'FAILED') {
        job.errorCode = providerStatus.errorCode || ERROR_CODES.GENERATION_FAILED;
        job.errorMessage = providerStatus.errorMessage || 'AI generation failed';
      }

      await job.save();
      return job;
    } catch (err) {
      // Maintain last known status on temporary network hiccups
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
