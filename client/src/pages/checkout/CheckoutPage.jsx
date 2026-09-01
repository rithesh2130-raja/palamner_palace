import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowLeft, AlertCircle } from 'lucide-react';
import { useCart } from '../../context/CartContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { checkoutService } from '../../services/checkoutService.js';
import { orderService } from '../../services/orderService.js';

import CheckoutStepper from '../../components/checkout/CheckoutStepper.jsx';
import AddressSelector from '../../components/checkout/AddressSelector.jsx';
import DeliverySelector from '../../components/checkout/DeliverySelector.jsx';
import PaymentSelector from '../../components/checkout/PaymentSelector.jsx';
import CheckoutSummary from '../../components/checkout/CheckoutSummary.jsx';

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, loading: cartLoading, refetchCart } = useCart();
  const { addToast } = useToast();

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('COD');

  const [preview, setPreview] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [error, setError] = useState('');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  // Idempotency Key generated once per checkout session
  const idempotencyKeyRef = useRef(
    `checkout-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
  );

  // Fetch server checkout preview
  const fetchPreview = useCallback(async () => {
    setPreviewLoading(true);
    setError('');
    try {
      const res = await checkoutService.getPreview({
        addressId: selectedAddressId || undefined,
        deliveryMethod,
      });
      if (res && res.success && res.data) {
        setPreview(res.data);
        if (res.data.address?.id && !selectedAddressId) {
          setSelectedAddressId(res.data.address.id);
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to calculate checkout preview.');
      if (err.code === 'EMPTY_CART') {
        navigate('/cart');
      }
    } finally {
      setPreviewLoading(false);
    }
  }, [selectedAddressId, deliveryMethod, navigate]);

  useEffect(() => {
    if (!cartLoading && cartItems.length === 0) {
      addToast('Your cart is empty. Please add products before checking out.', 'info');
      navigate('/cart');
      return;
    }
    fetchPreview();
  }, [cartLoading, cartItems.length, fetchPreview, navigate, addToast]);

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      setError('Please select or add a shipping address before placing your order.');
      setCurrentStep(1);
      return;
    }

    setIsPlacingOrder(true);
    setError('');

    try {
      const res = await orderService.placeOrder({
        addressId: selectedAddressId,
        deliveryMethod,
        paymentMethod,
        idempotencyKey: idempotencyKeyRef.current,
      });

      if (res && res.success && res.data) {
        await refetchCart();
        addToast('Order placed successfully!', 'success');
        const orderId = res.data.orderNumber || res.data._id || res.data.id;
        navigate(`/order-confirmation/${orderId}`, { state: { order: res.data } });
      }
    } catch (err) {
      console.error('Error placing order:', err);
      setError(err.message || 'Failed to place order. Please try again.');
      addToast(err.message || 'Failed to place order.', 'error');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <div className="bg-background min-h-screen pb-16">
      {/* Top Header */}
      <div className="bg-surface border-b border-border py-4">
        <div className="max-w-[1280px] mx-auto px-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/cart')}
            className="text-xs font-bold text-text-secondary hover:text-text-primary flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Shopping Cart</span>
          </button>
          <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            <span>256-BIT SSL SECURE CHECKOUT</span>
          </div>
        </div>
      </div>

      {/* Stepper Progress */}
      <CheckoutStepper currentStep={currentStep} onStepClick={(step) => setCurrentStep(step)} />

      {/* Main Checkout Container */}
      <div className="max-w-[1280px] mx-auto px-4">
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-semibold flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column - Checkout Workflow Steps */}
          <div className="lg:col-span-7 space-y-8">
            {/* Step 1: Address */}
            <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
              <AddressSelector
                selectedAddressId={selectedAddressId}
                onSelectAddress={(id) => {
                  setSelectedAddressId(id);
                  if (currentStep < 2) setCurrentStep(2);
                }}
              />
            </div>

            {/* Step 2: Delivery */}
            <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
              <DeliverySelector
                deliveryMethod={deliveryMethod}
                onSelectDelivery={(method) => {
                  setDeliveryMethod(method);
                  if (currentStep < 3) setCurrentStep(3);
                }}
                subtotal={preview?.pricing?.subtotal || 0}
              />
            </div>

            {/* Step 3: Payment */}
            <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
              <PaymentSelector
                paymentMethod={paymentMethod}
                onSelectPayment={(method) => {
                  setPaymentMethod(method);
                  if (currentStep < 4) setCurrentStep(4);
                }}
              />
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-5">
            <CheckoutSummary
              preview={preview}
              loading={previewLoading}
              onPlaceOrder={handlePlaceOrder}
              isPlacingOrder={isPlacingOrder}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
