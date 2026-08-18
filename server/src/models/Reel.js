import mongoose from 'mongoose';

const reelSchema = new mongoose.Schema(
  {
    creator: {
      name: { type: String, required: true },
      handle: { type: String, required: true },
      avatar: { type: String },
      verified: { type: Boolean, default: false }
    },
    caption: { type: String, required: true },
    videoPoster: { type: String, required: true },
    videoUrl: { type: String },
    likesCount: { type: Number, default: 0 },
    commentsCount: { type: Number, default: 0 },
    sharesCount: { type: Number, default: 0 },
    taggedProduct: {
      id: { type: String, required: true },
      title: { type: String },
      price: { type: Number },
      originalPrice: { type: Number },
      discount: { type: String },
      image: { type: String }
    }
  },
  { timestamps: true }
);

export const Reel = mongoose.models.Reel || mongoose.model('Reel', reelSchema);
