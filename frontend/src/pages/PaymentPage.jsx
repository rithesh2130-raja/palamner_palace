import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import CheckoutSteps from '../components/CheckoutSteps';

const PaymentPage = () => {
  const { shippingAddress, paymentMethod, savePaymentMethod } = useContext(CartContext);
  const navigate = useNavigate();

  const [paymentMethodName, setPaymentMethodName] = useState(paymentMethod || 'PayPal');

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate('/shipping');
    }
  }, [shippingAddress, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    savePaymentMethod(paymentMethodName);
    navigate('/placeorder');
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <CheckoutSteps step1 step2 step3 />
      <div className="form-container" style={{ margin: '0 auto' }}>
        <h1 className="form-title">Payment Method</h1>
        <form onSubmit={submitHandler}>
          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label className="form-label" style={{ marginBottom: '1rem' }}>Select Method</label>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.8rem' }}>
              <input
                type="radio"
                id="PayPal"
                name="paymentMethod"
                value="PayPal"
                checked={paymentMethodName === 'PayPal'}
                onChange={(e) => setPaymentMethodName(e.target.value)}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
              <label htmlFor="PayPal" style={{ cursor: 'pointer', fontWeight: '500' }}>PayPal or Credit Card</label>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.8rem' }}>
              <input
                type="radio"
                id="Stripe"
                name="paymentMethod"
                value="Stripe"
                checked={paymentMethodName === 'Stripe'}
                onChange={(e) => setPaymentMethodName(e.target.value)}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
              <label htmlFor="Stripe" style={{ cursor: 'pointer', fontWeight: '500' }}>Stripe Gateway</label>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <input
                type="radio"
                id="COD"
                name="paymentMethod"
                value="Cash on Delivery"
                checked={paymentMethodName === 'Cash on Delivery'}
                onChange={(e) => setPaymentMethodName(e.target.value)}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
              <label htmlFor="COD" style={{ cursor: 'pointer', fontWeight: '500' }}>Cash on Delivery</label>
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-block">
            Continue to Place Order
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentPage;
