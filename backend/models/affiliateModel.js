import mongoose from 'mongoose';

const affiliateSchema = mongoose.Schema(
  {
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    reel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Reel',
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Product',
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
    },
    clickTimestamp: {
      type: Date,
      default: Date.now,
    },
    commissionAmount: {
      type: Number,
      required: true,
      default: 0,
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Paid'],
      default: 'Approved',
    },
  },
  {
    timestamps: true,
  }
);

affiliateSchema.index({ creator: 1, createdAt: -1 });

const Affiliate = mongoose.model('Affiliate', affiliateSchema);

export default Affiliate;
