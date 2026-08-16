import React from 'react';
import { Sparkles, Zap, Music, Video } from 'lucide-react';

const PrimePage = () => {
  return (
    <div className="container" style={{ padding: '2.5rem 1rem', maxWidth: '1000px' }}>
      
      {/* Prime Header Block */}
      <div style={{
        background: 'linear-gradient(135deg, #005f73 0%, #0a9396 100%)',
        color: '#fff',
        padding: '3rem 2rem',
        borderRadius: 'var(--border-radius-md)',
        marginBottom: '2.5rem',
        boxShadow: 'var(--shadow-md)',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ fontSize: '1rem', fontWeight: '700', textTransform: 'uppercase', color: '#febd69', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.4rem', marginBottom: '0.8rem' }}>
          <Sparkles size={18} fill="#febd69" /> plmnermart prime
        </div>
        <h1 style={{ fontSize: '2.6rem', fontWeight: '900', marginBottom: '1rem' }}>Everything you love, all in one membership</h1>
        <p style={{ fontSize: '1.1rem', color: '#f3f4f6', maxWidth: '700px', margin: '0 auto 1.5rem auto', lineHeight: '1.5' }}>
          Get fast FREE delivery, exclusive access to award-winning Prime Video movies, ad-free Prime Music, and gaming loot rewards.
        </p>
        <button
          onClick={() => alert('Welcome to plmnermart Prime! (Simulation activated)')}
          className="btn btn-primary"
          style={{ fontSize: '1.05rem', padding: '0.8rem 2rem', backgroundColor: '#febd69', color: '#111', border: 'none', fontWeight: '700', borderRadius: '30px' }}
        >
          Try Prime FREE for 30 Days
        </button>
        <div style={{ fontSize: '0.85rem', color: '#e5e7eb', marginTop: '0.8rem' }}>
          Only $14.99/month after trial. Cancel anytime.
        </div>
      </div>

      {/* Benefits grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '3.5rem' }}>
        
        <div style={{ backgroundColor: 'var(--bg-card)', padding: '1.5rem', borderRadius: 'var(--border-radius-md)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: '#e0f2fe', color: '#0369a1', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
            <Zap size={24} />
          </div>
          <h3 style={{ fontWeight: '700', marginBottom: '0.5rem' }}>FREE 2-Day Shipping</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Get unlimited free shipping on millions of eligible items. No minimum purchase threshold values required.
          </p>
        </div>

        <div style={{ backgroundColor: 'var(--bg-card)', padding: '1.5rem', borderRadius: 'var(--border-radius-md)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: '#fae8ff', color: '#a21caf', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
            <Video size={24} />
          </div>
          <h3 style={{ fontWeight: '700', marginBottom: '0.5rem' }}>Prime Video Stream</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Watch popular movies, award-winning original shows, live sports, and top-tier series anytime, anywhere.
          </p>
        </div>

        <div style={{ backgroundColor: 'var(--bg-card)', padding: '1.5rem', borderRadius: 'var(--border-radius-md)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: '#ecfdf5', color: '#047857', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
            <Music size={24} />
          </div>
          <h3 style={{ fontWeight: '700', marginBottom: '0.5rem' }}>Ad-Free Music</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Access 100 million high-fidelity songs offline, curated music playlists, and thousands of podcasts ad-free.
          </p>
        </div>

      </div>

      {/* Prime Video Mock Slider section */}
      <h2 style={{ fontWeight: '800', marginBottom: '1.2rem', fontSize: '1.4rem' }}>Popular Movies & Shows on Prime Video</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { title: 'The Boys - Season 5', img: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400', tag: 'Action' },
          { title: 'Rings of Power', img: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400', tag: 'Fantasy' },
          { title: 'Jack Ryan', img: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400', tag: 'Thriller' },
          { title: 'Invincible', img: 'https://images.unsplash.com/photo-1608889175123-8ee362201f81?w=400', tag: 'Animation' },
        ].map((movie, idx) => (
          <div key={idx} style={{ borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)' }}>
            <img src={movie.img} alt={movie.title} style={{ width: '100%', height: '140px', objectFit: 'cover' }} />
            <div style={{ padding: '0.8rem' }}>
              <span className="badge badge-success" style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem' }}>{movie.tag}</span>
              <h4 style={{ fontWeight: '700', marginTop: '0.4rem', fontSize: '0.9rem' }}>{movie.title}</h4>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default PrimePage;
