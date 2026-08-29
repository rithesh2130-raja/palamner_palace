import { Request, Response, NextFunction } from 'express';
import Product from '../models/Product.js';
import productSearchService from '../services/products/productSearchService.js';

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
    const searchResult = await productSearchService.searchProducts(req.query);
    res.status(200).json({
      success: true,
      data: searchResult,
    });
    return;
  } catch (error) {
    next(error);
  }
};

export const getSearchSuggestions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const q = (req.query.q || req.query.search || '') as string;
    const result = await productSearchService.getSearchSuggestions(q);
    res.status(200).json({
      success: true,
      data: result,
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
