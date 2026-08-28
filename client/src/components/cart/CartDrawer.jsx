import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, ShoppingBag, Trash2, ArrowRight, Minus, Plus } from 'lucide-react';
import { useCart } from '../../context/CartContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import Drawer from '../ui/Drawer.jsx';

export const CartDrawer = () => {
  const { isCartOpen, closeCart, cartItems, cartSubtotal, cartTotal, deliveryFee, updateQuantity, removeFromCart, actionLoading } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleUpdateQuantity = async (productId, currentQty, delta, stock) => {
    const newQty = currentQty + delta;
    if (newQty <= 0) {
      handleRemove(productId);
      return;
    }
    if (stock && newQty > stock) {
      if (showToast) showToast(`Only ${stock} units are currently available.`, 'warning');
      return;
    }
    try {
      await updateQuantity(productId, newQty);
    } catch (err) {
      if (showToast) showToast(err.message || 'Failed to update quantity', 'error');
    }
  };

  const handleRemove = async (productId) => {
    try {
      await removeFromCart(productId);
      if (showToast) showToast('Item removed from cart', 'info');
    } catch (err) {
      if (showToast) showToast(err.message || 'Failed to remove item', 'error');
    }
  };

  return (
    <Drawer
      isOpen={isCartOpen}
      onClose={closeCart}
      title={`Your Cart (${cartItems.reduce((acc, item) => acc + item.quantity, 0)})`}
      position="right"
    >
      <div className="flex flex-col h-full justify-between">
        {/* Cart Item List */}
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 py-12 px-4 text-center">
            <div className="w-16 h-16 rounded-full bg-surface-secondary flex items-center justify-center mb-4">
              <ShoppingBag className="w-8 h-8 text-text-muted" />
            </div>
            <h3 className="text-base font-bold text-text-primary mb-1">Your cart is empty</h3>
            <p className="text-xs text-text-muted mb-6">Find something you'll love from our collection.</p>
            <button
              onClick={() => {
                closeCart();
                navigate('/products');
              }}
              className="px-5 py-2.5 bg-brand-primary text-white text-xs font-bold rounded-xl hover:bg-brand-primary-hover transition-colors shadow-md"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto py-3 space-y-4 px-1 scrollbar-thin">
            {cartItems.map(({ product, quantity, lineTotal, isAvailable }) => {
              const pid = product._id || product.id;
              const imageUrl = product.images?.[0]?.url || product.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200';
              const name = product.name || product.title;
              const price = product.price;

              return (
                <div
                  key={pid}
                  className="flex gap-3 p-3 bg-surface border border-border rounded-xl hover:border-brand-primary/40 transition-colors relative"
                >
                  <img
                    src={imageUrl}
                    alt={name}
                    className="w-16 h-16 rounded-lg object-cover border border-border shrink-0 bg-surface-secondary"
                  />
                  <div className="flex-1 min-w-0 space-y-1">
                    <span className="text-[10px] font-black uppercase text-brand-primary">{product.brand || 'ShopSphere'}</span>
                    <h4 className="text-xs font-bold text-text-primary truncate">{name}</h4>
                    <div className="text-xs font-black text-text-primary">₹{price?.toLocaleString('en-IN')}</div>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center border border-border rounded-lg bg-surface-secondary">
                        <button
                          onClick={() => handleUpdateQuantity(pid, quantity, -1, product.stock)}
                          disabled={actionLoading}
                          className="px-2 py-0.5 text-xs text-text-muted hover:text-text-primary disabled:opacity-40"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold text-text-primary">{quantity}</span>
                        <button
                          onClick={() => handleUpdateQuantity(pid, quantity, 1, product.stock)}
                          disabled={actionLoading || quantity >= product.stock}
                          className="px-2 py-0.5 text-xs text-text-muted hover:text-text-primary disabled:opacity-40"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => handleRemove(pid)}
                        disabled={actionLoading}
                        className="p-1.5 text-text-muted hover:text-status-danger transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer Summary & Checkout */}
        {cartItems.length > 0 && (
          <div className="border-t border-border pt-4 mt-auto space-y-3">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-text-muted">
                <span>Subtotal</span>
                <span className="font-bold text-text-primary">₹{cartSubtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-text-muted">
                <span>Shipping</span>
                <span className="font-bold text-text-primary">
                  {deliveryFee === 0 ? <span className="text-emerald-500">FREE</span> : `₹${deliveryFee}`}
                </span>
              </div>
              <div className="flex justify-between text-sm font-black text-text-primary pt-1 border-t border-border">
                <span>Total Amount</span>
                <span className="text-brand-primary">₹{cartTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => {
                  closeCart();
                  navigate('/cart');
                }}
                className="w-full py-2.5 px-3 rounded-xl border border-border text-text-primary font-bold text-xs hover:bg-surface-secondary transition-colors"
              >
                View Cart
              </button>
              <button
                onClick={() => {
                  closeCart();
                  navigate('/checkout');
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-brand-primary text-white font-bold text-xs hover:bg-brand-primary-hover transition-colors shadow-md flex items-center justify-center gap-1"
              >
                <span>Checkout</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </Drawer>
  );
};

export default CartDrawer;
