import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import { Video, Play, CheckCircle, AlertTriangle, Trash2, Eye, ExternalLink, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminReelsPage = () => {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReels = async () => {
      try {
        const res = await fetch('/api/reels/feed');
        if (res.ok) {
          const data = await res.json();
          setReels(data.reels || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReels();
  }, []);

  const handleStatusToggle = (reelId) => {
    setReels((prev) =>
      prev.map((r) =>
        r._id === reelId
          ? { ...r, status: r.status === 'Approved' ? 'Flagged' : 'Approved' }
          : r
      )
    );
  };

  const handleDeleteReel = (reelId) => {
    if (window.confirm('Are you sure you want to delete this Reel from discovery feed?')) {
      setReels((prev) => prev.filter((r) => r._id !== reelId));
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - var(--header-height))', backgroundColor: '#F6F7F9' }}>
      <AdminSidebar />

      <div style={{ flex: 1, padding: '2rem 2.5rem', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#111827', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Video color="#FFB000" /> Video Reels Content Moderation
            </h1>
            <p style={{ fontSize: '0.85rem', color: '#6b7280', margin: '0.2rem 0 0 0' }}>
              Review published short-form video Reels, tagged products, view counts, and community compliance.
            </p>
          </div>

          <Link to="/creator/create" className="btn btn-primary" style={{ backgroundColor: '#FFB000', border: 'none', color: '#111827', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.4rem', textDecoration: 'none' }}>
            <Sparkles size={16} /> Auto-Generate Reel with Gemini Omni
          </Link>
        </div>

        {loading ? (
          <div className="spinner-container">
            <div className="spinner"></div>
          </div>
        ) : (
          <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #E5E7EB', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB', color: '#374151', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.5px' }}>
                  <th style={{ padding: '0.8rem 1.2rem', textAlign: 'left' }}>Video / Caption</th>
                  <th style={{ padding: '0.8rem 1.2rem', textAlign: 'left' }}>Creator</th>
                  <th style={{ padding: '0.8rem 1.2rem', textAlign: 'left' }}>Category</th>
                  <th style={{ padding: '0.8rem 1.2rem', textAlign: 'left' }}>Views</th>
                  <th style={{ padding: '0.8rem 1.2rem', textAlign: 'left' }}>Status</th>
                  <th style={{ padding: '0.8rem 1.2rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reels.map((r) => (
                  <tr key={r._id} style={{ borderBottom: '1px solid #E5E7EB' }}>
                    <td style={{ padding: '1rem 1.2rem', fontWeight: '600', color: '#111827' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                        <div style={{ position: 'relative', width: '50px', height: '65px', borderRadius: '6px', overflow: 'hidden', backgroundColor: '#000' }}>
                          <img src={r.thumbnailUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          <Play size={14} fill="#ffffff" color="#ffffff" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
                        </div>
                        <div style={{ maxWidth: '280px' }}>
                          <div style={{ fontSize: '0.85rem', fontWeight: '700', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.caption}</div>
                          <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{(r.products || []).length} tagged products</span>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1rem 1.2rem', fontWeight: '600' }}>
                      @{r.creator ? r.creator.username || 'techcreator' : 'techcreator'}
                    </td>
                    <td style={{ padding: '1rem 1.2rem' }}>
                      <span style={{ backgroundColor: '#eff6ff', color: '#2563eb', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '700' }}>
                        {r.category}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.2rem', fontWeight: '700' }}>{r.views || 12400}</td>
                    <td style={{ padding: '1rem 1.2rem' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        padding: '0.2rem 0.6rem',
                        borderRadius: '12px',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        backgroundColor: r.status === 'Approved' ? '#ecfdf5' : '#fef2f2',
                        color: r.status === 'Approved' ? '#067d62' : '#c40000',
                      }}>
                        {r.status === 'Approved' ? <CheckCircle size={12} /> : <AlertTriangle size={12} />}
                        {r.status || 'Approved'}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.2rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                        <Link to="/reels" className="btn btn-secondary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}>
                          <Eye size={12} /> View
                        </Link>
                        <button
                          onClick={() => handleStatusToggle(r._id)}
                          className="btn btn-secondary"
                          style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}
                        >
                          {r.status === 'Approved' ? 'Flag' : 'Approve'}
                        </button>
                        <button
                          onClick={() => handleDeleteReel(r._id)}
                          className="btn btn-danger"
                          style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}
                        >
                          <Trash2 size={12} />
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

export default AdminReelsPage;
