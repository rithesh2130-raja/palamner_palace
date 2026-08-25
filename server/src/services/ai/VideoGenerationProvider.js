export class VideoGenerationProvider {
  constructor(name) {
    this.name = name;
  }

  async generateVideo(_params) {
    throw new Error('generateVideo() method must be implemented by Provider');
  }

  async getGenerationStatus(_requestId) {
    throw new Error('getGenerationStatus() method must be implemented by Provider');
  }

  async cancelGeneration(_requestId) {
    throw new Error('cancelGeneration() method must be implemented by Provider');
  }

  async enhancePrompt(_prompt, _productContext) {
    throw new Error('enhancePrompt() method must be implemented by Provider');
  }
}

export default VideoGenerationProvider;
