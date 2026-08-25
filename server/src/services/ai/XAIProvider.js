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
    if (!this.apiKey || this.apiKey === 'your_xai_api_key_placeholder' || this.apiKey === 'xai_demo_key_placeholder') {
      throw new AIVideoError(ERROR_CODES.MISSING_API_KEY, 'XAI_API_KEY is not configured', 503);
    }
    return {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
    };
  }

  async generateVideo(params) {
    const headers = this.getHeaders();
    const payload = {
      model: this.model,
      prompt: params.prompt,
      duration: params.duration || 6,
      aspect_ratio: params.aspectRatio || '9:16',
      resolution: params.resolution || '720p',
    };

    if (params.inputImageUrl) {
      payload.image_url = params.inputImageUrl;
    }

    try {
      const response = await fetch(`${this.baseUrl}/videos/generations`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 401) {
          throw new AIVideoError(ERROR_CODES.UNAUTHORIZED, 'Invalid xAI API credentials');
        }
        if (response.status === 429) {
          throw new AIVideoError(ERROR_CODES.RATE_LIMIT_EXCEEDED, 'Rate limit exceeded on xAI provider');
        }
        if (errorData.error?.type === 'moderation') {
          throw new AIVideoError(ERROR_CODES.MODERATION_BLOCKED, 'Prompt flagged by xAI safety guidelines');
        }
        throw new AIVideoError(
          ERROR_CODES.GENERATION_FAILED,
          errorData.error?.message || `xAI API returned status ${response.status}`
        );
      }

      const data = await response.json();
      return {
        requestId: data.request_id || data.id,
        status: data.status || 'QUEUED',
        model: this.model,
      };
    } catch (err) {
      if (err instanceof AIVideoError) throw err;
      throw new AIVideoError(
        ERROR_CODES.PROVIDER_UNAVAILABLE,
        `Network error connecting to xAI API: ${err.message}`
      );
    }
  }

  async getGenerationStatus(requestId) {
    const headers = this.getHeaders();

    try {
      const response = await fetch(`${this.baseUrl}/videos/${requestId}`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new AIVideoError(ERROR_CODES.JOB_NOT_FOUND, 'Generation job not found on xAI');
        }
        throw new AIVideoError(ERROR_CODES.PROVIDER_UNAVAILABLE, 'Failed to retrieve video status');
      }

      const data = await response.json();

      let status = 'GENERATING';
      const rawStatus = (data.status || '').toUpperCase();

      if (rawStatus === 'COMPLETED' || rawStatus === 'SUCCEEDED' || data.video_url) {
        status = 'COMPLETED';
      } else if (rawStatus === 'FAILED' || rawStatus === 'ERROR') {
        status = 'FAILED';
      } else if (rawStatus === 'EXPIRED') {
        status = 'EXPIRED';
      } else if (rawStatus === 'CANCELLED') {
        status = 'CANCELLED';
      } else if (rawStatus === 'QUEUED' || rawStatus === 'PENDING') {
        status = 'QUEUED';
      }

      return {
        requestId,
        status,
        progress: data.progress || (status === 'COMPLETED' ? 100 : 50),
        outputVideoUrl: data.video_url || data.output_video_url || null,
        thumbnailUrl: data.thumbnail_url || null,
        errorCode: data.error_code || null,
        errorMessage: data.error_message || null,
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
    const productInfo = productContext.title ? `Product: ${productContext.title} (${productContext.brand || ''}). ` : '';
    const enhanced = `Create a high-impact 9:16 vertical commercial advertisement for social commerce. ${productInfo}${prompt}. Professional studio lighting, shallow depth of field, 60fps smooth camera movement, crisp macro details, realistic materials, premium retail commercial style.`;
    return enhanced;
  }
}

export default XAIProvider;
