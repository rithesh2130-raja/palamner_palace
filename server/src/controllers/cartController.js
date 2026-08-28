import { cartService } from '../services/cart/cartService.js';

export async function getCart(req, res, next) {
  try {
    const userId = req.user._id;
    const data = await cartService.getCart(userId);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function addItem(req, res, next) {
  try {
    const userId = req.user._id;
    const { productId, quantity = 1 } = req.body;
    const data = await cartService.addItem(userId, productId, quantity);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function updateItem(req, res, next) {
  try {
    const userId = req.user._id;
    const { productId } = req.params;
    const { quantity } = req.body;
    const data = await cartService.updateItem(userId, productId, quantity);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function removeItem(req, res, next) {
  try {
    const userId = req.user._id;
    const { productId } = req.params;
    const data = await cartService.removeItem(userId, productId);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function clearCart(req, res, next) {
  try {
    const userId = req.user._id;
    const data = await cartService.clearCart(userId);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
}
