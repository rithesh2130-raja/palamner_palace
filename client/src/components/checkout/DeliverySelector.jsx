import React from 'react';
import { Truck, Zap, CheckCircle2 } from 'lucide-react';

export const DeliverySelector = ({ deliveryMethod, onSelectDelivery, subtotal = 0 }) => {
  const isFreeStandard = subtotal > 999 || subtotal === 0;

  return (
    <div className="space-y-4">
      <div className="border-b border-border pb-3">
        <h3 className="text-base font-extrabold text-text-primary flex items-center gap-2">
          <Truck className="w-5 h-5 text-accent" />
          <span>2. Select Delivery Speed</span>
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Standard Delivery */}
        <div
          onClick={() => onSelectDelivery('standard')}
          className={`cursor-pointer rounded-2xl border p-4 transition-all relative flex flex-col justify-between ${
            deliveryMethod === 'standard'
              ? 'bg-surface border-accent shadow-md ring-2 ring-accent/40'
              : 'bg-surface border-border hover:border-text-tertiary'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  name="deliveryMethod"
                  checked={deliveryMethod === 'standard'}
                  onChange={() => onSelectDelivery('standard')}
                  className="w-4 h-4 text-accent accent-accent"
                />
                <span className="font-extrabold text-sm text-text-primary">Standard Delivery</span>
              </div>
              <span className="font-black text-xs text-emerald-600 dark:text-emerald-400">
                {isFreeStandard ? 'FREE' : '₹79'}
              </span>
            </div>
            <p className="text-xs text-text-secondary pl-6">
              Delivered directly to your address in <strong>4–6 business days</strong>.
            </p>
          </div>

          {deliveryMethod === 'standard' && (
            <div className="mt-3 pt-2 border-t border-border flex items-center gap-1.5 text-xs font-bold text-accent">
              <CheckCircle2 className="w-4 h-4" />
              <span>Standard delivery selected</span>
            </div>
          )}
        </div>

        {/* Express Delivery */}
        <div
          onClick={() => onSelectDelivery('express')}
          className={`cursor-pointer rounded-2xl border p-4 transition-all relative flex flex-col justify-between ${
            deliveryMethod === 'express'
              ? 'bg-surface border-accent shadow-md ring-2 ring-accent/40'
              : 'bg-surface border-border hover:border-text-tertiary'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  name="deliveryMethod"
                  checked={deliveryMethod === 'express'}
                  onChange={() => onSelectDelivery('express')}
                  className="w-4 h-4 text-accent accent-accent"
                />
                <span className="font-extrabold text-sm text-text-primary flex items-center gap-1">
                  <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span>Express Priority</span>
                </span>
              </div>
              <span className="font-black text-xs text-text-primary">₹99</span>
            </div>
            <p className="text-xs text-text-secondary pl-6">
              Accelerated dispatch. Guaranteed arrival in <strong>1–2 business days</strong>.
            </p>
          </div>

          {deliveryMethod === 'express' && (
            <div className="mt-3 pt-2 border-t border-border flex items-center gap-1.5 text-xs font-bold text-accent">
              <CheckCircle2 className="w-4 h-4" />
              <span>Express delivery selected</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeliverySelector;
