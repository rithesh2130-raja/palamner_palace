import React, { createContext, useContext, useState } from 'react';
import { MOCK_PRODUCTS } from '../constants/mockProducts.js';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([
    { product: MOCK_PRODUCTS[0], quantity: 1 },
    { product: MOCK_PRODUCTS[1], quantity: 2 }
  ]);

  const addToCart = (product, quantity = 1) => {
    setCartItems(prev => {
      const existingIndex = prev.findIndex(item => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }
      return [...prev, { product, quantity }];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartSubtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const cartItemCount = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const deliveryFee = cartSubtotal > 999 || cartSubtotal === 0 ? 0 : 79;
  const cartTotal = cartSubtotal + deliveryFee;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartSubtotal,
        cartTotal,
        cartItemCount,
        deliveryFee
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
