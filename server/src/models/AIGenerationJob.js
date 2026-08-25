import mongoose from 'mongoose';

const aiGenerationJobSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    creatorId: {
      type: String,
      required: true,
      index: true,
    },
    productId: {
      type: String,
      default: null,
      index: true,
    },
    type: {
      type: String,
      enum: ['image-to-video', 'text-to-video', 'reference-to-video'],
      default: 'image-to-video',
    },
    provider: {
      type: String,
      default: 'xai',
    },
    model: {
      type: String,
      default: 'grok-imagine-video-1.5',
    },
    prompt: {
      type: String,
      required: true,
      maxlength: 2000,
    },
    enhancedPrompt: {
      type: String,
      default: null,
    },
    inputImageUrl: {
      type: String,
      default: null,
    },
    xaiRequestId: {
      type: String,
      default: null,
      index: true,
    },
    requestId: {
      type: String,
      default: null,
      index: true,
    },
    status: {
      type: String,
      enum: ['QUEUED', 'GENERATING', 'PROCESSING', 'COMPLETED', 'FAILED', 'EXPIRED', 'CANCELLED'],
      default: 'QUEUED',
      index: true,
    },
    progress: {
      type: Number,
      default: 0,
    },
    videoUrl: {
      type: String,
      default: null,
    },
    outputVideoUrl: {
      type: String,
      default: null,
    },
    thumbnailUrl: {
      type: String,
      default: null,
    },
    estimatedCost: {
      type: Number,
      default: 0.15,
    },
    actualCost: {
      type: Number,
      default: 0.15,
    },
    duration: {
      type: Number,
      default: 5,
    },
    aspectRatio: {
      type: String,
      default: '9:16',
    },
    resolution: {
      type: String,
      default: '720p',
    },
    error: {
      type: String,
      default: null,
    },
    errorCode: {
      type: String,
      default: null,
    },
    errorMessage: {
      type: String,
      default: null,
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const AIGenerationJob = mongoose.models.AIGenerationJob || mongoose.model('AIGenerationJob', aiGenerationJobSchema);
export default AIGenerationJob;
