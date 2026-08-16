import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import { DollarSign, CheckCircle2, XCircle, Percent } from 'lucide-react';

const PaymentsPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch('/api/orders');
        if (!res.ok) throw new Error('Failed to load orders for payments analysis');
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const totalSales = orders.filter((o) => o.isPaid).reduce((acc, o) => acc + o.totalPrice, 0);
  const totalCommissions = orders.filter((o) => o.isPaid).reduce((acc, o) => acc + (o.commissionPaid || 0), 0);
  const successfulCount = orders.filter((o) => o.isPaid).length;
  const pendingCount = orders.filter((o) => !o.isPaid).length;

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - var(--header-height))', marginLeft: '-1.5rem', marginRight: '-1.5rem', marginTop: '-2rem', marginBottom: '-2rem' }}>
      <AdminSidebar />
      <div style={{ flex: 1, padding: '2rem 2.5rem', overflowY: 'auto' }}>
        <h1 style={{ marginBottom: '2rem', fontWeight: '700' }}>Financial Ledger & Payments</h1>

        {/* Financial Metrics Cards */}
        <div className="dashboard-grid">
          <div className="stat-card">
            <div className="stat-icon-box" style={{ backgroundColor: '#eff6ff', color: 'var(--secondary)' }}>
              <DollarSign size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-label">TOTAL REVENUE</span>
              <span className="stat-value">${totalSales.toFixed(2)}</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-box" style={{ backgroundColor: '#ecfdf5', color: 'var(--success)' }}>
              <Percent size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-label">COMMISSIONS COLLECTED</span>
              <span className="stat-value">${totalCommissions.toFixed(2)}</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-box" style={{ backgroundColor: '#e0f2fe', color: '#0369a1' }}>
              <CheckCircle2 size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-label">SUCCESSFUL PAYMENTS</span>
              <span className="stat-value">{successfulCount} orders</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-box" style={{ backgroundColor: '#fee2e2', color: 'var(--danger)' }}>
              <XCircle size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-label">UNPAID / COD PENDING</span>
              <span className="stat-value">{pendingCount} orders</span>
            </div>
          </div>
        </div>

        {/* Transactions list */}
        {loading ? (
          <div className="spinner-container">
            <div className="spinner"></div>
          </div>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : orders.length === 0 ? (
          <div className="alert alert-info">No transactions found.</div>
        ) : (
          <div>
            <h2 style={{ marginBottom: '1.2rem', fontWeight: '700' }}>Transaction History</h2>
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>ORDER ID</th>
                    <th>CUSTOMER</th>
                    <th>DATE</th>
                    <th>GATEWAY METHOD</th>
                    <th>AMOUNT</th>
                    <th>COMMISSION</th>
                    <th>PAYMENT STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td style={{ fontWeight: '600' }}>{order._id}</td>
                      <td>{order.user ? order.user.name : 'Unknown'}</td>
                      <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td style={{ fontWeight: '500' }}>{order.paymentMethod}</td>
                      <td style={{ fontWeight: '600' }}>${order.totalPrice.toFixed(2)}</td>
                      <td style={{ color: 'var(--success)', fontWeight: '600' }}>
                        ${(order.commissionPaid || 0).toFixed(2)}
                      </td>
                      <td>
                        {order.isPaid ? (
                          <span className="badge badge-success">Success</span>
                        ) : (
                          <span className="badge badge-danger">Pending</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentsPage;
