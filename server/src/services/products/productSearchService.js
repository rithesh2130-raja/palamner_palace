import Product from '../../models/Product.js';
import { isDatabaseConnected } from '../../config/database.js';
import { validateProductQuery } from '../../validators/productQueryValidator.js';

// Fallback seed data if MongoDB is disconnected in dev
const FALLBACK_PRODUCTS = [
  {
    _id: '65f1a2b3c4d5e6f7a8b9c001',
    name: 'Wireless Active Noise Cancelling Headphones - Pro Audio',
    slug: 'wireless-gaming-mouse',
    description: 'Ergonomic wireless gaming mouse with 26k DPI optical sensor, ultra-lightweight design, and 80h battery life.',
    brand: 'AcousticPalace',
    category: 'Gaming',
    subcategory: 'Peripherals',
    price: 1499,
    compareAtPrice: 1999,
    stock: 42,
    sku: 'GM-001',
    images: [
      { url: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80', alt: 'Wireless Gaming Mouse Top View' },
      { url: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop&q=80', alt: 'Wireless Gaming Mouse Side' },
    ],
    rating: 4.7,
    reviewCount: 2431,
    tags: ['gaming', 'wireless', 'mouse'],
    isFeatured: true,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: '65f1a2b3c4d5e6f7a8b9c002',
    name: 'Palamner Traditional Silk Saree — Kanchipuram Gold Zari',
    slug: 'palamner-traditional-silk-saree',
    description: 'Authentic handwoven silk saree featuring exquisite gold zari work and rich royal crimson finish directly from Palamner artisan looms.',
    brand: 'Palamner Silks',
    category: 'Fashion',
    subcategory: 'Ethnic Wear',
    price: 3499,
    compareAtPrice: 4999,
    stock: 15,
    sku: 'PS-002',
    images: [
      { url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80', alt: 'Palamner Silk Saree' },
    ],
    rating: 4.8,
    reviewCount: 240,
    tags: ['saree', 'silk', 'traditional', 'wedding', 'palamner'],
    isFeatured: true,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: '65f1a2b3c4d5e6f7a8b9c003',
    name: 'Ayurvedic Kumkumadi Glow Face Serum 30ml',
    slug: 'ayurvedic-kumkumadi-glow-face-serum',
    description: 'Formulated with 24K gold flakes, pure saffron, and sandalwood extracts for radiant youthfulness and even skin tone.',
    brand: 'Palace Botanicals',
    category: 'Beauty',
    subcategory: 'Skincare',
    price: 699,
    compareAtPrice: 999,
    stock: 60,
    sku: 'BE-003',
    images: [
      { url: 'https://images.unsplash.com/photo-1608248597261-5421778b1621?w=800&auto=format&fit=crop&q=80', alt: 'Kumkumadi Serum' },
    ],
    rating: 4.9,
    reviewCount: 312,
    tags: ['skincare', 'ayurvedic', 'serum', 'glow'],
    isFeatured: true,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: '65f1a2b3c4d5e6f7a8b9c004',
    name: 'Brass Handcrafted Royal Peacock Diya Set (Pair of 2)',
    slug: 'brass-handcrafted-peacock-diya-set',
    description: 'Solid brass peacock oil lamps with antique gold polish, ideal for home decor and festive rituals.',
    brand: 'Heritage Crafts',
    category: 'Home',
    subcategory: 'Decor',
    price: 899,
    compareAtPrice: 1299,
    stock: 45,
    sku: 'HM-004',
    images: [
      { url: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=800&auto=format&fit=crop&q=80', alt: 'Brass Diya Pair' },
    ],
    rating: 4.6,
    reviewCount: 96,
    tags: ['decor', 'brass', 'diya', 'handicraft'],
    isFeatured: false,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: '65f1a2b3c4d5e6f7a8b9c005',
    name: 'Mechanical RGB Mechanical Keyboard (Tactile Brown Switches)',
    slug: 'rgb-mechanical-keyboard-tactile-brown',
    description: 'Full-size mechanical keyboard with hot-swappable tactile brown switches, per-key RGB backlighting, and aluminum frame.',
    brand: 'TechPro',
    category: 'Electronics',
    subcategory: 'Keyboards',
    price: 2999,
    compareAtPrice: 3999,
    stock: 17,
    sku: 'KB-005',
    images: [
      { url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80', alt: 'RGB Mechanical Keyboard' },
    ],
    rating: 4.7,
    reviewCount: 158,
    tags: ['keyboard', 'mechanical', 'rgb', 'gaming'],
    isFeatured: true,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: '65f1a2b3c4d5e6f7a8b9c006',
    name: 'Pro Graphite Badminton Racket Set with Case',
    slug: 'pro-graphite-badminton-racket-set',
    description: 'Ultra-light carbon graphite badminton racket pair engineered for high tension smash power and aerodynamic control.',
    brand: 'ApexSport',
    category: 'Sports',
    subcategory: 'Badminton',
    price: 1299,
    compareAtPrice: 1799,
    stock: 25,
    sku: 'SP-006',
    images: [
      { url: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&auto=format&fit=crop&q=80', alt: 'Badminton Racket Set' },
    ],
    rating: 4.5,
    reviewCount: 84,
    tags: ['badminton', 'sports', 'racket', 'fitness'],
    isFeatured: false,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

/**
 * Executes structured product search, filtering, sorting, and pagination.
 * @param {Record<string, any>} rawQuery
 */
export async function searchProducts(rawQuery = {}) {
  const queryParams = validateProductQuery(rawQuery);
  const {
    q,
    category,
    subcategory,
    brand,
    minPrice,
    maxPrice,
    minRating,
    inStock,
    isFeatured,
    sort,
    page,
    limit,
  } = queryParams;

  const skip = (page - 1) * limit;

  if (isDatabaseConnected()) {
    const mongoQuery = { isActive: true };

    // Search query matching (Text Search or Case-Insensitive Substring Regex fallback)
    let isTextSearchUsed = false;
    if (q) {
      const sanitizedQ = escapeRegex(q);
      const searchRegex = new RegExp(sanitizedQ, 'i');

      mongoQuery.$or = [
        { name: searchRegex },
        { brand: searchRegex },
        { category: searchRegex },
        { subcategory: searchRegex },
        { tags: searchRegex },
        { description: searchRegex },
        { sku: searchRegex },
      ];
    }

    // Category / Subcategory / Brand filters
    if (category && category.toLowerCase() !== 'all') {
      mongoQuery.category = new RegExp(`^${escapeRegex(category)}$`, 'i');
    }

    if (subcategory) {
      mongoQuery.subcategory = new RegExp(`^${escapeRegex(subcategory)}$`, 'i');
    }

    if (brand) {
      mongoQuery.brand = new RegExp(`^${escapeRegex(brand)}$`, 'i');
    }

    // Price Filter
    if (minPrice !== undefined || maxPrice !== undefined) {
      mongoQuery.price = {};
      if (minPrice !== undefined) mongoQuery.price.$gte = minPrice;
      if (maxPrice !== undefined) mongoQuery.price.$lte = maxPrice;
    }

    // Rating Filter
    if (minRating !== undefined) {
      mongoQuery.rating = { $gte: minRating };
    }

    // Availability Filter
    if (inStock) {
      mongoQuery.stock = { $gt: 0 };
    }

    // Featured Filter
    if (isFeatured !== undefined) {
      mongoQuery.isFeatured = isFeatured;
    }

    // Sort resolution
    let sortOptions = { createdAt: -1 };
    if (sort === 'price_asc') {
      sortOptions = { price: 1 };
    } else if (sort === 'price_desc') {
      sortOptions = { price: -1 };
    } else if (sort === 'rating') {
      sortOptions = { rating: -1, reviewCount: -1 };
    } else if (sort === 'popular') {
      sortOptions = { reviewCount: -1, rating: -1 };
    } else if (sort === 'newest') {
      sortOptions = { createdAt: -1 };
    } else if (sort === 'relevance') {
      sortOptions = q ? { rating: -1, reviewCount: -1 } : { createdAt: -1 };
    }

    const total = await Product.countDocuments(mongoQuery);
    const products = await Product.find(mongoQuery).sort(sortOptions).skip(skip).limit(limit);

    return {
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit) || 1,
      },
    };
  }

  // Fallback In-Memory Engine for Dev/Seed mode
  let filtered = [...FALLBACK_PRODUCTS].filter(p => p.isActive);

  if (q) {
    const qLower = q.toLowerCase();
    filtered = filtered.filter(
      p =>
        p.name.toLowerCase().includes(qLower) ||
        (p.brand && p.brand.toLowerCase().includes(qLower)) ||
        p.category.toLowerCase().includes(qLower) ||
        (p.subcategory && p.subcategory.toLowerCase().includes(qLower)) ||
        p.description.toLowerCase().includes(qLower) ||
        p.tags.some(t => t.toLowerCase().includes(qLower)) ||
        (p.sku && p.sku.toLowerCase().includes(qLower))
    );
  }

  if (category && category.toLowerCase() !== 'all') {
    filtered = filtered.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }

  if (subcategory) {
    filtered = filtered.filter(p => p.subcategory?.toLowerCase() === subcategory.toLowerCase());
  }

  if (brand) {
    filtered = filtered.filter(p => p.brand?.toLowerCase() === brand.toLowerCase());
  }

  if (minPrice !== undefined) {
    filtered = filtered.filter(p => p.price >= minPrice);
  }

  if (maxPrice !== undefined) {
    filtered = filtered.filter(p => p.price <= maxPrice);
  }

  if (minRating !== undefined) {
    filtered = filtered.filter(p => p.rating >= minRating);
  }

  if (inStock) {
    filtered = filtered.filter(p => p.stock > 0);
  }

  if (isFeatured !== undefined) {
    filtered = filtered.filter(p => p.isFeatured === isFeatured);
  }

  // Sorting
  if (sort === 'price_asc') filtered.sort((a, b) => a.price - b.price);
  else if (sort === 'price_desc') filtered.sort((a, b) => b.price - a.price);
  else if (sort === 'rating') filtered.sort((a, b) => b.rating - a.rating);
  else if (sort === 'popular') filtered.sort((a, b) => b.reviewCount - a.reviewCount);
  else if (sort === 'newest') filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const total = filtered.length;
  const paginated = filtered.slice(skip, skip + limit);

  return {
    products: paginated,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit) || 1,
    },
  };
}

/**
 * Returns instant search suggestions, matching categories & products for global header auto-complete.
 * @param {string} rawQuery
 */
export async function getSearchSuggestions(rawQuery = '') {
  const q = String(rawQuery || '').trim();
  if (!q) {
    return {
      query: '',
      suggestions: getPopularSearches(),
      products: [],
      categories: [],
    };
  }

  const searchResults = await searchProducts({ q, limit: 4 });
  const matchingProducts = searchResults.products;

  const categoriesSet = new Set();
  matchingProducts.forEach(p => {
    if (p.category) categoriesSet.add(p.category);
  });

  const matchingCategories = Array.from(categoriesSet);

  const suggestions = [
    q,
    ...matchingProducts.map(p => p.name).slice(0, 3),
  ];

  return {
    query: q,
    suggestions: Array.from(new Set(suggestions)),
    products: matchingProducts.map(p => ({
      _id: p._id,
      name: p.name,
      slug: p.slug,
      price: p.price,
      category: p.category,
      image: p.images && p.images.length > 0 ? p.images[0].url : '',
    })),
    categories: matchingCategories,
  };
}

/**
 * Returns popular trending searches.
 */
export function getPopularSearches() {
  return [
    'Wireless Gaming Mouse',
    'Silk Saree',
    'Face Serum',
    'Mechanical Keyboard',
    'Badminton Racket',
    'Peacock Diya',
  ];
}

export const productSearchService = {
  searchProducts,
  getSearchSuggestions,
  getPopularSearches,
};

export default productSearchService;
