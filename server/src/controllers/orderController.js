import { orderService } from '../services/orders/orderService.js';

export async function placeOrder(req, res, next) {
  try {
    const userId = req.user._id;
    const { addressId, deliveryMethod, paymentMethod, idempotencyKey: bodyKey } = req.body;
    const idempotencyKey = req.headers['idempotency-key'] || bodyKey;

    const order = await orderService.createOrder(userId, {
      addressId,
      deliveryMethod,
      paymentMethod,
      idempotencyKey,
    });

    res.status(201).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
}

export async function getOrders(req, res, next) {
  try {
    const userId = req.user._id;
    const { page, limit, status } = req.query;
    const result = await orderService.getUserOrders(userId, { page, limit, status });
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

export async function getOrder(req, res, next) {
  try {
    const userId = req.user._id;
    const isAdmin = req.user.role === 'admin';
    const { orderId } = req.params;

    const order = await orderService.getOrderById(orderId, userId, isAdmin);
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
}

export async function cancelOrder(req, res, next) {
  try {
    const userId = req.user._id;
    const isAdmin = req.user.role === 'admin';
    const { orderId } = req.params;
    const { note } = req.body;

    const order = await orderService.cancelOrder(orderId, userId, isAdmin, note);
    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      data: order,
    });
  } catch (error) {
    next(error);
  }
}

// Admin controllers
export async function getAdminOrders(req, res, next) {
  try {
    const { page, limit, status, search } = req.query;
    const result = await orderService.getAllOrdersAdmin({ page, limit, status, search });
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

export async function updateOrderStatusAdmin(req, res, next) {
  try {
    const { orderId } = req.params;
    const { status, note } = req.body;

    const order = await orderService.updateOrderStatusAdmin(orderId, status, note);
    res.status(200).json({
      success: true,
      message: `Order status updated to ${status}`,
      data: order,
    });
  } catch (error) {
    next(error);
  }
}
