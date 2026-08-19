import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, MessageCircle, Share2, Bookmark, ShoppingBag, Volume2, VolumeX, Play, Star, Sparkles, Check } from 'lucide-react';
import { useCart } from '../../context/CartContext.jsx';
import { useWishlist } from '../../context/WishlistContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { getMediaUrl } from '../../utils/mediaUrl.js';
import { MOCK_PRODUCTS } from '../../constants/mockProducts.js';

export const ReelCard = ({ reel, isActive }) => {
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likesCount, setLikesCount] = useState(reel.likesCount || reel.likes || 12400);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);

  const videoRef = useRef(null);

  const { addToCart, cartItems } = useCart();
  const { toggleWishlist } = useWishlist();
  const { showToast } = useToast();

  const product = reel.product || reel.taggedProduct || MOCK_PRODUCTS.find(p => p.id === reel.taggedProduct?.id) || MOCK_PRODUCTS[0];
  const isInCart = cartItems.some(item => item.product?.id === product?.id);

  // Play/Pause based on Active State from Parent Feed Observer
  useEffect(() => {
    if (isActive) {
      if (videoRef.current) {
        videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      } else {
        setIsPlaying(true);
      }
    } else {
      if (videoRef.current) {
        videoRef.current.pause();
      }
      setIsPlaying(false);
    }
  }, [isActive]);

  const togglePlay = (e) => {
    e.stopPropagation();
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      }
    } else {
      setIsPlaying(prev => !prev);
    }
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
    setIsMuted(prev => !prev);
  };

  const handleLikeToggle = (e) => {
    e.stopPropagation();
    if (liked) {
      setLiked(false);
      setLikesCount(prev => prev - 1);
    } else {
      setLiked(true);
      setLikesCount(prev => prev + 1);
      showToast('Liked Reel! ❤️', 'info');
    }
  };

  const handleSaveToggle = (e) => {
    e.stopPropagation();
    setSaved(prev => !prev);
    if (product) toggleWishlist(product);
    showToast(saved ? 'Removed from saved' : 'Saved Reel & Product to Wishlist! 🔖', 'success');
  };

  const handleShopNow = (e) => {
    e.stopPropagation();
    if (product) {
      addToCart(product, 1);
      showToast(`Added "${product.title}" to cart! 🛍️`, 'success');
    }
  };

  const handleViewProduct = (e) => {
    e.stopPropagation();
    if (product) {
      navigate(`/products/${product.id}`);
    }
  };

  const rawPoster = reel.thumbnailUrl || reel.videoPoster || product?.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80';
  const rawVideo = reel.videoUrl;

  const posterSrc = getMediaUrl(rawPoster);
  const videoSrc = getMediaUrl(rawVideo);

  return (
    <div
      onClick={togglePlay}
      className="relative w-full h-full max-w-[420px] mx-auto aspect-[9/16] bg-black overflow-hidden flex flex-col justify-between cursor-pointer border border-neutral-800 shadow-2xl select-none group"
    >
      {/* Video Stream or Poster Fallback */}
      {videoSrc && !videoError ? (
        <video
          ref={videoRef}
          src={videoSrc}
          poster={posterSrc}
          loop
          muted={isMuted}
          playsInline
          preload="metadata"
          onLoadedData={() => setVideoLoaded(true)}
          onError={(e) => {
            console.error('REEL VIDEO PLAYBACK ERROR', e.currentTarget.error, e.currentTarget.src);
            setVideoError(true);
          }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <img
          src={posterSrc}
          alt={reel.caption || 'Reel video poster'}
          className="absolute inset-0 w-full h-full object-cover opacity-90 transition-transform duration-700 pointer-events-none"
        />
      )}

      {/* Dark Overlay Gradients for Contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/90 pointer-events-none"></div>

      {/* Top Header Bar: Creator Avatar & Sound Button */}
      <div className="relative z-20 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <img
            src={getMediaUrl(reel.creator?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80')}
            alt={reel.creator?.name || 'PalamnerPalace'}
            className="w-9 h-9 rounded-full border-2 border-[#E50914] object-cover shadow"
          />
          <div>
            <div className="flex items-center gap-1">
              <span className="text-xs font-black text-white leading-none">
                {reel.creator?.name || 'PalamnerPalace'}
              </span>
              <Sparkles className="w-3.5 h-3.5 text-[#E50914] fill-[#E50914]" />
            </div>
            <span className="text-[11px] text-neutral-300 font-medium">
              {reel.creator?.handle || '@palamnerpalace'}
            </span>
          </div>
        </div>

        <button
          onClick={toggleMute}
          aria-label={isMuted ? 'Unmute video' : 'Mute video'}
          className="p-2.5 rounded-full bg-black/60 text-white backdrop-blur-md hover:bg-black transition-all"
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>
      </div>

      {/* Play/Pause Overlay Indicator */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          <div className="p-4 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20 animate-scaleUp">
            <Play className="w-8 h-8 fill-white translate-x-0.5" />
          </div>
        </div>
      )}

      {/* Right-Side Vertical Action Column */}
      <div className="absolute right-3 bottom-28 z-30 flex flex-col items-center gap-5">
        {/* Like Button */}
        <button
          onClick={handleLikeToggle}
          aria-label="Like Reel"
          className="flex flex-col items-center gap-1 group/btn"
        >
          <div className={`p-3 rounded-full backdrop-blur-md transition-all ${
            liked ? 'bg-[#E50914] text-white shadow-lg scale-110' : 'bg-black/60 text-white hover:bg-black'
          }`}>
            <Heart className={`w-6 h-6 ${liked ? 'fill-white' : ''}`} />
          </div>
          <span className="text-[11px] font-black text-white drop-shadow">
            {typeof likesCount === 'number' && likesCount > 999 ? `${(likesCount / 1000).toFixed(1)}k` : likesCount}
          </span>
        </button>

        {/* Comment Button */}
        <button
          onClick={(e) => { e.stopPropagation(); showToast('Comments section opening soon!', 'info'); }}
          aria-label="Comment on Reel"
          className="flex flex-col items-center gap-1"
        >
          <div className="p-3 bg-black/60 text-white hover:bg-black rounded-full backdrop-blur-md transition-all">
            <MessageCircle className="w-6 h-6" />
          </div>
          <span className="text-[11px] font-black text-white drop-shadow">
            {reel.commentsCount || reel.comments || 412}
          </span>
        </button>

        {/* Share Button */}
        <button
          onClick={(e) => { e.stopPropagation(); showToast('Reel link copied to clipboard! ↗', 'success'); }}
          aria-label="Share Reel"
          className="flex flex-col items-center gap-1"
        >
          <div className="p-3 bg-black/60 text-white hover:bg-black rounded-full backdrop-blur-md transition-all">
            <Share2 className="w-6 h-6" />
          </div>
          <span className="text-[11px] font-black text-white drop-shadow">
            {reel.sharesCount || reel.shares || 180}
          </span>
        </button>

        {/* Save Button */}
        <button
          onClick={handleSaveToggle}
          aria-label="Save Reel"
          className="flex flex-col items-center gap-1"
        >
          <div className={`p-3 rounded-full backdrop-blur-md transition-all ${
            saved ? 'bg-amber-500 text-black shadow-md' : 'bg-black/60 text-white hover:bg-black'
          }`}>
            <Bookmark className={`w-6 h-6 ${saved ? 'fill-black' : ''}`} />
          </div>
          <span className="text-[11px] font-black text-white drop-shadow">Save</span>
        </button>

        {/* Prominent Red SHOP NOW CTA Button */}
        <button
          onClick={handleShopNow}
          aria-label="Shop product"
          className="mt-1 p-3.5 bg-[#E50914] hover:bg-[#B20710] text-white rounded-full shadow-xl shadow-red-600/50 animate-pulse hover:animate-none transition-all flex flex-col items-center justify-center"
          title="Shop Now"
        >
          <ShoppingBag className="w-6 h-6" />
        </button>
      </div>

      {/* Bottom Area: Caption & Tagged Product Overlay */}
      <div className="relative z-20 p-4 space-y-3 pr-16 pb-6">
        <p className="text-xs text-white font-medium line-clamp-2 leading-relaxed drop-shadow">
          {reel.caption}
        </p>

        {/* Clickable Tagged Product Card */}
        {product && (
          <div
            onClick={handleViewProduct}
            className="bg-white/95 text-black rounded-xl p-3 shadow-2xl border border-neutral-200 flex items-center justify-between gap-3 hover:border-[#E50914] transition-all cursor-pointer"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src={getMediaUrl(product.image)}
                alt={product.title}
                className="w-12 h-12 rounded-lg object-cover border border-neutral-200 shrink-0"
              />
              <div className="min-w-0">
                <span className="text-[9px] uppercase font-black text-[#E50914] tracking-wider block">
                  Tagged Product
                </span>
                <h5 className="text-xs font-bold text-black truncate">{product.title}</h5>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="text-xs font-black text-black">₹{product.price?.toLocaleString('en-IN')}</span>
                  {product.originalPrice > product.price && (
                    <span className="text-[10px] text-neutral-500 line-through">₹{product.originalPrice?.toLocaleString('en-IN')}</span>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={handleShopNow}
              aria-label="Shop product"
              className={`px-3 py-2 rounded-lg font-bold text-xs shrink-0 transition-all ${
                isInCart
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#E50914] hover:bg-[#B20710] text-white shadow-sm'
              }`}
            >
              {isInCart ? <Check className="w-4 h-4" /> : 'SHOP NOW'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
