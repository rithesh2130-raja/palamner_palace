const MOCK_REELS = [
  {
    id: 'reel-1',
    creator: { name: 'Ananya Sharma', handle: '@ananya_style', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', verified: true },
    caption: 'Draping the royal Palamner Silk Saree for wedding season! ✨ Look at that gold zari luster! 💛',
    videoPoster: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80',
    likesCount: 14200,
    commentsCount: 380,
    sharesCount: 920,
    taggedProduct: { id: 'prod-1', title: 'Palamner Traditional Silk Saree', price: 3499, originalPrice: 4999, discount: '30% OFF', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=200&auto=format&fit=crop&q=80' }
  },
  {
    id: 'reel-2',
    creator: { name: 'Rohan Tech Reviews', handle: '@rohan_tech', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', verified: true },
    caption: 'Testing Active Noise Cancellation in noisy markets! Surprised by this quality under ₹3000 🎧🔥',
    videoPoster: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    likesCount: 8900,
    commentsCount: 215,
    sharesCount: 450,
    taggedProduct: { id: 'prod-2', title: 'Wireless Active Noise Cancelling Headphones', price: 2799, originalPrice: 3999, discount: '30% OFF', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&auto=format&fit=crop&q=80' }
  }
];

export const getReels = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      count: MOCK_REELS.length,
      data: MOCK_REELS
    });
  } catch (error) {
    next(error);
  }
};
