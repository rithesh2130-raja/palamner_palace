import { Wishlist } from '../../models/Wishlist.js';
import { Product } from '../../models/Product.js';
import { AppError } from '../../middleware/errorHandler.js';

export async function getWishlist(userId) {
  let wishlist = await Wishlist.findOne({ userId });
  if (!wishlist) {
    wishlist = await Wishlist.create({ userId, productIds: [] });
  }

  const populatedProducts = [];
  for (const pid of wishlist.productIds) {
    const product = await Product.findById(pid);
    if (product && product.isActive) {
      populatedProducts.push({
        _id: product._id.toString(),
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

export async function addToWishlist(userId, productId) {
  const product = await Product.findById(productId);
  if (!product || !product.isActive) {
    throw new AppError('Product not found or unavailable', 404, 'PRODUCT_NOT_FOUND');
  }

  let wishlist = await Wishlist.findOne({ userId });
  if (!wishlist) {
    wishlist = new Wishlist({ userId, productIds: [] });
  }

  const exists = wishlist.productIds.some(
    (pid) => pid.toString() === productId.toString()
  );

  if (!exists) {
    wishlist.productIds.push(productId);
    await wishlist.save();
  }

  return getWishlist(userId);
}

export async function removeFromWishlist(userId, productId) {
  let wishlist = await Wishlist.findOne({ userId });
  if (!wishlist) {
    return { items: [], count: 0 };
  }

  wishlist.productIds = wishlist.productIds.filter(
    (pid) => pid.toString() !== productId.toString()
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
