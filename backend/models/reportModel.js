import mongoose from 'mongoose';

const reportSchema = mongoose.Schema(
  {
    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    targetType: {
      type: String,
      required: true,
      enum: ['Reel', 'Comment', 'Creator', 'Product'],
    },
    targetId: {
      type: String,
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['Pending', 'Reviewed', 'Dismissed', 'Actioned'],
      default: 'Pending',
    },
  },
  {
    timestamps: true,
  }
);

const Report = mongoose.model('Report', reportSchema);

export default Report;
