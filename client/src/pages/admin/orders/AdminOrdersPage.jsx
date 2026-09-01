import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Search, Eye, Filter, RefreshCw } from 'lucide-react';
import { orderService } from '../../../services/orderService.js';
import OrderStatusBadge from '../../../components/orders/OrderStatusBadge.jsx';

export const AdminOrdersPage = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ totalPages: 1, totalCount: 0 });

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await orderService.getAdminOrders({
        page,
        limit: 20,
        status: status || undefined,
        search: search || undefined,
      });
      if (res && res.success && res.data) {
        setOrders(res.data.orders);
        setPagination(res.data.pagination);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch admin orders.');
    } finally {
      setLoading(false);
    }
  }, [page, status, search]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return (
    <div className="p-6 space-y-6">
      {/* Top Title & Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="text-2xl font-black text-text-primary tracking-tight flex items-center gap-2.5">
            <Package className="w-7 h-7 text-accent" />
            <span>Admin Order Fulfillment Manager</span>
          </h1>
          <p className="text-xs text-text-secondary mt-1">
            Monitor, inspect, and update logistics & order status across all platform customers.
          </p>
        </div>

        <button
          onClick={fetchOrders}
          className="px-3.5 py-2 bg-surface-secondary border border-border text-text-primary font-bold rounded-xl text-xs flex items-center gap-2 hover:bg-border transition-colors self-start sm:self-auto"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh Orders</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-surface p-4 rounded-2xl border border-border">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-text-tertiary absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Order #, Customer Name, or Phone..."
            className="w-full pl-9 pr-3 py-2 bg-surface-secondary border border-border rounded-xl text-xs text-text-primary focus:outline-none focus:border-accent"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-text-tertiary" />
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className="w-full sm:w-auto py-2 px-3 bg-surface-secondary border border-border rounded-xl text-xs text-text-primary font-bold focus:outline-none focus:border-accent"
          >
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="PACKED">Packed</option>
            <option value="SHIPPED">Shipped</option>
            <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-semibold">
          {error}
        </div>
      )}

      {/* Orders Table */}
      {loading ? (
        <div className="py-16 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent" />
        </div>
      ) : orders.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-border rounded-2xl bg-surface-secondary/40">
          <p className="text-xs text-text-secondary font-bold">No orders found matching filters.</p>
        </div>
      ) : (
        <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-surface-secondary border-b border-border text-text-secondary font-extrabold uppercase tracking-wider text-[10px]">
                  <th className="py-3.5 px-4">Order Ref</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Items</th>
                  <th className="py-3.5 px-4">Total</th>
                  <th className="py-3.5 px-4">Payment</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {orders.map((ord) => {
                  const ordId = ord.orderNumber || ord._id;
                  const customerName =
                    ord.shippingAddress?.fullName || ord.userId?.name || 'Customer';
                  const dateStr = new Date(ord.createdAt).toLocaleDateString('en-IN', {
                    month: 'short',
                    day: 'numeric',
                  });

                  return (
                    <tr key={ord._id} className="hover:bg-surface-secondary/50 transition-colors">
                      <td className="py-3.5 px-4 font-black text-text-primary">{ordId}</td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-text-primary">{customerName}</div>
                        <div className="text-[10px] text-text-tertiary">{ord.shippingAddress?.phone}</div>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-text-secondary">
                        {ord.items?.length || 0} items
                      </td>
                      <td className="py-3.5 px-4 font-extrabold text-text-primary">
                        ₹{(ord.pricing?.total || 0).toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-text-secondary">
                        {ord.payment?.method || 'COD'}
                      </td>
                      <td className="py-3.5 px-4">
                        <OrderStatusBadge status={ord.status} />
                      </td>
                      <td className="py-3.5 px-4 text-text-tertiary">{dateStr}</td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => navigate(`/admin/orders/${ordId}`)}
                          className="px-3 py-1.5 bg-accent/10 text-accent border border-accent/30 font-extrabold rounded-lg text-[11px] inline-flex items-center gap-1 hover:bg-accent/20 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Manage</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrdersPage;
