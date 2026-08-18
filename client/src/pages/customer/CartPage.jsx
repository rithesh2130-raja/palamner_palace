import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { EmptyState } from '../../components/ui/EmptyState.jsx';
import { ShoppingBag, Trash2, ArrowRight, ShieldCheck, Tag } from 'lucide-react';

export const CartPage = () => {
  const { cartItems, updateQuantity, removeFromCart, cartSubtotal, deliveryFee, cartTotal } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <EmptyState
          icon={ShoppingBag}
          title="Your Shopping Cart is Empty"
          description="You haven't added any products to your cart yet. Explore our catalog or watch shopping reels to discover items!"
          actionLabel="Start Shopping"
          actionTo="/products"
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="border-b border-slate-800 pb-6">
        <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
          <ShoppingBag className="w-8 h-8 text-amber-400" />
          <span>Shopping Cart ({cartItems.length} items)</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">Review your selected items and proceed to checkout.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Item List */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map(({ product, quantity }) => (
            <div
              key={product.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl"
            >
              <div className="flex items-center gap-4 min-w-0">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-20 h-20 rounded-xl object-cover border border-slate-800 shrink-0"
                />
                <div className="space-y-1 min-w-0">
                  <span className="text-[10px] font-bold uppercase text-amber-400">{product.brand}</span>
                  <Link to={`/products/${product.id}`} className="block font-bold text-sm text-white hover:text-amber-400 truncate">
                    {product.title}
                  </Link>
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-extrabold text-white">₹{product.price.toLocaleString('en-IN')}</span>
                    {product.originalPrice > product.price && (
                      <span className="text-xs text-slate-500 line-through">₹{product.originalPrice.toLocaleString('en-IN')}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Quantity Controls & Remove */}
              <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                <div className="flex items-center bg-slate-950 border border-slate-700 rounded-xl overflow-hidden">
                  <button
                    onClick={() => updateQuantity(product.id, quantity - 1)}
                    className="px-3 py-1 text-slate-300 hover:bg-slate-800 font-bold"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 text-xs font-bold text-white">{quantity}</span>
                  <button
                    onClick={() => updateQuantity(product.id, quantity + 1)}
                    className="px-3 py-1 text-slate-300 hover:bg-slate-800 font-bold"
                  >
                    +
                  </button>
                </div>

                <div className="text-right min-w-[80px]">
                  <div className="text-sm font-black text-white">
                    ₹{(product.price * quantity).toLocaleString('en-IN')}
                  </div>
                </div>

                <button
                  onClick={() => {
                    removeFromCart(product.id);
                    showToast(`Removed "${product.title}" from cart`, 'info');
                  }}
                  className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-xl transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5">
            <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3">
              Order Summary
            </h3>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-white">₹{cartSubtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Delivery Fee</span>
                <span className="font-bold text-white">
                  {deliveryFee === 0 ? <span className="text-emerald-400 font-bold">FREE</span> : `₹${deliveryFee}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Taxes (GST 18%)</span>
                <span className="font-bold text-white">Included</span>
              </div>

              <div className="border-t border-slate-800 pt-3 flex justify-between text-base font-black text-white">
                <span>Total Amount</span>
                <span className="text-amber-400">₹{cartTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={() => {
                showToast('Checkout engine will be implemented in Day 9!', 'info');
              }}
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </Button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 pt-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Safe & Secure 256-Bit SSL Encrypted Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
