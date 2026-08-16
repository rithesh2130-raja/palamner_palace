import React, { useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import { Truck, Check, RefreshCw } from 'lucide-react';

const AdminShippingPage = () => {
  const [shippingRates, setShippingRates] = useState([
    { zone: 'North America (US & CA)', standard: '$10.00', express: '$25.00', freeThreshold: '$50.00', status: 'Active' },
    { zone: 'European Union (EU)', standard: '$15.00', express: '$35.00', freeThreshold: '$75.00', status: 'Active' },
    { zone: 'Asia-Pacific (APAC)', standard: '$12.00', express: '$30.00', freeThreshold: '$60.00', status: 'Active' },
    { zone: 'Rest of World', standard: '$25.00', express: '$50.00', freeThreshold: '$120.00', status: 'Active' },
  ]);

  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      alert('Shipping parameters and rate tables saved successfully!');
    }, 600);
  };

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - var(--header-height))', backgroundColor: '#F6F7F9' }}>
      <AdminSidebar />

      <div style={{ flex: 1, padding: '2rem 2.5rem', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#111827', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Truck color="#FFB000" /> Shipping & Fulfillment Settings
            </h1>
            <p style={{ fontSize: '0.85rem', color: '#6b7280', margin: '0.2rem 0 0 0' }}>
              Configure global dispatch zones, flat delivery rates, and carrier integrations.
            </p>
          </div>

          <button onClick={handleSave} className="btn btn-primary" style={{ backgroundColor: '#FFB000', border: 'none', color: '#111827', fontWeight: '700' }} disabled={saving}>
            {saving ? <RefreshCw className="animate-spin" size={16} /> : <Check size={16} />} Save Changes
          </button>
        </div>

        <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #E5E7EB', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ padding: '1.2rem 1.5rem', borderBottom: '1px solid #E5E7EB', backgroundColor: '#F9FAFB' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '700', margin: 0 }}>Global Dispatch Zone Matrix</h3>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #E5E7EB', color: '#374151', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.5px' }}>
                <th style={{ padding: '0.8rem 1.2rem', textAlign: 'left' }}>Geographic Zone</th>
                <th style={{ padding: '0.8rem 1.2rem', textAlign: 'left' }}>Standard Freight</th>
                <th style={{ padding: '0.8rem 1.2rem', textAlign: 'left' }}>Express Expedited</th>
                <th style={{ padding: '0.8rem 1.2rem', textAlign: 'left' }}>Free Delivery Threshold</th>
                <th style={{ padding: '0.8rem 1.2rem', textAlign: 'left' }}>Carrier Status</th>
              </tr>
            </thead>
            <tbody>
              {shippingRates.map((rate, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #E5E7EB' }}>
                  <td style={{ padding: '1rem 1.2rem', fontWeight: '700', color: '#111827' }}>{rate.zone}</td>
                  <td style={{ padding: '1rem 1.2rem', fontWeight: '600' }}>{rate.standard}</td>
                  <td style={{ padding: '1rem 1.2rem', fontWeight: '600', color: '#2563eb' }}>{rate.express}</td>
                  <td style={{ padding: '1rem 1.2rem', fontWeight: '700', color: '#067d62' }}>Over {rate.freeThreshold}</td>
                  <td style={{ padding: '1rem 1.2rem' }}>
                    <span style={{ backgroundColor: '#ecfdf5', color: '#067d62', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '700' }}>
                      {rate.status}
                    </span>
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

export default AdminShippingPage;
