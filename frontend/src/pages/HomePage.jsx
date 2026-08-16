import React, { useState, useEffect, useContext } from 'react';
import { useLocation, Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight } from 'lucide-react';
import { UserContext } from '../context/UserContext';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const { userInfo } = useContext(UserContext);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search') || '';
  const categoryQuery = searchParams.get('category') || '';

  // Banner Slides
  const slides = [
    {
      title: 'Mega Gadget Deals',
      subtitle: 'Up to 40% off on top electronic brands',
      image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1000',
    },
    {
      title: 'Sound that Inspires',
      subtitle: 'Premium wireless headphones & audio systems',
      image: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=1000',
    },
    {
      title: 'Next Gen Gaming',
      subtitle: 'Consoles, controllers & accessories in stock',
      image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=1000',
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  useEffect(() => {
    if (categoryQuery) {
      setSelectedCategory(categoryQuery);
    }
  }, [categoryQuery]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let url = `/api/products`;
        const params = [];
        if (searchQuery) params.push(`keyword=${searchQuery}`);
        if (selectedCategory !== 'All') params.push(`category=${selectedCategory}`);
        
        if (params.length > 0) {
          url += `?${params.join('&')}`;
        }

        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to load products');
        const data = await res.json();
        
        // Filter out inactive products in frontend customer view
        const activeProducts = data.filter((p) => p.isActive !== false);
        setProducts(activeProducts);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [searchQuery, selectedCategory]);

  const categories = ['All', 'Electronics', 'Accessories'];

  // Mock recommendations data
  const gridDeals = products.slice(0, 4);

  return (
    <div className="home-container">
      {/* Hero Banner Slider */}
      {!searchQuery && (
        <div className="hero-slider" style={{ position: 'relative', height: '350px', overflow: 'hidden', marginBottom: '2rem' }}>
          <button
            onClick={() => setCurrentSlide(currentSlide === 0 ? slides.length - 1 : currentSlide - 1)}
            className="carousel-btn carousel-btn-left"
            style={{ zIndex: 10 }}
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={() => setCurrentSlide(currentSlide === slides.length - 1 ? 0 : currentSlide + 1)}
            className="carousel-btn carousel-btn-right"
            style={{ zIndex: 10 }}
          >
            <ChevronRight size={24} />
          </button>

          {slides.map((slide, idx) => (
            <div
              key={idx}
              className={`slide ${idx === currentSlide ? 'active' : ''}`}
              style={{
                backgroundImage: `url(${slide.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                opacity: idx === currentSlide ? 1 : 0,
                transition: 'opacity 0.8s ease-in-out',
                display: 'flex',
                alignItems: 'center',
                padding: '0 4rem',
              }}
            >
              <div className="slide-overlay" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(90deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 100%)' }}></div>
              <div className="slide-content" style={{ position: 'relative', zIndex: 2, color: '#fff' }}>
                <span className="slide-subtitle" style={{ color: '#febd69', fontWeight: '700', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Sparkles size={14} fill="#febd69" /> {slide.subtitle}
                </span>
                <h1 className="slide-title" style={{ fontSize: '2.5rem', fontWeight: '800', marginTop: '0.5rem' }}>{slide.title}</h1>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 4-Card Promo Grid */}
      {!searchQuery && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.5rem',
          margin: '0 1.5rem 2.5rem 1.5rem',
          marginTop: '-3rem', // overlay on banner slightly like Amazon
          position: 'relative',
          zIndex: 5,
        }}>
          {/* Card 1: Keep Shopping For */}
          <div style={{ backgroundColor: 'var(--bg-card)', padding: '1.2rem', borderRadius: '4px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-md)', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.8rem' }}>Keep Shopping For</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', flex: 1 }}>
              {gridDeals.map((p) => (
                <Link key={p._id} to={`/product/${p._id}`} style={{ textDecoration: 'none' }}>
                  <img src={p.image} alt={p.name} style={{ width: '100%', height: '70px', objectFit: 'contain', backgroundColor: '#f9f9f9', padding: '0.2rem', borderRadius: '3px' }} />
                  <div style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-dark)', marginTop: '0.2rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                </Link>
              ))}
            </div>
            <Link to="/deals" style={{ fontSize: '0.8rem', color: 'var(--secondary)', textDecoration: 'none', fontWeight: '600', marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
              See more deals <ArrowRight size={12} />
            </Link>
          </div>

          {/* Card 2: Buy It Again */}
          <div style={{ backgroundColor: 'var(--bg-card)', padding: '1.2rem', borderRadius: '4px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-md)', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.8rem' }}>Buy It Again</h3>
            {userInfo ? (
              <div style={{ display: 'flex', gap: '1rem', flex: 1, alignItems: 'center' }}>
                {products.length > 0 ? (
                  <>
                    <img src={products[0].image} alt={products[0].name} style={{ width: '80px', height: '80px', objectFit: 'contain' }} />
                    <div>
                      <h4 style={{ fontSize: '0.85rem', fontWeight: '700', margin: 0 }}>{products[0].name}</h4>
                      <p style={{ color: 'var(--success)', fontWeight: '700', fontSize: '0.95rem', margin: '0.3rem 0' }}>${products[0].price}</p>
                      <Link to={`/product/${products[0]._id}`} className="btn btn-primary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}>View Item</Link>
                    </div>
                  </>
                ) : (
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No previous orders found.</p>
                )}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '1.5rem 0', flex: 1 }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Sign in to view your personalized orders.</p>
                <Link to="/login" className="btn btn-primary" style={{ padding: '0.4rem 1.2rem', fontSize: '0.8rem' }}>Sign In Securely</Link>
              </div>
            )}
            <Link to="/profile" style={{ fontSize: '0.8rem', color: 'var(--secondary)', textDecoration: 'none', fontWeight: '600', marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
              Go to Profile <ArrowRight size={12} />
            </Link>
          </div>

          {/* Card 3: Up to 60% off */}
          <div style={{ backgroundColor: 'var(--bg-card)', padding: '1.2rem', borderRadius: '4px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-md)', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.8rem' }}>Deals & Promotions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
              <div style={{ display: 'flex', gap: '0.5rem', backgroundColor: '#fee2e2', padding: '0.5rem', borderRadius: '4px', border: '1px solid #fca5a5' }}>
                <span style={{ fontSize: '1rem', fontWeight: '800', color: '#991b1b' }}>-30%</span>
                <span style={{ fontSize: '0.8rem', fontWeight: '600', color: '#7f1d1d' }}>On Logitech Pro Accessories</span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', backgroundColor: '#eff6ff', padding: '0.5rem', borderRadius: '4px', border: '1px solid #bfdbfe' }}>
                <span style={{ fontSize: '1rem', fontWeight: '800', color: '#1e40af' }}>-40%</span>
                <span style={{ fontSize: '0.8rem', fontWeight: '600', color: '#1e3a8a' }}>On Apple Authorized Gear</span>
              </div>
            </div>
            <Link to="/deals" style={{ fontSize: '0.8rem', color: 'var(--secondary)', textDecoration: 'none', fontWeight: '600', marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
              Explore All Deals <ArrowRight size={12} />
            </Link>
          </div>

          {/* Card 4: ShopSphere Prime */}
          <div style={{ backgroundColor: 'var(--bg-card)', padding: '1.2rem', borderRadius: '4px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-md)', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.4rem', color: 'var(--secondary)' }}>ShopSphere Prime</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
              Enjoy FREE Fast Delivery, Exclusive Video Reels, and early access to deals.
            </p>
            <div style={{ marginTop: 'auto' }}>
              <Link to="/prime" className="btn btn-primary btn-block" style={{ backgroundColor: 'var(--accent)', border: 'none', color: '#111827', fontWeight: '700', textDecoration: 'none' }}>
                Join Prime Today
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* TRENDING VIDEO REELS DISCOVERY WIDGET */}
      {!searchQuery && (
        <div style={{ margin: '0 1.5rem 2.5rem 1.5rem', backgroundColor: '#131A22', borderRadius: '12px', padding: '1.5rem 2rem', color: '#ffffff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#FFB000', textTransform: 'uppercase', letterSpacing: '1px' }}>
                SOCIAL DISCOVERY ENGINE
              </span>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '800', margin: '0.2rem 0 0 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sparkles color="#FFB000" /> Trending Product Reels
              </h2>
            </div>
            <Link to="/reels" className="btn btn-primary" style={{ backgroundColor: '#FFB000', border: 'none', color: '#111827', fontWeight: '800', textDecoration: 'none' }}>
              Explore Reels Feed →
            </Link>
          </div>

          {/* Reels Row Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.2rem' }}>
            {[
              { id: '1', title: 'Unboxing Ultimate Gaming Headphones 🎧', creator: '@techcreator', views: '12.4K', thumb: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500' },
              { id: '2', title: 'Ergonomic Productivity Mouse Review 🖱️', creator: '@gadgetgirl', views: '8.9K', thumb: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500' },
              { id: '3', title: '4K Curved Gaming Setup Upgrade 🖥️', creator: '@techcreator', views: '24.5K', thumb: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500' },
            ].map((r) => (
              <Link key={r.id} to="/reels" style={{ textDecoration: 'none' }}>
                <div style={{
                  position: 'relative',
                  height: '320px',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  backgroundImage: `url(${r.thumb})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.4)',
                  transition: 'transform 200ms ease',
                }}>
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 60%)',
                    padding: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}>
                    <span style={{ backgroundColor: '#FFB000', color: '#111827', fontSize: '0.68rem', fontWeight: '800', padding: '0.2rem 0.5rem', borderRadius: '4px', width: 'fit-content' }}>
                      IN-STREAM SHOPPING
                    </span>

                    <div>
                      <div style={{ color: '#ffffff', fontWeight: '700', fontSize: '0.85rem', lineHeight: '1.3', marginBottom: '0.3rem' }}>
                        {r.title}
                      </div>
                      <div style={{ color: '#9ca3af', fontSize: '0.75rem' }}>
                        {r.creator} • {r.views} views
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Main layout */}
      <div className="shop-layout">
        <aside className="sidebar">
          <h3 className="sidebar-title">Categories</h3>
          <ul className="category-list">
            {categories.map((cat) => (
              <li
                key={cat}
                className={`category-item ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </li>
            ))}
          </ul>
        </aside>

        <div style={{ flex: 1 }}>
          <h2 style={{ marginBottom: '1.5rem', fontWeight: '700' }}>
            {searchQuery
              ? `Search Results for "${searchQuery}"`
              : selectedCategory === 'All'
              ? 'Trending Products'
              : `${selectedCategory} Collection`}
          </h2>

          {loading ? (
            <div className="spinner-container">
              <div className="spinner"></div>
            </div>
          ) : error ? (
            <div className="alert alert-danger">{error}</div>
          ) : products.length === 0 ? (
            <div className="alert alert-info">No products found.</div>
          ) : (
            <div className="products-grid">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
