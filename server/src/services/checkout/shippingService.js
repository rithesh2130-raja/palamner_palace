export function calculateShippingFee(deliveryMethod, subtotal) {
  const method = (deliveryMethod || 'standard').toLowerCase();

  if (method === 'express') {
    const estDate = new Date();
    estDate.setDate(estDate.getDate() + 2);
    return {
      method: 'express',
      fee: 99,
      estimatedDelivery: estDate,
      label: 'Express Delivery (1–2 days)',
    };
  }

  // Standard delivery
  const fee = subtotal > 999 || subtotal === 0 ? 0 : 79;
  const estDate = new Date();
  estDate.setDate(estDate.getDate() + 5);

  return {
    method: 'standard',
    fee,
    estimatedDelivery: estDate,
    label: fee === 0 ? 'Standard Delivery (FREE, 4–6 days)' : 'Standard Delivery (₹79, 4–6 days)',
  };
}

export const shippingService = {
  calculateShippingFee,
};

export default shippingService;
