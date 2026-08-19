import mongoose from 'mongoose';

const reelSchema = new mongoose.Schema(
  {
    creator: {
      name: { type: String, default: 'PalamnerPalace Official' },
      handle: { type: String, default: '@palamnerpalace' },
      avatar: { type: String, default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80' },
      verified: { type: Boolean, default: true }
    },
    caption: { type: String, required: true },
    videoPoster: { type: String },
    thumbnailUrl: { type: String },
    videoUrl: { type: String, required: true },
    uploadedImageUrl: { type: String },
    likesCount: { type: Number, default: 12400 },
    commentsCount: { type: Number, default: 412 },
    sharesCount: { type: Number, default: 180 },
    taggedProduct: {
      id: { type: String },
      title: { type: String },
      price: { type: Number },
      originalPrice: { type: Number },
      discount: { type: String },
      image: { type: String }
    },
    advertisementId: { type: mongoose.Schema.Types.ObjectId, ref: 'Advertisement' }
  },
  { timestamps: true }
);

export const Reel = mongoose.models.Reel || mongoose.model('Reel', reelSchema);
