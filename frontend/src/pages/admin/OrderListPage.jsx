import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminSidebar from '../../components/AdminSidebar';
import { Eye, Save } from 'lucide-react';

const OrderListPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [statuses, setStatuses] = useState({});
  const [actionLoading, setActionLoading] = useState(false);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      if (!res.ok) throw new Error('Failed to load orders');
      const data = await res.json();
      setOrders(data);

      const ordStatuses = {};
      data.forEach((o) => {
        ordStatuses[o._id] = o.status;
      });
      setStatuses(ordStatuses);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = (id, val) => {
    setStatuses((prev) => ({
      ...prev,
      [id]: val,
    }));
  };

  const saveStatusHandler = async (order) => {
    const newStatus = statuses[order._id];
    if (newStatus === undefined || newStatus === order.status) return;

    setActionLoading(true);
    try {
      const res = await fetch(`/api/orders/${order._id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update order status');

      alert('Order dispatch status updated successfully!');
      fetchOrders();
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const orderStatuses = ['Pending', 'Processing', 'Delivered', 'Cancelled'];

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - var(--header-height))', marginLeft: '-1.5rem', marginRight: '-1.5rem', marginTop: '-2rem', marginBottom: '-2rem' }}>
      <AdminSidebar />
      <div style={{ flex: 1, padding: '2rem 2.5rem', overflowY: 'auto' }}>
        <h1 style={{ marginBottom: '2rem', fontWeight: '700' }}>Orders Dispatch Tracking</h1>
        {error && <div className="alert alert-danger">{error}</div>}

        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>ORDER ID</th>
                <th>CUSTOMER</th>
                <th>DATE</th>
                <th>TOTAL</th>
                <th>PAID</th>
                <th>STATUS</th>
                <th>UPDATE STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td style={{ fontWeight: '600' }}>{order._id.substring(0, 10)}...</td>
                  <td>{order.user ? order.user.name : 'Deleted User'}</td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td style={{ fontWeight: '600' }}>${order.totalPrice.toFixed(2)}</td>
                  <td>
                    {order.isPaid ? (
                      <span className="badge badge-success">Paid</span>
                    ) : (
                      <span className="badge badge-danger">Not Paid</span>
                    )}
                  </td>
                  <td>
                    <span className="badge badge-warning" style={{
                      backgroundColor: order.status === 'Delivered' ? '#ecfdf5' : order.status === 'Cancelled' ? '#fee2e2' : '#fef3c7',
                      color: order.status === 'Delivered' ? '#065f46' : order.status === 'Cancelled' ? '#991b1b' : '#92400e'
                    }}>
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <select
                        className="qty-select"
                        style={{ width: '130px', padding: '0.4rem', height: '36px' }}
                        value={statuses[order._id] || 'Pending'}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        disabled={order.status === 'Delivered' || order.status === 'Cancelled'}
                      >
                        {orderStatuses.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => saveStatusHandler(order)}
                        className="btn btn-primary"
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                        disabled={actionLoading || statuses[order._id] === order.status || order.status === 'Delivered' || order.status === 'Cancelled'}
                      >
                        <Save size={12} />
                      </button>
                    </div>
                  </td>
                  <td>
                    <Link
                      to={`/order/${order._id}`}
                      className="btn btn-secondary"
                      style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                    >
                      <Eye size={12} /> Inspect
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrderListPage;
