import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { EmptyState } from '../../components/ui/EmptyState.jsx';
import { ShoppingBag, Trash2, ArrowRight, ShieldCheck } from 'lucide-react';

export const CartPage = () => {
  const { cartItems, updateQuantity, removeFromCart, cartSubtotal, deliveryFee, cartTotal } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="bg-white min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <EmptyState
            icon={ShoppingBag}
            title="Your Shopping Cart is Empty"
            description="You haven't added any products to your cart yet. Explore our catalog or watch shopping reels to discover items!"
            actionLabel="Start Shopping"
            actionTo="/products"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="border-b border-neutral-200 pb-6">
          <h1 className="text-3xl font-black text-black tracking-tight flex items-center gap-3">
            <ShoppingBag className="w-8 h-8 text-[#E50914]" />
            <span>Shopping Cart ({cartItems.length} items)</span>
          </h1>
          <p className="text-xs text-neutral-500 mt-1">Review your selected items and proceed to checkout.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Item List */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map(({ product, quantity }) => (
              <div
                key={product.id}
                className="bg-white border border-neutral-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm hover:border-[#E50914] transition-all"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-20 h-20 rounded-xl object-cover border border-neutral-200 shrink-0"
                  />
                  <div className="space-y-1 min-w-0">
                    <span className="text-[10px] font-black uppercase text-[#E50914]">{product.brand}</span>
                    <Link to={`/products/${product.id}`} className="block font-bold text-sm text-black hover:text-[#E50914] truncate">
                      {product.title}
                    </Link>
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm font-black text-black">₹{product.price.toLocaleString('en-IN')}</span>
                      {product.originalPrice > product.price && (
                        <span className="text-xs text-neutral-400 line-through">₹{product.originalPrice.toLocaleString('en-IN')}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-200">
                  <div className="flex items-center bg-neutral-100 border border-neutral-300 rounded-xl overflow-hidden">
                    <button
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      className="px-3 py-1 text-black hover:bg-neutral-200 font-bold"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 text-xs font-bold text-black">{quantity}</span>
                    <button
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      className="px-3 py-1 text-black hover:bg-neutral-200 font-bold"
                    >
                      +
                    </button>
                  </div>

                  <div className="text-right min-w-[80px]">
                    <div className="text-sm font-black text-black">
                      ₹{(product.price * quantity).toLocaleString('en-IN')}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      removeFromCart(product.id);
                      showToast(`Removed "${product.title}" from cart`, 'info');
                    }}
                    className="p-2 text-neutral-400 hover:text-red-600 rounded-xl transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-6 shadow-sm space-y-5">
              <h3 className="text-lg font-black text-black border-b border-neutral-200 pb-3">
                Order Summary
              </h3>

              <div className="space-y-3 text-xs text-neutral-700">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-black">₹{cartSubtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span className="font-bold text-black">
                    {deliveryFee === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : `₹${deliveryFee}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>GST (18%)</span>
                  <span className="font-bold text-black">Included</span>
                </div>

                <div className="border-t border-neutral-200 pt-3 flex justify-between text-base font-black text-black">
                  <span>Total Amount</span>
                  <span className="text-[#E50914]">₹{cartTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <Button
                variant="primary"
                size="lg"
                className="w-full"
                onClick={() => showToast('Checkout engine planned for Day 9!', 'info')}
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-neutral-500 pt-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>256-Bit SSL Encrypted Secure Checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
