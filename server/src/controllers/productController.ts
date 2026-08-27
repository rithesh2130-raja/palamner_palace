import { Request, Response, NextFunction } from 'express';
import Product from '../models/Product.js';
import { isDatabaseConnected } from '../config/database.js';

export const slugify = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
};

export const getProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 20;
    const skip = (page - 1) * limit;

    const { category, subcategory, minPrice, maxPrice, sort, search, isFeatured, filter } = req.query;

    if (isDatabaseConnected()) {
      const query: Record<string, any> = { isActive: true };

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

      let sortOptions: Record<string, 1 | -1> = { createdAt: -1 };
      if (sort === 'price_asc' || sort === 'price-low') sortOptions = { price: 1 };
      else if (sort === 'price_desc' || sort === 'price-high') sortOptions = { price: -1 };
      else if (sort === 'rating') sortOptions = { rating: -1 };
      else if (sort === 'bestsellers' || sort === 'bestseller') sortOptions = { rating: -1 };
      else if (sort === 'newest' || sort === 'new') sortOptions = { createdAt: -1 };

      const total = await Product.countDocuments(query);
      const products = await Product.find(query).sort(sortOptions).skip(skip).limit(limit);

      res.status(200).json({
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
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        products: [],
        pagination: { page, limit, total: 0, pages: 1 },
      },
    });
    return;
  } catch (error) {
    next(error);
  }
};

export const getFeaturedProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  req.query.isFeatured = 'true';
  await getProducts(req, res, next);
};

export const getProductsByCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  req.query.category = req.params.category;
  await getProducts(req, res, next);
};

export const getProductBySlug = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const slugStr = String(req.params.slug);
    const product = await Product.findOne({ slug: slugStr.toLowerCase() });
    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }
    res.status(200).json({ success: true, data: product });
    return;
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }
    res.status(200).json({ success: true, data: product });
    return;
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, slug: customSlug, description, brand, category, subcategory, price, compareAtPrice, stock, sku, images, tags, isFeatured, isActive } = req.body;
    const slug = customSlug ? slugify(customSlug) : slugify(name);

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
      images,
      tags: Array.isArray(tags) ? tags : [],
      isFeatured: Boolean(isFeatured),
      isActive: isActive !== undefined ? Boolean(isActive) : true,
    });

    res.status(201).json({ success: true, data: newProduct });
    return;
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const updated = await Product.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }
    res.status(200).json({ success: true, data: updated });
    return;
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: 'Product deleted' });
    return;
  } catch (error) {
    next(error);
  }
};
