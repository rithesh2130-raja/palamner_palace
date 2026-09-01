import React from 'react';
import { CreditCard, Banknote, ShieldCheck, CheckCircle2, Lock } from 'lucide-react';

export const PaymentSelector = ({ paymentMethod, onSelectPayment }) => {
  return (
    <div className="space-y-4">
      <div className="border-b border-border pb-3">
        <h3 className="text-base font-extrabold text-text-primary flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-accent" />
          <span>3. Select Payment Method</span>
        </h3>
      </div>

      <div className="space-y-3">
        {/* Cash on Delivery */}
        <div
          onClick={() => onSelectPayment('COD')}
          className={`cursor-pointer rounded-2xl border p-4 transition-all relative flex flex-col justify-between ${
            paymentMethod === 'COD'
              ? 'bg-surface border-accent shadow-md ring-2 ring-accent/40'
              : 'bg-surface border-border hover:border-text-tertiary'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <input
                type="radio"
                name="paymentMethod"
                checked={paymentMethod === 'COD'}
                onChange={() => onSelectPayment('COD')}
                className="w-4 h-4 text-accent accent-accent mt-1"
              />
              <div>
                <div className="flex items-center gap-2">
                  <Banknote className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="font-extrabold text-sm text-text-primary">Cash on Delivery (COD)</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[10px] uppercase">
                    AVAILABLE
                  </span>
                </div>
                <p className="text-xs text-text-secondary mt-1">
                  Pay cash or UPI directly to the courier agent upon doorstep package delivery. No upfront payment required.
                </p>
              </div>
            </div>
          </div>

          {paymentMethod === 'COD' && (
            <div className="mt-3 pt-2 border-t border-border flex items-center gap-1.5 text-xs font-bold text-accent">
              <CheckCircle2 className="w-4 h-4" />
              <span>Cash on Delivery active for order</span>
            </div>
          )}
        </div>

        {/* Online Payment (Razorpay/UPI - Prepared abstraction) */}
        <div className="rounded-2xl border border-border bg-surface-secondary/40 p-4 opacity-75 relative">
          <div className="flex items-start gap-3">
            <input
              type="radio"
              disabled
              name="paymentMethod"
              checked={false}
              className="w-4 h-4 text-text-tertiary cursor-not-allowed mt-1"
            />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-text-tertiary" />
                  <span className="font-extrabold text-sm text-text-secondary">UPI / Credit & Debit Cards / Net Banking</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-surface-secondary text-text-tertiary border border-border font-bold text-[10px] uppercase">
                  GATEWAY INTEGRATION IN PROGRESS
                </span>
              </div>
              <p className="text-xs text-text-tertiary mt-1">
                Instant secure checkout via Razorpay & UPI gateways will be enabled following payment infrastructure verification.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-3.5 rounded-xl bg-accent/5 border border-accent/20 flex items-center gap-2 text-xs text-text-secondary">
        <ShieldCheck className="w-4 h-4 text-accent shrink-0" />
        <span>ShopSphere Buyer Protection ensures 100% secure order processing and hassle-free returns.</span>
      </div>
    </div>
  );
};

export default PaymentSelector;
