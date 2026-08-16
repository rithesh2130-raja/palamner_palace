import React, { useState, useRef, useEffect } from 'react';
import { Heart, MessageCircle, Share2, Bookmark, ShoppingBag, Volume2, VolumeX, Play, Pause, Sparkles, UserPlus, Clock } from 'lucide-react';
import ProductDrawer from './ProductDrawer';
import ShopThisReelModal from './ShopThisReelModal';

const ReelPlayer = ({ reel, isActive, onNext, onPrev }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [likesCount, setLikesCount] = useState(reel.likes ? reel.likes.length : 124);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showHeartAnim, setShowHeartAnim] = useState(false);

  // Video Playback Runtime State
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(reel.duration || 18);

  const formatTime = (secs) => {
    if (isNaN(secs) || secs === undefined || secs === 0) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Drawers & Modals
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showBundleModal, setShowBundleModal] = useState(false);

  const primaryVideoUrl = reel.videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';
  const fallbackVideoUrl = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4';

  // Play/Pause on isActive visibility change
  useEffect(() => {
    if (videoRef.current) {
      if (isActive) {
        videoRef.current.muted = isMuted;
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => setIsPlaying(true))
            .catch(() => setIsPlaying(false));
        }
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  }, [isActive, isMuted]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    }
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleDoubleTap = (e) => {
    e.stopPropagation();
    if (!isLiked) {
      setIsLiked(true);
      setLikesCount((prev) => prev + 1);
    }
    setShowHeartAnim(true);
    setTimeout(() => setShowHeartAnim(false), 800);
  };

  const creatorName = reel.creator ? reel.creator.name || 'Alex Tech' : 'TechCreator';
  const creatorUsername = reel.creator ? reel.creator.username || 'techcreator' : 'techcreator';
  const creatorAvatar = reel.creator ? reel.creator.avatar : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150';
  const taggedProducts = reel.products || [];
  const mainProductObj = taggedProducts.length > 0 ? taggedProducts[0] : null;

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#0a0a0a',
      position: 'relative',
      overflow: 'hidden',
    }}>
      
      {/* Centered Reel Frame (Desktop max-width 420px, Mobile 100%) */}
      <div
        onDoubleClick={handleDoubleTap}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '430px',
          height: '100%',
          maxHeight: '820px',
          backgroundColor: '#000000',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.8)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {/* HTML5 Video Player */}
        <video
          ref={videoRef}
          loop
          muted={isMuted}
          playsInline
          onClick={togglePlay}
          onTimeUpdate={() => {
            if (videoRef.current) {
              setCurrentTime(videoRef.current.currentTime);
              if (videoRef.current.duration) setDuration(videoRef.current.duration);
            }
          }}
          onLoadedMetadata={() => {
            if (videoRef.current && videoRef.current.duration) {
              setDuration(videoRef.current.duration);
            }
          }}
          onError={(e) => {
            e.target.src = fallbackVideoUrl;
            e.target.play().catch(() => {});
          }}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            cursor: 'pointer',
          }}
        >
          <source src={primaryVideoUrl} type="video/mp4" />
          <source src={fallbackVideoUrl} type="video/mp4" />
        </video>

        {/* Double Tap Heart Animation */}
        {showHeartAnim && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%) scale(1.5)',
            zIndex: 100,
            pointerEvents: 'none',
            animation: 'ping 0.6s ease-out'
          }}>
            <Heart size={90} color="#f43f5e" fill="#f43f5e" />
          </div>
        )}

        {/* Play Button Overlay Indicator when Paused */}
        {!isPlaying && (
          <div
            onClick={togglePlay}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              backgroundColor: 'rgba(0,0,0,0.6)',
              borderRadius: '50%',
              padding: '1.2rem',
              color: '#ffffff',
              cursor: 'pointer',
              zIndex: 10,
              backdropFilter: 'blur(4px)',
            }}
          >
            <Play size={40} fill="#ffffff" />
          </div>
        )}

        {/* Top Control Bar */}
        <div style={{
          position: 'absolute',
          top: '15px',
          left: '15px',
          right: '15px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 20,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#ffffff', fontWeight: '800', fontSize: '1rem', textShadow: '0 2px 4px rgba(0,0,0,0.6)' }}>
            Shop<span style={{ color: '#FFB000' }}>Sphere</span> REELS
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              backgroundColor: 'rgba(0, 0, 0, 0.65)',
              color: '#ffffff',
              padding: '0.3rem 0.7rem',
              borderRadius: '16px',
              fontSize: '0.75rem',
              fontWeight: '800',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              backdropFilter: 'blur(6px)',
              border: '1px solid rgba(255,255,255,0.2)',
            }}>
              <Clock size={12} color="#FFB000" />
              <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
            </div>

            <button
              onClick={toggleMute}
              style={{
                backgroundColor: 'rgba(0,0,0,0.6)',
                border: 'none',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                cursor: 'pointer',
              }}
            >
              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
          </div>
        </div>

        {/* Bottom Gold Video Seek Progress Bar */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '4px',
          backgroundColor: 'rgba(255, 255, 255, 0.25)',
          zIndex: 30,
        }}>
          <div style={{
            height: '100%',
            width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%`,
            backgroundColor: '#FFB000',
            transition: 'width 100ms linear',
            boxShadow: '0 0 8px rgba(255,176,0,0.8)',
          }} />
        </div>

        {/* Right Side Social Actions Bar */}
        <div style={{
          position: 'absolute',
          right: '12px',
          bottom: '110px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.2rem',
          zIndex: 20,
        }}>
          {/* Like */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <button
              onClick={(e) => { e.stopPropagation(); setIsLiked(!isLiked); setLikesCount((p) => (isLiked ? p - 1 : p + 1)); }}
              style={{
                backgroundColor: 'rgba(0,0,0,0.5)',
                border: 'none',
                borderRadius: '50%',
                width: '44px',
                height: '44px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: isLiked ? '#f43f5e' : '#ffffff',
              }}
            >
              <Heart size={22} fill={isLiked ? '#f43f5e' : 'none'} />
            </button>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#ffffff', marginTop: '0.2rem', textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>
              {likesCount}
            </span>
          </div>

          {/* Comment */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <button
              onClick={(e) => { e.stopPropagation(); alert('Comments thread'); }}
              style={{
                backgroundColor: 'rgba(0,0,0,0.5)',
                border: 'none',
                borderRadius: '50%',
                width: '44px',
                height: '44px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#ffffff',
              }}
            >
              <MessageCircle size={22} />
            </button>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#ffffff', marginTop: '0.2rem' }}>
              {reel.commentsCount || 18}
            </span>
          </div>

          {/* Save */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <button
              onClick={(e) => { e.stopPropagation(); setIsSaved(!isSaved); }}
              style={{
                backgroundColor: 'rgba(0,0,0,0.5)',
                border: 'none',
                borderRadius: '50%',
                width: '44px',
                height: '44px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: isSaved ? '#FFB000' : '#ffffff',
              }}
            >
              <Bookmark size={22} fill={isSaved ? '#FFB000' : 'none'} />
            </button>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#ffffff', marginTop: '0.2rem' }}>Save</span>
          </div>

          {/* Shop Reel Multi-Bundle CTA */}
          {taggedProducts.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <button
                onClick={(e) => { e.stopPropagation(); setShowBundleModal(true); }}
                style={{
                  backgroundColor: '#FFB000',
                  border: 'none',
                  borderRadius: '50%',
                  width: '46px',
                  height: '46px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#111827',
                  boxShadow: '0 0 15px rgba(255,176,0,0.7)',
                }}
              >
                <ShoppingBag size={22} />
              </button>
              <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#FFB000', marginTop: '0.2rem' }}>Shop</span>
            </div>
          )}
        </div>

        {/* Bottom Overlay: Creator info & Tagged Product Card */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '1.5rem 1.2rem 1.2rem 1.2rem',
          background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)',
          zIndex: 15,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.6rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <img src={creatorAvatar} alt="" style={{ width: '36px', height: '36px', borderRadius: '50%', border: '2px solid #FFB000', objectFit: 'cover' }} />
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: '800', color: '#ffffff' }}>@{creatorUsername}</div>
              <div style={{ fontSize: '0.7rem', color: '#9ca3af' }}>{creatorName}</div>
            </div>
            <button
              onClick={() => setIsFollowing(!isFollowing)}
              style={{
                padding: '0.25rem 0.7rem',
                borderRadius: '16px',
                border: 'none',
                backgroundColor: isFollowing ? 'rgba(255,255,255,0.2)' : '#FFB000',
                color: isFollowing ? '#ffffff' : '#111827',
                fontWeight: '800',
                fontSize: '0.7rem',
                cursor: 'pointer',
                marginLeft: '0.4rem',
              }}
            >
              {isFollowing ? 'Following' : '+ Follow'}
            </button>
          </div>

          <p style={{ color: '#ffffff', fontSize: '0.82rem', lineHeight: '1.3', margin: 0, fontWeight: '500' }}>
            {reel.caption}
          </p>

          {/* In-Stream Product Badge */}
          {mainProductObj && (
            <div
              onClick={(e) => {
                e.stopPropagation();
                setSelectedProduct(mainProductObj.product || mainProductObj);
              }}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '8px',
                padding: '0.5rem 0.8rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                marginTop: '0.2rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flex: 1, overflow: 'hidden' }}>
                <img
                  src={mainProductObj.product ? mainProductObj.product.image : 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=150'}
                  alt=""
                  style={{ width: '36px', height: '36px', objectFit: 'contain', backgroundColor: '#ffffff', borderRadius: '4px' }}
                />
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <div style={{ fontSize: '0.68rem', color: '#067d62', fontWeight: '800' }}>IN-STREAM SHOPPING</div>
                  <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {mainProductObj.product ? mainProductObj.product.name : 'Featured Item'}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontWeight: '800', fontSize: '0.9rem', color: '#111827' }}>
                  ${mainProductObj.product ? mainProductObj.product.price : '99.99'}
                </span>
                <button
                  className="btn btn-primary"
                  style={{ padding: '0.3rem 0.6rem', fontSize: '0.72rem', backgroundColor: '#FFB000', border: 'none', color: '#111827', fontWeight: '800', borderRadius: '4px' }}
                >
                  Shop
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {selectedProduct && (
        <ProductDrawer
          product={selectedProduct}
          discountTag="20% OFF"
          onClose={() => setSelectedProduct(null)}
        />
      )}

      {showBundleModal && (
        <ShopThisReelModal
          products={taggedProducts}
          onClose={() => setShowBundleModal(false)}
        />
      )}
    </div>
  );
};

export default ReelPlayer;
