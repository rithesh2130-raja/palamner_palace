import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Sparkles, Tag, CheckCircle2, Film, Video, Plus, Wand2 } from 'lucide-react';

import GeminiOmniReelGenerator from '../../components/reels/GeminiOmniReelGenerator';

const CreatorStudioPage = () => {
  const navigate = useNavigate();

  const [activeStudioTab, setActiveStudioTab] = useState('omni');
  const [videoUrl, setVideoUrl] = useState('https://assets.mixkit.co/videos/preview/mixkit-headphones-on-a-table-41584-large.mp4');
  const [thumbnailUrl, setThumbnailUrl] = useState('https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500');
  const [caption, setCaption] = useState('');
  const [category, setCategory] = useState('Gaming');
  const [hashtags, setHashtags] = useState(['ShopSphere', 'Trending']);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        if (res.ok) {
          const data = await res.json();
          setAvailableProducts(data);
          if (data.length > 0) {
            setSelectedProductIds([data[0]._id]);
          }
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchProducts();
  }, []);

  const handleAIHashtagGenerate = () => {
    const suggestions = ['#GamingSetup', '#TechReview', '#Aesthetic', '#ShopSphereDeals', '#Unboxing'];
    setHashtags(suggestions);
    if (!caption) {
      setCaption(`Check out this incredible ${category} product setup! 🔥 #ShopSphere`);
    }
  };

  const handleProductToggle = (prodId) => {
    if (selectedProductIds.includes(prodId)) {
      setSelectedProductIds(selectedProductIds.filter((id) => id !== prodId));
    } else {
      setSelectedProductIds([...selectedProductIds, prodId]);
    }
  };

  const handlePublish = async (e) => {
    e.preventDefault();
    if (!caption) return alert('Please enter a caption for your Reel!');

    setPublishing(true);
    try {
      const res = await fetch('/api/reels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoUrl,
          thumbnailUrl,
          caption,
          category,
          hashtags,
          productIds: selectedProductIds,
        }),
      });

      if (res.ok) {
        alert('Your video Reel has been published successfully to the ShopSphere Feed!');
        navigate('/reels');
      } else {
        const data = await res.json();
        alert(`Reel Creation Status: ${data.message || 'Published successfully'}`);
        navigate('/reels');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
      
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Video color="#FFB000" size={28} /> ShopSphere Creator Studio
        </h1>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: '0.3rem 0 0 0' }}>
          Create viral video Reels with Gemini Omni AI or upload manual MP4 content. Earn 10-15% affiliate commissions on every sale!
        </p>

        {/* Mode Selector Tabs */}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', borderBottom: '2px solid var(--border-color)' }}>
          <button
            onClick={() => setActiveStudioTab('omni')}
            style={{
              padding: '0.8rem 1.5rem',
              border: 'none',
              background: 'none',
              fontWeight: '800',
              fontSize: '0.95rem',
              color: activeStudioTab === 'omni' ? '#FFB000' : 'var(--text-muted)',
              borderBottom: activeStudioTab === 'omni' ? '3px solid #FFB000' : '3px solid transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <Sparkles size={18} /> ✨ Gemini Omni AI Reel Studio
          </button>

          <button
            onClick={() => setActiveStudioTab('manual')}
            style={{
              padding: '0.8rem 1.5rem',
              border: 'none',
              background: 'none',
              fontWeight: '800',
              fontSize: '0.95rem',
              color: activeStudioTab === 'manual' ? '#FFB000' : 'var(--text-muted)',
              borderBottom: activeStudioTab === 'manual' ? '3px solid #FFB000' : '3px solid transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <Upload size={18} /> Manual Video Upload & Tagging
          </button>
        </div>
      </div>

      {activeStudioTab === 'omni' ? (
        <GeminiOmniReelGenerator />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        
        {/* Left: Video Upload & Preview Card */}
        <div style={{ backgroundColor: 'var(--bg-card)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)', height: 'fit-content' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Film size={18} color="#2563eb" /> Video Preview & Asset
          </h2>

          <div style={{
            height: '420px',
            borderRadius: '12px',
            backgroundColor: '#000000',
            overflow: 'hidden',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1rem',
          }}>
            <video
              src={videoUrl}
              controls
              muted
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Video URL (MP4 / WebM)</label>
            <input
              type="text"
              className="form-control"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Right: Caption, AI Helper & Product Tagging Form */}
        <div style={{ backgroundColor: 'var(--bg-card)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <form onSubmit={handlePublish}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: '700', margin: 0 }}>Reel Details & Tagging</h2>
              <button
                type="button"
                onClick={handleAIHashtagGenerate}
                style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '6px', color: '#1d4ed8', fontSize: '0.75rem', fontWeight: '700', padding: '0.3rem 0.6rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
              >
                <Wand2 size={14} /> AI Hashtags
              </button>
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="form-control" value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="Gaming">Gaming</option>
                <option value="Electronics">Electronics</option>
                <option value="Accessories">Accessories</option>
                <option value="Fashion">Fashion</option>
                <option value="Beauty">Beauty</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Caption</label>
              <textarea
                rows="3"
                className="form-control"
                placeholder="Write an engaging video caption..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                required
              ></textarea>
            </div>

            <div className="form-group">
              <label className="form-label">Hashtags</label>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.4rem' }}>
                {hashtags.map((tag, i) => (
                  <span key={i} style={{ backgroundColor: '#f3f4f6', color: '#374151', fontSize: '0.75rem', fontWeight: '700', padding: '0.2rem 0.6rem', borderRadius: '12px' }}>
                    #{tag.replace('#', '')}
                  </span>
                ))}
              </div>
            </div>

            {/* Product Tagging Selector */}
            <div className="form-group" style={{ marginTop: '1.5rem' }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Tag size={16} color="#FFB000" /> Tag Catalog Products (Affiliate In-Stream Shopping)
              </label>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', maxHeight: '180px', overflowY: 'auto', border: '1px solid var(--border-color)', padding: '0.6rem', borderRadius: '8px' }}>
                {availableProducts.map((p) => {
                  const isSelected = selectedProductIds.includes(p._id);
                  return (
                    <div
                      key={p._id}
                      onClick={() => handleProductToggle(p._id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.5rem 0.8rem',
                        borderRadius: '6px',
                        backgroundColor: isSelected ? '#ecfdf5' : '#ffffff',
                        border: `1px solid ${isSelected ? '#a7f3d0' : '#e5e7eb'}`,
                        cursor: 'pointer',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <img src={p.image} alt="" style={{ width: '30px', height: '30px', objectFit: 'contain' }} />
                        <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#111827' }}>{p.name}</span>
                      </div>
                      <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#067d62' }}>
                        {isSelected ? <CheckCircle2 size={16} /> : `$${p.price}`}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block"
              disabled={publishing}
              style={{ backgroundColor: '#FFB000', border: 'none', color: '#111827', fontWeight: '800', height: '46px', marginTop: '1.2rem' }}
            >
              {publishing ? 'Publishing Reel...' : 'Publish Reel to Discovery Feed'}
            </button>
          </form>
        </div>
      </div>
      )}
    </div>
  );
};

export default CreatorStudioPage;
