import React from 'react';
import { Link } from 'react-router-dom';

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
  return (
    <div className="checkout-steps">
      <div className={`checkout-step ${step1 ? 'completed' : ''}`}>
        {step1 ? <Link to="/login">Sign In</Link> : <span>Sign In</span>}
      </div>

      <div className={`checkout-line ${step2 ? 'completed' : ''}`}></div>

      <div className={`checkout-step ${step2 ? 'active' : ''} ${step2 && step3 ? 'completed' : ''}`}>
        {step2 ? <Link to="/shipping">Shipping</Link> : <span>Shipping</span>}
      </div>

      <div className={`checkout-line ${step3 ? 'completed' : ''}`}></div>

      <div className={`checkout-step ${step3 ? 'active' : ''} ${step3 && step4 ? 'completed' : ''}`}>
        {step3 ? <Link to="/payment">Payment</Link> : <span>Payment</span>}
      </div>

      <div className={`checkout-line ${step4 ? 'completed' : ''}`}></div>

      <div className={`checkout-step ${step4 ? 'active' : ''}`}>
        {step4 ? <Link to="/placeorder">Place Order</Link> : <span>Place Order</span>}
      </div>
    </div>
  );
};

export default CheckoutSteps;
