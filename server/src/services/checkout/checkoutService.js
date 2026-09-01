import { Cart } from '../../models/Cart.js';
import { Product } from '../../models/Product.js';
import { Address } from '../../models/Address.js';
import { shippingService } from './shippingService.js';
import { AppError } from '../../middleware/errorHandler.js';

export async function createCheckoutPreview(userId, { addressId, deliveryMethod = 'standard' }) {
  // 1. Fetch user's cart
  const cart = await Cart.findOne({ userId });
  if (!cart || !cart.items || cart.items.length === 0) {
    throw new AppError('Your shopping cart is empty.', 400, 'EMPTY_CART');
  }

  // 2. Fetch and validate selected shipping address if provided
  let selectedAddress = null;
  if (addressId) {
    selectedAddress = await Address.findById(addressId);
    if (!selectedAddress) {
      throw new AppError('Selected shipping address was not found.', 404, 'ADDRESS_NOT_FOUND');
    }
    if (selectedAddress.userId.toString() !== userId.toString()) {
      throw new AppError('Access denied for selected address.', 403, 'ADDRESS_FORBIDDEN');
    }
  } else {
    // Attempt to load default address
    selectedAddress = await Address.findOne({ userId, isDefault: true });
    if (!selectedAddress) {
      selectedAddress = await Address.findOne({ userId }).sort({ createdAt: -1 });
    }
  }

  // 3. Process products, prices, and stock server-authoritatively
  const items = [];
  let subtotal = 0;
  let itemCount = 0;

  for (const item of cart.items) {
    const product = await Product.findById(item.productId);

    if (!product || !product.isActive) {
      throw new AppError(
        `Product "${product ? product.name : 'Unknown'}" is no longer available.`,
        400,
        'PRODUCT_UNAVAILABLE'
      );
    }

    if (product.stock < item.quantity) {
      const msg =
        product.stock === 0
          ? `Product "${product.name}" is currently out of stock.`
          : `Only ${product.stock} units available for "${product.name}".`;
      throw new AppError(msg, 409, 'INSUFFICIENT_STOCK');
    }

    const unitPrice = Number(product.price) || 0;
    const lineTotal = unitPrice * item.quantity;

    subtotal += lineTotal;
    itemCount += item.quantity;

    items.push({
      productId: product._id.toString(),
      name: product.name,
      sku: product.sku || '',
      image: product.images?.[0]?.url || '',
      unitPrice,
      quantity: item.quantity,
      lineTotal,
      stockAvailable: product.stock,
    });
  }

  // 4. Calculate server shipping & totals
  const shippingInfo = shippingService.calculateShippingFee(deliveryMethod, subtotal);
  const discount = 0;
  const tax = 0;
  const total = subtotal + shippingInfo.fee - discount + tax;

  return {
    items,
    address: selectedAddress
      ? {
          id: selectedAddress._id.toString(),
          fullName: selectedAddress.fullName,
          phone: selectedAddress.phone,
          addressLine1: selectedAddress.addressLine1,
          addressLine2: selectedAddress.addressLine2,
          city: selectedAddress.city,
          state: selectedAddress.state,
          postalCode: selectedAddress.postalCode,
          country: selectedAddress.country,
          landmark: selectedAddress.landmark,
          isDefault: selectedAddress.isDefault,
        }
      : null,
    pricing: {
      subtotal,
      discount,
      shipping: shippingInfo.fee,
      tax,
      total,
      itemCount,
    },
    delivery: {
      method: shippingInfo.method,
      fee: shippingInfo.fee,
      estimatedDelivery: shippingInfo.estimatedDelivery,
      label: shippingInfo.label,
    },
  };
}

export const checkoutService = {
  createCheckoutPreview,
};

export default checkoutService;
