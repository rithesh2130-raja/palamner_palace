import mongoose from 'mongoose';

const advertisementSchema = new mongoose.Schema(
  {
    product: {
      id: { type: String, required: true },
      title: { type: String, required: true },
      brand: { type: String },
      price: { type: Number },
      originalPrice: { type: Number },
      discountPercentage: { type: Number },
      description: { type: String },
      image: { type: String }
    },
    createdBy: { type: String, default: 'Admin' },
    objective: {
      type: String,
      enum: [
        'Product Launch',
        'Flash Sale',
        'Discount Promotion',
        'New Arrival',
        'Brand Awareness',
        'Festival Campaign',
        'Limited Stock',
        'Clearance Sale'
      ],
      default: 'Product Launch'
    },
    targetAudience: { type: String, default: 'General Shoppers' },
    tone: {
      type: String,
      enum: ['Premium', 'Energetic', 'Minimal', 'Luxury', 'Youthful', 'Urgent', 'Emotional', 'Modern'],
      default: 'Energetic'
    },
    visualStyle: {
      type: String,
      enum: [
        'Cinematic',
        'Minimal Product Showcase',
        'Luxury Commercial',
        'Fast-Paced Social Ad',
        'Lifestyle',
        'Studio Product Shot',
        'Festival Promotion'
      ],
      default: 'Cinematic'
    },
    callToAction: { type: String, default: 'Shop Now' },
    duration: { type: String, default: '8 seconds' },
    aspectRatio: { type: String, default: '9:16' },
    prompt: { type: String },
    status: {
      type: String,
      enum: ['queued', 'processing', 'completed', 'failed'],
      default: 'completed'
    },
    videoUrl: { type: String },
    thumbnailUrl: { type: String },
    geminiInteractionId: { type: String },
    publishedAsReel: { type: Boolean, default: false },
    reelId: { type: String }
  },
  { timestamps: true }
);

export const Advertisement = mongoose.models.Advertisement || mongoose.model('Advertisement', advertisementSchema);
