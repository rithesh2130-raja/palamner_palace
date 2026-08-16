import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Sparkles, Users, Video, DollarSign, Heart, CheckCircle2, Play, Plus, Share2 } from 'lucide-react';

const CreatorProfilePage = () => {
  const { username } = useParams();
  const [creatorData, setCreatorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('reels');
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const fetchCreator = async () => {
      try {
        const targetUser = username || 'techcreator';
        const res = await fetch(`/api/creators/${targetUser}`);
        if (res.ok) {
          const data = await res.json();
          setCreatorData(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCreator();
  }, [username]);

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }

  const user = creatorData?.user || {
    name: 'Alex TechCreator',
    username: 'techcreator',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    bio: 'Unboxing the future of tech accessories & setup gadgets 🎧⚡',
    followersCount: 14200,
    followingCount: 120,
  };

  const profile = creatorData?.profile || {
    totalViews: 85400,
    totalLikes: 6400,
    totalEarnings: 820.50,
  };

  const reels = creatorData?.reels || [];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      
      {/* Creator Header Banner */}
      <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: '12px', padding: '2rem', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <img
            src={user.avatar}
            alt={user.name}
            style={{ width: '110px', height: '110px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #FFB000' }}
          />

          <div style={{ flex: 1, minWidth: '260px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <h1 style={{ fontSize: '1.6rem', fontWeight: '800', margin: 0, color: 'var(--text-primary)' }}>
                {user.name}
              </h1>
              <CheckCircle2 size={20} color="#067d62" />
            </div>

            <div style={{ fontSize: '0.9rem', color: '#2563eb', fontWeight: '700', marginTop: '0.2rem' }}>
              @{user.username || 'techcreator'}
            </div>

            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: '0.6rem 0', lineHeight: '1.4' }}>
              {user.bio}
            </p>

            {/* Metrics pills */}
            <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem', fontSize: '0.85rem' }}>
              <div>
                <strong style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>{(user.followersCount || 14200).toLocaleString()}</strong>
                <span style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.75rem' }}>Followers</span>
              </div>
              <div>
                <strong style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>{(profile.totalViews || 85400).toLocaleString()}</strong>
                <span style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.75rem' }}>Reel Views</span>
              </div>
              <div>
                <strong style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>{(profile.totalLikes || 6400).toLocaleString()}</strong>
                <span style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.75rem' }}>Total Likes</span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <button
              onClick={() => setIsFollowing(!isFollowing)}
              className="btn btn-primary"
              style={{
                backgroundColor: isFollowing ? 'var(--bg-card)' : '#FFB000',
                border: isFollowing ? '1px solid var(--border-color)' : 'none',
                color: isFollowing ? 'var(--text-primary)' : '#111827',
                fontWeight: '800',
                padding: '0.6rem 1.8rem',
              }}
            >
              {isFollowing ? 'Following' : 'Follow Creator'}
            </button>
            
            <Link to="/creator/create" className="btn btn-secondary" style={{ fontSize: '0.8rem', textAlign: 'center' }}>
              <Plus size={14} /> Upload Reel
            </Link>
          </div>
        </div>
      </div>

      {/* Tabs Bar */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '2px solid var(--border-color)', marginBottom: '2rem' }}>
        <button
          onClick={() => setActiveTab('reels')}
          style={{
            padding: '0.8rem 1.5rem',
            border: 'none',
            background: 'none',
            fontWeight: '800',
            fontSize: '0.95rem',
            color: activeTab === 'reels' ? '#FFB000' : 'var(--text-muted)',
            borderBottom: activeTab === 'reels' ? '3px solid #FFB000' : '3px solid transparent',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
          }}
        >
          <Video size={18} /> Creator Reels ({reels.length})
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          style={{
            padding: '0.8rem 1.5rem',
            border: 'none',
            background: 'none',
            fontWeight: '800',
            fontSize: '0.95rem',
            color: activeTab === 'analytics' ? '#FFB000' : 'var(--text-muted)',
            borderBottom: activeTab === 'analytics' ? '3px solid #FFB000' : '3px solid transparent',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
          }}
        >
          <DollarSign size={18} /> Earnings & Analytics
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'reels' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {reels.map((reel) => (
            <Link key={reel._id} to="/reels" style={{ textDecoration: 'none' }}>
              <div style={{
                position: 'relative',
                height: '380px',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-md)',
                backgroundImage: `url(${reel.thumbnailUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}>
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 50%)',
                  padding: '1.2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ backgroundColor: 'rgba(0,0,0,0.6)', color: '#ffffff', fontSize: '0.75rem', padding: '0.2rem 0.6rem', borderRadius: '12px', fontWeight: '700' }}>
                      {reel.category}
                    </span>
                    <Play size={20} fill="#ffffff" color="#ffffff" />
                  </div>

                  <div>
                    <div style={{ color: '#ffffff', fontWeight: '700', fontSize: '0.9rem', lineHeight: '1.3', marginBottom: '0.4rem' }}>
                      {reel.caption}
                    </div>
                    <div style={{ color: '#9ca3af', fontSize: '0.75rem', display: 'flex', gap: '0.8rem' }}>
                      <span>👀 {reel.views} views</span>
                      <span>❤️ {reel.likes ? reel.likes.length : 12}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {activeTab === 'analytics' && (
        <div style={{ backgroundColor: 'var(--bg-card)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '1.5rem' }}>Creator Affiliate Commissions Dashboard</h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            <div style={{ backgroundColor: '#ecfdf5', padding: '1.2rem', borderRadius: '8px', border: '1px solid #a7f3d0' }}>
              <span style={{ fontSize: '0.8rem', color: '#067d62', fontWeight: '700' }}>Total Commission Paid</span>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#067d62', marginTop: '0.4rem' }}>
                ${profile.totalEarnings ? profile.totalEarnings.toFixed(2) : '820.50'}
              </div>
            </div>

            <div style={{ backgroundColor: '#eff6ff', padding: '1.2rem', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
              <span style={{ fontSize: '0.8rem', color: '#1d4ed8', fontWeight: '700' }}>Pending Commission</span>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#1d4ed8', marginTop: '0.4rem' }}>
                $145.00
              </div>
            </div>

            <div style={{ backgroundColor: '#fffbe6', padding: '1.2rem', borderRadius: '8px', border: '1px solid #ffe58f' }}>
              <span style={{ fontSize: '0.8rem', color: '#d97706', fontWeight: '700' }}>Affiliate Conversion Rate</span>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#d97706', marginTop: '0.4rem' }}>
                4.8%
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatorProfilePage;
