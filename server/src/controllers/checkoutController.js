import { checkoutService } from '../services/checkout/checkoutService.js';

export async function getCheckoutPreview(req, res, next) {
  try {
    const userId = req.user._id;
    const { addressId, deliveryMethod } = req.body;
    const preview = await checkoutService.createCheckoutPreview(userId, {
      addressId,
      deliveryMethod,
    });
    res.status(200).json({ success: true, data: preview });
  } catch (error) {
    next(error);
  }
}
