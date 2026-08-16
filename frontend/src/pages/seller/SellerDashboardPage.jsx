import React, { useState, useEffect } from 'react';
import { Store, Plus, CheckCircle2, TrendingUp, Users, DollarSign, Tag } from 'lucide-react';

const SellerDashboardPage = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [commissionRate, setCommissionRate] = useState(15);
  const [budget, setBudget] = useState(1500);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await fetch('/api/campaigns');
        if (res.ok) {
          const data = await res.json();
          setCampaigns(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaigns();
  }, []);

  const handleCreateCampaign = async (e) => {
    e.preventDefault();
    if (!name) return;

    try {
      const res = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          commissionRate: Number(commissionRate),
          budget: Number(budget),
        }),
      });

      if (res.ok) {
        const created = await res.json();
        setCampaigns([...campaigns, created]);
        setName('');
        alert('Seller Creator Campaign deployed successfully!');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Store color="#FFB000" size={28} /> Seller Operations & Creator Marketplace
        </h1>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: '0.3rem 0 0 0' }}>
          Collaborate with top creators, launch viral Reel promotion campaigns, and track creator-driven revenue.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        
        {/* Create Campaign Form */}
        <div style={{ backgroundColor: 'var(--bg-card)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)', height: 'fit-content' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Plus size={18} color="#067d62" /> Launch Creator Campaign
          </h2>

          <form onSubmit={handleCreateCampaign}>
            <div className="form-group">
              <label className="form-label">Campaign Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Summer Gaming Headphone Launch"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Creator Commission Rate (%)</label>
              <input
                type="number"
                className="form-control"
                value={commissionRate}
                onChange={(e) => setCommissionRate(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Campaign Budget ($)</label>
              <input
                type="number"
                className="form-control"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary btn-block" style={{ backgroundColor: '#FFB000', border: 'none', color: '#111827', fontWeight: '800', height: '44px', marginTop: '1rem' }}>
              Deploy Campaign to Creators
            </button>
          </form>
        </div>

        {/* Active Campaigns Table */}
        <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
          <div style={{ padding: '1.2rem 1.5rem', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '700', margin: 0 }}>Active Creator Promotional Campaigns</h3>
          </div>

          {loading ? (
            <div className="spinner-container">
              <div className="spinner"></div>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.5px' }}>
                  <th style={{ padding: '0.8rem 1.2rem', textAlign: 'left' }}>Campaign</th>
                  <th style={{ padding: '0.8rem 1.2rem', textAlign: 'left' }}>Commission</th>
                  <th style={{ padding: '0.8rem 1.2rem', textAlign: 'left' }}>Budget</th>
                  <th style={{ padding: '0.8rem 1.2rem', textAlign: 'left' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((c) => (
                  <tr key={c._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1rem 1.2rem', fontWeight: '700', color: 'var(--text-primary)' }}>{c.name}</td>
                    <td style={{ padding: '1rem 1.2rem', fontWeight: '800', color: '#067d62' }}>{c.commissionRate}% Commission</td>
                    <td style={{ padding: '1rem 1.2rem', fontWeight: '600' }}>${c.budget}</td>
                    <td style={{ padding: '1rem 1.2rem' }}>
                      <span style={{ backgroundColor: '#ecfdf5', color: '#067d62', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '700' }}>
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerDashboardPage;
