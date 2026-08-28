import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../middleware/authMiddleware.js";
import { wishlistService } from "../services/wishlist/wishlistService.js";

export async function getWishlist(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user._id;
    const data = await wishlistService.getWishlist(userId);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function addToWishlist(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user._id;
    const productId = req.params.productId as string;
    const data = await wishlistService.addToWishlist(userId, productId);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function removeFromWishlist(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user._id;
    const productId = req.params.productId as string;
    const data = await wishlistService.removeFromWishlist(userId, productId);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
}
