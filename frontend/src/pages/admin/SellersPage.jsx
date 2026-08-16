import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import { Plus, UserCheck, AlertOctagon, Trash2 } from 'lucide-react';

const SellersPage = () => {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [commissionRate, setCommissionRate] = useState(10);
  
  const [actionLoading, setActionLoading] = useState(false);

  const fetchSellers = async () => {
    try {
      const res = await fetch('/api/sellers');
      if (!res.ok) throw new Error('Failed to load sellers');
      const data = await res.json();
      setSellers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellers();
  }, []);

  const addSellerHandler = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    setActionLoading(true);
    try {
      const res = await fetch('/api/sellers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, commissionRate }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Creation failed');

      alert('Seller created successfully!');
      setName('');
      setEmail('');
      setCommissionRate(10);
      fetchSellers();
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const updateStatusHandler = async (id, status) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/sellers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Update status failed');
      fetchSellers();
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this seller?')) {
      setActionLoading(true);
      try {
        const res = await fetch(`/api/sellers/${id}`, { method: 'DELETE' });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Delete failed');
        fetchSellers();
      } catch (err) {
        alert(err.message);
      } finally {
        setActionLoading(false);
      }
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - var(--header-height))', marginLeft: '-1.5rem', marginRight: '-1.5rem', marginTop: '-2rem', marginBottom: '-2rem' }}>
      <AdminSidebar />
      <div style={{ flex: 1, padding: '2rem 2.5rem', overflowY: 'auto' }}>
        <h1 style={{ marginBottom: '2rem', fontWeight: '700' }}>Seller & Vendor Management</h1>

        {/* Add Vendor Form Box */}
        <div style={{
          backgroundColor: 'var(--bg-card)',
          padding: '1.5rem',
          borderRadius: 'var(--border-radius-md)',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '2.5rem'
        }}>
          <h3 style={{ marginBottom: '1rem', fontWeight: '600' }}>Register New Marketplace Vendor</h3>
          <form onSubmit={addSellerHandler} style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'flex-end' }}>
            <div className="form-group" style={{ flex: 1, minWidth: '200px', marginBottom: 0 }}>
              <label className="form-label">Vendor Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Apple Inc."
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="form-group" style={{ flex: 1, minWidth: '200px', marginBottom: 0 }}>
              <label className="form-label">Vendor Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="e.g. sales@apple.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group" style={{ width: '120px', marginBottom: 0 }}>
              <label className="form-label">Commission %</label>
              <input
                type="number"
                className="form-control"
                value={commissionRate}
                onChange={(e) => setCommissionRate(Number(e.target.value))}
                min="0"
                max="100"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={actionLoading} style={{ height: '42px' }}>
              <Plus size={16} /> Register Vendor
            </button>
          </form>
        </div>

        {/* Sellers Directory list */}
        {loading ? (
          <div className="spinner-container">
            <div className="spinner"></div>
          </div>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : sellers.length === 0 ? (
          <div className="alert alert-info">No vendors found.</div>
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>VENDOR NAME</th>
                  <th>EMAIL</th>
                  <th>COMMISSION RATE</th>
                  <th>APPROVAL STATUS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {sellers.map((seller) => (
                  <tr key={seller._id}>
                    <td style={{ fontWeight: '600' }}>{seller.name}</td>
                    <td>{seller.email}</td>
                    <td style={{ fontWeight: '600' }}>{seller.commissionRate}%</td>
                    <td>
                      {seller.status === 'Approved' ? (
                        <span className="badge badge-success">Approved</span>
                      ) : seller.status === 'Suspended' ? (
                        <span className="badge badge-danger">Suspended</span>
                      ) : (
                        <span className="badge badge-warning">Pending Approval</span>
                      )}
                    </td>
                    <td>
                      <div className="actions-cell">
                        {seller.status !== 'Approved' && (
                          <button
                            onClick={() => updateStatusHandler(seller._id, 'Approved')}
                            className="btn btn-primary"
                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', backgroundColor: 'var(--success)' }}
                            disabled={actionLoading}
                          >
                            <UserCheck size={12} /> Approve
                          </button>
                        )}
                        {seller.status !== 'Suspended' && (
                          <button
                            onClick={() => updateStatusHandler(seller._id, 'Suspended')}
                            className="btn btn-secondary"
                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', backgroundColor: 'var(--warning)', color: '#fff' }}
                            disabled={actionLoading}
                          >
                            <AlertOctagon size={12} /> Suspend
                          </button>
                        )}
                        <button
                          onClick={() => deleteHandler(seller._id)}
                          className="btn btn-danger"
                          style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                          disabled={actionLoading}
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
        )}
      </div>
    </div>
  );
};

export default SellersPage;
