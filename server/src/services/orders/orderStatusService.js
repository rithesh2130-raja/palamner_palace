import { AppError } from '../../middleware/errorHandler.js';

export const ORDER_STATUSES = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  PACKED: 'PACKED',
  SHIPPED: 'SHIPPED',
  OUT_FOR_DELIVERY: 'OUT_FOR_DELIVERY',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
  RETURN_REQUESTED: 'RETURN_REQUESTED',
  RETURNED: 'RETURNED',
  REFUNDED: 'REFUNDED',
};

const ALLOWED_TRANSITIONS = {
  PENDING: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['PACKED', 'CANCELLED'],
  PACKED: ['SHIPPED', 'CANCELLED'],
  SHIPPED: ['OUT_FOR_DELIVERY'],
  OUT_FOR_DELIVERY: ['DELIVERED'],
  DELIVERED: ['RETURN_REQUESTED'],
  RETURN_REQUESTED: ['RETURNED', 'REFUNDED'],
  CANCELLED: [],
  RETURNED: [],
  REFUNDED: [],
};

const CANCELLABLE_STATUSES = ['PENDING', 'CONFIRMED', 'PACKED'];

export function validateStatusTransition(currentStatus, targetStatus) {
  if (currentStatus === targetStatus) {
    return true;
  }

  const allowed = ALLOWED_TRANSITIONS[currentStatus] || [];
  if (!allowed.includes(targetStatus)) {
    throw new AppError(
      `Invalid order status transition from '${currentStatus}' to '${targetStatus}'.`,
      400,
      'INVALID_STATUS_TRANSITION'
    );
  }
  return true;
}

export function isCancellable(status) {
  return CANCELLABLE_STATUSES.includes(status);
}

export const orderStatusService = {
  ORDER_STATUSES,
  validateStatusTransition,
  isCancellable,
};

export default orderStatusService;
