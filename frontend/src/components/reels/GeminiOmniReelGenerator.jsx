import React, { useState, useEffect } from 'react';
import { Sparkles, Wand2, Video, Play, CheckCircle2, Film, Mic, Tag, RefreshCw, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const GeminiOmniReelGenerator = ({ onPublished }) => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [tone, setTone] = useState('Energetic Unboxing');
  const [customPrompt, setCustomPrompt] = useState('');
  const [generating, setGenerating] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [generatedReel, setGeneratedReel] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
          if (data.length > 0) {
            setSelectedProductId(data[0]._id);
          }
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchProducts();
  }, []);

  const handleGenerateOmni = async () => {
    if (!selectedProductId) return alert('Please select a product first!');
    setGenerating(true);
    setGeneratedReel(null);

    try {
      const res = await fetch('/api/reels/generate-omni', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: selectedProductId,
          tone,
          customPrompt,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setTimeout(() => {
          setGeneratedReel(data.generatedReel);
          setGenerating(false);
        }, 1000);
      } else {
        setGenerating(false);
        alert('Omni AI synthesis failed. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setGenerating(false);
    }
  };

  const handlePublishReel = async () => {
    if (!generatedReel) return;
    setPublishing(true);

    try {
      const res = await fetch('/api/reels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoUrl: generatedReel.videoUrl,
          thumbnailUrl: generatedReel.thumbnailUrl,
          caption: generatedReel.caption,
          category: generatedReel.category,
          hashtags: generatedReel.hashtags,
          productIds: [generatedReel.productId],
        }),
      });

      if (res.ok) {
        alert('✨ Gemini Omni Video Reel created and published to ShopSphere Discovery Feed!');
        if (onPublished) onPublished();
        else navigate('/reels');
      } else {
        const data = await res.json();
        alert(`Video creation status: ${data.message || 'Published to feed'}`);
        navigate('/reels');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setPublishing(false);
    }
  };

  const selectedProdObj = products.find((p) => p._id === selectedProductId);

  return (
    <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: '12px', padding: '2rem', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-md)' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <div style={{ backgroundColor: '#FFB000', padding: '0.6rem', borderRadius: '10px', color: '#111827' }}>
            <Wand2 size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: '800', margin: 0, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              Gemini Omni AI Video Reel Generator
            </h2>
            <span style={{ fontSize: '0.8rem', color: '#2563eb', fontWeight: '700' }}>
              Multimodal 9:16 Short-Form Video & Storyboard Synthesizer
            </span>
          </div>
        </div>

        <span style={{ backgroundColor: '#eff6ff', color: '#1d4ed8', fontSize: '0.75rem', fontWeight: '800', padding: '0.3rem 0.8rem', borderRadius: '20px', border: '1px solid #bfdbfe' }}>
          Gemini 1.5 Omni Vision
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: generatedReel ? '1fr 1.2fr' : '1fr', gap: '2rem' }}>
        
        {/* Left Column: AI Config Inputs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div className="form-group">
            <label className="form-label" style={{ fontWeight: '700', color: 'var(--text-primary)' }}>
              1. Select Target Catalog Product
            </label>
            <select
              className="form-control"
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              style={{ fontSize: '0.9rem', fontWeight: '600' }}
            >
              {products.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name} — ${p.price} ({p.category})
                </option>
              ))}
            </select>
          </div>

          {selectedProdObj && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', backgroundColor: 'var(--bg-secondary)', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <img src={selectedProdObj.image} alt="" style={{ width: '50px', height: '50px', objectFit: 'contain', backgroundColor: '#ffffff', borderRadius: '6px', padding: '0.2rem' }} />
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-primary)' }}>{selectedProdObj.name}</div>
                <div style={{ fontSize: '0.8rem', fontWeight: '800', color: '#067d62' }}>${selectedProdObj.price} • {selectedProdObj.brand}</div>
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label" style={{ fontWeight: '700', color: 'var(--text-primary)' }}>
              2. Select Reel Presentation Style & Tone
            </label>
            <select className="form-control" value={tone} onChange={(e) => setTone(e.target.value)}>
              <option value="Energetic Unboxing">🔥 Energetic Unboxing & First Impression</option>
              <option value="Aesthetic Setup">⚡ Aesthetic Desk Setup & Daily Use</option>
              <option value="Flash Deal Promo">💰 High-Conversion Flash Deal Promo</option>
              <option value="Tech Deep-Dive">🎧 Professional Tech Feature Breakdown</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" style={{ fontWeight: '700', color: 'var(--text-primary)' }}>
              3. Additional AI Prompt Instructions (Optional)
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Focus on active noise cancellation and RGB lights..."
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
            />
          </div>

          <button
            type="button"
            onClick={handleGenerateOmni}
            className="btn btn-primary"
            disabled={generating}
            style={{
              backgroundColor: '#FFB000',
              border: 'none',
              color: '#111827',
              fontWeight: '800',
              height: '48px',
              borderRadius: '8px',
              fontSize: '0.95rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.6rem',
              marginTop: '0.5rem',
            }}
          >
            {generating ? (
              <>
                <RefreshCw className="animate-spin" size={20} /> Synthesizing Multimodal Reel with Gemini...
              </>
            ) : (
              <>
                <Sparkles size={20} /> Generate Omni AI Video Reel
              </>
            )}
          </button>
        </div>

        {/* Right Column: Generated Preview & Script Breakdown */}
        {generatedReel && (
          <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: '800', color: '#067d62', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <CheckCircle2 size={16} /> AI Reel Ready
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{generatedReel.audioTrack}</span>
            </div>

            {/* Video Preview */}
            <div style={{ position: 'relative', height: '240px', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#000000', marginBottom: '1rem' }}>
              <video src={generatedReel.videoUrl} poster={generatedReel.thumbnailUrl} controls style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>

            {/* Script Breakdown */}
            <div style={{ marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                AI Storyboard & Voiceover Script
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '0.4rem' }}>
                {generatedReel.script.map((s, idx) => (
                  <div key={idx} style={{ backgroundColor: '#ffffff', padding: '0.5rem 0.8rem', borderRadius: '6px', fontSize: '0.78rem', border: '1px solid #e5e7eb' }}>
                    <strong style={{ color: '#2563eb' }}>[{s.time}] {s.step}:</strong> {s.text}
                  </div>
                ))}
              </div>
            </div>

            {/* Caption & Tags */}
            <div className="form-group">
              <label className="form-label" style={{ fontSize: '0.8rem' }}>AI Generated Caption</label>
              <textarea
                rows="2"
                className="form-control"
                value={generatedReel.caption}
                onChange={(e) => setGeneratedReel({ ...generatedReel, caption: e.target.value })}
                style={{ fontSize: '0.85rem' }}
              />
            </div>

            <button
              onClick={handlePublishReel}
              className="btn btn-primary btn-block"
              disabled={publishing}
              style={{ backgroundColor: '#067d62', border: 'none', color: '#ffffff', fontWeight: '800', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            >
              <Send size={16} /> {publishing ? 'Publishing...' : 'Publish AI Omni Reel to Feed'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GeminiOmniReelGenerator;
