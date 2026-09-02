import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    userName: { type: String, required: true, trim: true },
    userAvatar: { type: String, default: '' },
    text: { type: String, required: true, trim: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const reelSchema = new mongoose.Schema(
  {
    creator: {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      name: { type: String, default: 'ShopSphere Official' },
      handle: { type: String, default: '@shopsphere' },
      avatar: {
        type: String,
        default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      },
      verified: { type: Boolean, default: true },
    },
    caption: { type: String, required: true, trim: true },
    hashtags: [{ type: String, trim: true }],
    videoPoster: { type: String, default: '' },
    thumbnailUrl: { type: String, default: '' },
    videoUrl: { type: String, required: true, trim: true },
    uploadedImageUrl: { type: String, default: '' },

    likesCount: { type: Number, default: 0, min: 0 },
    commentsCount: { type: Number, default: 0, min: 0 },
    sharesCount: { type: Number, default: 0, min: 0 },
    viewsCount: { type: Number, default: 0, min: 0 },
    savesCount: { type: Number, default: 0, min: 0 },

    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    savedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

    comments: [commentSchema],

    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    taggedProduct: {
      id: { type: String },
      title: { type: String },
      price: { type: Number },
      originalPrice: { type: Number },
      discount: { type: String },
      image: { type: String },
      slug: { type: String },
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
    aspectRatio: { type: String, default: '9:16' },
  },
  { timestamps: true }
);

reelSchema.index({ createdAt: -1 });
reelSchema.index({ productId: 1 });
reelSchema.index({ 'creator.handle': 1 });

export const Reel = mongoose.models.Reel || mongoose.model('Reel', reelSchema);
export default Reel;
