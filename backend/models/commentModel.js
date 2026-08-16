import mongoose from 'mongoose';

const commentSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    reel: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Reel',
    },
    parentComment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
      default: null,
    },
    text: {
      type: String,
      required: true,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    attachedProduct: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

commentSchema.index({ reel: 1, createdAt: -1 });

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;
