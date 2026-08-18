const MOCK_CATEGORIES = [
  { id: 'cat-1', name: 'Fashion & Ethnic', slug: 'fashion', itemCount: 420, image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&auto=format&fit=crop&q=80', description: 'Silk sarees, kurtas, jewelry.' },
  { id: 'cat-2', name: 'Electronics & Audio', slug: 'electronics', itemCount: 280, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&auto=format&fit=crop&q=80', description: 'Headphones, smartwatches, gadgets.' },
  { id: 'cat-3', name: 'Home & Handicrafts', slug: 'home-kitchen', itemCount: 310, image: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=400&auto=format&fit=crop&q=80', description: 'Brass idols, earthenware, lamps.' },
  { id: 'cat-4', name: 'Beauty & Wellness', slug: 'beauty-care', itemCount: 195, image: 'https://images.unsplash.com/photo-1608248597261-5421778b1621?w=400&auto=format&fit=crop&q=80', description: 'Ayurvedic oils, skincare.' }
];

export const getCategories = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      count: MOCK_CATEGORIES.length,
      data: MOCK_CATEGORIES
    });
  } catch (error) {
    next(error);
  }
};
