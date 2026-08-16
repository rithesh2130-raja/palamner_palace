import React, { useState, useEffect, useContext } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import { UserContext } from '../../context/UserContext';
import { Check, X, Ban, Trash2 } from 'lucide-react';

const UserListPage = () => {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [actionLoading, setActionLoading] = useState(false);

  const { userInfo } = useContext(UserContext);

  const fetchData = async () => {
    try {
      const [usrRes, ordRes] = await Promise.all([
        fetch('/api/users'),
        fetch('/api/orders'),
      ]);

      if (!usrRes.ok || !ordRes.ok) throw new Error('Failed to load customers analysis data');

      const usrs = await usrRes.json();
      const ords = await ordRes.json();

      setUsers(usrs);
      setOrders(ords);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      setActionLoading(true);
      try {
        const res = await fetch(`/api/users/${id}`, { method: 'DELETE' });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Delete failed');
        fetchData();
      } catch (err) {
        alert(err.message);
      } finally {
        setActionLoading(false);
      }
    }
  };

  const toggleBlockHandler = async (user) => {
    const newStatus = user.status === 'Blocked' ? 'Active' : 'Blocked';
    if (window.confirm(`Are you sure you want to change this customer's status to ${newStatus}?`)) {
      setActionLoading(true);
      try {
        const res = await fetch(`/api/users/${user._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...user,
            status: newStatus,
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to update status');
        fetchData();
      } catch (err) {
        alert(err.message);
      } finally {
        setActionLoading(false);
      }
    }
  };

  const getSpending = (userId) => {
    const total = orders
      .filter((o) => o.user && (o.user._id === userId || o.user === userId) && o.isPaid)
      .reduce((acc, o) => acc + o.totalPrice, 0);
    return `$${total.toFixed(2)}`;
  };

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
        <h1 style={{ marginBottom: '2rem', fontWeight: '700' }}>Customers Management</h1>
        {error && <div className="alert alert-danger">{error}</div>}

        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>CUSTOMER NAME</th>
                <th>EMAIL</th>
                <th>SPENDING HISTORY</th>
                <th>ADMIN PRIVILEGES</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} style={{ opacity: user.status === 'Blocked' ? 0.6 : 1 }}>
                  <td style={{ fontWeight: '600' }}>{user.name}</td>
                  <td>
                    <a href={`mailto:${user.email}`}>{user.email}</a>
                  </td>
                  <td style={{ fontWeight: '700' }}>{getSpending(user._id)}</td>
                  <td>
                    {user.isAdmin ? (
                      <span style={{ color: 'var(--success)' }}>
                        <Check size={18} />
                      </span>
                    ) : (
                      <span style={{ color: 'var(--danger)' }}>
                        <X size={18} />
                      </span>
                    )}
                  </td>
                  <td>
                    {user.status === 'Blocked' ? (
                      <span className="badge badge-danger">Blocked</span>
                    ) : (
                      <span className="badge badge-success">Active</span>
                    )}
                  </td>
                  <td>
                    <div className="actions-cell">
                      <button
                        onClick={() => toggleBlockHandler(user)}
                        className="btn btn-secondary"
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', backgroundColor: user.status === 'Blocked' ? 'var(--success)' : 'var(--warning)', color: '#fff' }}
                        disabled={actionLoading || user._id === userInfo._id}
                        title={user.status === 'Blocked' ? 'Unblock User' : 'Block User'}
                      >
                        <Ban size={12} /> {user.status === 'Blocked' ? 'Unblock' : 'Block'}
                      </button>
                      <button
                        onClick={() => deleteHandler(user._id)}
                        className="btn btn-danger"
                        disabled={actionLoading || user._id === userInfo._id || user.isAdmin}
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                      >
                        <Trash2 size={12} /> Remove
                      </button>
                    </div>
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

export default UserListPage;
