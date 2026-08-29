import Product from '../../models/Product.js';
import { isDatabaseConnected } from '../../config/database.js';
import { validateProductQuery, ValidatedProductQuery } from '../../validators/productQueryValidator.js';

export interface SearchResult {
  products: any[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface SearchSuggestionResult {
  query: string;
  suggestions: string[];
  products: Array<{
    _id: string;
    name: string;
    slug: string;
    price: number;
    category: string;
    image: string;
  }>;
  categories: string[];
}

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
    ],
    rating: 4.7,
    reviewCount: 2431,
    tags: ['gaming', 'wireless', 'mouse'],
    isFeatured: true,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

function escapeRegex(text: string): string {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

export async function searchProducts(rawQuery: Record<string, any> = {}): Promise<SearchResult> {
  const queryParams: ValidatedProductQuery = validateProductQuery(rawQuery);
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
    const mongoQuery: any = { isActive: true };

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

    if (category && category.toLowerCase() !== 'all') {
      mongoQuery.category = new RegExp(`^${escapeRegex(category)}$`, 'i');
    }

    if (subcategory) {
      mongoQuery.subcategory = new RegExp(`^${escapeRegex(subcategory)}$`, 'i');
    }

    if (brand) {
      mongoQuery.brand = new RegExp(`^${escapeRegex(brand)}$`, 'i');
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      mongoQuery.price = {};
      if (minPrice !== undefined) mongoQuery.price.$gte = minPrice;
      if (maxPrice !== undefined) mongoQuery.price.$lte = maxPrice;
    }

    if (minRating !== undefined) {
      mongoQuery.rating = { $gte: minRating };
    }

    if (inStock) {
      mongoQuery.stock = { $gt: 0 };
    }

    if (isFeatured !== undefined) {
      mongoQuery.isFeatured = isFeatured;
    }

    let sortOptions: any = { createdAt: -1 };
    if (sort === 'price_asc') sortOptions = { price: 1 };
    else if (sort === 'price_desc') sortOptions = { price: -1 };
    else if (sort === 'rating') sortOptions = { rating: -1, reviewCount: -1 };
    else if (sort === 'popular') sortOptions = { reviewCount: -1, rating: -1 };
    else if (sort === 'newest') sortOptions = { createdAt: -1 };
    else if (sort === 'relevance') sortOptions = q ? { rating: -1, reviewCount: -1 } : { createdAt: -1 };

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

  let filtered = [...FALLBACK_PRODUCTS].filter(p => p.isActive);
  if (q) {
    const qLower = q.toLowerCase();
    filtered = filtered.filter(p => p.name.toLowerCase().includes(qLower));
  }
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

export async function getSearchSuggestions(rawQuery: string = ''): Promise<SearchSuggestionResult> {
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

  const categoriesSet = new Set<string>();
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
      _id: p._id.toString(),
      name: p.name,
      slug: p.slug,
      price: p.price,
      category: p.category,
      image: p.images && p.images.length > 0 ? p.images[0].url : '',
    })),
    categories: matchingCategories,
  };
}

export function getPopularSearches(): string[] {
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
