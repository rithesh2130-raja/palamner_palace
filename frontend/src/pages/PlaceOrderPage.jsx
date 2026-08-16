import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import CheckoutSteps from '../components/CheckoutSteps';

const PlaceOrderPage = () => {
  const {
    cartItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    clearCart,
  } = useContext(CartContext);

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate('/shipping');
    } else if (!paymentMethod) {
      navigate('/payment');
    }
  }, [shippingAddress, paymentMethod, navigate]);

  const placeOrderHandler = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderItems: cartItems,
          shippingAddress,
          paymentMethod,
          itemsPrice,
          shippingPrice,
          taxPrice,
          totalPrice,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to place order');

      clearCart();
      navigate(`/order/${data._id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <CheckoutSteps step1 step2 step3 step4 />

      <h1 style={{ marginBottom: '2rem', fontWeight: '700' }}>Review Order</h1>

      <div className="order-layout">
        <div>
          {/* Shipping details */}
          <div className="order-details-card">
            <h2 className="order-section-title">Shipping</h2>
            <p>
              <strong>Address: </strong>
              {shippingAddress.address}, {shippingAddress.city},{' '}
              {shippingAddress.postalCode}, {shippingAddress.country}
            </p>
          </div>

          {/* Payment Method details */}
          <div className="order-details-card">
            <h2 className="order-section-title">Payment Method</h2>
            <p>
              <strong>Method: </strong>
              {paymentMethod}
            </p>
          </div>

          {/* Cart items details */}
          <div className="order-details-card">
            <h2 className="order-section-title">Order Items</h2>
            {cartItems.length === 0 ? (
              <div className="alert alert-info">Your cart is empty</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {cartItems.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      justifyContent: 'space-between',
                      borderBottom: idx === cartItems.length - 1 ? 'none' : '1px solid var(--border-color)',
                      paddingBottom: '0.8rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{ width: '50px', height: '50px', objectFit: 'contain', borderRadius: '4px', backgroundColor: '#f7fafc' }}
                      />
                      <Link to={`/product/${item._id}`} style={{ fontWeight: '500', fontSize: '0.95rem' }}>
                        {item.name}
                      </Link>
                    </div>
                    <div style={{ fontWeight: '600', minWidth: '100px', textAlign: 'right' }}>
                      {item.qty} x ${item.price.toFixed(2)} = ${(item.qty * item.price).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Order Summary sidebar */}
        <div>
          <div className="cart-summary-box">
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
              Order Summary
            </h2>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Items:</span>
              <span>${itemsPrice.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Shipping:</span>
              <span>${shippingPrice.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Tax (15%):</span>
              <span>${taxPrice.toFixed(2)}</span>
            </div>
            <div style={{ height: '1px', backgroundColor: 'var(--border-color)' }}></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '700', fontSize: '1.2rem' }}>
              <span>Total:</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            <button
              onClick={placeOrderHandler}
              className="btn btn-primary btn-block"
              disabled={cartItems.length === 0 || loading}
            >
              {loading ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrderPage;
