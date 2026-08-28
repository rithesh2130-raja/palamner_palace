import { Cart, ICart } from '../../models/Cart.js';
import { Product } from '../../models/Product.js';
import { AppError } from '../../middleware/errorHandler.js';
import mongoose from 'mongoose';

export interface FormattedCartSummary {
  itemCount: number;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
}

export interface FormattedCartItem {
  product: any;
  quantity: number;
  lineTotal: number;
  isAvailable: boolean;
}

export interface FormattedCart {
  items: FormattedCartItem[];
  summary: FormattedCartSummary;
}

export async function calculateCartTotals(cart: ICart | null): Promise<FormattedCart> {
  if (!cart || !cart.items || cart.items.length === 0) {
    return {
      items: [],
      summary: {
        itemCount: 0,
        subtotal: 0,
        discount: 0,
        shipping: 0,
        total: 0,
      },
    };
  }

  const enrichedItems: FormattedCartItem[] = [];
  let subtotal = 0;
  let itemCount = 0;

  for (const item of cart.items) {
    const product = await Product.findById(item.productId);

    if (!product || !product.isActive) {
      continue;
    }

    const price = Number(product.price) || 0;
    const quantity = Number(item.quantity) || 1;
    const lineTotal = price * quantity;

    subtotal += lineTotal;
    itemCount += quantity;

    enrichedItems.push({
      product: {
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
      },
      quantity,
      lineTotal,
      isAvailable: product.stock > 0 && product.isActive,
    });
  }

  const shipping = subtotal > 999 || subtotal === 0 ? 0 : 79;
  const discount = 0;
  const total = subtotal + shipping - discount;

  return {
    items: enrichedItems,
    summary: {
      itemCount,
      subtotal,
      discount,
      shipping,
      total,
    },
  };
}

export async function getCart(userId: mongoose.Types.ObjectId | string): Promise<FormattedCart> {
  let cart = await Cart.findOne({ userId });
  if (!cart) {
    cart = await Cart.create({ userId, items: [] });
  }
  return calculateCartTotals(cart);
}

export async function addItem(
  userId: mongoose.Types.ObjectId | string,
  productId: string,
  quantity = 1
): Promise<FormattedCart> {
  const reqQty = Number(quantity);
  if (!reqQty || reqQty < 1 || !Number.isInteger(reqQty)) {
    throw new AppError('Quantity must be a positive integer', 400, 'INVALID_QUANTITY');
  }

  const product = await Product.findById(productId);
  if (!product || !product.isActive) {
    throw new AppError('Product not found or currently unavailable', 404, 'PRODUCT_NOT_FOUND');
  }

  let cart = await Cart.findOne({ userId });
  if (!cart) {
    cart = new Cart({ userId, items: [] });
  }

  const existingItemIndex = cart.items.findIndex(
    (item: any) => item.productId.toString() === productId.toString()
  );

  let currentQtyInCart = 0;
  if (existingItemIndex > -1) {
    currentQtyInCart = cart.items[existingItemIndex].quantity;
  }

  const totalRequestedQty = currentQtyInCart + reqQty;

  if (totalRequestedQty > product.stock) {
    const msg =
      product.stock === 0
        ? 'This item is currently out of stock.'
        : `Only ${product.stock} items are currently available.`;
    throw new AppError(msg, 409, 'INSUFFICIENT_STOCK');
  }

  if (existingItemIndex > -1) {
    cart.items[existingItemIndex].quantity = totalRequestedQty;
  } else {
    cart.items.push({ productId: new mongoose.Types.ObjectId(productId), quantity: reqQty });
  }

  await cart.save();
  return calculateCartTotals(cart);
}

export async function updateItem(
  userId: mongoose.Types.ObjectId | string,
  productId: string,
  quantity: number
): Promise<FormattedCart> {
  const reqQty = Number(quantity);
  if (isNaN(reqQty) || !Number.isInteger(reqQty)) {
    throw new AppError('Quantity must be an integer', 400, 'INVALID_QUANTITY');
  }

  let cart = await Cart.findOne({ userId });
  if (!cart) {
    cart = await Cart.create({ userId, items: [] });
  }

  if (reqQty <= 0) {
    return removeItem(userId, productId);
  }

  const product = await Product.findById(productId);
  if (!product || !product.isActive) {
    throw new AppError('Product not found or unavailable', 404, 'PRODUCT_NOT_FOUND');
  }

  if (reqQty > product.stock) {
    throw new AppError(
      `Only ${product.stock} items are currently available.`,
      409,
      'INSUFFICIENT_STOCK'
    );
  }

  const existingItemIndex = cart.items.findIndex(
    (item: any) => item.productId.toString() === productId.toString()
  );

  if (existingItemIndex > -1) {
    cart.items[existingItemIndex].quantity = reqQty;
  } else {
    cart.items.push({ productId: new mongoose.Types.ObjectId(productId), quantity: reqQty });
  }

  await cart.save();
  return calculateCartTotals(cart);
}

export async function removeItem(
  userId: mongoose.Types.ObjectId | string,
  productId: string
): Promise<FormattedCart> {
  const cart = await Cart.findOne({ userId });
  if (!cart) {
    return calculateCartTotals(null);
  }

  cart.items = cart.items.filter(
    (item: any) => item.productId.toString() !== productId.toString()
  );

  await cart.save();
  return calculateCartTotals(cart);
}

export async function clearCart(
  userId: mongoose.Types.ObjectId | string
): Promise<FormattedCart> {
  const cart = await Cart.findOne({ userId });
  if (cart) {
    cart.items = [];
    await cart.save();
  }
  return calculateCartTotals(cart);
}

export const cartService = {
  getCart,
  addItem,
  updateItem,
  removeItem,
  clearCart,
  calculateCartTotals,
};

export default cartService;
