import React from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import { DollarSign, TrendingUp, ShoppingBag, Video, ArrowDown } from 'lucide-react';

const AdminAffiliatePage = () => {
  const funnel = [
    { stage: '1. Reel Video Views', count: '1,240,000', rate: '100%' },
    { stage: '2. Product Drawer Clicks', count: '148,000', rate: '11.9%' },
    { stage: '3. Add to Cart from Reel', count: '38,500', rate: '26.0%' },
    { stage: '4. Completed Orders', count: '18,400', rate: '47.8%' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - var(--header-height))', backgroundColor: '#F6F7F9' }}>
      <AdminSidebar />

      <div style={{ flex: 1, padding: '2rem 2.5rem', overflowY: 'auto' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#111827', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <DollarSign color="#FFB000" /> Affiliate Payouts & Social Funnel Analytics
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#6b7280', margin: '0.2rem 0 0 0' }}>
            Analyze conversion funnels from Reel views to completed orders, and audit creator commissions.
          </p>
        </div>

        {/* Funnel Overview */}
        <div style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '8px', border: '1px solid #E5E7EB', marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '1.2rem', color: '#111827' }}>Social-Commerce Conversion Funnel</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            {funnel.map((f, i) => (
              <div key={i} style={{ backgroundColor: '#F9FAFB', padding: '1rem', borderRadius: '6px', border: '1px solid #E5E7EB' }}>
                <span style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: '700' }}>{f.stage}</span>
                <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#111827', margin: '0.3rem 0' }}>{f.count}</div>
                <span style={{ fontSize: '0.75rem', color: '#067d62', fontWeight: '800' }}>Stage Conv: {f.rate}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAffiliatePage;
