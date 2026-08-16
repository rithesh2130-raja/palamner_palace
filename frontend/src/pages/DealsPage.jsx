import React, { useState, useEffect, useContext } from 'react';
import { Sparkles, ShoppingCart, Clock } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { Link } from 'react-router-dom';

const DealsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(3600 * 4 + 120); // 4 hours 2 mins mock timer
  
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        if (res.ok) {
          const data = await res.json();
          // Simulate discounted prices on deals
          const deals = data.map((p, idx) => ({
            ...p,
            originalPrice: p.price * 1.3, // 30% higher MRP
            claimedPct: Math.floor(Math.random() * 60) + 20, // 20% to 80% claimed
          }));
          setProducts(deals);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Timer Countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 3600 * 4));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      
      {/* Banner */}
      <div style={{
        background: 'linear-gradient(90deg, #1f2937 0%, #111827 100%)',
        color: '#fff',
        padding: '2.5rem',
        borderRadius: 'var(--border-radius-md)',
        marginBottom: '2rem',
        borderLeft: '5px solid #febd69',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#febd69', fontWeight: '700', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px', marginBottom: '0.5rem' }}>
          <Sparkles size={16} fill="#febd69" /> Today's Lightning Deals
        </div>
        <h1 style={{ fontWeight: '800', fontSize: '2rem', marginBottom: '0.8rem' }}>plmnermart Super Saving Hub</h1>
        <p style={{ color: '#ccc', maxWidth: '600px', fontSize: '0.95rem' }}>
          Grab these ultra-discounted items before they sell out or the timer expires. Refreshing hourly with premium tech accessories.
        </p>
        
        {/* Countdown Box */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1.2rem', backgroundColor: '#374151', width: 'fit-content', padding: '0.5rem 1rem', borderRadius: '4px', border: '1px solid #4b5563' }}>
          <Clock size={16} color="#febd69" />
          <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>Deals expire in:</span>
          <span style={{ fontSize: '1rem', fontWeight: '700', color: '#febd69', fontFamily: 'monospace' }}>{formatTime(timeLeft)}</span>
        </div>
      </div>

      {loading ? (
        <div className="spinner-container">
          <div className="spinner"></div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {products.map((p) => (
            <div
              key={p._id}
              style={{
                backgroundColor: 'var(--bg-card)',
                borderRadius: 'var(--border-radius-md)',
                border: '1px solid var(--border-color)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: 'var(--shadow-sm)',
                transition: 'transform 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-4px)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              {/* Image box */}
              <div style={{ padding: '1rem', backgroundColor: '#f9f9f9', display: 'flex', justifyContent: 'center', height: '180px', position: 'relative' }}>
                <img src={p.image} alt={p.name} style={{ maxHeight: '100%', objectFit: 'contain' }} />
                <span style={{ position: 'absolute', top: '10px', left: '10px', backgroundColor: '#cc0c39', color: '#fff', fontSize: '0.75rem', fontWeight: '700', padding: '0.2rem 0.6rem', borderRadius: '2px' }}>
                  SAVE 30%
                </span>
              </div>

              {/* Body */}
              <div style={{ padding: '1.2rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <Link to={`/product/${p._id}`} style={{ fontWeight: '700', fontSize: '0.95rem', color: 'var(--text-dark)', textDecoration: 'none', lineHeight: '1.3', height: '40px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                  {p.name}
                </Link>
                
                {/* Price block */}
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', margin: '0.6rem 0' }}>
                  <span style={{ fontSize: '1.2rem', fontWeight: '800', color: '#cc0c39' }}>
                    ${p.price.toFixed(2)}
                  </span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                    ${p.originalPrice.toFixed(2)}
                  </span>
                </div>

                {/* Deal claimed slider */}
                <div style={{ margin: '0.5rem 0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                    <span>{p.claimedPct}% claimed</span>
                  </div>
                  <div style={{ width: '100%', height: '6px', backgroundColor: '#e5e7eb', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${p.claimedPct}%`, height: '100%', backgroundColor: '#e11d48', borderRadius: '3px' }}></div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    addToCart(p, 1);
                    alert('Deal added to cart!');
                  }}
                  className="btn btn-primary btn-block"
                  style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', backgroundColor: '#febd69', border: 'none', color: '#111' }}
                  disabled={p.countInStock === 0}
                >
                  <ShoppingCart size={14} /> Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default DealsPage;
