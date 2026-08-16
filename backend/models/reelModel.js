import mongoose from 'mongoose';

const reelSchema = mongoose.Schema(
  {
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    videoUrl: {
      type: String,
      required: true,
    },
    thumbnailUrl: {
      type: String,
      required: true,
    },
    caption: {
      type: String,
      required: true,
    },
    hashtags: [
      {
        type: String,
      },
    ],
    category: {
      type: String,
      required: true,
      default: 'Gaming',
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
        },
        discountTag: {
          type: String,
          default: '20% OFF',
        },
      },
    ],
    duration: {
      type: Number,
      default: 18,
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    commentsCount: {
      type: Number,
      default: 0,
    },
    shares: {
      type: Number,
      default: 0,
    },
    saves: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    watchTime: {
      type: Number,
      default: 0,
    },
    completionRate: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['Approved', 'Pending', 'Flagged', 'Rejected'],
      default: 'Approved',
    },
  },
  {
    timestamps: true,
  }
);

reelSchema.index({ creator: 1, createdAt: -1 });
reelSchema.index({ category: 1, views: -1 });
reelSchema.index({ hashtags: 1 });

const Reel = mongoose.model('Reel', reelSchema);

export default Reel;
