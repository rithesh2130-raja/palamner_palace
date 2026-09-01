import mongoose from 'mongoose';
import { Order } from '../../models/Order.js';
import { Cart } from '../../models/Cart.js';
import { Product } from '../../models/Product.js';
import { Address } from '../../models/Address.js';
import { orderNumberService } from './orderNumberService.js';
import { shippingService } from '../checkout/shippingService.js';
import { orderStatusService } from './orderStatusService.js';
import { PaymentProviderFactory } from '../payments/PaymentProviderFactory.js';
import { AppError } from '../../middleware/errorHandler.js';

export async function createOrder(userId, { addressId, deliveryMethod = 'standard', paymentMethod = 'COD', idempotencyKey }) {
  // 1. Check idempotency key if provided
  if (idempotencyKey) {
    const existingOrder = await Order.findOne({ userId, idempotencyKey });
    if (existingOrder) {
      return existingOrder;
    }
  }

  // 2. Fetch cart
  const cart = await Cart.findOne({ userId });
  if (!cart || !cart.items || cart.items.length === 0) {
    throw new AppError('Your cart is empty. Cannot place an order.', 400, 'EMPTY_CART');
  }

  // 3. Load and verify shipping address ownership
  if (!addressId) {
    throw new AppError('Shipping address is required.', 400, 'ADDRESS_REQUIRED');
  }

  const address = await Address.findById(addressId);
  if (!address) {
    throw new AppError('Selected shipping address not found.', 404, 'ADDRESS_NOT_FOUND');
  }

  if (address.userId.toString() !== userId.toString()) {
    throw new AppError('You are not authorized to use this shipping address.', 403, 'ADDRESS_FORBIDDEN');
  }

  // 4. Validate products & prices server-side
  const orderItems = [];
  let subtotal = 0;
  const itemsToDecrement = [];

  for (const cartItem of cart.items) {
    const product = await Product.findById(cartItem.productId);

    if (!product || !product.isActive) {
      throw new AppError(
        `Product "${product ? product.name : 'Unknown'}" is inactive or unavailable.`,
        400,
        'PRODUCT_UNAVAILABLE'
      );
    }

    if (product.stock < cartItem.quantity) {
      throw new AppError(
        `Insufficient stock for "${product.name}". Requested: ${cartItem.quantity}, Available: ${product.stock}`,
        409,
        'INSUFFICIENT_STOCK'
      );
    }

    const unitPrice = Number(product.price) || 0;
    const lineTotal = unitPrice * cartItem.quantity;
    subtotal += lineTotal;

    orderItems.push({
      productId: product._id,
      name: product.name,
      sku: product.sku || '',
      image: product.images?.[0]?.url || '',
      unitPrice,
      quantity: cartItem.quantity,
      lineTotal,
    });

    itemsToDecrement.push({
      productId: product._id,
      quantity: cartItem.quantity,
      name: product.name,
    });
  }

  // 5. Calculate shipping & totals
  const shippingInfo = shippingService.calculateShippingFee(deliveryMethod, subtotal);
  const discount = 0;
  const tax = 0;
  const total = subtotal + shippingInfo.fee - discount + tax;

  // 6. Process payment provider
  const paymentProvider = PaymentProviderFactory.getProvider(paymentMethod);
  const paymentResult = await paymentProvider.createPayment({
    amount: total,
    currency: 'INR',
    userId,
  });

  // 7. Atomic inventory updates with rollback on failure
  const decrementedItems = [];
  try {
    for (const item of itemsToDecrement) {
      const updatedProduct = await Product.findOneAndUpdate(
        {
          _id: item.productId,
          stock: { $gte: item.quantity },
          isActive: true,
        },
        { $inc: { stock: -item.quantity } },
        { new: true }
      );

      if (!updatedProduct) {
        throw new AppError(
          `Stock changed for product "${item.name}". Unable to complete purchase.`,
          409,
          'INSUFFICIENT_STOCK'
        );
      }

      decrementedItems.push(item);
    }
  } catch (err) {
    // Rollback decremented stock for preceding items in the loop
    for (const rollbackItem of decrementedItems) {
      await Product.findByIdAndUpdate(rollbackItem.productId, {
        $inc: { stock: rollbackItem.quantity },
      });
    }
    throw err;
  }

  // 8. Create Order Document with snapshots
  const orderNumber = orderNumberService.generateOrderNumber();
  const addressSnapshot = {
    fullName: address.fullName,
    phone: address.phone,
    addressLine1: address.addressLine1,
    addressLine2: address.addressLine2 || '',
    city: address.city,
    state: address.state,
    postalCode: address.postalCode,
    country: address.country || 'India',
    landmark: address.landmark || '',
  };

  const initialStatus = 'PENDING';
  const order = new Order({
    orderNumber,
    userId,
    items: orderItems,
    shippingAddress: addressSnapshot,
    pricing: {
      subtotal,
      discount,
      shipping: shippingInfo.fee,
      tax,
      total,
    },
    payment: {
      method: (paymentMethod || 'COD').toUpperCase(),
      status: paymentResult.status || 'PENDING',
      transactionId: paymentResult.transactionId || '',
    },
    delivery: {
      method: shippingInfo.method,
      estimatedDelivery: shippingInfo.estimatedDelivery,
    },
    status: initialStatus,
    statusHistory: [
      {
        status: initialStatus,
        timestamp: new Date(),
        note: 'Order placed successfully by customer.',
      },
    ],
    idempotencyKey: idempotencyKey || null,
  });

  try {
    await order.save();
  } catch (saveError) {
    // Rollback stock if order creation fails
    for (const rollbackItem of decrementedItems) {
      await Product.findByIdAndUpdate(rollbackItem.productId, {
        $inc: { stock: rollbackItem.quantity },
      });
    }
    throw saveError;
  }

  // 9. Clear user's cart upon successful order creation
  cart.items = [];
  await cart.save();

  return order;
}

