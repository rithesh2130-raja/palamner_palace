import React, { useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import { Users, CheckCircle2, DollarSign, Video, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminCreatorsPage = () => {
  const [creators, setCreators] = useState([
    { id: '1', name: 'Alex TechCreator', username: 'techcreator', followers: '14.2K', views: '85.4K', earnings: '$820.50', status: 'Verified' },
    { id: '2', name: 'Sarah SetupGirl', username: 'gadgetgirl', followers: '28.9K', views: '142.0K', earnings: '$1,450.00', status: 'Verified' },
  ]);

  const toggleVerification = (id) => {
    setCreators((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: c.status === 'Verified' ? 'Pending' : 'Verified' } : c))
    );
  };

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - var(--header-height))', backgroundColor: '#F6F7F9' }}>
      <AdminSidebar />

      <div style={{ flex: 1, padding: '2rem 2.5rem', overflowY: 'auto' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#111827', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Users color="#FFB000" /> Creator Economy & Verification Management
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#6b7280', margin: '0.2rem 0 0 0' }}>
            Manage registered ShopSphere creators, verify creator badges, and audit follower engagement.
          </p>
        </div>

        <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #E5E7EB', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB', color: '#374151', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.5px' }}>
                <th style={{ padding: '0.8rem 1.2rem', textAlign: 'left' }}>Creator</th>
                <th style={{ padding: '0.8rem 1.2rem', textAlign: 'left' }}>Followers</th>
                <th style={{ padding: '0.8rem 1.2rem', textAlign: 'left' }}>Reel Views</th>
                <th style={{ padding: '0.8rem 1.2rem', textAlign: 'left' }}>Affiliate Earnings</th>
                <th style={{ padding: '0.8rem 1.2rem', textAlign: 'left' }}>Status</th>
                <th style={{ padding: '0.8rem 1.2rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {creators.map((c) => (
                <tr key={c.id} style={{ borderBottom: '1px solid #E5E7EB' }}>
                  <td style={{ padding: '1rem 1.2rem', fontWeight: '700', color: '#111827' }}>
                    <div>
                      {c.name}
                      <span style={{ display: 'block', fontSize: '0.75rem', color: '#2563eb', fontWeight: '600' }}>@{c.username}</span>
                    </div>
                  </td>
                  <td style={{ padding: '1rem 1.2rem', fontWeight: '600' }}>{c.followers}</td>
                  <td style={{ padding: '1rem 1.2rem', fontWeight: '600' }}>{c.views}</td>
                  <td style={{ padding: '1rem 1.2rem', fontWeight: '800', color: '#067d62' }}>{c.earnings}</td>
                  <td style={{ padding: '1rem 1.2rem' }}>
                    <span style={{ backgroundColor: c.status === 'Verified' ? '#ecfdf5' : '#fffbe6', color: c.status === 'Verified' ? '#067d62' : '#d97706', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                      <CheckCircle2 size={12} /> {c.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.2rem', textAlign: 'right' }}>
                    <button onClick={() => toggleVerification(c.id)} className="btn btn-secondary" style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}>
                      {c.status === 'Verified' ? 'Unverify' : 'Verify'}
                    </button>
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

export default AdminCreatorsPage;
