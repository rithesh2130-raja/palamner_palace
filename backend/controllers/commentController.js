import Comment from '../models/commentModel.js';
import Reel from '../models/reelModel.js';

// @desc    Get Reel Comments
// @route   GET /api/reels/:id/comments
// @access  Public
export const getReelComments = async (req, res) => {
  try {
    const comments = await Comment.find({ reel: req.params.id })
      .populate('user', 'name username avatar')
      .populate('attachedProduct', 'name price image')
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add Comment to Reel
// @route   POST /api/reels/:id/comments
// @access  Private
export const createReelComment = async (req, res) => {
  try {
    const { text, parentComment, attachedProduct } = req.body;

    const comment = new Comment({
      user: req.user._id,
      reel: req.params.id,
      parentComment: parentComment || null,
      text,
      attachedProduct: attachedProduct || null,
    });

    const savedComment = await comment.save();

    // Increment commentsCount on Reel
    await Reel.findByIdAndUpdate(req.params.id, { $inc: { commentsCount: 1 } });

    const populatedComment = await Comment.findById(savedComment._id)
      .populate('user', 'name username avatar')
      .populate('attachedProduct', 'name price image');

    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
