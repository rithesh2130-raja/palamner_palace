import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { Eye } from 'lucide-react';

const ProfilePage = () => {
  const { userInfo, login } = useContext(UserContext);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState(null);

  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name);
      setEmail(userInfo.email);
    }
  }, [userInfo]);

  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        const res = await fetch('/api/orders/myorders');
        if (!res.ok) throw new Error('Could not fetch orders');
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        setOrdersError(err.message);
      } finally {
        setOrdersLoading(false);
      }
    };
    fetchMyOrders();
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setUpdateError('Passwords do not match');
      return;
    }

    setUpdateLoading(true);
    setUpdateError(null);
    setUpdateSuccess(false);

    try {
      const res = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Update failed');

      login(data);
      setUpdateSuccess(true);
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      setUpdateError(err.message);
    } finally {
      setUpdateLoading(false);
    }
  };

  return (
    <div className="profile-layout">
      {/* Update Info Form */}
      <div>
        <h2 style={{ marginBottom: '1.5rem', fontWeight: '700' }}>User Profile</h2>
        
        {updateError && <div className="alert alert-danger">{updateError}</div>}
        {updateSuccess && <div className="alert alert-success">Profile Updated Successfully</div>}

        <form onSubmit={submitHandler} style={{ backgroundColor: 'var(--bg-card)', padding: '1.5rem', borderRadius: 'var(--border-radius-md)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
          <div className="form-group">
            <label className="form-label">Name</label>
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary btn-block" disabled={updateLoading}>
            {updateLoading ? 'Updating...' : 'Update Profile'}
          </button>
        </form>
      </div>

      {/* Orders History list */}
      <div>
        <h2 style={{ marginBottom: '1.5rem', fontWeight: '700' }}>My Orders</h2>
        
        {ordersLoading ? (
          <div className="spinner-container">
            <div className="spinner"></div>
          </div>
        ) : ordersError ? (
          <div className="alert alert-danger">{ordersError}</div>
        ) : orders.length === 0 ? (
          <div className="alert alert-info">You have no orders yet.</div>
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>DATE</th>
                  <th>TOTAL</th>
                  <th>PAID</th>
                  <th>DELIVERED</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td style={{ fontWeight: '600' }}>{order._id.substring(0, 10)}...</td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td style={{ fontWeight: '600' }}>${order.totalPrice.toFixed(2)}</td>
                    <td>
                      {order.isPaid ? (
                        <span className="badge badge-success">
                          Paid
                        </span>
                      ) : (
                        <span className="badge badge-danger">Not Paid</span>
                      )}
                    </td>
                    <td>
                      {order.isDelivered ? (
                        <span className="badge badge-success">
                          Delivered
                        </span>
                      ) : (
                        <span className="badge badge-warning">Pending</span>
                      )}
                    </td>
                    <td>
                      <Link to={`/order/${order._id}`} className="btn btn-secondary btn-block" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                        <Eye size={12} /> Details
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
  );
};

export default ProfilePage;
