import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import { MessageSquare, Star, CheckCircle, AlertTriangle, Trash2, Search, Filter } from 'lucide-react';

const AdminReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterRating, setFilterRating] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Fetch products to aggregate all customer reviews
    const fetchReviews = async () => {
      try {
        const res = await fetch('/api/products');
        if (res.ok) {
          const products = await res.json();
          const allReviews = [];
          products.forEach((p) => {
            if (p.reviews && p.reviews.length > 0) {
              p.reviews.forEach((r) => {
                allReviews.push({
                  ...r,
                  productName: p.name,
                  productId: p._id,
                  productImage: p.image,
                  status: r.status || 'Published',
                });
              });
            }
          });
          setReviews(allReviews);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  const handleStatusToggle = (reviewId) => {
    setReviews((prev) =>
      prev.map((r) =>
        r._id === reviewId
          ? { ...r, status: r.status === 'Published' ? 'Flagged' : 'Published' }
          : r
      )
    );
  };

  const handleDeleteReview = (reviewId) => {
    if (window.confirm('Are you sure you want to delete this customer review?')) {
      setReviews((prev) => prev.filter((r) => r._id !== reviewId));
    }
  };

  const filteredReviews = reviews.filter((r) => {
    const matchesRating = filterRating === 'All' || r.rating === Number(filterRating);
    const matchesSearch =
      r.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.productName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRating && matchesSearch;
  });

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - var(--header-height))', backgroundColor: '#F6F7F9' }}>
      <AdminSidebar />

      <div style={{ flex: 1, padding: '2rem 2.5rem', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#111827', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MessageSquare color="#FFB000" /> Customer Reviews Moderation
            </h1>
            <p style={{ fontSize: '0.85rem', color: '#6b7280', margin: '0.2rem 0 0 0' }}>
              Monitor, approve, flag, or delete customer ratings across all active catalog items.
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#ffffff', border: '1px solid #E5E7EB', borderRadius: '6px', padding: '0.4rem 0.8rem', gap: '0.5rem' }}>
              <Search size={16} color="#9ca3af" />
              <input
                type="text"
                placeholder="Search reviews..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ border: 'none', outline: 'none', fontSize: '0.85rem' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#ffffff', border: '1px solid #E5E7EB', borderRadius: '6px', padding: '0.4rem 0.8rem', gap: '0.5rem' }}>
              <Filter size={16} color="#9ca3af" />
              <select
                value={filterRating}
                onChange={(e) => setFilterRating(e.target.value)}
                style={{ border: 'none', outline: 'none', fontSize: '0.85rem', cursor: 'pointer', backgroundColor: 'transparent' }}
              >
                <option value="All">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="spinner-container">
            <div className="spinner"></div>
          </div>
        ) : filteredReviews.length === 0 ? (
          <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #E5E7EB', padding: '3rem', textAlign: 'center', color: '#6b7280' }}>
            No customer reviews match the selected filter parameters.
          </div>
        ) : (
          <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #E5E7EB', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAling: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB', color: '#374151', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.5px' }}>
                  <th style={{ padding: '0.8rem 1.2rem' }}>Product</th>
                  <th style={{ padding: '0.8rem 1.2rem' }}>Customer</th>
                  <th style={{ padding: '0.8rem 1.2rem' }}>Rating</th>
                  <th style={{ padding: '0.8rem 1.2rem', width: '35%' }}>Comment</th>
                  <th style={{ padding: '0.8rem 1.2rem' }}>Status</th>
                  <th style={{ padding: '0.8rem 1.2rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredReviews.map((rev) => (
                  <tr key={rev._id} style={{ borderBottom: '1px solid #E5E7EB' }}>
                    <td style={{ padding: '1rem 1.2rem', fontWeight: '600', color: '#111827' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <img src={rev.productImage} alt="" style={{ width: '36px', height: '36px', objectFit: 'contain', backgroundColor: '#f9f9f9', borderRadius: '4px' }} />
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '180px' }}>{rev.productName}</span>
                      </div>
                    </td>
                    <td style={{ padding: '1rem 1.2rem', fontWeight: '500' }}>{rev.name}</td>
                    <td style={{ padding: '1rem 1.2rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#f59e0b', fontWeight: '700' }}>
                        <Star size={14} fill="#f59e0b" /> {rev.rating}/5
                      </div>
                    </td>
                    <td style={{ padding: '1rem 1.2rem', color: '#4b5563', lineHeight: '1.4' }}>
                      "{rev.comment}"
                    </td>
                    <td style={{ padding: '1rem 1.2rem' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        padding: '0.2rem 0.6rem',
                        borderRadius: '12px',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        backgroundColor: rev.status === 'Published' ? '#ecfdf5' : '#fef2f2',
                        color: rev.status === 'Published' ? '#067d62' : '#c40000',
                      }}>
                        {rev.status === 'Published' ? <CheckCircle size={12} /> : <AlertTriangle size={12} />}
                        {rev.status}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.2rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                        <button
                          onClick={() => handleStatusToggle(rev._id)}
                          className="btn btn-secondary"
                          style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}
                        >
                          {rev.status === 'Published' ? 'Flag' : 'Publish'}
                        </button>
                        <button
                          onClick={() => handleDeleteReview(rev._id)}
                          className="btn btn-danger"
                          style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}
                        >
                          <Trash2 size={14} />
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

export default AdminReviewsPage;
