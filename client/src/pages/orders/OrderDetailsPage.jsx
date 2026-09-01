import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Package, MapPin, CreditCard, ArrowLeft, XCircle, AlertCircle, CheckCircle2 } from 'lucide-react';
import { orderService } from '../../services/orderService.js';
import { useToast } from '../../context/ToastContext.jsx';
import OrderStatusBadge from '../../components/orders/OrderStatusBadge.jsx';
import OrderTimeline from '../../components/orders/OrderTimeline.jsx';

export const OrderDetailsPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Cancel Modal state
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelNote, setCancelNote] = useState('');
  const [cancelLoading, setCancelLoading] = useState(false);

  const fetchOrder = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await orderService.getOrder(orderId);
      if (res && res.success && res.data) {
        setOrder(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load order details.');
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  const handleCancelOrder = async () => {
    setCancelLoading(true);
    try {
      const res = await orderService.cancelOrder(orderId, cancelNote);
      if (res && res.success) {
        addToast('Order cancelled successfully. Inventory restored.', 'success');
        setIsCancelModalOpen(false);
        fetchOrder();
      }
    } catch (err) {
      addToast(err.message || 'Failed to cancel order.', 'error');
    } finally {
      setCancelLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-16 flex justify-center items-center bg-background">
        <div className="animate-spin rounded-full h-9 w-9 border-b-2 border-accent" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
        <h2 className="text-lg font-extrabold text-text-primary">Order Not Found</h2>
        <p className="text-xs text-text-secondary mt-1">{error || 'The requested order could not be located.'}</p>
        <button
          onClick={() => navigate('/orders')}
          className="mt-4 px-4 py-2 bg-accent text-gray-950 font-bold rounded-xl text-xs inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to My Orders</span>
        </button>
      </div>
    );
  }

  const orderNum = order.orderNumber || order._id;
  const isCancellable = ['PENDING', 'CONFIRMED', 'PACKED'].includes(order.status);
  const formattedDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="bg-background min-h-screen py-8 pb-16">
      <div className="max-w-5xl mx-auto px-4 space-y-6">
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
          <div>
            <button
              onClick={() => navigate('/orders')}
              className="text-xs font-bold text-text-secondary hover:text-text-primary flex items-center gap-1.5 mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to All Orders</span>
            </button>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black text-text-primary tracking-tight">Order #{orderNum}</h1>
              <OrderStatusBadge status={order.status} />
            </div>
            <p className="text-xs text-text-secondary mt-1">Placed on {formattedDate}</p>
          </div>

          {isCancellable && (
            <button
              onClick={() => setIsCancelModalOpen(true)}
              className="px-4 py-2.5 bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 font-bold rounded-xl text-xs flex items-center gap-2 hover:bg-red-500/20 transition-colors self-start sm:self-auto"
            >
              <XCircle className="w-4 h-4" />
              <span>CANCEL ORDER</span>
            </button>
          )}
        </div>

        {/* Live Order Timeline */}
        <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
          <h3 className="font-extrabold text-sm text-text-primary mb-2">Package Delivery Timeline</h3>
          <OrderTimeline currentStatus={order.status} statusHistory={order.statusHistory} />
        </div>

        {/* Details Grid: Address, Payment & Order Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Items & Address Snapshots */}
          <div className="lg:col-span-7 space-y-6">
            {/* Item Snapshots */}
            <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="font-extrabold text-sm text-text-primary flex items-center gap-2 border-b border-border pb-3">
                <Package className="w-4 h-4 text-accent" />
                <span>Purchased Products ({order.items?.length || 0})</span>
              </h3>

              <div className="space-y-3">
                {order.items?.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between gap-4 p-3 bg-surface-secondary/40 border border-border/50 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image || 'https://via.placeholder.com/60'}
                        alt={item.name}
                        className="w-14 h-14 rounded-xl object-cover border border-border shrink-0 bg-surface"
                      />
                      <div>
                        <h4 className="font-bold text-xs text-text-primary">{item.name}</h4>
                        {item.sku && <p className="text-[10px] text-text-tertiary">SKU: {item.sku}</p>}
                        <p className="text-[11px] text-text-secondary mt-0.5">
                          Qty: {item.quantity} × ₹{item.unitPrice.toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>

                    <span className="font-extrabold text-xs text-text-primary">
                      ₹{item.lineTotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Address Snapshot */}
            <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm space-y-3">
              <h3 className="font-extrabold text-sm text-text-primary flex items-center gap-2 border-b border-border pb-3">
                <MapPin className="w-4 h-4 text-accent" />
                <span>Shipping Address Snapshot</span>
              </h3>

              {order.shippingAddress && (
                <div className="text-xs text-text-secondary leading-relaxed space-y-1">
                  <p className="font-extrabold text-text-primary text-sm">{order.shippingAddress.fullName}</p>
                  <p className="font-semibold text-text-secondary">📞 {order.shippingAddress.phone}</p>
                  <p>{order.shippingAddress.addressLine1}</p>
                  {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                  </p>
                  <p>{order.shippingAddress.country}</p>
                  {order.shippingAddress.landmark && (
                    <p className="text-text-tertiary italic">Landmark: {order.shippingAddress.landmark}</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Pricing & Payment Summary */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="font-extrabold text-sm text-text-primary flex items-center gap-2 border-b border-border pb-3">
                <CreditCard className="w-4 h-4 text-accent" />
                <span>Payment & Pricing Breakdown</span>
              </h3>

              <div className="space-y-2.5 text-xs text-text-secondary">
                <div className="flex justify-between">
                  <span>Payment Method</span>
                  <span className="font-bold text-text-primary">{order.payment?.method || 'COD'}</span>
                </div>

                <div className="flex justify-between">
                  <span>Payment Status</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {order.payment?.status || 'PENDING'}
                  </span>
                </div>

                <div className="flex justify-between pt-2 border-t border-border">
                  <span>Items Subtotal</span>
                  <span className="font-bold text-text-primary">
                    ₹{(order.pricing?.subtotal || 0).toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span className="font-bold text-text-primary">
                    {order.pricing?.shipping === 0 ? (
                      <span className="text-emerald-600 dark:text-emerald-400">FREE</span>
                    ) : (
                      `₹${(order.pricing?.shipping || 0).toLocaleString('en-IN')}`
                    )}
                  </span>
                </div>

                {order.pricing?.discount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Discount</span>
                    <span className="font-bold">-₹{order.pricing.discount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="flex justify-between pt-3 border-t border-border text-sm font-black text-text-primary">
                  <span>Total Amount</span>
                  <span className="text-base text-accent">
                    ₹{(order.pricing?.total || 0).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Order Modal */}
      {isCancelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-surface border border-border rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-extrabold text-text-primary flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-500" />
              <span>Confirm Order Cancellation</span>
            </h3>

            <p className="text-xs text-text-secondary leading-relaxed">
              Are you sure you want to cancel Order <strong>#{orderNum}</strong>? Any inventory reserved for this order will be released.
            </p>

            <div>
              <label className="block text-xs font-bold text-text-secondary uppercase mb-1">
                Reason for Cancellation (Optional)
              </label>
              <textarea
                value={cancelNote}
                onChange={(e) => setCancelNote(e.target.value)}
                placeholder="Changed my mind / Ordered by mistake..."
                className="w-full p-2.5 bg-surface-secondary border border-border rounded-xl text-xs text-text-primary focus:outline-none focus:border-accent"
                rows={3}
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsCancelModalOpen(false)}
                className="px-4 py-2 border border-border rounded-xl text-xs font-bold text-text-secondary"
              >
                Keep Order
              </button>
              <button
                type="button"
                disabled={cancelLoading}
                onClick={handleCancelOrder}
                className="px-5 py-2 bg-red-600 text-white font-bold rounded-xl text-xs hover:bg-red-700 transition-colors"
              >
                {cancelLoading ? 'Cancelling...' : 'Confirm Cancellation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetailsPage;
