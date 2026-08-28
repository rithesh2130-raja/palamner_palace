import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartService } from '../services/cartService';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartData, setCartData] = useState({
    items: [],
    summary: {
      itemCount: 0,
      subtotal: 0,
      discount: 0,
      shipping: 0,
      total: 0,
    },
  });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const fetchCart = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await cartService.getCart();
      if (res && res.success && res.data) {
        setCartData(res.data);
      }
    } catch (err) {
      console.error('Error fetching cart:', err);
      setError(err.message || 'Failed to load cart');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCartDrawer = () => setIsCartOpen(prev => !prev);

  const extractProductId = (productOrId) => {
    if (!productOrId) return '';
    if (typeof productOrId === 'string') return productOrId;
    return productOrId._id || productOrId.id || '';
  };

  const addToCart = async (productOrId, quantity = 1) => {
    const productId = extractProductId(productOrId);
    if (!productId) return null;

    setActionLoading(true);
    setError(null);
    try {
      const res = await cartService.addToCart(productId, quantity);
      if (res && res.success && res.data) {
        setCartData(res.data);
        return res.data;
      }
    } catch (err) {
      console.error('Error adding to cart:', err);
      setError(err.message);
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  const updateQuantity = async (productOrId, quantity) => {
    const productId = extractProductId(productOrId);
    if (!productId) return null;

    setActionLoading(true);
    setError(null);
    try {
      const res = await cartService.updateCartItem(productId, quantity);
      if (res && res.success && res.data) {
        setCartData(res.data);
        return res.data;
      }
    } catch (err) {
      console.error('Error updating cart quantity:', err);
      setError(err.message);
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  const removeFromCart = async (productOrId) => {
    const productId = extractProductId(productOrId);
    if (!productId) return null;

    setActionLoading(true);
    setError(null);
    try {
      const res = await cartService.removeCartItem(productId);
      if (res && res.success && res.data) {
        setCartData(res.data);
        return res.data;
      }
    } catch (err) {
      console.error('Error removing cart item:', err);
      setError(err.message);
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  const clearCart = async () => {
    setActionLoading(true);
    setError(null);
    try {
      const res = await cartService.clearCart();
      if (res && res.success && res.data) {
        setCartData(res.data);
        return res.data;
      }
    } catch (err) {
      console.error('Error clearing cart:', err);
      setError(err.message);
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  const cartItems = cartData.items || [];
  const cartSubtotal = cartData.summary?.subtotal || 0;
  const cartTotal = cartData.summary?.total || 0;
  const deliveryFee = cartData.summary?.shipping || 0;
  const cartItemCount = cartData.summary?.itemCount || 0;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartSummary: cartData.summary,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartSubtotal,
        cartTotal,
        cartItemCount,
        deliveryFee,
        loading,
        actionLoading,
        error,
        refetchCart: fetchCart,
        isCartOpen,
        openCart,
        closeCart,
        toggleCartDrawer,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;
