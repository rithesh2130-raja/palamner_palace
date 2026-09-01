import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import { CheckCircle2, Package, Truck, ArrowRight, ShoppingBag } from 'lucide-react';
import { orderService } from '../../services/orderService.js';

export const OrderConfirmationPage = () => {
  const { orderId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!location.state?.order);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!order && orderId) {
      setLoading(true);
      orderService
        .getOrder(orderId)
        .then((res) => {
          if (res && res.success && res.data) {
            setOrder(res.data);
          }
        })
        .catch((err) => {
          setError(err.message || 'Unable to load order details.');
        })
        .finally(() => setLoading(false));
    }
  }, [orderId, order]);

  if (loading) {
    return (
      <div className="min-h-screen py-16 flex justify-center items-center bg-background">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-accent" />
      </div>
    );
  }

  const orderNum = order?.orderNumber || orderId;
  const pricing = order?.pricing || {};
  const delivery = order?.delivery;

  return (
    <div className="bg-background min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Success Header Card */}
        <div className="bg-surface border border-border rounded-3xl p-8 text-center shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 via-accent to-emerald-400" />

          <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 mx-auto flex items-center justify-center mb-5 animate-bounce">
            <CheckCircle2 className="w-12 h-12 stroke-[2.5]" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-text-primary tracking-tight">
            ORDER CONFIRMED!
          </h1>
          <p className="text-xs text-text-secondary mt-2 max-w-md mx-auto">
            Thank you for shopping with ShopSphere! We have received your order and are preparing it for shipment.
          </p>

          <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-3 p-3 bg-surface-secondary/60 rounded-2xl border border-border text-xs">
            <div className="px-3 py-1">
              <span className="text-text-tertiary block text-[10px] font-bold uppercase">Order Reference</span>
              <span className="font-extrabold text-accent text-sm">{orderNum}</span>
            </div>

            <div className="w-px h-8 bg-border hidden sm:block" />

            <div className="px-3 py-1">
              <span className="text-text-tertiary block text-[10px] font-bold uppercase">Total Paid / COD</span>
              <span className="font-extrabold text-text-primary text-sm">
                ₹{(pricing.total || 0).toLocaleString('en-IN')}
              </span>
            </div>

            <div className="w-px h-8 bg-border hidden sm:block" />

            <div className="px-3 py-1">
              <span className="text-text-tertiary block text-[10px] font-bold uppercase">Payment Method</span>
              <span className="font-extrabold text-text-primary text-sm">
                {order?.payment?.method || 'Cash on Delivery'}
              </span>
            </div>
          </div>
        </div>

        {/* Order Details & Summary Card */}
        {order && (
          <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm space-y-6 text-xs">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-extrabold text-sm text-text-primary flex items-center gap-2">
                <Package className="w-4 h-4 text-accent" />
                <span>Purchased Items ({order.items?.length || 0})</span>
              </h3>

              {delivery?.estimatedDelivery && (
                <span className="text-text-secondary text-[11px] font-semibold flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-accent" />
                  Estimated Delivery:{' '}
                  <strong className="text-text-primary">
                    {new Date(delivery.estimatedDelivery).toLocaleDateString('en-IN', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </strong>
                </span>
              )}
            </div>

            <div className="space-y-3">
              {order.items?.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image || 'https://via.placeholder.com/60'}
                      alt={item.name}
                      className="w-12 h-12 rounded-xl object-cover border border-border shrink-0 bg-surface-secondary"
                    />
                    <div>
                      <h4 className="font-bold text-xs text-text-primary">{item.name}</h4>
                      <p className="text-[11px] text-text-tertiary">
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

            <div className="pt-4 border-t border-border space-y-1.5 text-text-secondary">
              <div className="flex justify-between">
                <span>Shipping Address</span>
                <span className="font-bold text-text-primary text-right">
                  {order.shippingAddress?.fullName}, {order.shippingAddress?.city}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link
            to={`/orders/${orderNum}`}
            className="w-full sm:w-1/2 py-3.5 bg-accent text-gray-950 font-extrabold rounded-xl shadow-md hover:opacity-90 transition-opacity flex items-center justify-center gap-2 text-xs"
          >
            <Package className="w-4 h-4" />
            <span>TRACK YOUR ORDER</span>
          </Link>

          <Link
            to="/products"
            className="w-full sm:w-1/2 py-3.5 bg-surface border border-border text-text-primary font-extrabold rounded-xl hover:bg-surface-secondary transition-colors flex items-center justify-center gap-2 text-xs"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>CONTINUE SHOPPING</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
