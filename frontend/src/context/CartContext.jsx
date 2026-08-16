import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('cartItems');
    return saved ? JSON.parse(saved) : [];
  });

  const [shippingAddress, setShippingAddress] = useState(() => {
    const saved = localStorage.getItem('shippingAddress');
    return saved ? JSON.parse(saved) : {};
  });

  const [paymentMethod, setPaymentMethod] = useState(() => {
    const saved = localStorage.getItem('paymentMethod');
    return saved ? JSON.parse(saved) : 'PayPal';
  });

  // Derived prices
  const itemsPrice = Number(
    cartItems.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2)
  );
  const shippingPrice = Number((itemsPrice > 100 ? 0 : 10).toFixed(2));
  const taxPrice = Number((0.15 * itemsPrice).toFixed(2));
  const totalPrice = Number((itemsPrice + shippingPrice + taxPrice).toFixed(2));

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, qty) => {
    setCartItems((prevItems) => {
      const existItem = prevItems.find((x) => x._id === product._id);

      if (existItem) {
        return prevItems.map((x) =>
          x._id === product._id ? { ...x, qty } : x
        );
      } else {
        return [...prevItems, { ...product, qty }];
      }
    });
  };

  const removeFromCart = (id) => {
    setCartItems((prevItems) => prevItems.filter((x) => x._id !== id));
  };

  const saveShippingAddress = (address) => {
    setShippingAddress(address);
    localStorage.setItem('shippingAddress', JSON.stringify(address));
  };

  const savePaymentMethod = (method) => {
    setPaymentMethod(method);
    localStorage.setItem('paymentMethod', JSON.stringify(method));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cartItems');
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
        addToCart,
        removeFromCart,
        saveShippingAddress,
        savePaymentMethod,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
