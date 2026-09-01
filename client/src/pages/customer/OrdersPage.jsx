import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Package, Search, ChevronRight, AlertCircle, ShoppingBag } from 'lucide-react';
import { orderService } from '../../services/orderService.js';
import OrderStatusBadge from '../../components/orders/OrderStatusBadge.jsx';

export const OrdersPage = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await orderService.getOrders({
        status: statusFilter || undefined,
        limit: 50,
      });
      if (res && res.success && res.data?.orders) {
        setOrders(res.data.orders);
      }
    } catch (err) {
      setError(err.message || 'Failed to load order history.');
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const filteredOrders = orders.filter((ord) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    const matchNum = ord.orderNumber?.toLowerCase().includes(query);
    const matchItem = ord.items?.some((i) => i.name?.toLowerCase().includes(query));
    return matchNum || matchItem;
  });

  return (
    <div className="max-w-[1280px] mx-auto px-4 py-8 space-y-6">
      {/* Top Header & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="text-2xl font-black text-text-primary tracking-tight flex items-center gap-2.5">
            <Package className="w-7 h-7 text-accent" />
            <span>My Orders & Order History</span>
          </h1>
          <p className="text-xs text-text-secondary mt-1">
            Track live package shipments, review order details, and view historical receipts.
          </p>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-text-tertiary absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by order # or product..."
              className="w-full pl-9 pr-3 py-2 bg-surface-secondary border border-border rounded-xl text-xs text-text-primary focus:outline-none focus:border-accent"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto py-2 px-3 bg-surface-secondary border border-border rounded-xl text-xs text-text-primary font-bold focus:outline-none focus:border-accent"
          >
            <option value="">All Orders</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="py-16 flex justify-center">
          <div className="animate-spin rounded-full h-9 w-9 border-b-2 border-accent" />
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-16 px-4 border border-dashed border-border rounded-2xl bg-surface-secondary/40">
          <Package className="w-12 h-12 text-text-tertiary mx-auto mb-3" />
          <h3 className="text-base font-extrabold text-text-primary">No orders found</h3>
          <p className="text-xs text-text-secondary mt-1 max-w-sm mx-auto">
            {searchQuery || statusFilter
              ? 'No orders matched your search or status filter.'
              : 'You have not placed any orders on ShopSphere yet.'}
          </p>
          <Link
            to="/products"
            className="mt-4 px-5 py-2.5 bg-accent text-gray-950 font-bold rounded-xl text-xs inline-flex items-center gap-2 hover:opacity-90 transition-opacity shadow-sm"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Explore ShopSphere Products</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const orderId = order.orderNumber || order._id;
            const formattedDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            });

            return (
              <div
                key={order._id || orderId}
                className="bg-surface border border-border rounded-2xl p-5 shadow-sm space-y-4 hover:border-text-tertiary transition-all"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3.5 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-text-primary text-sm tracking-tight">
                        Order #{orderId}
                      </span>
                      <span className="text-text-tertiary">• Placed on {formattedDate}</span>
                    </div>
                    <div className="text-text-secondary">
                      Total:{' '}
                      <span className="font-extrabold text-text-primary">
                        ₹{(order.pricing?.total || 0).toLocaleString('en-IN')}
                      </span>{' '}
                      ({order.payment?.method || 'COD'})
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3">
                    <OrderStatusBadge status={order.status} />

                    <button
                      onClick={() => navigate(`/orders/${orderId}`)}
                      className="px-3.5 py-1.5 bg-surface-secondary border border-border hover:bg-border font-bold rounded-xl text-xs text-text-primary flex items-center gap-1 transition-colors"
                    >
                      <span>VIEW ORDER</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Items Preview */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 bg-surface-secondary/40 p-2.5 rounded-xl border border-border/50">
                      <img
                        src={item.image || 'https://via.placeholder.com/60'}
                        alt={item.name}
                        className="w-12 h-12 rounded-lg object-cover border border-border shrink-0 bg-surface"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-text-primary truncate">{item.name}</h4>
                        <p className="text-[11px] text-text-secondary mt-0.5">
                          Qty: {item.quantity} • ₹{item.unitPrice.toLocaleString('en-IN')} each
                        </p>
                      </div>
                      <span className="font-extrabold text-xs text-text-primary shrink-0">
                        ₹{item.lineTotal.toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
