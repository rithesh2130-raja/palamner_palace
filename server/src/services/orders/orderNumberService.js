import crypto from 'crypto';

export function generateOrderNumber() {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomChars = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `SS-${dateStr}-${randomChars}`;
}

export const orderNumberService = {
  generateOrderNumber,
};

export default orderNumberService;
