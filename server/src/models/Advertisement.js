import mongoose from 'mongoose';

const advertisementSchema = new mongoose.Schema(
  {
    generationId: { type: String, required: true },
    geminiInteractionId: { type: String },
    inputImageHash: { type: String },
    videoHash: { type: String },
    product: {
      id: { type: String },
      title: { type: String },
      brand: { type: String },
      price: { type: Number },
      originalPrice: { type: Number },
      discountPercentage: { type: Number },
      description: { type: String },
      image: { type: String }
    },
    uploadedImageUrl: { type: String },
    prompt: { type: String, required: true },
    style: { type: String, default: 'Cinematic' },
    aspectRatio: { type: String, default: '9:16' },
    createdBy: { type: String, default: 'Admin' },
    status: {
      type: String,
      enum: ['queued', 'processing', 'completed', 'failed'],
      default: 'processing'
    },
    videoUrl: { type: String },
    thumbnailUrl: { type: String },
    publishedAsReel: { type: Boolean, default: false },
    reelId: { type: String }
  },
  { timestamps: true }
);

export const Advertisement = mongoose.models.Advertisement || mongoose.model('Advertisement', advertisementSchema);
