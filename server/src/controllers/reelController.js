import { Reel } from '../models/Reel.js';
import { Product } from '../models/Product.js';
import { AppError } from '../middleware/errorHandler.js';

// Fallback seed reels if DB is empty
const DEFAULT_SEED_REELS = [
  {
    _id: '65e8a1010101010101010101',
    creator: {
      name: 'Ananya Sharma',
      handle: '@ananya_style',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      verified: true,
    },
    caption: 'Draping the royal Palamner Silk Saree for wedding season! ✨ Look at that gold zari luster! 💛 #PalamnerSilk #FestiveVibes',
    hashtags: ['PalamnerSilk', 'FestiveVibes', 'EthnicWear'],
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-fashion-model-showing-a-saree-41473-large.mp4',
    videoPoster: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&auto=format&fit=crop&q=80',
    likesCount: 14200,
    commentsCount: 380,
    sharesCount: 920,
    savesCount: 1540,
    viewsCount: 45000,
    taggedProduct: {
      id: 'prod-1',
      title: 'Palamner Traditional Silk Saree',
      price: 3499,
      originalPrice: 4999,
      discount: '30% OFF',
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&auto=format&fit=crop&q=80',
      slug: 'palamner-traditional-silk-saree',
    },
  },
  {
    _id: '65e8a1010101010101010102',
    creator: {
      name: 'Rohan Tech Reviews',
      handle: '@rohan_tech',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      verified: true,
    },
    caption: 'Testing Active Noise Cancellation in noisy markets! Surprised by this sound quality under ₹3000 🎧🔥 #AudioTech #Unboxing',
    hashtags: ['AudioTech', 'Unboxing', 'NoiseCancelling'],
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-man-listening-to-music-with-headphones-41584-large.mp4',
    videoPoster: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&auto=format&fit=crop&q=80',
    likesCount: 8900,
    commentsCount: 215,
    sharesCount: 450,
    savesCount: 890,
    viewsCount: 28000,
    taggedProduct: {
      id: 'prod-2',
      title: 'Wireless Active Noise Cancelling Headphones',
      price: 2799,
      originalPrice: 3999,
      discount: '30% OFF',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&auto=format&fit=crop&q=80',
      slug: 'wireless-active-noise-cancelling-headphones',
    },
  },
  {
    _id: '65e8a1010101010101010103',
    creator: {
      name: 'Kavya Fitness',
      handle: '@kavyafit',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      verified: true,
    },
    caption: 'My daily workout companion! Tracks heart rate, SpO2, and sleep cycle with 14 days battery ⌚💪 #FitnessGear #Smartwatch',
    hashtags: ['FitnessGear', 'Smartwatch', 'HealthTech'],
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-doing-fitness-exercises-with-dumbbells-41530-large.mp4',
    videoPoster: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&auto=format&fit=crop&q=80',
    likesCount: 11400,
    commentsCount: 310,
    sharesCount: 670,
    savesCount: 1200,
    viewsCount: 38000,
    taggedProduct: {
      id: 'prod-3',
      title: 'Ultra Fit Pro Smartwatch',
      price: 1999,
      originalPrice: 2999,
      discount: '33% OFF',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&auto=format&fit=crop&q=80',
      slug: 'ultra-fit-pro-smartwatch',
    },
  },
];

export async function getReels(req, res, next) {
  try {
    const { page = 1, limit = 10 } = req.query;
    const p = Math.max(1, parseInt(page));
    const l = Math.max(1, Math.min(50, parseInt(limit)));
    const skip = (p - 1) * l;

    let dbReels = [];
    let totalCount = 0;

    try {
      [dbReels, totalCount] = await Promise.all([
        Reel.find().sort({ createdAt: -1 }).skip(skip).limit(l),
        Reel.countDocuments(),
      ]);
    } catch {
      dbReels = [];
    }

    if (!dbReels || dbReels.length === 0) {
      // Map user liked/saved status if user authenticated
      const currentUserId = req.user ? req.user._id.toString() : null;
      const formattedReels = DEFAULT_SEED_REELS.map((r) => ({
        ...r,
        id: r._id,
        isLiked: false,
        isSaved: false,
      }));

      return res.status(200).json({
        success: true,
        count: formattedReels.length,
        data: formattedReels,
      });
    }

    const currentUserId = req.user ? req.user._id.toString() : null;
    const formattedReels = dbReels.map((r) => {
      const obj = r.toObject();
      return {
        ...obj,
        id: obj._id.toString(),
        isLiked: currentUserId && obj.likedBy ? obj.likedBy.some((id) => id.toString() === currentUserId) : false,
        isSaved: currentUserId && obj.savedBy ? obj.savedBy.some((id) => id.toString() === currentUserId) : false,
      };
    });

    res.status(200).json({
      success: true,
      count: totalCount,
      data: formattedReels,
    });
  } catch (error) {
    next(error);
  }
}

