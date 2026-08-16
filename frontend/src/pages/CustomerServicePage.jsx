import React, { useState } from 'react';
import { Search, HelpCircle, MessageSquare, ShieldCheck, CreditCard, RefreshCw } from 'lucide-react';

const CustomerServicePage = () => {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const faqs = [
    {
      q: "How can I track my order status?",
      a: "Go to 'Account' -> 'Your Orders' in the profile page to track shipping progress with our real-time tracker pipeline.",
      cat: "Orders",
    },
    {
      q: "What is your return policy?",
      a: "Most items can be returned within 30 days of delivery. Returns are free and can be scheduled for home pickup.",
      cat: "Returns",
    },
    {
      q: "How long does a refund take?",
      a: "Refunds are processed in 3-5 business days after the warehouse receives and inspects your returned product.",
      cat: "Returns",
    },
    {
      q: "Is payment on plmnermart secure?",
      a: "Yes, we support bank-level encrypted checkouts with PayPal, Stripe, and Cash on Delivery (COD) secure protocols.",
      cat: "Payments",
    },
    {
      q: "How do I update my profile details?",
      a: "Visit the Profile page from your account dropdown menu to change your email, password, and addresses.",
      cat: "Account",
    },
  ];

  const filteredFaqs = faqs.filter((faq) => {
    const matchesQuery = faq.q.toLowerCase().includes(query.toLowerCase()) || faq.a.toLowerCase().includes(query.toLowerCase());
    const matchesCat = selectedCategory === 'All' || faq.cat === selectedCategory;
    return matchesQuery && matchesCat;
  });

  return (
    <div className="container" style={{ padding: '2.5rem 1rem', maxWidth: '900px' }}>
      
      {/* Help Banner Header */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontWeight: '800', fontSize: '2.2rem', marginBottom: '0.8rem' }}>Hello. How can we help you?</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.8rem' }}>Search our support guidelines or select a category below</p>
        
        <div style={{ position: 'relative', maxWidth: '550px', margin: '0 auto' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Type keywords (e.g. refund, delivery)..."
            style={{ padding: '0.8rem 1rem 0.8rem 2.8rem', borderRadius: '30px', fontSize: '1rem' }}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Search size={18} style={{ position: 'absolute', top: '15px', left: '16px', color: 'var(--text-muted)' }} />
        </div>
      </div>

      {/* Category Boxes */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.2rem', marginBottom: '3rem' }}>
        {[
          { name: 'All', icon: <HelpCircle size={20} /> },
          { name: 'Orders', icon: <ShieldCheck size={20} /> },
          { name: 'Returns', icon: <RefreshCw size={20} /> },
          { name: 'Payments', icon: <CreditCard size={20} /> },
        ].map((cat) => (
          <div
            key={cat.name}
            onClick={() => setSelectedCategory(cat.name)}
            style={{
              padding: '1.2rem',
              backgroundColor: selectedCategory === cat.name ? '#eff6ff' : 'var(--bg-card)',
              borderRadius: 'var(--border-radius-md)',
              border: `1px solid ${selectedCategory === cat.name ? 'var(--secondary)' : 'var(--border-color)'}`,
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.6rem',
              transition: 'all 0.2s',
            }}
          >
            <div style={{ color: selectedCategory === cat.name ? 'var(--secondary)' : 'var(--text-muted)' }}>
              {cat.icon}
            </div>
            <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>{cat.name} Help</span>
          </div>
        ))}
      </div>

      {/* FAQ Lists */}
      <h3 style={{ fontWeight: '700', marginBottom: '1.2rem' }}>Frequently Asked Questions</h3>
      
      {filteredFaqs.length === 0 ? (
        <div className="alert alert-info">No match found. Try entering other keywords.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '3rem' }}>
          {filteredFaqs.map((faq, i) => (
            <div key={i} style={{ backgroundColor: 'var(--bg-card)', padding: '1.2rem', borderRadius: 'var(--border-radius-md)', border: '1px solid var(--border-color)' }}>
              <h4 style={{ fontWeight: '700', fontSize: '0.95rem', color: 'var(--text-dark)', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <HelpCircle size={14} color="var(--secondary)" /> {faq.q}
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.4', paddingLeft: '1.2rem' }}>
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Rufus AI CTA */}
      <div style={{
        backgroundColor: '#f8fafc',
        border: '1px solid #e2e8f0',
        padding: '1.5rem',
        borderRadius: 'var(--border-radius-md)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <h4 style={{ fontWeight: '700', marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <MessageSquare size={18} color="#f90" fill="#f90" /> Still need answers?
          </h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
            Chat with Rufus, our advanced AI shopping assistant located at the bottom-right corner!
          </p>
        </div>
        <button
          onClick={() => alert("Click the 'Ask Rufus' floating button in the bottom-right corner to start!")}
          className="btn btn-secondary"
          style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}
        >
          Chat Now
        </button>
      </div>

    </div>
  );
};

export default CustomerServicePage;
