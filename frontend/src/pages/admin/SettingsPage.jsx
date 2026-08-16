import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import { Save } from 'lucide-react';

const SettingsPage = () => {
  const [storeName, setStoreName] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [taxRate, setTaxRate] = useState(0);
  const [shippingRate, setShippingRate] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings');
        if (!res.ok) throw new Error('Failed to load store settings');
        const data = await res.json();
        
        setStoreName(data.storeName);
        setCurrency(data.currency);
        setTaxRate(data.taxRate);
        setShippingRate(data.shippingRate);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storeName,
          currency,
          taxRate,
          shippingRate,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to save settings');

      alert('Global store settings updated successfully!');
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - var(--header-height))', marginLeft: '-1.5rem', marginRight: '-1.5rem', marginTop: '-2rem', marginBottom: '-2rem' }}>
      <AdminSidebar />
      <div style={{ flex: 1, padding: '2rem 2.5rem', overflowY: 'auto' }}>
        <h1 style={{ marginBottom: '2rem', fontWeight: '700' }}>Store Settings & Configuration</h1>

        {loading ? (
          <div className="spinner-container">
            <div className="spinner"></div>
          </div>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : (
          <div className="form-container" style={{ margin: '0', maxWidth: '600px' }}>
            <form onSubmit={submitHandler}>
              <div className="form-group">
                <label className="form-label">Store Brand Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Currency Code</label>
                <select
                  className="form-control"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  required
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="INR">INR (₹)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Default Tax / GST Rate (%)</label>
                <input
                  type="number"
                  className="form-control"
                  value={taxRate}
                  onChange={(e) => setTaxRate(Number(e.target.value))}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Standard Shipping Charges ($)</label>
                <input
                  type="number"
                  className="form-control"
                  value={shippingRate}
                  onChange={(e) => setShippingRate(Number(e.target.value))}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary btn-block" style={{ marginTop: '1rem' }} disabled={submitLoading}>
                <Save size={16} /> {submitLoading ? 'Saving Settings...' : 'Save Configuration'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;
