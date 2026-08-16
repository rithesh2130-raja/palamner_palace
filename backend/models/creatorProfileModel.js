import mongoose from 'mongoose';

const creatorProfileSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
      unique: true,
    },
    bio: {
      type: String,
      default: 'Creator on ShopSphere Social Marketplace',
    },
    isVerified: {
      type: Boolean,
      default: true,
    },
    followersCount: {
      type: Number,
      default: 0,
    },
    totalViews: {
      type: Number,
      default: 0,
    },
    totalLikes: {
      type: Number,
      default: 0,
    },
    totalEarnings: {
      type: Number,
      default: 0,
    },
    commissionRate: {
      type: Number,
      default: 10,
    },
    categories: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const CreatorProfile = mongoose.model('CreatorProfile', creatorProfileSchema);

export default CreatorProfile;
