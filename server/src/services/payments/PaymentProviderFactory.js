import { CODProvider } from './providers/CODProvider.js';
import { AppError } from '../../middleware/errorHandler.js';

export class PaymentProviderFactory {
  static getProvider(method) {
    const formattedMethod = (method || 'COD').toUpperCase();
    switch (formattedMethod) {
      case 'COD':
        return new CODProvider();
      case 'ONLINE':
      case 'UPI':
      case 'CARD':
        // For Day 8, online options use COD or throw unsupported until real gateway is enabled
        throw new AppError(
          `Payment method '${method}' is coming soon. Please select Cash on Delivery (COD).`,
          400,
          'PAYMENT_METHOD_UNSUPPORTED'
        );
      default:
        throw new AppError(`Unsupported payment method: ${method}`, 400, 'INVALID_PAYMENT_METHOD');
    }
  }
}

export default PaymentProviderFactory;
