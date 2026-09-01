import React from 'react';
import { Check, Clock, Package, Truck, Home, XCircle } from 'lucide-react';

const TRACKING_STEPS = [
  { status: 'PENDING', label: 'Ordered', icon: Clock },
  { status: 'CONFIRMED', label: 'Confirmed', icon: Check },
  { status: 'PACKED', label: 'Packed', icon: Package },
  { status: 'SHIPPED', label: 'Shipped', icon: Truck },
  { status: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', icon: Truck },
  { status: 'DELIVERED', label: 'Delivered', icon: Home },
];

export const OrderTimeline = ({ currentStatus, statusHistory = [] }) => {
  const isCancelled = currentStatus === 'CANCELLED';

  if (isCancelled) {
    return (
      <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 flex items-center gap-3 text-xs font-bold">
        <XCircle className="w-6 h-6 shrink-0" />
        <div>
          <h4 className="text-sm font-extrabold">ORDER CANCELLED</h4>
          <p className="text-[11px] font-normal text-red-500 mt-0.5">
            This order was cancelled. Any decremented inventory has been restored.
          </p>
        </div>
      </div>
    );
  }

  // Determine current step index
  const statusKeys = TRACKING_STEPS.map((s) => s.status);
  const currentIndex = statusKeys.indexOf(currentStatus);

  return (
    <div className="w-full py-4">
      {/* Desktop Horizontal Timeline */}
      <div className="hidden sm:flex items-center justify-between relative">
        <div className="absolute top-5 left-6 right-6 h-0.5 bg-border -z-0" />

        {TRACKING_STEPS.map((step, idx) => {
          const Icon = step.icon;
          const isPassed = idx <= currentIndex;
          const isCurrent = idx === currentIndex;

          // Find status history entry if available
          const historyEntry = statusHistory.find((h) => h.status === step.status);

          return (
            <div key={step.status} className="relative z-10 flex flex-col items-center group text-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                  isCurrent
                    ? 'bg-accent text-gray-950 shadow-md ring-4 ring-accent/30 font-black scale-110'
                    : isPassed
                    ? 'bg-emerald-500 text-white shadow-sm'
                    : 'bg-surface border border-border text-text-tertiary'
                }`}
              >
                {isPassed && !isCurrent ? (
                  <Check className="w-5 h-5 stroke-[3]" />
                ) : (
                  <Icon className="w-4 h-4" />
                )}
              </div>

              <span
                className={`text-[11px] font-extrabold mt-2.5 tracking-tight ${
                  isCurrent
                    ? 'text-text-primary'
                    : isPassed
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-text-tertiary'
                }`}
              >
                {step.label}
              </span>

              {historyEntry?.timestamp && (
                <span className="text-[10px] text-text-tertiary mt-0.5">
                  {new Date(historyEntry.timestamp).toLocaleDateString('en-IN', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile Vertical Timeline */}
      <div className="sm:hidden space-y-4 relative pl-6 border-l-2 border-border ml-2">
        {TRACKING_STEPS.map((step, idx) => {
          const Icon = step.icon;
          const isPassed = idx <= currentIndex;
          const isCurrent = idx === currentIndex;
          const historyEntry = statusHistory.find((h) => h.status === step.status);

          return (
            <div key={step.status} className="relative flex items-center gap-3">
              <div
                className={`absolute -left-[31px] w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  isCurrent
                    ? 'bg-accent text-gray-950 ring-2 ring-accent/40'
                    : isPassed
                    ? 'bg-emerald-500 text-white'
                    : 'bg-surface border border-border text-text-tertiary'
                }`}
              >
                <Icon className="w-3 h-3" />
              </div>

              <div>
                <span
                  className={`text-xs font-extrabold block ${
                    isCurrent ? 'text-text-primary' : isPassed ? 'text-emerald-600' : 'text-text-tertiary'
                  }`}
                >
                  {step.label}
                </span>
                {historyEntry?.timestamp && (
                  <span className="text-[10px] text-text-tertiary">
                    {new Date(historyEntry.timestamp).toLocaleDateString('en-IN', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderTimeline;
