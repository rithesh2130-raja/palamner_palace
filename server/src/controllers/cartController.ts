import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../middleware/authMiddleware.js";
import { cartService } from "../services/cart/cartService.js";

export async function getCart(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user._id;
    const data = await cartService.getCart(userId);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function addItem(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user._id;
    const { productId, quantity = 1 } = req.body;
    const data = await cartService.addItem(userId, productId, quantity);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function updateItem(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user._id;
    const productId = req.params.productId as string;
    const { quantity } = req.body;
    const data = await cartService.updateItem(userId, productId, quantity);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function removeItem(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user._id;
    const productId = req.params.productId as string;
    const data = await cartService.removeItem(userId, productId);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function clearCart(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user._id;
    const data = await cartService.clearCart(userId);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
}
