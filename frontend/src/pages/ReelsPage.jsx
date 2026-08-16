import React, { useState, useEffect, useRef } from 'react';
import ReelPlayer from '../components/reels/ReelPlayer';
import { Sparkles, RefreshCw } from 'lucide-react';

const ReelsPage = () => {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('For You');
  const [activeReelIndex, setActiveReelIndex] = useState(0);

  const containerRef = useRef(null);
  const categories = ['For You', 'Following', 'Trending', 'Gaming', 'Electronics', 'Accessories', 'Deals'];

  const fetchFeed = async () => {
    setLoading(true);
    try {
      let url = `/api/reels/feed`;
      if (activeCategory !== 'For You' && activeCategory !== 'Trending') {
        url += `?category=${activeCategory}`;
      }
      const res = await fetch(url);
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

  useEffect(() => {
    fetchFeed();
  }, [activeCategory]);

  const handleScroll = () => {
    if (containerRef.current) {
      const scrollTop = containerRef.current.scrollTop;
      const height = containerRef.current.clientHeight;
      const index = Math.round(scrollTop / height);
      if (index !== activeReelIndex && index >= 0 && index < reels.length) {
        setActiveReelIndex(index);
      }
    }
  };

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: 'calc(100vh - var(--header-height) - 60px)',
      backgroundColor: '#0a0a0a',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      
      {/* Top Floating Category Filters */}
      <div style={{
        position: 'absolute',
        top: '15px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 50,
        display: 'flex',
        gap: '0.5rem',
        backgroundColor: 'rgba(0,0,0,0.65)',
        padding: '0.4rem 0.8rem',
        borderRadius: '30px',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255,255,255,0.1)',
        maxWidth: '92%',
        overflowX: 'auto',
      }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setActiveCategory(cat);
              setActiveReelIndex(0);
            }}
            style={{
              padding: '0.35rem 0.9rem',
              borderRadius: '20px',
              border: 'none',
              backgroundColor: activeCategory === cat ? '#FFB000' : 'transparent',
              color: activeCategory === cat ? '#111827' : '#ffffff',
              fontWeight: '800',
              fontSize: '0.8rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 150ms ease',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Snap Scroll Viewport */}
      {loading ? (
        <div className="spinner-container" style={{ height: '100%', color: '#ffffff' }}>
          <div className="spinner"></div>
        </div>
      ) : reels.length === 0 ? (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#ffffff', gap: '1rem' }}>
          <Sparkles size={48} color="#FFB000" />
          <h2 style={{ fontSize: '1.2rem', fontWeight: '700' }}>No Reels Found in {activeCategory}</h2>
          <button onClick={fetchFeed} className="btn btn-primary" style={{ backgroundColor: '#FFB000', border: 'none', color: '#111827', fontWeight: '700' }}>
            <RefreshCw size={16} /> Refresh Feed
          </button>
        </div>
      ) : (
        <div
          ref={containerRef}
          onScroll={handleScroll}
          style={{
            width: '100%',
            height: '100%',
            overflowY: 'scroll',
            scrollSnapType: 'y mandatory',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {reels.map((reel, idx) => (
            <div key={reel._id} style={{ width: '100%', height: '100%', scrollSnapAlign: 'start' }}>
              <ReelPlayer
                reel={reel}
                isActive={idx === activeReelIndex}
                onNext={() => {
                  if (containerRef.current && idx < reels.length - 1) {
                    containerRef.current.scrollTo({ top: (idx + 1) * containerRef.current.clientHeight, behavior: 'smooth' });
                  }
                }}
                onPrev={() => {
                  if (containerRef.current && idx > 0) {
                    containerRef.current.scrollTo({ top: (idx - 1) * containerRef.current.clientHeight, behavior: 'smooth' });
                  }
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReelsPage;