export async function getReelById(req, res, next) {
  try {
    const { id } = req.params;
    let reel = await Reel.findById(id);

    if (!reel) {
      const seedReel = DEFAULT_SEED_REELS.find((r) => r._id === id || r.id === id);
      if (!seedReel) {
        throw new AppError('Reel not found.', 404, 'REEL_NOT_FOUND');
      }
      return res.status(200).json({ success: true, data: seedReel });
    }

    const currentUserId = req.user ? req.user._id.toString() : null;
    const obj = reel.toObject();
    const formatted = {
      ...obj,
      id: obj._id.toString(),
      isLiked: currentUserId && obj.likedBy ? obj.likedBy.some((id) => id.toString() === currentUserId) : false,
      isSaved: currentUserId && obj.savedBy ? obj.savedBy.some((id) => id.toString() === currentUserId) : false,
    };

    res.status(200).json({ success: true, data: formatted });
  } catch (error) {
    next(error);
  }
}

export async function toggleLikeReel(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    let reel = await Reel.findById(id);
    if (!reel) {
      // If using fallback mock ID, acknowledge like toggle
      return res.status(200).json({
        success: true,
        message: 'Like updated.',
        isLiked: true,
        likesCount: 14201,
      });
    }

    const likedIndex = reel.likedBy.indexOf(userId);
    let isLiked = false;

    if (likedIndex > -1) {
      reel.likedBy.splice(likedIndex, 1);
      reel.likesCount = Math.max(0, reel.likesCount - 1);
      isLiked = false;
    } else {
      reel.likedBy.push(userId);
      reel.likesCount += 1;
      isLiked = true;
    }

    await reel.save();

    res.status(200).json({
      success: true,
      data: {
        isLiked,
        likesCount: reel.likesCount,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function toggleSaveReel(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    let reel = await Reel.findById(id);
    if (!reel) {
      return res.status(200).json({
        success: true,
        message: 'Save status updated.',
        isSaved: true,
        savesCount: 1541,
      });
    }

    const savedIndex = reel.savedBy.indexOf(userId);
    let isSaved = false;

    if (savedIndex > -1) {
      reel.savedBy.splice(savedIndex, 1);
      reel.savesCount = Math.max(0, reel.savesCount - 1);
      isSaved = false;
    } else {
      reel.savedBy.push(userId);
      reel.savesCount += 1;
      isSaved = true;
    }

    await reel.save();

    res.status(200).json({
      success: true,
      data: {
        isSaved,
        savesCount: reel.savesCount,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function addReelComment(req, res, next) {
  try {
    const { id } = req.params;
    const { text } = req.body;

    if (!text || !text.trim()) {
      throw new AppError('Comment text cannot be empty.', 400, 'EMPTY_COMMENT');
    }

    let reel = await Reel.findById(id);
    const commentObj = {
      userId: req.user._id,
      userName: req.user.name || 'ShopSphere User',
      userAvatar: req.user.avatarUrl || req.user.avatar || '',
      text: text.trim(),
      createdAt: new Date(),
    };

    if (!reel) {
      return res.status(201).json({
        success: true,
        data: commentObj,
      });
    }

    reel.comments.push(commentObj);
    reel.commentsCount += 1;
    await reel.save();

    res.status(201).json({
      success: true,
      data: commentObj,
      commentsCount: reel.commentsCount,
    });
  } catch (error) {
    next(error);
  }
}

export async function recordReelView(req, res, next) {
  try {
    const { id } = req.params;
    await Reel.findByIdAndUpdate(id, { $inc: { viewsCount: 1 } });
    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
}

export const reelController = {
  getReels,
  getReelById,
  toggleLikeReel,
  toggleSaveReel,
  addReelComment,
  recordReelView,
};

export default reelController;
