import React, { useContext } from 'react';
import { CartContext } from '../../context/CartContext';
import { X, ShoppingBag, Plus } from 'lucide-react';

const ShopThisReelModal = ({ products, onClose }) => {
  const { addToCart } = useContext(CartContext);

  if (!products || products.length === 0) return null;

  const handleAddAll = () => {
    products.forEach((pObj) => {
      const prod = pObj.product || pObj;
      addToCart(prod, 1);
    });
    alert(`All ${products.length} tagged items added to your cart!`);
    onClose();
  };

  const totalBundlePrice = products.reduce((sum, pObj) => {
    const prod = pObj.product || pObj;
    return sum + (prod.price || 0);
  }, 0);

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.65)',
        zIndex: 2000,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '1rem',
        backdropFilter: 'blur(5px)',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '560px',
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          padding: '1.5rem',
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
          maxHeight: '85vh',
          overflowY: 'auto',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.8rem' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#111827', margin: 0 }}>
              Shop This Reel ({products.length} Tagged Items)
            </h3>
            <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>Bundle Total: <strong>${totalBundlePrice.toFixed(2)}</strong></span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
          {products.map((itemObj, idx) => {
            const prod = itemObj.product || itemObj;
            return (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.8rem', border: '1px solid #e5e7eb', borderRadius: '8px', backgroundColor: '#f9fafb' }}>
                <img src={prod.image} alt={prod.name} style={{ width: '60px', height: '60px', objectFit: 'contain', backgroundColor: '#ffffff', borderRadius: '4px', padding: '0.2rem' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '700', fontSize: '0.9rem', color: '#111827' }}>{prod.name}</div>
                  <div style={{ fontWeight: '800', fontSize: '0.95rem', color: '#067d62', marginTop: '0.2rem' }}>${prod.price ? prod.price.toFixed(2) : '49.99'}</div>
                </div>
                <button
                  onClick={() => {
                    addToCart(prod, 1);
                    alert(`Added ${prod.name}!`);
                  }}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.75rem', padding: '0.4rem 0.8rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}
                >
                  <Plus size={14} /> Add
                </button>
              </div>
            );
          })}
        </div>

        <button
          onClick={handleAddAll}
          className="btn btn-primary btn-block"
          style={{ backgroundColor: '#FFB000', border: 'none', color: '#111827', fontWeight: '800', height: '46px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
        >
          <ShoppingBag size={18} /> Add All ({products.length}) to Cart
        </button>
      </div>
    </div>
  );
};

export default ShopThisReelModal;
