import VideoGenerationProvider from '../VideoGenerationProvider.js';
import { AIVideoError, ERROR_CODES } from '../xaiErrors.js';

export class Wan21Provider extends VideoGenerationProvider {
  constructor() {
    super('wan21');
    this.baseUrl = process.env.RUNPOD_ENDPOINT_URL;
    this.apiKey = process.env.RUNPOD_API_KEY;
    this.model = 'Wan2.1-VACE-1.3B';
    // Local mock job state cache for development fallback
    this.localMockJobs = new Map();
  }

  isConfigured() {
    const url = process.env.RUNPOD_ENDPOINT_URL || this.baseUrl;
    const key = process.env.RUNPOD_API_KEY || this.apiKey;
    return Boolean(url && key && !url.includes('YOUR_RUNPOD') && !key.includes('your_runpod'));
  }

  getHeaders() {
    const key = process.env.RUNPOD_API_KEY || this.apiKey;
    return {
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/json',
    };
  }

  async generateVideo(params) {
    const duration = Number(params.duration) || 5;
    const aspectRatio = params.aspectRatio || '9:16';
    const resolution = params.resolution || '480p';
    const mode = params.inputImageUrl ? 'image_to_video' : 'text_to_video';

    // Development fallback when RunPod credentials have not been added to .env yet
    if (!this.isConfigured()) {
      console.log(`[Wan21 Provider] RunPod Serverless unconfigured. Running local Wan 2.1 simulation for development...`);
      const mockJobId = `wan_local_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      
      this.localMockJobs.set(mockJobId, {
        requestId: mockJobId,
        status: 'GENERATING',
        createdAt: Date.now(),
        outputVideoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      });

      return {
        requestId: mockJobId,
        xaiRequestId: mockJobId,
        status: 'GENERATING',
        model: mode === 'image_to_video' ? 'Wan2.1-VACE-1.3B' : 'Wan2.1-T2V-1.3B',
      };
    }

    const endpointUrl = process.env.RUNPOD_ENDPOINT_URL || this.baseUrl;
    const headers = this.getHeaders();

    console.log(`\n[Wan21 Provider] Submitting job to RunPod Serverless | Endpoint: ${endpointUrl} | Mode: ${mode}`);

    const payload = {
      input: {
        prompt: params.prompt,
        image_url: params.inputImageUrl || null,
        mode,
        duration,
        aspect_ratio: aspectRatio,
        resolution,
        frames: 81,
      },
    };

    try {
      const response = await fetch(`${endpointUrl.replace(/\/$/, '')}/run`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[Wan21 ERROR] POST /run HTTP ${response.status}: ${errorText}`);
        throw new AIVideoError(
          ERROR_CODES.GENERATION_FAILED,
          `RunPod Wan2.1 Serverless Error (HTTP ${response.status}): ${errorText}`,
          response.status
        );
      }

      const data = await response.json();
      const jobId = data.id;

      if (!jobId) {
        throw new AIVideoError(ERROR_CODES.GENERATION_FAILED, 'RunPod did not return a valid job ID');
      }

      console.log(`[Wan21 SUCCESS] RunPod Job Submitted | Job ID: ${jobId}`);

      return {
        requestId: jobId,
        xaiRequestId: jobId,
        status: 'GENERATING',
        model: mode === 'image_to_video' ? 'Wan2.1-VACE-1.3B' : 'Wan2.1-T2V-1.3B',
      };
    } catch (err) {
      if (err instanceof AIVideoError) throw err;
      throw new AIVideoError(
        ERROR_CODES.PROVIDER_UNAVAILABLE,
        `Network error connecting to RunPod Serverless GPU worker: ${err.message}`,
        500
      );
    }
  }

  async getGenerationStatus(requestId) {
    if (!requestId) {
      throw new AIVideoError(ERROR_CODES.JOB_NOT_FOUND, 'Missing RunPod job ID');
    }

    // Local development simulation fallback check
    if (this.localMockJobs.has(requestId)) {
      const localJob = this.localMockJobs.get(requestId);
      const elapsed = Date.now() - localJob.createdAt;

      // Complete after 3 seconds simulation
      if (elapsed > 3000) {
        localJob.status = 'COMPLETED';
      }

      return {
        requestId,
        xaiRequestId: requestId,
        status: localJob.status,
        outputVideoUrl: localJob.status === 'COMPLETED' ? localJob.outputVideoUrl : null,
        videoUrl: localJob.status === 'COMPLETED' ? localJob.outputVideoUrl : null,
      };
    }

    const endpointUrl = process.env.RUNPOD_ENDPOINT_URL || this.baseUrl;
    const headers = this.getHeaders();

    try {
      const response = await fetch(`${endpointUrl.replace(/\/$/, '')}/status/${requestId}`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[Wan21 ERROR] GET /status/${requestId} HTTP ${response.status}: ${errorText}`);
        throw new AIVideoError(ERROR_CODES.PROVIDER_UNAVAILABLE, `Failed to query RunPod job status: ${errorText}`);
      }

      const data = await response.json();
      const rawStatus = (data.status || '').toUpperCase();

      console.log(`[Wan21 DEBUG] Polling RunPod status | Job ID: ${requestId} | Status: ${rawStatus}`);

      let mappedStatus = 'GENERATING';
      let videoUrl = null;

      if (rawStatus === 'COMPLETED') {
        mappedStatus = 'COMPLETED';
        videoUrl = data.output?.video_url || data.output?.video_path || null;
        console.log(`[Wan21 SUCCESS] Wan2.1 Video Completed | Job ID: ${requestId} | CDN URL: ${videoUrl}`);
      } else if (rawStatus === 'FAILED' || rawStatus === 'CANCELLED') {
        mappedStatus = 'FAILED';
        console.error(`[Wan21 ERROR] RunPod job failed | Job ID: ${requestId} | Error: ${JSON.stringify(data.error || data)}`);
      } else if (rawStatus === 'IN_QUEUE' || rawStatus === 'QUEUED') {
        mappedStatus = 'QUEUED';
      }

      return {
        requestId,
        xaiRequestId: requestId,
        status: mappedStatus,
        outputVideoUrl: videoUrl,
        videoUrl,
        thumbnailUrl: data.output?.thumbnail_url || null,
        errorCode: data.error?.code || null,
        errorMessage: data.error?.message || (data.error ? JSON.stringify(data.error) : null),
      };
    } catch (err) {
      if (err instanceof AIVideoError) throw err;
      throw new AIVideoError(ERROR_CODES.PROVIDER_UNAVAILABLE, err.message);
    }
  }

  async cancelGeneration(requestId) {
    return { requestId, status: 'CANCELLED' };
  }

  async enhancePrompt(prompt, productContext = {}) {
    const productTitle = productContext.title || 'Featured Product';
    return `Create a premium vertical social-commerce product advertisement featuring ${productTitle}. ${prompt}. Preserve the product's visual identity and physical characteristics. Smooth cinematic camera motion, realistic lighting, detailed materials, professional advertising composition, strong hero shot at the end.`;
  }
}

export default Wan21Provider;
