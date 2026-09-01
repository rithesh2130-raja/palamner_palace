import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Package, MapPin, CreditCard, ArrowLeft, Shield, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { orderService } from '../../../services/orderService.js';
import { useToast } from '../../../context/ToastContext.jsx';
import OrderStatusBadge from '../../../components/orders/OrderStatusBadge.jsx';

const STATUS_OPTIONS = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'CONFIRMED', label: 'Confirmed' },
  { value: 'PACKED', label: 'Packed' },
  { value: 'SHIPPED', label: 'Shipped' },
  { value: 'OUT_FOR_DELIVERY', label: 'Out for Delivery' },
  { value: 'DELIVERED', label: 'Delivered' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

export const AdminOrderDetailsPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Status update state
  const [targetStatus, setTargetStatus] = useState('');
  const [statusNote, setStatusNote] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchOrder = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await orderService.getOrder(orderId);
      if (res && res.success && res.data) {
        setOrder(res.data);
        setTargetStatus(res.data.status);
      }
    } catch (err) {
      setError(err.message || 'Failed to load admin order details.');
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    if (!targetStatus || targetStatus === order.status) {
      addToast('Please select a different status to update.', 'info');
      return;
    }

    setUpdating(true);
    try {
      const res = await orderService.updateOrderStatusAdmin(orderId, targetStatus, statusNote);
      if (res && res.success) {
        addToast(`Order status updated to ${targetStatus}`, 'success');
        setStatusNote('');
        fetchOrder();
      }
    } catch (err) {
      addToast(err.message || 'Failed to update order status.', 'error');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="p-16 flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="p-12 text-center">
        <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-2" />
        <h3 className="text-base font-bold text-text-primary">Order Not Found</h3>
        <p className="text-xs text-text-secondary mt-1">{error}</p>
        <button
          onClick={() => navigate('/admin/orders')}
          className="mt-4 px-4 py-2 bg-accent text-gray-950 font-bold rounded-xl text-xs inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Admin Orders</span>
        </button>
      </div>
    );
  }

  const orderNum = order.orderNumber || order._id;

  return (
    <div className="p-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <button
            onClick={() => navigate('/admin/orders')}
            className="text-xs font-bold text-text-secondary hover:text-text-primary flex items-center gap-1.5 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Orders</span>
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-text-primary tracking-tight">Order #{orderNum}</h1>
            <OrderStatusBadge status={order.status} />
          </div>
          <p className="text-xs text-text-secondary mt-1">
            Placed on {new Date(order.createdAt).toLocaleString('en-IN')}
          </p>
        </div>
      </div>

      {/* Admin Status Transition Control Card */}
      <div className="bg-surface border border-accent/30 rounded-2xl p-6 shadow-md space-y-4">
        <h3 className="font-extrabold text-sm text-text-primary flex items-center gap-2 border-b border-border pb-3">
          <Shield className="w-4 h-4 text-accent" />
          <span>Update Logistics & Order Status</span>
        </h3>

        <form onSubmit={handleStatusUpdate} className="space-y-4 max-w-lg text-xs">
          <div>
            <label className="block font-bold text-text-secondary uppercase mb-1">Target Order Status</label>
            <select
              value={targetStatus}
              onChange={(e) => setTargetStatus(e.target.value)}
              className="w-full p-2.5 bg-surface-secondary border border-border rounded-xl text-xs font-bold text-text-primary focus:outline-none focus:border-accent"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-text-secondary uppercase mb-1">Logistics Note (Optional)</label>
            <input
              type="text"
              value={statusNote}
              onChange={(e) => setStatusNote(e.target.value)}
              placeholder="e.g. Handed over to BlueDart courier, Tracking ID #12345..."
              className="w-full p-2.5 bg-surface-secondary border border-border rounded-xl text-xs text-text-primary focus:outline-none focus:border-accent"
            />
          </div>

          <button
            type="submit"
            disabled={updating || targetStatus === order.status}
            className="px-5 py-2.5 bg-accent text-gray-950 font-extrabold rounded-xl text-xs hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {updating ? 'Updating Status...' : 'UPDATE ORDER STATUS'}
          </button>
        </form>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Products & Address */}
        <div className="lg:col-span-7 space-y-6">
          {/* Purchased Items */}
          <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="font-extrabold text-sm text-text-primary flex items-center gap-2 border-b border-border pb-3">
              <Package className="w-4 h-4 text-accent" />
              <span>Purchased Items ({order.items?.length || 0})</span>
            </h3>

            <div className="space-y-3">
              {order.items?.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between gap-4 p-3 bg-surface-secondary/40 border border-border/50 rounded-xl text-xs"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image || 'https://via.placeholder.com/60'}
                      alt={item.name}
                      className="w-12 h-12 rounded-xl object-cover border border-border shrink-0 bg-surface"
                    />
                    <div>
                      <h4 className="font-bold text-text-primary">{item.name}</h4>
                      {item.sku && <p className="text-[10px] text-text-tertiary">SKU: {item.sku}</p>}
                      <p className="text-[11px] text-text-secondary mt-0.5">
                        Qty: {item.quantity} × ₹{item.unitPrice.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                  <span className="font-extrabold text-text-primary">
                    ₹{item.lineTotal.toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm space-y-3">
            <h3 className="font-extrabold text-sm text-text-primary flex items-center gap-2 border-b border-border pb-3">
              <MapPin className="w-4 h-4 text-accent" />
              <span>Shipping Address</span>
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
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Pricing & Status History */}
        <div className="lg:col-span-5 space-y-6">
          {/* Pricing Summary */}
          <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm space-y-3 text-xs">
            <h3 className="font-extrabold text-sm text-text-primary flex items-center gap-2 border-b border-border pb-3">
              <CreditCard className="w-4 h-4 text-accent" />
              <span>Financial Overview</span>
            </h3>

            <div className="space-y-2 text-text-secondary">
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
                <span>Subtotal</span>
                <span className="font-bold text-text-primary">
                  ₹{(order.pricing?.subtotal || 0).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Shipping Fee</span>
                <span className="font-bold text-text-primary">
                  ₹{(order.pricing?.shipping || 0).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-border font-black text-sm text-text-primary">
                <span>Total Amount</span>
                <span className="text-accent">₹{(order.pricing?.total || 0).toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Status History Log */}
          <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm space-y-3">
            <h3 className="font-extrabold text-sm text-text-primary flex items-center gap-2 border-b border-border pb-3">
              <Clock className="w-4 h-4 text-accent" />
              <span>Status Audit Log</span>
            </h3>

            <div className="space-y-3 text-xs">
              {order.statusHistory?.map((log, idx) => (
                <div key={idx} className="border-l-2 border-accent/40 pl-3 py-1 space-y-0.5">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-text-primary">{log.status}</span>
                    <span className="text-[10px] text-text-tertiary">
                      {new Date(log.timestamp).toLocaleString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  {log.note && <p className="text-[11px] text-text-secondary">{log.note}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetailsPage;
