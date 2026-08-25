import VideoGenerationProvider from './VideoGenerationProvider.js';

export class MockVideoGenerationProvider extends VideoGenerationProvider {
  constructor() {
    super('mock');
    this.mockJobs = new Map();
  }

  async generateVideo(params) {
    const requestId = `mock_req_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const startTime = Date.now();

    // High quality public Google CDN sample MP4 videos with 100% open CORS access
    const sampleVideos = [
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyattacks.mp4',
    ];

    const selectedVideoUrl = sampleVideos[Math.floor(Math.random() * sampleVideos.length)];

    const mockJob = {
      requestId,
      startTime,
      duration: params.duration || 6,
      prompt: params.prompt,
      mockVideoUrl: selectedVideoUrl,
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
      return {
        requestId,
        status: 'COMPLETED',
        progress: 100,
        outputVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80',
      };
    }

    const elapsedMs = Date.now() - job.startTime;
    const totalSimTimeMs = 5000;

    if (elapsedMs < 1200) {
      return {
        requestId,
        status: 'QUEUED',
        progress: 20,
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
