import React, { useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import { Tag, Plus, CheckCircle2, Copy } from 'lucide-react';

const AdminPromotionsPage = () => {
  const [coupons, setCoupons] = useState([
    { code: 'SPHERE20', discount: '20% OFF', category: 'Electronics', validUntil: '2026-12-31', status: 'Active', uses: 142 },
    { code: 'FREESHIP', discount: 'FREE SHIPPING', category: 'All Orders', validUntil: '2026-09-30', status: 'Active', uses: 389 },
    { code: 'WELCOME10', discount: '10% OFF', category: 'First Purchase', validUntil: '2026-11-15', status: 'Active', uses: 890 },
  ]);

  const [code, setCode] = useState('');
  const [discount, setDiscount] = useState('');
  const [category, setCategory] = useState('All Orders');

  const handleCreateCoupon = (e) => {
    e.preventDefault();
    if (!code || !discount) return;
    setCoupons([
      ...coupons,
      { code: code.toUpperCase(), discount, category, validUntil: '2026-12-31', status: 'Active', uses: 0 }
    ]);
    setCode('');
    setDiscount('');
    alert(`Promotion Coupon ${code.toUpperCase()} created successfully!`);
  };

  const copyCouponCode = (couponCode) => {
    navigator.clipboard.writeText(couponCode);
    alert(`Copied "${couponCode}" to clipboard!`);
  };

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - var(--header-height))', backgroundColor: '#F6F7F9' }}>
      <AdminSidebar />

      <div style={{ flex: 1, padding: '2rem 2.5rem', overflowY: 'auto' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#111827', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Tag color="#FFB000" /> Promotions & Coupon Management
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#6b7280', margin: '0.2rem 0 0 0' }}>
            Manage active store discount codes, flash deal banners, and promotional campaigns.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
          {/* Left: Create Coupon Form */}
          <div style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '8px', border: '1px solid #E5E7EB', height: 'fit-content' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1.2rem', color: '#111827', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Plus size={18} color="#067D62" /> Create Promo Coupon
            </h2>

            <form onSubmit={handleCreateCoupon}>
              <div className="form-group">
                <label className="form-label">Coupon Code</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. FLASH50"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Discount Value</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. 15% OFF or $20 OFF"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Target Category</label>
                <select className="form-control" value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option value="All Orders">All Orders</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Accessories">Accessories</option>
                </select>
              </div>

              <button type="submit" className="btn btn-primary btn-block" style={{ backgroundColor: '#FFB000', border: 'none', color: '#111827', fontWeight: '700', marginTop: '1rem' }}>
                Deploy Promotion Code
              </button>
            </form>
          </div>

          {/* Right: Coupons List */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #E5E7EB', overflow: 'hidden' }}>
            <div style={{ padding: '1.2rem 1.5rem', borderBottom: '1px solid #E5E7EB', backgroundColor: '#F9FAFB' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '700', margin: 0 }}>Active Store Campaigns</h3>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #E5E7EB', color: '#374151', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.5px' }}>
                  <th style={{ padding: '0.8rem 1.2rem', textAlign: 'left' }}>Code</th>
                  <th style={{ padding: '0.8rem 1.2rem', textAlign: 'left' }}>Discount</th>
                  <th style={{ padding: '0.8rem 1.2rem', textAlign: 'left' }}>Target</th>
                  <th style={{ padding: '0.8rem 1.2rem', textAlign: 'left' }}>Redemptions</th>
                  <th style={{ padding: '0.8rem 1.2rem', textAlign: 'left' }}>Status</th>
                  <th style={{ padding: '0.8rem 1.2rem', textAlign: 'right' }}>Copy</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((cpn, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #E5E7EB' }}>
                    <td style={{ padding: '1rem 1.2rem', fontWeight: '700', color: '#111827' }}>
                      <span style={{ backgroundColor: '#eff6ff', color: '#2563eb', padding: '0.2rem 0.6rem', borderRadius: '4px', border: '1px border-dashed #bfdbfe' }}>
                        {cpn.code}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.2rem', fontWeight: '700', color: '#067d62' }}>{cpn.discount}</td>
                    <td style={{ padding: '1rem 1.2rem', color: '#4b5563' }}>{cpn.category}</td>
                    <td style={{ padding: '1rem 1.2rem', fontWeight: '600' }}>{cpn.uses} uses</td>
                    <td style={{ padding: '1rem 1.2rem' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: '#067d62', fontWeight: '700', fontSize: '0.75rem' }}>
                        <CheckCircle2 size={14} /> {cpn.status}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.2rem', textAlign: 'right' }}>
                      <button onClick={() => copyCouponCode(cpn.code)} className="btn btn-secondary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}>
                        <Copy size={12} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPromotionsPage;
