import React from 'react';
import { ShoppingBag, ShieldCheck, Tag } from 'lucide-react';

export const CheckoutSummary = ({ preview, loading, onPlaceOrder, isPlacingOrder }) => {
  if (loading && !preview) {
    return (
      <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm animate-pulse space-y-4">
        <div className="h-6 bg-surface-secondary rounded w-1/2" />
        <div className="h-20 bg-surface-secondary rounded" />
        <div className="h-32 bg-surface-secondary rounded" />
      </div>
    );
  }

  const items = preview?.items || [];
  const pricing = preview?.pricing || { subtotal: 0, shipping: 0, discount: 0, tax: 0, total: 0 };
  const delivery = preview?.delivery;

  return (
    <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm sticky top-24 space-y-6">
      <div className="border-b border-border pb-4 flex items-center justify-between">
        <h3 className="font-extrabold text-base text-text-primary flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-accent" />
          <span>Order Summary</span>
        </h3>
        <span className="px-2.5 py-0.5 rounded-full bg-accent/10 text-accent text-xs font-extrabold">
          {pricing.itemCount || items.reduce((acc, i) => acc + i.quantity, 0)} Items
        </span>
      </div>

      {/* Purchased Items List */}
      <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
        {items.map((item, idx) => (
          <div key={item.productId || idx} className="flex items-center gap-3">
            <img
              src={item.image || 'https://via.placeholder.com/80'}
              alt={item.name}
              className="w-12 h-12 rounded-xl object-cover border border-border shrink-0 bg-surface-secondary"
            />
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-text-primary truncate">{item.name}</h4>
              <p className="text-[11px] text-text-secondary mt-0.5">
                Qty: {item.quantity} × ₹{item.unitPrice.toLocaleString('en-IN')}
              </p>
            </div>
            <span className="font-extrabold text-xs text-text-primary shrink-0">
              ₹{item.lineTotal.toLocaleString('en-IN')}
            </span>
          </div>
        ))}
      </div>

      {/* Pricing Breakdown */}
      <div className="space-y-2.5 pt-4 border-t border-border text-xs">
        <div className="flex items-center justify-between text-text-secondary">
          <span>Subtotal</span>
          <span className="font-bold text-text-primary">₹{pricing.subtotal.toLocaleString('en-IN')}</span>
        </div>

        <div className="flex items-center justify-between text-text-secondary">
          <span>Delivery Fee</span>
          <span className="font-bold text-text-primary">
            {pricing.shipping === 0 ? (
              <span className="text-emerald-600 dark:text-emerald-400">FREE</span>
            ) : (
              `₹${pricing.shipping.toLocaleString('en-IN')}`
            )}
          </span>
        </div>

        {pricing.discount > 0 && (
          <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400">
            <span className="flex items-center gap-1">
              <Tag className="w-3.5 h-3.5" /> Discount
            </span>
            <span className="font-bold">-₹{pricing.discount.toLocaleString('en-IN')}</span>
          </div>
        )}

        {pricing.tax > 0 && (
          <div className="flex items-center justify-between text-text-secondary">
            <span>Estimated Tax</span>
            <span className="font-bold text-text-primary">₹{pricing.tax.toLocaleString('en-IN')}</span>
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-border text-sm font-black text-text-primary">
          <span>Order Total</span>
          <span className="text-base text-accent">₹{pricing.total.toLocaleString('en-IN')}</span>
        </div>

        {delivery?.estimatedDelivery && (
          <div className="pt-2 text-[11px] text-text-tertiary text-center">
            Estimated Delivery by{' '}
            <strong className="text-text-secondary">
              {new Date(delivery.estimatedDelivery).toLocaleDateString('en-IN', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
              })}
            </strong>
          </div>
        )}
      </div>

      {/* Place Order CTA */}
      <div className="space-y-3 pt-2">
        <button
          type="button"
          disabled={isPlacingOrder || loading || items.length === 0}
          onClick={onPlaceOrder}
          className="w-full py-3.5 bg-accent text-gray-950 font-extrabold rounded-xl shadow-lg hover:opacity-90 transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPlacingOrder ? (
            <>
              <div className="w-4 h-4 border-2 border-gray-950 border-t-transparent rounded-full animate-spin" />
              <span>PROCESSING ORDER...</span>
            </>
          ) : (
            <>
              <ShieldCheck className="w-5 h-5" />
              <span>PLACE ORDER NOW • ₹{pricing.total.toLocaleString('en-IN')}</span>
            </>
          )}
        </button>

        <p className="text-[10px] text-text-tertiary text-center leading-normal">
          By clicking Place Order, you confirm acceptance of ShopSphere's Terms & Conditions and return policy.
        </p>
      </div>
    </div>
  );
};

export default CheckoutSummary;
