/**
 * PaymentProvider Base / Interface contract
 */
export class PaymentProvider {
  /**
   * Process/Initialize payment for an order input
   * @param {Object} input - { orderId, amount, currency, userId, metadata }
   * @returns {Promise<{ success: boolean, transactionId?: string, status: string, details?: any }>}
   */
  async createPayment(input) {
    throw new Error('createPayment method must be implemented by payment provider');
  }

  /**
   * Optional verification step for gateway callbacks / webhooks
   * @param {Object} input
   * @returns {Promise<{ success: boolean, status: string }>}
   */
  async verifyPayment(input) {
    throw new Error('verifyPayment method must be implemented by payment provider');
  }
}

export default PaymentProvider;
