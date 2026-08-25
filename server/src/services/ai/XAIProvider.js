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
    const duration = Number(params.duration) || 5;
    const aspectRatio = params.aspectRatio || '9:16';
    const resolution = params.resolution || '720p';
    const isImageMode = Boolean(params.inputImageUrl && typeof params.inputImageUrl === 'string' && params.inputImageUrl.startsWith('http'));

    // Step 1: Log outgoing xAI request safely
    console.log(`\n[xAI DEBUG] model: ${this.model}`);
    console.log(`[xAI DEBUG] prompt: ${params.prompt}`);
    console.log(`[xAI DEBUG] duration: ${duration}`);
    console.log(`[xAI DEBUG] aspect_ratio: ${aspectRatio}`);
    console.log(`[xAI DEBUG] resolution: ${resolution}`);
    console.log(`[xAI DEBUG] image mode: ${isImageMode ? 'IMAGE-TO-VIDEO' : 'TEXT-TO-VIDEO'}`);
    console.log(`[xAI DEBUG] image URL present: ${isImageMode ? 'YES' : 'NO'}`);

    // Construct Payload cleanly
    const payload = {
      model: this.model,
      prompt: params.prompt,
      duration,
      aspect_ratio: aspectRatio,
      resolution,
    };

    if (isImageMode) {
      console.log(`[xAI DEBUG] product image URL: ${params.inputImageUrl}`);
      console.log(`[xAI DEBUG] image URL reachable: ${params.inputImageUrl.startsWith('https://') ? 'YES (Public HTTPS)' : 'NO'}`);
      payload.image = {
        url: params.inputImageUrl
      };
    }

    try {
      const response = await fetch(`${this.baseUrl}/videos/generations`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });

      // Step 2: Log actual xAI error body if not ok
      if (!response.ok) {
        const responseText = await response.text();
        console.error('[xAI ERROR]', {
          status: response.status,
          body: responseText,
        });

        let parsedError = responseText;
        try {
          const jsonErr = JSON.parse(responseText);
          parsedError = jsonErr.error?.message || jsonErr.error || jsonErr.message || jsonErr.code || responseText;
        } catch {
          // keep responseText
        }

        if (response.status === 401) {
          throw new AIVideoError(
            'XAI_AUTH_FAILED',
            `AI provider authentication failed (HTTP 401): ${parsedError}`,
            401
          );
        }
        if (response.status === 403 || response.status === 402 || response.status === 429) {
          throw new AIVideoError(
            'XAI_BILLING_ERROR',
            `xAI Account Credits Required (HTTP ${response.status}): ${parsedError}`,
            response.status
          );
        }

        throw new AIVideoError(
          'XAI_API_ERROR',
          `xAI API HTTP ${response.status} Error: ${parsedError}`,
          response.status
        );
      }

      const data = await response.json();
      const requestId = data.request_id || data.id;

      if (!requestId) {
        throw new AIVideoError('XAI_API_ERROR', 'xAI API response missing request_id');
      }

      console.log(`[xAI SUCCESS] Generation started | xAI Request ID: ${requestId}`);

      return {
        requestId,
        xaiRequestId: requestId,
        status: 'GENERATING',
        model: this.model,
      };
    } catch (err) {
      if (err instanceof AIVideoError) throw err;
      throw new AIVideoError(
        'XAI_API_ERROR',
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
        const responseText = await response.text();
        console.error('[xAI ERROR] GET Status Failed', { status: response.status, body: responseText });
        if (response.status === 404) {
          throw new AIVideoError(ERROR_CODES.JOB_NOT_FOUND, `Request ${requestId} not found on xAI`, 404);
        }
        throw new AIVideoError(ERROR_CODES.PROVIDER_UNAVAILABLE, `Failed to query xAI status: ${responseText}`);
      }

      const data = await response.json();
      const rawStatus = (data.status || data.state || '').toLowerCase();

      console.log(`[xAI DEBUG] Polling status | Request ID: ${requestId} | Status: ${rawStatus}`);

      let mappedStatus = 'GENERATING';
      let videoUrl = null;

      if (rawStatus === 'done' || rawStatus === 'completed' || rawStatus === 'succeeded' || data.video?.url || data.video_url) {
        mappedStatus = 'COMPLETED';
        videoUrl = data.video?.url || data.video_url || data.url || null;
        console.log(`[xAI SUCCESS] Video completed | Request ID: ${requestId} | Video URL: ${videoUrl}`);
      } else if (rawStatus === 'failed' || rawStatus === 'error') {
        mappedStatus = 'FAILED';
        console.error(`[xAI ERROR] Generation failed on provider side | Request ID: ${requestId} | Error: ${JSON.stringify(data.error || data)}`);
      } else if (rawStatus === 'expired') {
        mappedStatus = 'EXPIRED';
        console.warn(`[xAI WARNING] Generation expired | Request ID: ${requestId}`);
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
        errorMessage: data.error?.message || (data.error ? JSON.stringify(data.error) : null),
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