export async function getUserOrders(userId, { page = 1, limit = 10, status }) {
  const query = { userId };
  if (status) {
    query.status = status.toUpperCase();
  }

  const p = Math.max(1, parseInt(page));
  const l = Math.max(1, Math.min(50, parseInt(limit)));
  const skip = (p - 1) * l;

  const [orders, totalCount] = await Promise.all([
    Order.find(query).sort({ createdAt: -1 }).skip(skip).limit(l),
    Order.countDocuments(query),
  ]);

  return {
    orders,
    pagination: {
      page: p,
      limit: l,
      totalCount,
      totalPages: Math.ceil(totalCount / l),
    },
  };
}

export async function getOrderById(orderId, userId, isAdmin = false) {
  let order;
  if (mongoose.Types.ObjectId.isValid(orderId)) {
    order = await Order.findById(orderId);
  }
  if (!order) {
    order = await Order.findOne({ orderNumber: orderId });
  }

  if (!order) {
    throw new AppError('Order not found.', 404, 'ORDER_NOT_FOUND');
  }

  if (!isAdmin && order.userId.toString() !== userId.toString()) {
    throw new AppError('You are not authorized to view this order.', 403, 'ORDER_FORBIDDEN');
  }

  return order;
}

export async function cancelOrder(orderId, userId, isAdmin = false, note = '') {
  const order = await getOrderById(orderId, userId, isAdmin);

  if (!orderStatusService.isCancellable(order.status)) {
    throw new AppError(
      `Order cannot be cancelled as its current status is '${order.status}'.`,
      400,
      'CANCELLATION_NOT_ELIGIBLE'
    );
  }

  orderStatusService.validateStatusTransition(order.status, 'CANCELLED');

  order.status = 'CANCELLED';
  order.statusHistory.push({
    status: 'CANCELLED',
    timestamp: new Date(),
    note: note || (isAdmin ? 'Order cancelled by Admin.' : 'Order cancelled by Customer.'),
  });

  await order.save();

  // Restore inventory safely
  for (const item of order.items) {
    await Product.findByIdAndUpdate(item.productId, {
      $inc: { stock: item.quantity },
    });
  }

  return order;
}

export async function getAllOrdersAdmin({ page = 1, limit = 20, status, search }) {
  const query = {};

  if (status) {
    query.status = status.toUpperCase();
  }

  if (search) {
    query.$or = [
      { orderNumber: { $regex: search, $options: 'i' } },
      { 'shippingAddress.fullName': { $regex: search, $options: 'i' } },
      { 'shippingAddress.phone': { $regex: search, $options: 'i' } },
    ];
  }

  const p = Math.max(1, parseInt(page));
  const l = Math.max(1, Math.min(100, parseInt(limit)));
  const skip = (p - 1) * l;

  const [orders, totalCount] = await Promise.all([
    Order.find(query)
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(l),
    Order.countDocuments(query),
  ]);

  return {
    orders,
    pagination: {
      page: p,
      limit: l,
      totalCount,
      totalPages: Math.ceil(totalCount / l),
    },
  };
}

export async function updateOrderStatusAdmin(orderId, newStatus, note = '') {
  let order;
  if (mongoose.Types.ObjectId.isValid(orderId)) {
    order = await Order.findById(orderId);
  }
  if (!order) {
    order = await Order.findOne({ orderNumber: orderId });
  }

  if (!order) {
    throw new AppError('Order not found.', 404, 'ORDER_NOT_FOUND');
  }

  const targetStatus = newStatus.toUpperCase();
  orderStatusService.validateStatusTransition(order.status, targetStatus);

  // If status change is cancellation, restore inventory if coming from eligible state
  if (targetStatus === 'CANCELLED' && orderStatusService.isCancellable(order.status)) {
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: item.quantity },
      });
    }
  }

  order.status = targetStatus;
  order.statusHistory.push({
    status: targetStatus,
    timestamp: new Date(),
    note: note || `Order status updated to ${targetStatus} by Admin.`,
  });

  await order.save();
  return order;
}

export const orderService = {
  createOrder,
  getUserOrders,
  getOrderById,
  cancelOrder,
  getAllOrdersAdmin,
  updateOrderStatusAdmin,
};

export default orderService;
