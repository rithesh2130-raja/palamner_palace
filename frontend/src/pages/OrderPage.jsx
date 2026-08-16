import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { CheckCircle2, AlertCircle, Truck, CheckCircle } from 'lucide-react';

const OrderPage = () => {
  const { id } = useParams();
  const { userInfo } = useContext(UserContext);

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [actionLoading, setActionLoading] = useState(false);

  const fetchOrder = async () => {
    try {
      const res = await fetch(`/api/orders/${id}`);
      if (!res.ok) throw new Error('Order not found');
      const data = await res.json();
      setOrder(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const payOrderHandler = async () => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/orders/${id}/pay`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error('Payment simulation failed');
      fetchOrder();
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const deliverOrderHandler = async () => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/orders/${id}/deliver`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error('Mark as delivered failed');
      fetchOrder();
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

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

  // Determine active stages for visual stepper
  const isCancelled = order.status === 'Cancelled';
  const stages = [
    { label: 'Order Placed', active: true },
    { label: 'Confirmed', active: order.status === 'Processing' || order.status === 'Delivered' },
    { label: 'Shipped', active: order.status === 'Processing' || order.status === 'Delivered' },
    { label: 'Delivered', active: order.status === 'Delivered' },
  ];

  return (
    <div>
      <h1 style={{ marginBottom: '1.5rem', fontWeight: '700' }}>
        Order Details
      </h1>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '2rem' }}>
        ID: {order._id} | Registered on: {new Date(order.createdAt).toLocaleDateString()}
      </p>

      {/* Stepper Pipeline */}
      {isCancelled ? (
        <div className="alert alert-danger" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 1.5rem', borderRadius: '6px', marginBottom: '2.5rem' }}>
          <AlertCircle size={20} />
          <strong>This order was Cancelled. No further delivery stages are tracked.</strong>
        </div>
      ) : (
        <div style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--border-radius-md)',
          padding: '1.5rem 2rem',
          marginBottom: '2.5rem',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Truck size={16} color="var(--secondary)" /> Shipment Tracking pipeline
          </h3>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
            {/* Background progress bar line */}
            <div style={{
              position: 'absolute',
              top: '18px',
              left: '5%',
              right: '5%',
              height: '4px',
              backgroundColor: '#e5e7eb',
              zIndex: 1,
            }}>
              <div style={{
                height: '100%',
                width: order.status === 'Delivered' ? '100%' : order.status === 'Processing' ? '66%' : '0%',
                backgroundColor: 'var(--success)',
                transition: 'width 0.4s ease'
              }}></div>
            </div>

            {stages.map((stage, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2, flex: 1 }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: stage.active ? 'var(--success)' : '#ffffff',
                  border: `3px solid ${stage.active ? 'var(--success)' : '#d1d5db'}`,
                  color: stage.active ? '#ffffff' : '#9ca3af',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '700',
                  fontSize: '0.9rem',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.08)'
                }}>
                  {stage.active ? <CheckCircle size={18} /> : idx + 1}
                </div>
                <span style={{
                  fontSize: '0.8rem',
                  fontWeight: stage.active ? '700' : '500',
                  color: stage.active ? 'var(--text-dark)' : 'var(--text-muted)',
                  marginTop: '0.5rem',
                  textAlign: 'center'
                }}>
                  {stage.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Order Info layout */}
      <div className="order-layout">
        <div>
          {/* Shipping Address info */}
          <div className="order-details-card">
            <h2 className="order-section-title">Shipping Address</h2>
            <p style={{ marginBottom: '0.8rem' }}>
              <strong>Name: </strong> {order.user ? order.user.name : 'Unknown User'}
            </p>
            <p style={{ marginBottom: '0.8rem' }}>
              <strong>Email: </strong>{' '}
              {order.user ? <a href={`mailto:${order.user.email}`}>{order.user.email}</a> : 'No Email'}
            </p>
            <p style={{ marginBottom: '1rem' }}>
              <strong>Address: </strong> {order.shippingAddress.address},{' '}
              {order.shippingAddress.city}, {order.shippingAddress.postalCode},{' '}
              {order.shippingAddress.country}
            </p>

            {order.isDelivered ? (
              <div className="alert alert-success">
                <CheckCircle2 size={16} /> Delivered on{' '}
                {new Date(order.deliveredAt).toLocaleString()}
              </div>
            ) : (
              <div className="alert alert-danger">
                <AlertCircle size={16} /> Not Delivered (Dispatch stage: {order.status})
              </div>
            )}
          </div>

          {/* Payment Method info */}
          <div className="order-details-card">
            <h2 className="order-section-title">Payment details</h2>
            <p style={{ marginBottom: '1rem' }}>
              <strong>Method: </strong> {order.paymentMethod}
            </p>

            {order.isPaid ? (
              <div className="alert alert-success">
                <CheckCircle2 size={16} /> Paid on{' '}
                {new Date(order.paidAt).toLocaleString()}
              </div>
            ) : (
              <div className="alert alert-danger">
                <AlertCircle size={16} /> Not Paid
              </div>
            )}
          </div>

          {/* Order Items info */}
          <div className="order-details-card">
            <h2 className="order-section-title">Ordered Products</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {order.orderItems.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    justifyContent: 'space-between',
                    borderBottom: idx === order.orderItems.length - 1 ? 'none' : '1px solid var(--border-color)',
                    paddingBottom: '0.8rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{ width: '50px', height: '50px', objectFit: 'contain', borderRadius: '4px', backgroundColor: '#f7fafc' }}
                    />
                    <Link to={`/product/${item.product}`} style={{ fontWeight: '500', fontSize: '0.95rem', color: 'var(--secondary)', textDecoration: 'none' }}>
                      {item.name}
                    </Link>
                  </div>
                  <div style={{ fontWeight: '600', minWidth: '100px', textAlign: 'right' }}>
                    {item.qty} x ${item.price.toFixed(2)} = ${(item.qty * item.price).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order pricing summary side card */}
        <div>
          <div className="cart-summary-box">
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
              Order Pricing Summary
            </h2>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Items:</span>
              <span>${order.itemsPrice.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Shipping:</span>
              <span>${order.shippingPrice.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Tax (15%):</span>
              <span>${order.taxPrice.toFixed(2)}</span>
            </div>
            <div style={{ height: '1px', backgroundColor: 'var(--border-color)' }}></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '700', fontSize: '1.2rem' }}>
              <span>Total:</span>
              <span>${order.totalPrice.toFixed(2)}</span>
            </div>

            {/* Pay Simulation button */}
            {!order.isPaid && (
              <button
                onClick={payOrderHandler}
                className="btn btn-primary btn-block"
                disabled={actionLoading}
                style={{ backgroundColor: 'var(--accent)', border: 'none', color: '#111827', fontWeight: '700', marginTop: '1rem' }}
              >
                {actionLoading ? 'Processing...' : 'Pay Order (Simulation)'}
              </button>
            )}

            {/* Deliver Order (Admin only) button */}
            {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
              <button
                onClick={deliverOrderHandler}
                className="btn btn-secondary btn-block"
                disabled={actionLoading}
                style={{ marginTop: '1rem' }}
              >
                {actionLoading ? 'Processing...' : 'Mark as Delivered'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
