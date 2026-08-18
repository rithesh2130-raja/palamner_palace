const MOCK_PRODUCTS = [
  {
    id: 'prod-1',
    title: 'Palamner Traditional Silk Saree — Kanchipuram Gold Zari',
    brand: 'Palamner Silks',
    category: 'Fashion',
    categorySlug: 'fashion',
    price: 3499,
    originalPrice: 4999,
    discountPercentage: 30,
    rating: 4.8,
    reviewCount: 240,
    isNew: true,
    isBestseller: true,
    stock: 15,
    description: 'Authentic handwoven silk saree featuring exquisite gold zari work and rich royal crimson finish directly from Palamner artisan looms.',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80',
    tags: ['saree', 'silk', 'traditional', 'wedding', 'palamner']
  },
  {
    id: 'prod-2',
    title: 'Wireless Active Noise Cancelling Headphones - Pro Audio',
    brand: 'AcousticPalace',
    category: 'Electronics',
    categorySlug: 'electronics',
    price: 2799,
    originalPrice: 3999,
    discountPercentage: 30,
    rating: 4.6,
    reviewCount: 184,
    isNew: false,
    isBestseller: true,
    stock: 28,
    description: 'Immersive sound with 40-hour battery life, fast charging, and premium memory foam ear cushions.',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
    tags: ['headphones', 'wireless', 'audio', 'anc']
  },
  {
    id: 'prod-3',
    title: 'Brass Handcrafted Royal Peacock Diya Set (Pair of 2)',
    brand: 'Heritage Crafts',
    category: 'Home & Kitchen',
    categorySlug: 'home-kitchen',
    price: 899,
    originalPrice: 1299,
    discountPercentage: 31,
    rating: 4.9,
    reviewCount: 96,
    isNew: true,
    isBestseller: false,
    stock: 45,
    description: 'Solid brass peacock oil lamps with antique gold polish, ideal for home decor and festive rituals.',
    image: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=600&auto=format&fit=crop&q=80',
    tags: ['decor', 'brass', 'diya', 'handicraft']
  },
  {
    id: 'prod-4',
    title: 'Ayurvedic Kumkumadi Glow Face Serum 30ml',
    brand: 'Palace Botanicals',
    category: 'Beauty & Care',
    categorySlug: 'beauty-care',
    price: 699,
    originalPrice: 999,
    discountPercentage: 30,
    rating: 4.7,
    reviewCount: 312,
    isNew: false,
    isBestseller: true,
    stock: 60,
    description: 'Formulated with 24K gold flakes, pure saffron, and sandalwood extracts for radiant youthfulness.',
    image: 'https://images.unsplash.com/photo-1608248597261-5421778b1621?w=600&auto=format&fit=crop&q=80',
    tags: ['skincare', 'ayurvedic', 'serum', 'glow']
  }
];

export const getProducts = async (req, res, next) => {
  try {
    const { category, search, filter } = req.query;
    let list = [...MOCK_PRODUCTS];

    if (category) {
      list = list.filter(p => p.categorySlug === category);
    }
    if (search) {
      const q = String(search).toLowerCase();
      list = list.filter(p => p.title.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q));
    }
    if (filter === 'bestseller') {
      list = list.filter(p => p.isBestseller);
    }
    if (filter === 'new') {
      list = list.filter(p => p.isNew);
    }

    res.status(200).json({
      success: true,
      count: list.length,
      data: list
    });
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = MOCK_PRODUCTS.find(p => p.id === id) || MOCK_PRODUCTS[0];
    res.status(200).json({
      success: true,
      data: item
    });
  } catch (error) {
    next(error);
  }
};
