import React, { useState, useContext } from 'react';
import { Sparkles, MessageSquare, X, Send, Bot, ShoppingBag } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const ShopSphereAI = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'ai', text: 'Hi! I am ShopSphere AI 🤖. How can I help you find products or explore video Reels today?' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    setMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setInput('');
    setLoading(true);

    try {
      // Query API products database to find matching products
      const res = await fetch('/api/products');
      let matchedProducts = [];
      if (res.ok) {
        const allProducts = await res.json();
        const queryLower = userMsg.toLowerCase();
        matchedProducts = allProducts.filter(
          (p) =>
            p.name.toLowerCase().includes(queryLower) ||
            p.category.toLowerCase().includes(queryLower) ||
            p.brand.toLowerCase().includes(queryLower)
        );
      }

      setTimeout(() => {
        if (matchedProducts.length > 0) {
          setMessages((prev) => [
            ...prev,
            {
              sender: 'ai',
              text: `Based on your request "${userMsg}", here are top recommendations from our catalog & video Reels:`,
              products: matchedProducts.slice(0, 2),
            },
          ]);
        } else {
          setMessages((prev) => [
            ...prev,
            {
              sender: 'ai',
              text: `I recommend checking our Trending Video Reels! Top creators have reviewed top gaming headphones, ergonomic mice, and 4K displays.`,
            },
          ]);
        }
        setLoading(false);
      }, 500);
    } catch (err) {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating AI Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '25px',
          right: '25px',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: '#FFB000',
          color: '#111827',
          border: 'none',
          boxShadow: '0 8px 25px rgba(255,176,0,0.5)',
          cursor: 'pointer',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'transform 200ms ease',
        }}
      >
        {isOpen ? <X size={24} /> : <Bot size={26} />}
      </button>

      {/* AI Chat Window */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          bottom: '90px',
          right: '25px',
          width: '380px',
          maxWidth: 'calc(100vw - 40px)',
          height: '520px',
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0 12px 40px rgba(0,0,0,0.25)',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          border: '1px solid #E5E7EB',
          animation: 'fadeIn 200ms ease-out',
        }}>
          {/* Top Bar */}
          <div style={{ backgroundColor: '#131A22', color: '#ffffff', padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Sparkles color="#FFB000" size={20} />
            <div>
              <div style={{ fontWeight: '800', fontSize: '0.95rem' }}>ShopSphere AI Assistant</div>
              <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Reels & Product Recommendation Bot</div>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', backgroundColor: '#F9FAFB' }}>
            {messages.map((m, idx) => (
              <div key={idx} style={{ alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
                <div style={{
                  padding: '0.7rem 1rem',
                  borderRadius: '12px',
                  backgroundColor: m.sender === 'user' ? '#131A22' : '#ffffff',
                  color: m.sender === 'user' ? '#ffffff' : '#111827',
                  border: m.sender === 'user' ? 'none' : '1px solid #E5E7EB',
                  fontSize: '0.85rem',
                  lineHeight: '1.4',
                }}>
                  {m.text}
                </div>

                {m.products && m.products.map((p) => (
                  <div key={p._id} style={{ marginTop: '0.5rem', backgroundColor: '#ffffff', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <img src={p.image} alt="" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.8rem', fontWeight: '700' }}>{p.name}</div>
                      <div style={{ fontSize: '0.85rem', fontWeight: '800', color: '#067d62' }}>${p.price}</div>
                    </div>
                    <button
                      onClick={() => {
                        addToCart(p, 1);
                        alert(`Added ${p.name} to cart!`);
                      }}
                      className="btn btn-primary"
                      style={{ fontSize: '0.7rem', padding: '0.3rem 0.5rem', backgroundColor: '#FFB000', border: 'none', color: '#111827', fontWeight: '700' }}
                    >
                      <ShoppingBag size={12} />
                    </button>
                  </div>
                ))}
              </div>
            ))}
            {loading && <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>ShopSphere AI is searching catalog...</div>}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSend} style={{ display: 'flex', padding: '0.8rem', backgroundColor: '#ffffff', borderTop: '1px solid #E5E7EB', gap: '0.5rem' }}>
            <input
              type="text"
              placeholder="Ask AI for products or Reels..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={{ flex: 1, border: '1px solid #D5D9D9', borderRadius: '6px', padding: '0.5rem 0.8rem', fontSize: '0.85rem', outline: 'none' }}
            />
            <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#FFB000', border: 'none', color: '#111827' }}>
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default ShopSphereAI;
