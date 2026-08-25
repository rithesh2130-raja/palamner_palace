import VideoGenerationProvider from './VideoGenerationProvider.js';
import { AIVideoError, ERROR_CODES } from './xaiErrors.js';

export class XAIProvider extends VideoGenerationProvider {
  constructor() {
    super('xai');
    this.apiKey = process.env.XAI_API_KEY;
    this.baseUrl = process.env.XAI_VIDEO_BASE_URL || 'https://api.x.ai/v1';
    this.model = process.env.XAI_VIDEO_MODEL || 'grok-imagine-video-1.5';
  }

  getHeaders() {
    const key = process.env.XAI_API_KEY || this.apiKey;
    if (!key || key.includes('placeholder') || key.includes('your_real_xai_api_key')) {
      throw new AIVideoError(
        'XAI_NOT_CONFIGURED',
        'AI video generation is not configured. Add your xAI API key to the server environment.',
        503
      );
    }
    return {
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/json',
    };
  }

  async generateVideo(params) {
    const headers = this.getHeaders();

    const payload = {
      model: this.model,
      prompt: params.prompt,
      duration: Number(params.duration) || 5,
      aspect_ratio: params.aspectRatio || '9:16',
      resolution: params.resolution || '720p',
    };

    if (params.inputImageUrl) {
      payload.image = { url: params.inputImageUrl };
      payload.image_url = params.inputImageUrl; // Included for API compatibility
    }

    console.log(`[xAI] Starting video generation | Model: ${this.model} | Mode: ${params.inputImageUrl ? 'image-to-video' : 'text-to-video'}`);

    try {
      const response = await fetch(`${this.baseUrl}/videos/generations`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const status = response.status;
        const errMessage = errorData.error?.message || errorData.message || `xAI API HTTP ${status}`;

        console.error(`[xAI ERROR] POST /videos/generations returned HTTP ${status}: ${errMessage}`);

        if (status === 401) {
          throw new AIVideoError('XAI_AUTH_FAILED', 'AI provider authentication failed. Check the server xAI API key.', 401);
        }
        if (status === 402 || status === 429) {
          throw new AIVideoError('XAI_BILLING_ERROR', 'AI video generation is currently unavailable. Check your xAI API account and usage limits.', 429);
        }

        throw new AIVideoError(
          ERROR_CODES.GENERATION_FAILED,
          `xAI Generation Error: ${errMessage}`,
          status
        );
      }

      const data = await response.json();
      const requestId = data.request_id || data.id;

      if (!requestId) {
        throw new AIVideoError(ERROR_CODES.GENERATION_FAILED, 'xAI API did not return a valid request_id');
      }

      console.log(`[xAI] Generation started | Request ID: ${requestId}`);

      return {
        requestId,
        xaiRequestId: requestId,
        status: 'GENERATING',
        model: this.model,
      };
    } catch (err) {
      if (err instanceof AIVideoError) throw err;
      throw new AIVideoError(
        ERROR_CODES.PROVIDER_UNAVAILABLE,
        `Network error connecting to xAI API: ${err.message}`,
        500
      );
    }
  }

  async getGenerationStatus(requestId) {
    if (!requestId) {
      throw new AIVideoError(ERROR_CODES.JOB_NOT_FOUND, 'Missing xAI request ID');
    }

    const headers = this.getHeaders();

    try {
      const response = await fetch(`${this.baseUrl}/videos/${requestId}`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new AIVideoError(ERROR_CODES.JOB_NOT_FOUND, `Generation request ${requestId} not found on xAI`, 404);
        }
        throw new AIVideoError(ERROR_CODES.PROVIDER_UNAVAILABLE, `Failed to query status from xAI (HTTP ${response.status})`);
      }

      const data = await response.json();
      const rawStatus = (data.status || data.state || '').toLowerCase();

      console.log(`[xAI] Polling status | Request ID: ${requestId} | Provider Status: ${rawStatus}`);

      let mappedStatus = 'GENERATING';
      let videoUrl = null;

      if (rawStatus === 'done' || rawStatus === 'completed' || rawStatus === 'succeeded' || data.video?.url || data.video_url) {
        mappedStatus = 'COMPLETED';
        videoUrl = data.video?.url || data.video_url || data.url || null;
        console.log(`[xAI] Video generated successfully | Request ID: ${requestId} | Video URL: ${videoUrl}`);
      } else if (rawStatus === 'failed' || rawStatus === 'error') {
        mappedStatus = 'FAILED';
        console.error(`[xAI] Generation failed on provider side | Request ID: ${requestId} | Error: ${data.error?.message || 'Unknown provider error'}`);
      } else if (rawStatus === 'expired') {
        mappedStatus = 'EXPIRED';
        console.warn(`[xAI] Generation expired on provider side | Request ID: ${requestId}`);
      } else if (rawStatus === 'cancelled') {
        mappedStatus = 'CANCELLED';
      }

      return {
        requestId,
        xaiRequestId: requestId,
        status: mappedStatus,
        outputVideoUrl: videoUrl,
        videoUrl,
        thumbnailUrl: data.thumbnail_url || data.thumbnail?.url || null,
        errorCode: data.error?.code || null,
        errorMessage: data.error?.message || null,
      };
    } catch (err) {
      if (err instanceof AIVideoError) throw err;
      throw new AIVideoError(ERROR_CODES.PROVIDER_UNAVAILABLE, err.message);
    }
  }

  async cancelGeneration(requestId) {
    const headers = this.getHeaders();
    try {
      await fetch(`${this.baseUrl}/videos/${requestId}/cancel`, {
        method: 'POST',
        headers,
      });
      return { requestId, status: 'CANCELLED' };
    } catch {
      return { requestId, status: 'CANCELLED' };
    }
  }

  async enhancePrompt(prompt, productContext = {}) {
    const productTitle = productContext.title || 'Featured Product';
    return `Create a premium vertical social-commerce product advertisement featuring ${productTitle}. ${prompt}. Preserve the product's visual identity and physical characteristics. Smooth cinematic camera motion, realistic lighting, detailed materials, professional advertising composition, strong hero shot at the end.`;
  }
}

export default XAIProvider;
