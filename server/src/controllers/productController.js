import Product from '../models/Product.js';
import { isDatabaseConnected } from '../config/database.js';

// Fallback seed data if MongoDB is unavailable in dev
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

// Generate slug helper
export const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-'); // Replace multiple - with single -
};

/**
 * GET /api/v1/products
 * Supports page, limit, category, subcategory, minPrice, maxPrice, sort, search
 */
export const getProducts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    const { category, subcategory, minPrice, maxPrice, sort, search, isFeatured, filter } = req.query;

    if (isDatabaseConnected()) {
      const query = { isActive: true };

      if (category) {
        query.category = { $regex: new RegExp(`^${category}$`, 'i') };
      }
      if (subcategory) {
        query.subcategory = { $regex: new RegExp(`^${subcategory}$`, 'i') };
      }
      if (isFeatured !== undefined) {
        query.isFeatured = isFeatured === 'true';
      }
      if (filter === 'bestseller' || filter === 'bestsellers') {
        query.reviewCount = { $gt: 0 };
      }
      if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = Number(minPrice);
        if (maxPrice) query.price.$lte = Number(maxPrice);
      }
      if (search) {
        const searchRegex = new RegExp(String(search), 'i');
        query.$or = [
          { name: searchRegex },
          { brand: searchRegex },
          { description: searchRegex },
          { tags: searchRegex },
        ];
      }

      // Sorting
      let sortOptions = { createdAt: -1 };
      if (sort === 'price_asc' || sort === 'price-low') sortOptions = { price: 1 };
      else if (sort === 'price_desc' || sort === 'price-high') sortOptions = { price: -1 };
      else if (sort === 'rating') sortOptions = { rating: -1 };
      else if (sort === 'bestsellers' || sort === 'bestseller') sortOptions = { reviewCount: -1, rating: -1 };
      else if (sort === 'newest' || sort === 'new') sortOptions = { createdAt: -1 };

      const total = await Product.countDocuments(query);
      const products = await Product.find(query).sort(sortOptions).skip(skip).limit(limit);

      return res.status(200).json({
        success: true,
        data: {
          products,
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit) || 1,
          },
        },
      });
    }

    // Fallback in-memory logic
    let filtered = [...FALLBACK_PRODUCTS].filter(p => p.isActive);
    if (category) {
      filtered = filtered.filter(p => p.category.toLowerCase() === String(category).toLowerCase());
    }
    if (subcategory) {
      filtered = filtered.filter(p => p.subcategory?.toLowerCase() === String(subcategory).toLowerCase());
    }
    if (isFeatured !== undefined) {
      filtered = filtered.filter(p => p.isFeatured === (isFeatured === 'true'));
    }
    if (minPrice) {
      filtered = filtered.filter(p => p.price >= Number(minPrice));
    }
    if (maxPrice) {
      filtered = filtered.filter(p => p.price <= Number(maxPrice));
    }
    if (search) {
      const q = String(search).toLowerCase();
      filtered = filtered.filter(
        p =>
          p.name.toLowerCase().includes(q) ||
          (p.brand && p.brand.toLowerCase().includes(q)) ||
          p.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    if (sort === 'price_asc') filtered.sort((a, b) => a.price - b.price);
    else if (sort === 'price_desc') filtered.sort((a, b) => b.price - a.price);
    else if (sort === 'rating') filtered.sort((a, b) => b.rating - a.rating);

    const total = filtered.length;
    const paginated = filtered.slice(skip, skip + limit);

    return res.status(200).json({
      success: true,
      data: {
        products: paginated,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit) || 1,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/products/featured
 */
export const getFeaturedProducts = async (req, res, next) => {
  try {
    req.query.isFeatured = 'true';
    return getProducts(req, res, next);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/products/category/:category
 */
export const getProductsByCategory = async (req, res, next) => {
  try {
    req.query.category = req.params.category;
    return getProducts(req, res, next);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/products/slug/:slug
 */
export const getProductBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    if (isDatabaseConnected()) {
      const product = await Product.findOne({ slug: slug.toLowerCase() });
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product with slug '${slug}' not found`,
        });
      }
      return res.status(200).json({
        success: true,
        data: product,
      });
    }

    // Fallback
    const product = FALLBACK_PRODUCTS.find(p => p.slug === slug.toLowerCase()) || FALLBACK_PRODUCTS[0];
    return res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/products/:id
 */
export const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isDatabaseConnected()) {
      const product = await Product.findById(id);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product with ID '${id}' not found`,
        });
      }
      return res.status(200).json({
        success: true,
        data: product,
      });
    }

    // Fallback
    const product = FALLBACK_PRODUCTS.find(p => p._id === id || p.slug === id) || FALLBACK_PRODUCTS[0];
    return res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/v1/products
 */
export const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      slug: customSlug,
      description,
      brand,
      category,
      subcategory,
      price,
      compareAtPrice,
      stock,
      sku,
      images,
      tags,
      isFeatured,
      isActive,
    } = req.body;

    if (!name || !description || !category || price === undefined || stock === undefined || !sku) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, description, category, price, stock, sku',
      });
    }

    const slug = customSlug ? slugify(customSlug) : slugify(name);

    if (isDatabaseConnected()) {
      const existingSlug = await Product.findOne({ slug });
      if (existingSlug) {
        return res.status(400).json({
          success: false,
          message: `Product with slug '${slug}' already exists`,
        });
      }

      const existingSku = await Product.findOne({ sku });
      if (existingSku) {
        return res.status(400).json({
          success: false,
          message: `Product with SKU '${sku}' already exists`,
        });
      }

      const formattedImages = Array.isArray(images) && images.length > 0
        ? images.map(img => typeof img === 'string' ? { url: img } : img)
        : [{ url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80', alt: name }];

      const newProduct = await Product.create({
        name,
        slug,
        description,
        brand,
        category,
        subcategory,
        price: Number(price),
        compareAtPrice: compareAtPrice ? Number(compareAtPrice) : undefined,
        stock: Number(stock),
        sku,
        images: formattedImages,
        tags: Array.isArray(tags) ? tags : typeof tags === 'string' ? tags.split(',').map(t => t.trim()) : [],
        isFeatured: Boolean(isFeatured),
        isActive: isActive !== undefined ? Boolean(isActive) : true,
      });

      return res.status(201).json({
        success: true,
        message: 'Product created successfully',
        data: newProduct,
      });
    }

    // Fallback response
    const mockCreated = {
      _id: `mock-${Date.now()}`,
      name,
      slug,
      description,
      brand: brand || 'Generic',
      category,
      subcategory,
      price: Number(price),
      compareAtPrice: compareAtPrice ? Number(compareAtPrice) : undefined,
      stock: Number(stock),
      sku,
      images: images || [{ url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80', alt: name }],
      rating: 0,
      reviewCount: 0,
      tags: tags || [],
      isFeatured: Boolean(isFeatured),
      isActive: Boolean(isActive),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    FALLBACK_PRODUCTS.unshift(mockCreated);

    return res.status(201).json({
      success: true,
      message: 'Product created (fallback mode)',
      data: mockCreated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/v1/products/:id
 */
export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateFields = { ...req.body };

    if (updateFields.name && !updateFields.slug) {
      updateFields.slug = slugify(updateFields.name);
    } else if (updateFields.slug) {
      updateFields.slug = slugify(updateFields.slug);
    }

    if (updateFields.images && Array.isArray(updateFields.images)) {
      updateFields.images = updateFields.images.map(img => typeof img === 'string' ? { url: img } : img);
    }

    if (isDatabaseConnected()) {
      const updatedProduct = await Product.findByIdAndUpdate(id, updateFields, {
        new: true,
        runValidators: true,
      });

      if (!updatedProduct) {
        return res.status(404).json({
          success: false,
          message: `Product with ID '${id}' not found`,
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Product updated successfully',
        data: updatedProduct,
      });
    }

    // Fallback
    const index = FALLBACK_PRODUCTS.findIndex(p => p._id === id);
    if (index !== -1) {
      FALLBACK_PRODUCTS[index] = { ...FALLBACK_PRODUCTS[index], ...updateFields, updatedAt: new Date().toISOString() };
      return res.status(200).json({
        success: true,
        message: 'Product updated (fallback mode)',
        data: FALLBACK_PRODUCTS[index],
      });
    }

    return res.status(404).json({ success: false, message: 'Product not found' });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/v1/products/:id
 */
export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isDatabaseConnected()) {
      const deleted = await Product.findByIdAndDelete(id);
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: `Product with ID '${id}' not found`,
        });
      }
      return res.status(200).json({
        success: true,
        message: 'Product deleted successfully',
      });
    }

    const index = FALLBACK_PRODUCTS.findIndex(p => p._id === id);
    if (index !== -1) {
      FALLBACK_PRODUCTS.splice(index, 1);
    }

    return res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
