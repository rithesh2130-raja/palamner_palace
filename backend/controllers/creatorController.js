import CreatorProfile from '../models/creatorProfileModel.js';
import User from '../models/userModel.js';
import Reel from '../models/reelModel.js';
import Affiliate from '../models/affiliateModel.js';

// @desc    Get Creator Profile by Username
// @route   GET /api/creators/:username
// @access  Public
export const getCreatorByUsername = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Creator not found' });
    }

    let profile = await CreatorProfile.findOne({ user: user._id });
    if (!profile) {
      profile = await CreatorProfile.create({
        user: user._id,
        bio: user.bio || 'Creator on ShopSphere Social Marketplace',
        isVerified: true,
      });
    }

    const reels = await Reel.find({ creator: user._id, status: 'Approved' })
      .populate('products.product')
      .sort({ createdAt: -1 });

    const totalViews = reels.reduce((acc, r) => acc + (r.views || 0), 0);
    const totalLikes = reels.reduce((acc, r) => acc + (r.likes ? r.likes.length : 0), 0);

    res.json({
      user,
      profile,
      reels,
      stats: {
        totalViews,
        totalLikes,
        reelsCount: reels.length,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle Follow Creator
// @route   POST /api/creators/:id/follow
// @access  Private
export const toggleFollowCreator = async (req, res) => {
  try {
    const creatorUser = await User.findById(req.params.id);
    if (!creatorUser) {
      return res.status(404).json({ message: 'Creator not found' });
    }

    creatorUser.followersCount += 1;
    await creatorUser.save();

    res.json({ success: true, followersCount: creatorUser.followersCount, isFollowing: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Creator Analytics & Affiliate Earnings
// @route   GET /api/creators/:id/analytics
// @access  Private
export const getCreatorAnalytics = async (req, res) => {
  try {
    const creatorId = req.params.id;
    const affiliates = await Affiliate.find({ creator: creatorId }).populate('product').sort({ createdAt: -1 });

    const totalEarnings = affiliates.reduce((sum, a) => sum + (a.commissionAmount || 0), 0);

    res.json({
      totalEarnings,
      totalConversions: affiliates.length,
      recentTransactions: affiliates,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
