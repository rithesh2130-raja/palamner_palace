import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { Trash2, ArrowLeft, ShoppingCart } from 'lucide-react';

const CartPage = () => {
  const { cartItems, addToCart, removeFromCart } = useContext(CartContext);
  const navigate = useNavigate();

  const [savedLaterItems, setSavedLaterItems] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  // Load Saved for Later
  useEffect(() => {
    const stored = localStorage.getItem('plmnermart_saved_later');
    if (stored) {
      setSavedLaterItems(JSON.parse(stored));
    }

    // Fetch cross-sell recommendations
    const loadRecs = async () => {
      try {
        const res = await fetch('/api/products');
        if (res.ok) {
          const data = await res.json();
          // Choose 3 items that are not currently in the cart
          const filtered = data.filter((item) => !cartItems.some((c) => c._id === item._id)).slice(0, 3);
          setRecommendations(filtered);
        }
      } catch (err) {
        console.error(err);
      }
    };
    loadRecs();
  }, [cartItems]);

  const saveLaterHandler = (item) => {
    // 1. Remove from active cart
    removeFromCart(item._id);
    
    // 2. Add to saved later
    const updated = [...savedLaterItems];
    if (!updated.some((x) => x._id === item._id)) {
      updated.push(item);
    }
    setSavedLaterItems(updated);
    localStorage.setItem('plmnermart_saved_later', JSON.stringify(updated));
    alert('Item saved for later!');
  };

  const moveToCartHandler = (item) => {
    // 1. Add back to cart
    addToCart(item, 1);

    // 2. Remove from saved later
    const updated = savedLaterItems.filter((x) => x._id !== item._id);
    setSavedLaterItems(updated);
    localStorage.setItem('plmnermart_saved_later', JSON.stringify(updated));
    alert('Item moved to active cart!');
  };

  const deleteSavedHandler = (id) => {
    const updated = savedLaterItems.filter((x) => x._id !== id);
    setSavedLaterItems(updated);
    localStorage.setItem('plmnermart_saved_later', JSON.stringify(updated));
  };

  const checkoutHandler = () => {
    navigate('/login?redirect=/shipping');
  };

  const totalQty = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const totalPrice = cartItems
    .reduce((acc, item) => acc + item.price * item.qty, 0)
    .toFixed(2);

  return (
    <div>
      <h1 className="cart-title">Shopping Cart</h1>
      <Link to="/" className="btn btn-secondary" style={{ marginBottom: '1.5rem' }}>
        <ArrowLeft size={16} /> Continue Shopping
      </Link>

      {cartItems.length === 0 ? (
        <div className="alert alert-info">
          Your shopping cart is empty.{' '}
          <Link to="/" style={{ textDecoration: 'underline', fontWeight: 'bold' }}>
            Go Back
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          {/* Cart Items list */}
          <div className="cart-items-section">
            {cartItems.map((item) => (
              <div key={item._id} className="cart-item" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
                <img src={item.image} alt={item.name} className="cart-item-img" />
                <div style={{ flex: 1 }}>
                  <Link to={`/product/${item._id}`} className="cart-item-name">
                    {item.name}
                  </Link>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.2rem 0' }}>
                    Brand: {item.brand}
                  </p>
                  
                  {/* Actions buttons */}
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '0.6rem' }}>
                    <button
                      onClick={() => saveLaterHandler(item)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        color: 'var(--secondary)',
                        fontWeight: '600',
                        padding: 0,
                      }}
                    >
                      Save for Later
                    </button>
                    <button
                      onClick={() => removeFromCart(item._id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        color: 'var(--danger)',
                        fontWeight: '600',
                        padding: 0,
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
                
                <div className="cart-item-price" style={{ minWidth: '80px', textAlign: 'right', fontWeight: '700' }}>
                  ${item.price.toFixed(2)}
                </div>
                
                <div style={{ marginLeft: '1.5rem' }}>
                  <select
                    className="qty-select"
                    value={item.qty}
                    onChange={(e) => addToCart(item, Number(e.target.value))}
                  >
                    {[...Array(item.countInStock).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>

          {/* Checkout Card */}
          <div className="cart-summary-box" style={{ height: 'fit-content' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700' }}>
              Subtotal ({totalQty}) items
            </h2>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', margin: '0.5rem 0' }}>
              ${totalPrice}
            </div>
            <button
              onClick={checkoutHandler}
              className="btn btn-primary btn-block"
              disabled={cartItems.length === 0}
              style={{ backgroundColor: 'var(--accent)', border: 'none', color: '#111827', fontWeight: '700' }}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}

      {/* Saved for Later Section */}
      <div style={{ marginTop: '4rem', borderTop: '1px solid var(--border-color)', paddingTop: '2rem' }}>
        <h2 style={{ fontWeight: '700', marginBottom: '1.5rem' }}>Saved for Later ({savedLaterItems.length} items)</h2>
        
        {savedLaterItems.length === 0 ? (
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No saved items.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            {savedLaterItems.map((item) => (
              <div
                key={item._id}
                style={{
                  display: 'flex',
                  gap: '1.5rem',
                  backgroundColor: 'var(--bg-card)',
                  padding: '1.2rem',
                  borderRadius: 'var(--border-radius-md)',
                  border: '1px solid var(--border-color)',
                  alignItems: 'center',
                }}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  style={{ width: '70px', height: '70px', objectFit: 'contain' }}
                />
                
                <div style={{ flex: 1 }}>
                  <Link to={`/product/${item._id}`} style={{ fontWeight: '700', color: 'var(--text-dark)', textDecoration: 'none', fontSize: '0.95rem' }}>
                    {item.name}
                  </Link>
                  <div style={{ fontWeight: '700', fontSize: '1rem', color: 'var(--secondary)', marginTop: '0.2rem' }}>
                    ${item.price.toFixed(2)}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => moveToCartHandler(item)}
                    className="btn btn-primary"
                    style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}
                  >
                    <ShoppingCart size={12} /> Move to Cart
                  </button>
                  <button
                    onClick={() => deleteSavedHandler(item._id)}
                    className="btn btn-secondary"
                    style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem', border: '1px solid var(--border-color)' }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cross-Sell Recommendations Section */}
      {recommendations.length > 0 && (
        <div style={{ marginTop: '4rem', borderTop: '1px solid var(--border-color)', paddingTop: '2rem', marginBottom: '2rem' }}>
          <h2 style={{ fontWeight: '700', marginBottom: '1.5rem' }}>Frequently Bought Together</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem' }}>
            {recommendations.map((item) => (
              <div
                key={item._id}
                style={{
                  backgroundColor: 'var(--bg-card)',
                  borderRadius: 'var(--border-radius-md)',
                  border: '1px solid var(--border-color)',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.6rem',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <img src={item.image} alt={item.name} style={{ width: '100%', height: '110px', objectFit: 'contain', backgroundColor: '#f9f9f9', padding: '0.2rem', borderRadius: '3px' }} />
                <Link to={`/product/${item._id}`} style={{ fontWeight: '700', fontSize: '0.85rem', color: 'var(--text-dark)', textDecoration: 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {item.name}
                </Link>
                <div style={{ fontWeight: '700', color: 'var(--secondary)' }}>${item.price.toFixed(2)}</div>
                <button
                  onClick={() => {
                    addToCart(item, 1);
                    alert('Recommendation added to cart!');
                  }}
                  className="btn btn-primary btn-block"
                  style={{ fontSize: '0.75rem', padding: '0.4rem' }}
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default CartPage;
