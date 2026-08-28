import { Wishlist } from '../../models/Wishlist.js';
import { Product } from '../../models/Product.js';
import { AppError } from '../../middleware/errorHandler.js';
import mongoose from 'mongoose';

export interface FormattedWishlist {
  items: any[];
  count: number;
}

export async function getWishlist(userId: mongoose.Types.ObjectId | string): Promise<FormattedWishlist> {
  let wishlist = await Wishlist.findOne({ userId });
  if (!wishlist) {
    wishlist = await Wishlist.create({ userId, productIds: [] });
  }

  const populatedProducts: any[] = [];
  for (const pid of wishlist.productIds) {
    const product = await Product.findById(pid);
    if (product && product.isActive) {
      populatedProducts.push({
        _id: (product._id as mongoose.Types.ObjectId).toString(),
        name: product.name,
        slug: product.slug,
        description: product.description,
        brand: product.brand,
        category: product.category,
        price: product.price,
        compareAtPrice: product.compareAtPrice,
        stock: product.stock,
        sku: product.sku,
        images: product.images,
        rating: product.rating,
        reviewCount: product.reviewCount,
        isActive: product.isActive,
      });
    }
  }

  return {
    items: populatedProducts,
    count: populatedProducts.length,
  };
}

export async function addToWishlist(
  userId: mongoose.Types.ObjectId | string,
  productId: string
): Promise<FormattedWishlist> {
  const product = await Product.findById(productId);
  if (!product || !product.isActive) {
    throw new AppError('Product not found or unavailable', 404, 'PRODUCT_NOT_FOUND');
  }

  let wishlist = await Wishlist.findOne({ userId });
  if (!wishlist) {
    wishlist = new Wishlist({ userId, productIds: [] });
  }

  const exists = wishlist.productIds.some(
    (pid: any) => pid.toString() === productId.toString()
  );

  if (!exists) {
    wishlist.productIds.push(new mongoose.Types.ObjectId(productId));
    await wishlist.save();
  }

  return getWishlist(userId);
}

export async function removeFromWishlist(
  userId: mongoose.Types.ObjectId | string,
  productId: string
): Promise<FormattedWishlist> {
  let wishlist = await Wishlist.findOne({ userId });
  if (!wishlist) {
    return { items: [], count: 0 };
  }

  wishlist.productIds = wishlist.productIds.filter(
    (pid: any) => pid.toString() !== productId.toString()
  );

  await wishlist.save();
  return getWishlist(userId);
}

export const wishlistService = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
};

export default wishlistService;
