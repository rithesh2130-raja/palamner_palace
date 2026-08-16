import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Rating from '../components/Rating';
import { CartContext } from '../context/CartContext';
import { UserContext } from '../context/UserContext';
import { ArrowLeft, Send, Sparkles, Heart, ZoomIn, Video, Play, ExternalLink } from 'lucide-react';

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState(null);
  const [reviewSuccess, setReviewSuccess] = useState(null);

  // Variant States
  const [selectedColor, setSelectedColor] = useState('Midnight');
  const [selectedSize, setSelectedSize] = useState('Standard');

  // Lists list dropdown state
  const [listName, setListName] = useState('My Wishlist');
  const [wishlists, setWishlists] = useState({ 'My Wishlist': [] });

  const { addToCart } = useContext(CartContext);
  const { userInfo } = useContext(UserContext);

  const fetchProduct = async () => {
    try {
      const res = await fetch(`/api/products/${id}`);
      if (!res.ok) throw new Error('Product not found');
      const data = await res.json();
      setProduct(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
    // Load lists
    const stored = localStorage.getItem('plmnermart_wishlists');
    if (stored) {
      setWishlists(JSON.parse(stored));
    }
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product, qty);
    navigate('/cart');
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setReviewLoading(true);
    setReviewError(null);
    setReviewSuccess(null);

    try {
      const res = await fetch(`/api/products/${id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, comment }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to submit review');

      setReviewSuccess('Review submitted successfully!');
      setComment('');
      fetchProduct();
    } catch (err) {
      setReviewError(err.message);
    } finally {
      setReviewLoading(false);
    }
  };

  const addToListHandler = () => {
    const updated = { ...wishlists };
    if (!updated[listName]) {
      updated[listName] = [];
    }
    // Check if product is already in list
    if (updated[listName].some((item) => item._id === product._id)) {
      alert(`Product is already saved in your "${listName}"!`);
      return;
    }
    updated[listName].push(product);
    setWishlists(updated);
    localStorage.setItem('plmnermart_wishlists', JSON.stringify(updated));
    alert(`Added to "${listName}"!`);
  };

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Link to="/" className="btn btn-secondary" style={{ marginBottom: '1.5rem' }}>
          <ArrowLeft size={16} /> Back to Products
        </Link>
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  // Calculate Mock ratings distribution
  const totalReviewsCount = product.reviews.length || 3;
  const ratingDistribution = [
    { stars: 5, pct: product.reviews.length ? (product.reviews.filter((r) => r.rating === 5).length / product.reviews.length) * 100 : 70 },
    { stars: 4, pct: product.reviews.length ? (product.reviews.filter((r) => r.rating === 4).length / product.reviews.length) * 100 : 20 },
    { stars: 3, pct: product.reviews.length ? (product.reviews.filter((r) => r.rating === 3).length / product.reviews.length) * 100 : 10 },
    { stars: 2, pct: product.reviews.length ? (product.reviews.filter((r) => r.rating === 2).length / product.reviews.length) * 100 : 0 },
    { stars: 1, pct: product.reviews.length ? (product.reviews.filter((r) => r.rating === 1).length / product.reviews.length) * 100 : 0 },
  ];

  return (
    <div>
      <Link to="/" className="btn btn-secondary" style={{ marginBottom: '2.5rem' }}>
        <ArrowLeft size={16} /> Back to Products
      </Link>

      <div className="product-details" style={{ marginBottom: '4rem' }}>
        
        {/* Left Column: Product Image Gallery & Lists */}
        <div className="product-image-section" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', height: 'auto', justifyContent: 'flex-start', padding: 0, border: 'none', backgroundColor: 'transparent', boxShadow: 'none' }}>
          <div style={{
            backgroundColor: '#f9f9f9',
            padding: '2rem',
            borderRadius: 'var(--border-radius-md)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            justifyContent: 'center',
            height: '380px',
            position: 'relative'
          }}>
            <img src={product.image} alt={product.name} style={{ maxHeight: '100%', objectFit: 'contain' }} />
            <div style={{ position: 'absolute', bottom: '15px', right: '15px', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <ZoomIn size={14} /> Hover to zoom mockup
            </div>
          </div>
          
          {/* Thumbnails list */}
          <div style={{ display: 'flex', gap: '0.6rem', marginTop: '1rem', justifyContent: 'center' }}>
            <div style={{ border: '2px solid var(--secondary)', width: '60px', height: '60px', borderRadius: '4px', padding: '4px', cursor: 'pointer', backgroundColor: '#f9f9f9' }}>
              <img src={product.image} alt="main" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
            <div style={{ border: '1px solid var(--border-color)', width: '60px', height: '60px', borderRadius: '4px', padding: '4px', cursor: 'pointer', opacity: 0.7, backgroundColor: '#f9f9f9' }}>
              <img src={product.image} alt="side" style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'hue-rotate(45deg)' }} />
            </div>
          </div>

          {/* Add to Wishlist list widget */}
          <div style={{
            marginTop: '2rem',
            padding: '1.2rem',
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--border-radius-md)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.8rem',
            boxShadow: 'var(--shadow-sm)',
          }}>
            <h4 style={{ fontWeight: '700', fontSize: '0.9rem', margin: 0 }}>Add to Shopping List</h4>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <select
                className="qty-select"
                style={{ flex: 1, height: '40px', padding: '0.4rem' }}
                value={listName}
                onChange={(e) => setListName(e.target.value)}
              >
                {Object.keys(wishlists).map((name) => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
              <button
                onClick={addToListHandler}
                className="btn btn-secondary"
                style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', height: '40px' }}
              >
                <Heart size={16} color="var(--danger)" fill="var(--danger)" /> Add
              </button>
            </div>
          </div>
        </div>

        {/* Middle Column: Spec options & Info */}
        <div className="product-info-section">
          <h1 style={{ fontWeight: '800', fontSize: '1.8rem', lineHeight: '1.3', marginBottom: '0.8rem' }}>{product.name}</h1>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.2rem' }}>
            <Rating value={product.rating} text={`${product.numReviews} customer reviews`} />
            <span className="badge badge-success">Fulfilled by plmnermart</span>
          </div>

          {/* AI Review Summary panel */}
          <div style={{
            backgroundColor: '#eff6ff',
            border: '1px solid #bfdbfe',
            padding: '1rem',
            borderRadius: 'var(--border-radius-md)',
            marginBottom: '1.5rem',
            display: 'flex',
            gap: '0.6rem',
          }}>
            <Sparkles size={18} color="var(--secondary)" fill="var(--secondary)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong style={{ fontSize: '0.85rem', color: '#1e3a8a', display: 'block', marginBottom: '0.2rem' }}>AI-Generated Review Highlight</strong>
              <p style={{ fontSize: '0.8rem', color: '#1e40af', margin: 0, lineHeight: '1.4' }}>
                Customers praise this item for its high performance, premium ergonomics, and rapid response. Highly recommended for workspace setups.
              </p>
            </div>
          </div>

          <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '1.5rem' }}>
            {product.description}
          </p>

          {/* Variant 1: Colors selection */}
          <div style={{ marginBottom: '1.2rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>
              COLOR: <span style={{ color: 'var(--text-dark)' }}>{selectedColor}</span>
            </span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {['Midnight', 'Space Gray', 'Starlight'].map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  style={{
                    padding: '0.4rem 1rem',
                    borderRadius: '20px',
                    border: `2px solid ${selectedColor === color ? 'var(--secondary)' : 'var(--border-color)'}`,
                    backgroundColor: 'transparent',
                    fontWeight: '600',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                  }}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Variant 2: Size specs */}
          <div style={{ marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>
              SIZE SPEC: <span style={{ color: 'var(--text-dark)' }}>{selectedSize}</span>
            </span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {['Standard', 'Pro Upgrade'].map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  style={{
                    padding: '0.4rem 1rem',
                    borderRadius: '4px',
                    border: `2px solid ${selectedSize === size ? 'var(--secondary)' : 'var(--border-color)'}`,
                    backgroundColor: 'transparent',
                    fontWeight: '600',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                  }}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Buy Card widget */}
        <div className="product-details-action">
          <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--text-dark)' }}>
            ${product.price.toFixed(2)}
          </div>

          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            FREE shipping on returns. Delivery tomorrow.
          </div>

          <div style={{ fontSize: '0.9rem', fontWeight: '700', color: product.countInStock > 0 ? 'var(--success)' : 'var(--danger)' }}>
            {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
          </div>

          {product.countInStock > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>Quantity</span>
                <select
                  className="qty-select"
                  value={qty}
                  onChange={(e) => setQty(Number(e.target.value))}
                  style={{ width: '70px', padding: '0.3rem' }}
                >
                  {[...Array(product.countInStock).keys()].map((x) => (
                    <option key={x + 1} value={x + 1}>
                      {x + 1}
                    </option>
                  ))}
                </select>
              </div>

              <button onClick={handleAddToCart} className="btn btn-primary btn-block" style={{ backgroundColor: 'var(--accent)', border: 'none', color: '#111827', fontWeight: '700', height: '46px', borderRadius: '6px', marginTop: '0.5rem' }}>
                Add to Cart
              </button>
              <button onClick={handleAddToCart} className="btn btn-secondary btn-block" style={{ backgroundColor: 'var(--primary)', border: 'none', color: '#ffffff', fontWeight: '700', height: '46px', borderRadius: '6px', marginTop: '0.5rem' }}>
                Buy Now
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Ratings distribution graphs */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '3rem', borderTop: '1px solid var(--border-color)', paddingTop: '2.5rem', marginBottom: '3rem' }}>
        
        {/* Left Side: Distribution */}
        <div>
          <h3 style={{ fontWeight: '700', marginBottom: '1rem' }}>Customer Ratings</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Rating value={product.rating} />
            <span style={{ fontWeight: '700', fontSize: '1.1rem' }}>{product.rating} out of 5</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {ratingDistribution.map((dist) => (
              <div key={dist.stars} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem' }}>
                <span style={{ width: '45px', fontWeight: '600' }}>{dist.stars} star</span>
                <div style={{ flex: 1, height: '18px', backgroundColor: '#e5e7eb', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${dist.pct}%`, height: '100%', backgroundColor: '#f59e0b' }}></div>
                </div>
                <span style={{ width: '35px', textAlign: 'right', fontWeight: '600', color: 'var(--text-muted)' }}>{dist.pct.toFixed(0)}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Reviews CRUD */}
        <div>
          <h3 style={{ fontWeight: '700', marginBottom: '1.2rem' }}>Customer Reviews</h3>

          {product.reviews.length === 0 ? (
            <div className="alert alert-info">No reviews yet. Be the first to write a review!</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', marginBottom: '2rem' }}>
              {product.reviews.map((rev) => (
                <div key={rev._id} style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.4rem' }}>
                    <strong style={{ fontSize: '0.9rem' }}>{rev.name}</strong>
                    <Rating value={rev.rating} />
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(rev.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.4', margin: 0 }}>
                    {rev.comment}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Write a review form */}
          {userInfo ? (
            <div style={{ backgroundColor: 'var(--bg-card)', padding: '1.5rem', borderRadius: 'var(--border-radius-md)', border: '1px solid var(--border-color)' }}>
              <h4 style={{ fontWeight: '700', marginBottom: '1rem' }}>Write a Customer Review</h4>
              
              {reviewSuccess && <div className="alert alert-success">{reviewSuccess}</div>}
              {reviewError && <div className="alert alert-danger">{reviewError}</div>}

              <form onSubmit={handleReviewSubmit}>
                <div className="form-group">
                  <label className="form-label">Overall Star Rating</label>
                  <select
                    className="form-control"
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                  >
                    <option value="5">5 - Excellent</option>
                    <option value="4">4 - Good</option>
                    <option value="3">3 - Average</option>
                    <option value="2">2 - Fair</option>
                    <option value="1">1 - Poor</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Review Comment</label>
                  <textarea
                    rows="3"
                    className="form-control"
                    placeholder="What did you like or dislike about this product?..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                  ></textarea>
                </div>

                <button type="submit" className="btn btn-primary" disabled={reviewLoading} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Send size={14} /> Submit Review
                </button>
              </form>
            </div>
          ) : (
            <div className="alert alert-warning">
              Please <Link to="/login">sign in</Link> to write a review.
            </div>
          )}
        </div>

        {/* SEE IT IN ACTION - Community Video Reels Section */}
        <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '2px dashed var(--border-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
            <div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Video color="#FFB000" /> SEE IT IN ACTION — Community Reels
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.2rem 0 0 0' }}>
                Watch short-form unboxing videos, setup guides, and reviews created by real ShopSphere creators.
              </p>
            </div>

            <Link to="/reels" className="btn btn-secondary" style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              Explore All Reels <ExternalLink size={12} />
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.2rem' }}>
            <Link to="/reels" style={{ textDecoration: 'none' }}>
              <div style={{
                position: 'relative',
                height: '320px',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                backgroundImage: `url(${product.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                cursor: 'pointer',
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
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ backgroundColor: '#FFB000', color: '#111827', fontSize: '0.7rem', fontWeight: '800', padding: '0.2rem 0.5rem', borderRadius: '4px', textTransform: 'uppercase' }}>
                      FEATURED REEL
                    </span>
                    <div style={{ backgroundColor: 'rgba(0,0,0,0.6)', padding: '0.4rem', borderRadius: '50%', color: '#ffffff' }}>
                      <Play size={16} fill="#ffffff" />
                    </div>
                  </div>

                  <div>
                    <div style={{ color: '#ffffff', fontWeight: '700', fontSize: '0.85rem', marginBottom: '0.3rem', lineHeight: '1.3' }}>
                      Unboxing & Deep Review of {product.name}
                    </div>
                    <div style={{ color: '#9ca3af', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Sparkles size={12} color="#FFB000" /> @techcreator • 12.4K views
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductPage;
