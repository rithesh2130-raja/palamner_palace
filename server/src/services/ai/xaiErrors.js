export class AIVideoError extends Error {
  constructor(code, message, status = 400) {
    super(message);
    this.name = 'AIVideoError';
    this.code = code;
    this.status = status;
  }
}

export const ERROR_CODES = {
  MISSING_API_KEY: 'MISSING_API_KEY',
  PROVIDER_UNAVAILABLE: 'PROVIDER_UNAVAILABLE',
  GENERATION_FAILED: 'GENERATION_FAILED',
  UNSUPPORTED_RESOLUTION: 'UNSUPPORTED_RESOLUTION',
  UNSUPPORTED_DURATION: 'UNSUPPORTED_DURATION',
  INVALID_IMAGE: 'INVALID_IMAGE',
  TIMEOUT: 'TIMEOUT',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  MODERATION_BLOCKED: 'MODERATION_BLOCKED',
  JOB_NOT_FOUND: 'JOB_NOT_FOUND',
  UNAUTHORIZED: 'UNAUTHORIZED',
};

export const getHumanReadableErrorMessage = (code, rawMessage = '') => {
  switch (code) {
    case ERROR_CODES.MISSING_API_KEY:
      return 'AI video generation is currently not configured on the server. Please contact support.';
    case ERROR_CODES.PROVIDER_UNAVAILABLE:
      return 'The AI video generation provider is temporarily unavailable. Please try again in a few moments.';
    case ERROR_CODES.RATE_LIMIT_EXCEEDED:
      return 'Generation rate limit reached. Please wait a minute before creating another Reel.';
    case ERROR_CODES.MODERATION_BLOCKED:
      return 'This video prompt could not be processed due to safety guidelines. Please modify your prompt and try again.';
    case ERROR_CODES.UNSUPPORTED_RESOLUTION:
      return 'The selected video resolution is not supported by the current AI model.';
    case ERROR_CODES.UNSUPPORTED_DURATION:
      return 'The selected video duration is not supported.';
    case ERROR_CODES.INVALID_IMAGE:
      return 'The product image provided is invalid or inaccessible.';
    case ERROR_CODES.TIMEOUT:
      return 'Video generation timed out. You can retry generating from the AI Studio.';
    default:
      return rawMessage || 'An unexpected error occurred during AI video generation. Please try again.';
  }
};
