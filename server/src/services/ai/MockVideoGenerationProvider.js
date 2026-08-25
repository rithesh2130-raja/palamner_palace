import VideoGenerationProvider from './VideoGenerationProvider.js';

export class MockVideoGenerationProvider extends VideoGenerationProvider {
  constructor() {
    super('mock');
    this.mockJobs = new Map();
  }

  async generateVideo(params) {
    const requestId = `mock_req_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const startTime = Date.now();

    const mockJob = {
      requestId,
      startTime,
      duration: params.duration || 6,
      prompt: params.prompt,
      // Sample high quality demo videos for development preview
      mockVideoUrl: params.mockVideoUrl || 'https://assets.mixkit.co/videos/preview/mixkit-hand-holding-a-smartphone-showing-a-game-41553-large.mp4',
      mockThumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80',
    };

    this.mockJobs.set(requestId, mockJob);

    return {
      requestId,
      status: 'QUEUED',
      model: 'grok-imagine-video-1.5-mock',
    };
  }

  async getGenerationStatus(requestId) {
    const job = this.mockJobs.get(requestId);
    if (!job) {
      // Return completed fallback for static/unknown IDs
      return {
        requestId,
        status: 'COMPLETED',
        progress: 100,
        outputVideoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-typing-on-a-luminous-keyboard-41555-large.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80',
      };
    }

    const elapsedMs = Date.now() - job.startTime;
    // Simulate realistic 6-second progress simulation for development testing
    const totalSimTimeMs = 6000;

    if (elapsedMs < 1500) {
      return {
        requestId,
        status: 'QUEUED',
        progress: 15,
        outputVideoUrl: null,
      };
    } else if (elapsedMs < totalSimTimeMs) {
      const progress = Math.min(95, Math.floor((elapsedMs / totalSimTimeMs) * 100));
      return {
        requestId,
        status: 'GENERATING',
        progress,
        outputVideoUrl: null,
      };
    } else {
      return {
        requestId,
        status: 'COMPLETED',
        progress: 100,
        outputVideoUrl: job.mockVideoUrl,
        thumbnailUrl: job.mockThumbnail,
      };
    }
  }

  async cancelGeneration(requestId) {
    this.mockJobs.delete(requestId);
    return { requestId, status: 'CANCELLED' };
  }

  async enhancePrompt(prompt, productContext = {}) {
    const productTitle = productContext.title || 'Featured Product';
    return `[AI Enhanced Commercial] Premium 9:16 social-commerce showcase of ${productTitle}. ${prompt}. 4K crisp detail, cinematic volumetric lighting, smooth camera rotation, luxury brand aesthetic.`;
  }
}

export default MockVideoGenerationProvider;
