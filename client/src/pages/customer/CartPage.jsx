import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { EmptyState } from '../../components/ui/EmptyState.jsx';
import { ShoppingBag, Trash2, ArrowRight, ShieldCheck, Minus, Plus, Loader2 } from 'lucide-react';

export const CartPage = () => {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    cartSubtotal,
    deliveryFee,
    cartTotal,
    cartItemCount,
    loading,
    actionLoading,
  } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleUpdateQuantity = async (productId, currentQty, delta, stock) => {
    const newQty = currentQty + delta;
    if (newQty <= 0) {
      handleRemoveItem(productId);
      return;
    }
    if (stock && newQty > stock) {
      if (showToast) showToast(`Only ${stock} items are currently available.`, 'warning');
      return;
    }
    try {
      await updateQuantity(productId, newQty);
    } catch (err) {
      if (showToast) showToast(err.message || 'Failed to update quantity', 'error');
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      await removeFromCart(productId);
      if (showToast) showToast('Item removed from cart', 'info');
    } catch (err) {
      if (showToast) showToast(err.message || 'Failed to remove item', 'error');
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart();
      if (showToast) showToast('Cart cleared', 'info');
    } catch (err) {
      if (showToast) showToast(err.message || 'Failed to clear cart', 'error');
    }
  };

  if (loading && cartItems.length === 0) {
    return (
      <div className="bg-surface min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3 text-text-muted">
          <Loader2 className="w-6 h-6 animate-spin text-brand-primary" />
          <span className="font-semibold text-sm">Loading your cart...</span>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="bg-surface min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-surface-secondary border border-border rounded-2xl p-12 text-center max-w-lg mx-auto space-y-5 shadow-sm">
            <div className="w-20 h-20 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto text-brand-primary">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <div className="space-y-1">
              <h2 className="text-2xl font-black text-text-primary">Your cart is empty</h2>
              <p className="text-sm text-text-muted">Find something you'll love from our collection.</p>
            </div>
            <Link
              to="/products"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-brand-primary text-white font-bold text-sm rounded-xl hover:bg-brand-primary-hover shadow-lg shadow-brand-primary/20 transition-all"
            >
              <span>START SHOPPING</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="border-b border-border pb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-text-primary tracking-tight flex items-center gap-3">
              <ShoppingBag className="w-7 h-7 text-brand-primary" />
              <span>YOUR CART ({cartItemCount} items)</span>
            </h1>
            <p className="text-xs text-text-muted mt-1">Review your items and proceed to secure checkout.</p>
          </div>

          <button
            onClick={handleClearCart}
            disabled={actionLoading}
            className="text-xs font-bold text-text-muted hover:text-status-danger transition-colors px-3 py-1.5 rounded-lg border border-border hover:border-status-danger/40"
          >
            Clear Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Products List */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map(({ product, quantity, lineTotal, isAvailable }) => {
              const pid = product._id || product.id;
              const name = product.name || product.title;
              const imageUrl = product.images?.[0]?.url || product.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400';
              const price = product.price;
              const compareAtPrice = product.compareAtPrice;

              return (
                <div
                  key={pid}
                  className="bg-surface border border-border rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm hover:border-brand-primary/40 transition-all"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <img
                      src={imageUrl}
                      alt={name}
                      className="w-20 h-20 rounded-xl object-cover border border-border shrink-0 bg-surface-secondary"
                    />
                    <div className="space-y-1 min-w-0">
                      <span className="text-[10px] font-black uppercase text-brand-primary">{product.brand || 'ShopSphere'}</span>
                      <Link to={`/products/${product.slug || pid}`} className="block font-bold text-sm text-text-primary hover:text-brand-primary truncate">
                        {name}
                      </Link>
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm font-black text-text-primary">₹{price?.toLocaleString('en-IN')}</span>
                        {compareAtPrice && compareAtPrice > price && (
                          <span className="text-xs text-text-muted line-through">₹{compareAtPrice.toLocaleString('en-IN')}</span>
                        )}
                      </div>
                      {!isAvailable && (
                        <span className="text-[11px] font-bold text-status-danger">Item currently unavailable</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-border">
                    {/* Quantity Controls */}
                    <div className="flex items-center bg-surface-secondary border border-border rounded-xl">
                      <button
                        onClick={() => handleUpdateQuantity(pid, quantity, -1, product.stock)}
                        disabled={actionLoading}
                        className="px-3 py-1.5 text-text-muted hover:text-text-primary font-bold disabled:opacity-40"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-xs font-bold text-text-primary min-w-[24px] text-center">{quantity}</span>
                      <button
                        onClick={() => handleUpdateQuantity(pid, quantity, 1, product.stock)}
                        disabled={actionLoading || quantity >= product.stock}
                        className="px-3 py-1.5 text-text-muted hover:text-text-primary font-bold disabled:opacity-40"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right min-w-[90px]">
                      <div className="text-sm font-black text-text-primary">
                        ₹{(lineTotal || price * quantity).toLocaleString('en-IN')}
                      </div>
                    </div>

                    <button
                      onClick={() => handleRemoveItem(pid)}
                      disabled={actionLoading}
                      className="p-2 text-text-muted hover:text-status-danger rounded-xl transition-colors"
                      title="Remove product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary Box */}
          <div className="space-y-6">
            <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm space-y-5">
              <h3 className="text-lg font-black text-text-primary border-b border-border pb-3">
                Order Summary
              </h3>

              <div className="space-y-3 text-xs text-text-secondary">
                <div className="flex justify-between">
                  <span>Subtotal ({cartItemCount} items)</span>
                  <span className="font-bold text-text-primary">₹{cartSubtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping & Delivery</span>
                  <span className="font-bold text-text-primary">
                    {deliveryFee === 0 ? <span className="text-emerald-500 font-bold">FREE</span> : `₹${deliveryFee}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Taxes (18% GST)</span>
                  <span className="font-bold text-text-primary">Included</span>
                </div>

                <div className="border-t border-border pt-3 flex justify-between text-base font-black text-text-primary">
                  <span>Total Amount</span>
                  <span className="text-brand-primary">₹{cartTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <Button
                variant="primary"
                size="lg"
                className="w-full font-bold"
                onClick={() => navigate('/checkout')}
              >
                <span>PROCEED TO CHECKOUT</span>
                <ArrowRight className="w-4 h-4" />
              </Button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-text-muted pt-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>256-Bit Secure SSL Encrypted Checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
