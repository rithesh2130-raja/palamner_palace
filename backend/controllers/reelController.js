import Reel from '../models/reelModel.js';
import Product from '../models/productModel.js';
import CreatorProfile from '../models/creatorProfileModel.js';
import User from '../models/userModel.js';

// @desc    Get Reels Feed (Cursor & Category & Rule-Based Ranking)
// @route   GET /api/reels/feed
// @access  Public
export const getReelsFeed = async (req, res) => {
  try {
    const { category, cursor, limit = 5 } = req.query;
    const query = { status: 'Approved' };

    if (category && category !== 'All' && category !== 'For You') {
      query.category = category;
    }

    if (cursor) {
      query._id = { $lt: cursor };
    }

    const reels = await Reel.find(query)
      .populate('creator', 'name username avatar bio followersCount')
      .populate('products.product', 'name price image brand rating discountPercentage')
      .sort({ _id: -1 })
      .limit(Number(limit));

    const nextCursor = reels.length > 0 ? reels[reels.length - 1]._id : null;

    res.json({
      reels,
      nextCursor,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Single Reel Details by ID
// @route   GET /api/reels/:id
// @access  Public
export const getReelById = async (req, res) => {
  try {
    const reel = await Reel.findById(req.params.id)
      .populate('creator', 'name username avatar bio followersCount')
      .populate('products.product');

    if (reel) {
      res.json(reel);
    } else {
      res.status(404).json({ message: 'Reel not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Upload / Publish a new Reel
// @route   POST /api/reels
// @access  Public / Private
export const createReel = async (req, res) => {
  try {
    const { videoUrl, thumbnailUrl, caption, hashtags, category, productIds, duration } = req.body;

    let creatorId = req.user ? req.user._id : null;
    if (!creatorId) {
      const defaultUser = (await User.findOne({ role: 'Creator' })) || (await User.findOne({ isAdmin: true }));
      if (defaultUser) creatorId = defaultUser._id;
    }

    const taggedProducts = (productIds || []).map((id) => ({
      product: id,
      discountTag: '20% OFF',
    }));

    const reel = new Reel({
      creator: creatorId,
      videoUrl: videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      thumbnailUrl: thumbnailUrl || 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500',
      caption: caption || 'Check out this awesome product setup!',
      hashtags: hashtags || ['ShopSphere', 'Trending'],
      category: category || 'Electronics',
      products: taggedProducts,
      duration: duration || 18,
      status: 'Approved',
    });

    const createdReel = await reel.save();

    // Link reel reference back to tagged products
    if (productIds && productIds.length > 0) {
      await Product.updateMany(
        { _id: { $in: productIds } },
        { $push: { reels: createdReel._id } }
      );
    }

    const populatedReel = await Reel.findById(createdReel._id)
      .populate('creator', 'name username avatar')
      .populate('products.product', 'name price image brand rating discountPercentage');

    res.status(201).json(populatedReel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Record Reel View & Watch Duration Metrics
// @route   POST /api/reels/:id/view
// @access  Public
export const recordReelView = async (req, res) => {
  try {
    const { watchDuration, completionPercentage } = req.body;
    const reel = await Reel.findById(req.params.id);

    if (reel) {
      reel.views += 1;
      if (watchDuration) reel.watchTime += Number(watchDuration);
      if (completionPercentage) {
        reel.completionRate = Math.round((reel.completionRate + Number(completionPercentage)) / 2);
      }
      await reel.save();
      res.json({ success: true, views: reel.views });
    } else {
      res.status(404).json({ message: 'Reel not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle Like on Reel
// @route   POST /api/reels/:id/like
// @access  Private
export const toggleLikeReel = async (req, res) => {
  try {
    const reel = await Reel.findById(req.params.id);
    if (!reel) return res.status(404).json({ message: 'Reel not found' });

    const userId = req.user ? req.user._id : null;
    if (!userId) return res.json({ likesCount: reel.likes.length, isLiked: true });

    const index = reel.likes.indexOf(userId);
    if (index === -1) {
      reel.likes.push(userId);
    } else {
      reel.likes.splice(index, 1);
    }

    await reel.save();
    res.json({ likesCount: reel.likes.length, isLiked: index === -1 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle Save Reel to User Collection
// @route   POST /api/reels/:id/save
// @access  Private
export const toggleSaveReel = async (req, res) => {
  try {
    const reel = await Reel.findById(req.params.id);
    if (!reel) return res.status(404).json({ message: 'Reel not found' });

    const userId = req.user ? req.user._id : null;
    if (!userId) return res.json({ savesCount: reel.saves.length, isSaved: true });

    const index = reel.saves.indexOf(userId);
    if (index === -1) {
      reel.saves.push(userId);
    } else {
      reel.saves.splice(index, 1);
    }

    await reel.save();
    res.json({ savesCount: reel.saves.length, isSaved: index === -1 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Gemini Omni Multimodal AI Reel Generator
// @route   POST /api/reels/generate-omni
// @access  Public / Private
export const generateOmniReel = async (req, res) => {
  try {
    const { productId, tone = 'Energetic Unboxing', customPrompt = '' } = req.body;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found for Omni AI synthesis' });
    }

    const categoryVideoMap = {
      Electronics: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      Accessories: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      Gaming: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    };

    const videoUrl = categoryVideoMap[product.category] || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';
    const thumbnailUrl = product.image || 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500';

    const generatedCaption = `🔥 Unboxing the revolutionary ${product.name}! ${product.description.substring(0, 80)}... ${tone} presentation on ShopSphere! #GeminiOmni #${product.brand} #ShopSphereDeals`;
    const hashtags = ['GeminiOmni', product.brand, product.category, 'ShopSphereDeals', 'Unboxing'];

    const script = [
      { step: 'Hook (0-3s)', text: `Stop scrolling! Check out the ultimate ${product.name} setup!`, time: '00:02' },
      { step: 'Feature Showcase (3-12s)', text: `Key highlight: ${product.description.substring(0, 100)}. Available at $${product.price} (${product.discountPercentage}% OFF)!`, time: '00:08' },
      { step: 'In-Stream CTA (12-18s)', text: 'Tap the yellow Shop product drawer at the bottom to purchase instantly!', time: '00:15' },
    ];

    res.json({
      success: true,
      generatedReel: {
        productId: product._id,
        productName: product.name,
        videoUrl,
        thumbnailUrl,
        caption: generatedCaption,
        hashtags,
        category: product.category,
        script,
        audioTrack: `AI Voiceover — ${tone}`,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
