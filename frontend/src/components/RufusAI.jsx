import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, X, Send, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const RufusAI = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'rufus', text: "Hello! I'm Rufus, your AI shopping assistant. Ask me questions about plmnermart products, compare specs, or find deals!" }
  ]);
  const [input, setInput] = useState('');
  const [products, setProducts] = useState([]);
  
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Fetch product catalog for AI references
    const loadProducts = async () => {
      try {
        const res = await fetch('/api/products');
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        }
      } catch (err) {
        console.error('Rufus failed to fetch catalog', err);
      }
    };
    loadProducts();
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const sendHandler = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input.trim();
    setMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setInput('');

    setTimeout(() => {
      const reply = generateAIMessage(userText);
      setMessages((prev) => [...prev, { sender: 'rufus', text: reply.text, suggestions: reply.suggestions }]);
    }, 800);
  };

  const generateAIMessage = (text) => {
    const query = text.toLowerCase();
    
    // Check for product listings
    if (query.includes('electronics') || query.includes('gadget') || query.includes('device')) {
      const items = products.filter((p) => p.category.toLowerCase() === 'electronics');
      if (items.length > 0) {
        return {
          text: `Here are the top Electronics at plmnermart:`,
          suggestions: items.map((p) => ({ label: `${p.name} ($${p.price})`, path: `/product/${p._id}` })),
        };
      }
    }

    if (query.includes('brand') || query.includes('brands')) {
      const brands = [...new Set(products.map((p) => p.brand))];
      return {
        text: `We carry products from these premium brands: ${brands.join(', ')}. What are you looking to buy today?`,
        suggestions: [],
      };
    }

    // Keyword search products
    const matched = products.filter((p) => 
      p.name.toLowerCase().includes(query) || 
      p.description.toLowerCase().includes(query) ||
      p.brand.toLowerCase().includes(query)
    );

    if (matched.length > 0) {
      return {
        text: `I found ${matched.length} product(s) matching "${text}":`,
        suggestions: matched.slice(0, 3).map((p) => ({ label: `${p.name} - $${p.price}`, path: `/product/${p._id}` })),
      };
    }

    // FAQs
    if (query.includes('return') || query.includes('refund')) {
      return {
        text: "At plmnermart, you can return most items within 30 days of delivery. Refunds are processed to your original payment method in 3-5 business days.",
        suggestions: [{ label: "Help Center", path: "/help" }],
      };
    }

    if (query.includes('shipping') || query.includes('delivery')) {
      return {
        text: "We offer FREE standard shipping on orders over $50. Prime members get free 2-day shipping on all items!",
        suggestions: [{ label: "Try Prime Page", path: "/prime" }],
      };
    }

    if (query.includes('deal') || query.includes('discount') || query.includes('coupon')) {
      const deals = products.filter((p) => p.price < 150);
      return {
        text: "You can find lightning deals on our Today's Deals section. Here are some top-rated items under $150:",
        suggestions: deals.slice(0, 3).map((p) => ({ label: `${p.name} - Only $${p.price}`, path: `/product/${p._id}` })),
      };
    }

    return {
      text: "I'm not sure about that query, but you can explore our latest catalog collections, today's deals, or get in touch with Customer Support.",
      suggestions: [
        { label: "Today's Deals", path: "/deals" },
        { label: "Help Center", path: "/help" },
      ],
    };
  };

  return (
    <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 9999 }}>
      
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: '#131921',
            color: '#fff',
            border: '2px solid #febd69',
            borderRadius: '30px',
            padding: '0.8rem 1.2rem',
            cursor: 'pointer',
            boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
            fontSize: '0.9rem',
            fontWeight: '600',
            transition: 'transform 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          <Sparkles size={16} color="#febd69" fill="#febd69" />
          <span>Ask Rufus</span>
        </button>
      )}

      {/* Chat Drawer Box */}
      {isOpen && (
        <div style={{
          width: '350px',
          height: '500px',
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
          border: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
        }}>
          {/* Header */}
          <div style={{
            backgroundColor: '#131921',
            color: '#fff',
            padding: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '2px solid #febd69',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={16} color="#febd69" fill="#febd69" />
              <span style={{ fontWeight: '700', fontSize: '0.95rem' }}>Rufus AI shopping assistant</span>
            </div>
            <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
              <X size={18} />
            </button>
          </div>

          {/* Messages Area */}
          <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.8rem', backgroundColor: '#f7f9fa' }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '85%',
                  padding: '0.7rem 0.9rem',
                  borderRadius: '12px',
                  fontSize: '0.85rem',
                  lineHeight: '1.4',
                  backgroundColor: msg.sender === 'user' ? '#febd69' : '#ffffff',
                  color: msg.sender === 'user' ? '#111' : '#333',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                  border: msg.sender === 'user' ? 'none' : '1px solid #e5e7eb',
                }}>
                  {msg.text}
                </div>

                {/* Suggestions / Product Cards inside reply */}
                {msg.suggestions && msg.suggestions.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', marginTop: '0.5rem', width: '100%' }}>
                    {msg.suggestions.map((sug, idx) => (
                      <Link
                        key={idx}
                        to={sug.path}
                        onClick={() => setIsOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          backgroundColor: '#fff',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          padding: '0.4rem 0.6rem',
                          fontSize: '0.8rem',
                          color: 'var(--secondary)',
                          textDecoration: 'none',
                          fontWeight: '600',
                          transition: 'background-color 0.2s',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f3f4f6')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#fff')}
                      >
                        <span>{sug.label}</span>
                        <ArrowRight size={12} />
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Form Input Footer */}
          <form onSubmit={sendHandler} style={{ padding: '0.6rem', borderTop: '1px solid #e5e7eb', display: 'flex', gap: '0.4rem', backgroundColor: '#fff' }}>
            <input
              type="text"
              placeholder="Ask Rufus..."
              style={{
                flex: 1,
                border: '1px solid #ccc',
                borderRadius: '20px',
                padding: '0.5rem 1rem',
                fontSize: '0.85rem',
                outline: 'none',
              }}
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit" style={{
              backgroundColor: '#febd69',
              border: 'none',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}>
              <Send size={14} color="#111" />
            </button>
          </form>
        </div>
      )}

    </div>
  );
};

export default RufusAI;
