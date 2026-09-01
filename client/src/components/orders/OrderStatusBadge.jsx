import React from 'react';

const STATUS_CONFIGS = {
  PENDING: { label: 'Pending', className: 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400' },
  CONFIRMED: { label: 'Confirmed', className: 'bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400' },
  PACKED: { label: 'Packed', className: 'bg-indigo-500/10 border-indigo-500/30 text-indigo-600 dark:text-indigo-400' },
  SHIPPED: { label: 'Shipped', className: 'bg-purple-500/10 border-purple-500/30 text-purple-600 dark:text-purple-400' },
  OUT_FOR_DELIVERY: { label: 'Out for Delivery', className: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-600 dark:text-cyan-400' },
  DELIVERED: { label: 'Delivered', className: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400' },
  CANCELLED: { label: 'Cancelled', className: 'bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400' },
  RETURN_REQUESTED: { label: 'Return Requested', className: 'bg-amber-500/10 border-amber-500/30 text-amber-600' },
  RETURNED: { label: 'Returned', className: 'bg-gray-500/10 border-gray-500/30 text-gray-600' },
  REFUNDED: { label: 'Refunded', className: 'bg-teal-500/10 border-teal-500/30 text-teal-600' },
};

export const OrderStatusBadge = ({ status }) => {
  const normalized = (status || 'PENDING').toUpperCase();
  const config = STATUS_CONFIGS[normalized] || {
    label: status,
    className: 'bg-gray-500/10 border-gray-500/30 text-text-secondary',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full border text-[11px] font-extrabold uppercase tracking-wider ${config.className}`}
    >
      {config.label}
    </span>
  );
};

export default OrderStatusBadge;
