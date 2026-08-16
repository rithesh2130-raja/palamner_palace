import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminSidebar from '../../components/AdminSidebar';
import {
  DollarSign,
  Users,
  ShoppingBag,
  Package,
  Eye,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react';

const DashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [stats, setStats] = useState({
    totalSales: 0,
    todaySales: 0,
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    cancelledOrders: 0,
    totalUsers: 0,
    totalProducts: 0,
    lowStockProducts: 0,
    outOfStockProducts: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [categorySales, setCategorySales] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [prodRes, ordRes, usrRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/orders'),
          fetch('/api/users'),
        ]);

        if (!prodRes.ok || !ordRes.ok || !usrRes.ok) {
          throw new Error('Failed to load dashboard metrics');
        }

        const products = await prodRes.json();
        const orders = await ordRes.json();
        const users = await usrRes.json();

        const totalSales = orders
          .filter((o) => o.isPaid)
          .reduce((acc, o) => acc + o.totalPrice, 0);

        // Today's Sales
        const todayStr = new Date().toDateString();
        const todaySales = orders
          .filter((o) => o.isPaid && new Date(o.createdAt).toDateString() === todayStr)
          .reduce((acc, o) => acc + o.totalPrice, 0);

        const pendingOrders = orders.filter((o) => o.status === 'Pending').length;
        const completedOrders = orders.filter((o) => o.status === 'Delivered').length;
        const cancelledOrders = orders.filter((o) => o.status === 'Cancelled').length;

        const lowStockProducts = products.filter(
          (p) => p.countInStock > 0 && p.countInStock <= p.reorderLevel
        ).length;
        const outOfStockProducts = products.filter((p) => p.countInStock === 0).length;

        setStats({
          totalSales,
          todaySales,
          totalOrders: orders.length,
          pendingOrders,
          completedOrders,
          cancelledOrders,
          totalUsers: users.length,
          totalProducts: products.length,
          lowStockProducts,
          outOfStockProducts,
        });

        // Calculate product category distributions
        const categoriesMap = products.reduce((acc, curr) => {
          acc[curr.category] = (acc[curr.category] || 0) + 1;
          return acc;
        }, {});

        const chartData = Object.entries(categoriesMap).map(([name, value]) => ({
          name,
          value,
        }));
        setCategorySales(chartData);

        // Set top 5 recent orders
        setRecentOrders(orders.slice(-5).reverse());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div
      style={{
        display: 'flex',
        minHeight: 'calc(100vh - var(--header-height))',
        marginLeft: '-1.5rem',
        marginRight: '-1.5rem',
        marginTop: '-2rem',
        marginBottom: '-2rem',
      }}
    >
      <AdminSidebar />
      <div style={{ flex: 1, padding: '2rem 2.5rem', overflowY: 'auto' }}>
        <h1 style={{ marginBottom: '2rem', fontWeight: '700' }}>Admin Dashboard</h1>

        {/* Stats Cards Grid - Row 1: Finance & Users */}
        <div className="dashboard-grid" style={{ marginBottom: '1.5rem' }}>
          <div className="stat-card">
            <div
              className="stat-icon-box"
              style={{ backgroundColor: '#eff6ff', color: 'var(--secondary)' }}
            >
              <DollarSign size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-label">TOTAL SALES</span>
              <span className="stat-value">${stats.totalSales.toFixed(2)}</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-box" style={{ backgroundColor: '#ecfdf5', color: 'var(--success)' }}>
              <TrendingUp size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-label">TODAY'S REVENUE</span>
              <span className="stat-value">${stats.todaySales.toFixed(2)}</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-box" style={{ backgroundColor: '#fef3c7', color: 'var(--warning)' }}>
              <Users size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-label">CUSTOMERS</span>
              <span className="stat-value">{stats.totalUsers}</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-box" style={{ backgroundColor: '#fef2f2', color: 'var(--danger)' }}>
              <Package size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-label">PRODUCTS</span>
              <span className="stat-value">{stats.totalProducts}</span>
            </div>
          </div>
        </div>

        {/* Stats Cards Grid - Row 2: Orders & Inventory */}
        <div className="dashboard-grid" style={{ marginBottom: '2.5rem' }}>
          <div className="stat-card" style={{ borderLeft: '4px solid var(--primary)' }}>
            <div className="stat-info">
              <span className="stat-label">PENDING ORDERS</span>
              <span className="stat-value" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                {stats.pendingOrders} <span style={{ fontSize: '0.75rem', fontWeight: 'normal', color: 'var(--text-muted)' }}>waiting</span>
              </span>
            </div>
          </div>

          <div className="stat-card" style={{ borderLeft: '4px solid var(--success)' }}>
            <div className="stat-info">
              <span className="stat-label">COMPLETED ORDERS</span>
              <span className="stat-value" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                {stats.completedOrders} <span style={{ fontSize: '0.75rem', fontWeight: 'normal', color: 'var(--text-muted)' }}>shipped</span>
              </span>
            </div>
          </div>

          <div className="stat-card" style={{ borderLeft: '4px solid var(--warning)' }}>
            <div className="stat-info">
              <span className="stat-label">LOW STOCK ALERT</span>
              <span className="stat-value" style={{ color: stats.lowStockProducts > 0 ? 'var(--warning)' : 'inherit' }}>
                {stats.lowStockProducts} SKUs
              </span>
            </div>
          </div>

          <div className="stat-card" style={{ borderLeft: '4px solid #64748b' }}>
            <div className="stat-info">
              <span className="stat-label">OUT OF STOCK</span>
              <span className="stat-value" style={{ color: stats.outOfStockProducts > 0 ? 'var(--danger)' : 'inherit' }}>
                {stats.outOfStockProducts} SKUs
              </span>
            </div>
          </div>
        </div>

        {/* Product Category Distribution Chart */}
        <div
          style={{
            backgroundColor: 'var(--bg-card)',
            padding: '1.8rem',
            borderRadius: 'var(--border-radius-md)',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-sm)',
            marginBottom: '2.5rem',
          }}
        >
          <h2 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '1.5rem' }}>
            Products Distribution by Category
          </h2>
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-around',
              height: '240px',
              padding: '1rem 0',
              borderBottom: '2px solid var(--border-color)',
            }}
          >
            {categorySales.map((item, idx) => {
              const maxValue = Math.max(...categorySales.map((d) => d.value), 1);
              const pct = (item.value / maxValue) * 100;
              return (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: '120px',
                    gap: '0.8rem',
                  }}
                >
                  <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--secondary)' }}>
                    {item.value} units
                  </span>
                  <div
                    style={{
                      width: '45px',
                      height: `${pct * 1.5}px`,
                      minHeight: '6px',
                      background:
                        'linear-gradient(180deg, var(--secondary) 0%, #3b82f6 100%)',
                      borderRadius: '6px 6px 0 0',
                      boxShadow: '0 4px 10px rgba(37, 99, 235, 0.2)',
                    }}
                  ></div>
                  <span style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-muted)' }}>
                    {item.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Orders section */}
        <div>
          <div className="page-header-row" style={{ marginBottom: '1rem' }}>
            <h2 style={{ fontWeight: '700' }}>Recent Orders</h2>
            <Link
              to="/admin/orderlist"
              className="btn btn-secondary"
              style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
            >
              View All <ArrowUpRight size={14} />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="alert alert-info">No orders found.</div>
          ) : (
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>ORDER ID</th>
                    <th>USER</th>
                    <th>DATE</th>
                    <th>TOTAL</th>
                    <th>PAID</th>
                    <th>DELIVERED</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order._id}>
                      <td style={{ fontWeight: '600' }}>{order._id}</td>
                      <td>{order.user ? order.user.name : 'Deleted User'}</td>
                      <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td style={{ fontWeight: '600' }}>${order.totalPrice.toFixed(2)}</td>
                      <td>
                        {order.isPaid ? (
                          <span className="badge badge-success">Paid</span>
                        ) : (
                          <span className="badge badge-danger">Unpaid</span>
                        )}
                      </td>
                      <td>
                        {order.isDelivered ? (
                          <span className="badge badge-success">Delivered</span>
                        ) : (
                          <span className="badge badge-warning">Pending</span>
                        )}
                      </td>
                      <td>
                        <Link
                          to={`/order/${order._id}`}
                          className="btn btn-secondary"
                          style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                        >
                          <Eye size={12} /> View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
