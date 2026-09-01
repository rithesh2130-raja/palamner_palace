import { PaymentProvider } from '../PaymentProvider.js';

export class CODProvider extends PaymentProvider {
  async createPayment(input) {
    const transactionId = `COD-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    return {
      success: true,
      transactionId,
      status: 'PENDING',
      details: {
        method: 'COD',
        instructions: 'Payment will be collected in cash upon delivery.',
      },
    };
  }

  async verifyPayment(input) {
    return {
      success: true,
      status: 'PENDING',
    };
  }
}

export default CODProvider;
