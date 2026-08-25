import mongoose from 'mongoose';

const reelSchema = new mongoose.Schema(
  {
    creator: {
      name: { type: String, default: 'ShopSphere Official' },
      handle: { type: String, default: '@shopsphere' },
      avatar: { type: String, default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80' },
      verified: { type: Boolean, default: true }
    },
    caption: { type: String, required: true },
    hashtags: [{ type: String }],
    videoPoster: { type: String },
    thumbnailUrl: { type: String },
    videoUrl: { type: String, required: true },
    uploadedImageUrl: { type: String },
    likesCount: { type: Number, default: 0 },
    commentsCount: { type: Number, default: 0 },
    sharesCount: { type: Number, default: 0 },
    viewsCount: { type: Number, default: 0 },
    taggedProduct: {
      id: { type: String },
      title: { type: String },
      price: { type: Number },
      originalPrice: { type: Number },
      discount: { type: String },
      image: { type: String }
    },
    productIds: [{ type: String }],
    advertisementId: { type: mongoose.Schema.Types.ObjectId, ref: 'Advertisement' },
    // AI Reel Metadata
    aiGenerated: { type: Boolean, default: false },
    aiProvider: { type: String, default: 'xai' },
    aiModel: { type: String, default: 'grok-imagine-video-1.5' },
    aiGenerationJobId: { type: String, default: null },
    prompt: { type: String, default: null },
    duration: { type: Number, default: 6 },
    resolution: { type: String, default: '720p' },
    aspectRatio: { type: String, default: '9:16' }
  },
  { timestamps: true }
);

export const Reel = mongoose.models.Reel || mongoose.model('Reel', reelSchema);
export default Reel;
