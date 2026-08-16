import React, { useContext } from 'react';
import { CartContext } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { X, ShoppingBag, Truck, ShieldCheck, Sparkles, ExternalLink } from 'lucide-react';

const ProductDrawer = ({ product, discountTag, onClose }) => {
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  if (!product) return null;

  const handleAddToCart = () => {
    addToCart(product, 1);
    alert(`"${product.name}" added to cart from Reel!`);
  };

  const handleBuyNow = () => {
    addToCart(product, 1);
    navigate('/checkout');
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.6)',
        zIndex: 2000,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-end',
        backdropFilter: 'blur(4px)',
        animation: 'fadeIn 200ms ease-out',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '540px',
          backgroundColor: '#ffffff',
          borderTopLeftRadius: '16px',
          borderTopRightRadius: '16px',
          padding: '1.5rem',
          boxShadow: '0 -10px 40px rgba(0,0,0,0.3)',
          maxHeight: '85vh',
          overflowY: 'auto',
          position: 'relative',
        }}
      >
        {/* Header bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.8rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: '700', color: '#111827' }}>
            <Sparkles size={16} color="#FFB000" /> Featured Reel Product
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.2rem', color: '#6b7280' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Product Details Row */}
        <div style={{ display: 'flex', gap: '1.2rem', marginBottom: '1.2rem' }}>
          <img
            src={product.image}
            alt={product.name}
            style={{ width: '110px', height: '110px', objectFit: 'contain', backgroundColor: '#f9fafb', borderRadius: '8px', padding: '0.4rem', border: '1px solid #e5e7eb' }}
          />

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {product.brand}
            </span>
            <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#111827', margin: '0.2rem 0', lineHeight: '1.3' }}>
              {product.name}
            </h3>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginTop: '0.3rem' }}>
              <span style={{ fontSize: '1.4rem', fontWeight: '800', color: '#111827' }}>
                ${product.price ? product.price.toFixed(2) : '99.99'}
              </span>
              {discountTag && (
                <span style={{ backgroundColor: '#ecfdf5', color: '#067d62', fontSize: '0.75rem', fontWeight: '800', padding: '0.15rem 0.5rem', borderRadius: '4px', border: '1px solid #a7f3d0' }}>
                  {discountTag}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Perks & Delivery Badge */}
        <div style={{ display: 'flex', gap: '1rem', backgroundColor: '#f7f7f7', padding: '0.8rem', borderRadius: '6px', marginBottom: '1.2rem', fontSize: '0.8rem', color: '#4b5563' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Truck size={14} color="#067d62" /> FREE One-Day Delivery
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <ShieldCheck size={14} color="#2563eb" /> Verified ShopSphere Item
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <button
            onClick={handleAddToCart}
            className="btn btn-primary btn-block"
            style={{ backgroundColor: '#FFB000', border: 'none', color: '#111827', fontWeight: '700', height: '46px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
          >
            <ShoppingBag size={18} /> Add to Cart (Keep Watching)
          </button>
          
          <button
            onClick={handleBuyNow}
            className="btn btn-secondary btn-block"
            style={{ backgroundColor: '#131A22', border: 'none', color: '#ffffff', fontWeight: '700', height: '46px', borderRadius: '6px' }}
          >
            Buy Now
          </button>

          <button
            onClick={() => navigate(`/product/${product._id}`)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.8rem', color: '#2563eb', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', marginTop: '0.4rem' }}
          >
            View Full Product Page <ExternalLink size={12} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDrawer;
