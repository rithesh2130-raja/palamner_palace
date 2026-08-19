import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Heart, MessageCircle, Share2, Bookmark, ShoppingBag, Volume2, VolumeX, Play, Pause, Sparkles, Check, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext.jsx';
import { useWishlist } from '../../context/WishlistContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { MOCK_PRODUCTS } from '../../constants/mockProducts.js';

export const ReelCard = ({ reel }) => {
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likesCount, setLikesCount] = useState(reel.likesCount || 12400);

  const videoRef = useRef(null);
  const containerRef = useRef(null);

  const { addToCart, cartItems } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { showToast } = useToast();

  const product = reel.product || MOCK_PRODUCTS.find(p => p.id === reel.taggedProduct?.id) || MOCK_PRODUCTS[0];
  const isInCart = cartItems.some(item => item.product.id === product.id);

  // IntersectionObserver for Viewport Autoplay
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
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
      },
      { threshold: 0.6 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
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
    toggleWishlist(product);
    showToast(saved ? 'Removed from saved' : 'Saved Reel & Product to Wishlist! 🔖', 'success');
  };

  const handleShopNow = (e) => {
    e.stopPropagation();
    addToCart(product, 1);
    showToast(`Added "${product.title}" to cart! 🛍️`, 'success');
  };

  const handleViewProduct = (e) => {
    e.stopPropagation();
    navigate(`/products/${product.id}`);
  };

  return (
    <div
      ref={containerRef}
      onClick={togglePlay}
      className="relative w-full max-w-[360px] mx-auto aspect-[9/16] bg-black rounded-2xl overflow-hidden shadow-2xl flex flex-col justify-between cursor-pointer border border-neutral-800 group select-none"
    >
      {/* Video / Animated Poster */}
      {reel.videoUrl ? (
        <video
          ref={videoRef}
          src={reel.videoUrl}
          poster={reel.videoPoster || reel.thumbnailUrl}
          loop
          muted={isMuted}
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <img
          src={reel.videoPoster || reel.thumbnailUrl || product.image}
          alt={reel.caption}
          className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700 pointer-events-none"
        />
      )}

      {/* Overlay Dark Gradients for Text Contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/95 pointer-events-none"></div>

      {/* Top Header Row: Creator Handle & Sound Toggle */}
      <div className="relative z-10 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <img
            src={reel.creator?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
            alt={reel.creator?.name || 'PalamnerPalace'}
            className="w-9 h-9 rounded-full border-2 border-[#E50914] object-cover shadow"
          />
          <div>
            <div className="flex items-center gap-1">
              <span className="text-xs font-bold text-white leading-none">
                {reel.creator?.name || 'PalamnerPalace'}
              </span>
              <Sparkles className="w-3 h-3 text-[#E50914] fill-[#E50914]" />
            </div>
            <span className="text-[11px] text-neutral-300 font-medium">
              {reel.creator?.handle || '@palamnerpalace'}
            </span>
          </div>
        </div>

        <button
          onClick={toggleMute}
          aria-label={isMuted ? 'Unmute' : 'Mute'}
          className="p-2 rounded-full bg-black/60 text-white backdrop-blur-md hover:bg-black transition-all"
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Play/Pause Center Overlay */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="p-4 rounded-full bg-black/50 backdrop-blur-md text-white border border-white/20 animate-scaleUp">
            <Play className="w-8 h-8 fill-white translate-x-0.5" />
          </div>
        </div>
      )}

      {/* Right Side Social Actions Column */}
      <div className="absolute right-3 bottom-28 z-20 flex flex-col items-center gap-4">
        {/* Like */}
        <button onClick={handleLikeToggle} className="flex flex-col items-center gap-1 group/btn">
          <div className={`p-3 rounded-full backdrop-blur-md transition-all ${
            liked ? 'bg-[#E50914] text-white shadow-lg scale-110' : 'bg-black/60 text-white hover:bg-black'
          }`}>
            <Heart className={`w-5 h-5 ${liked ? 'fill-white' : ''}`} />
          </div>
          <span className="text-[11px] font-black text-white drop-shadow">
            {(likesCount / 1000).toFixed(1)}k
          </span>
        </button>

        {/* Comment */}
        <button onClick={(e) => { e.stopPropagation(); showToast('Comments section opening soon!', 'info'); }} className="flex flex-col items-center gap-1">
          <div className="p-3 bg-black/60 text-white hover:bg-black rounded-full backdrop-blur-md transition-all">
            <MessageCircle className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-black text-white drop-shadow">
            {reel.commentsCount || 412}
          </span>
        </button>

        {/* Share */}
        <button onClick={(e) => { e.stopPropagation(); showToast('Reel link copied to clipboard! ↗', 'success'); }} className="flex flex-col items-center gap-1">
          <div className="p-3 bg-black/60 text-white hover:bg-black rounded-full backdrop-blur-md transition-all">
            <Share2 className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-black text-white drop-shadow">
            {reel.sharesCount || 180}
          </span>
        </button>

        {/* Save */}
        <button onClick={handleSaveToggle} className="flex flex-col items-center gap-1">
          <div className={`p-3 rounded-full backdrop-blur-md transition-all ${
            saved ? 'bg-amber-500 text-black shadow-md' : 'bg-black/60 text-white hover:bg-black'
          }`}>
            <Bookmark className={`w-5 h-5 ${saved ? 'fill-black' : ''}`} />
          </div>
          <span className="text-[11px] font-black text-white drop-shadow">Save</span>
        </button>

        {/* Prominent Red SHOP NOW CTA Button */}
        <button
          onClick={handleShopNow}
          className="mt-2 p-3 bg-[#E50914] hover:bg-[#B20710] text-white rounded-full shadow-lg shadow-red-600/40 animate-pulse hover:animate-none transition-all flex flex-col items-center justify-center"
          title="Shop Now"
        >
          <ShoppingBag className="w-5 h-5" />
        </button>
      </div>

      {/* Bottom Information & Tagged Product Banner */}
      <div className="relative z-10 p-4 space-y-3 pr-14">
        {/* Caption */}
        <p className="text-xs text-white font-medium line-clamp-2 leading-relaxed drop-shadow">
          {reel.caption}
        </p>

        {/* Clickable Tagged Product Overlay Card */}
        <div
          onClick={handleViewProduct}
          className="bg-white/95 text-black rounded-xl p-2.5 shadow-2xl border border-neutral-200 flex items-center justify-between gap-3 hover:border-[#E50914] transition-all cursor-pointer"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src={product.image}
              alt={product.title}
              className="w-11 h-11 rounded-lg object-cover border border-neutral-200 shrink-0"
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
            className={`px-3 py-1.5 rounded-lg font-bold text-xs shrink-0 transition-all ${
              isInCart
                ? 'bg-emerald-600 text-white'
                : 'bg-[#E50914] hover:bg-[#B20710] text-white shadow-sm'
            }`}
          >
            {isInCart ? <Check className="w-3.5 h-3.5" /> : 'Shop'}
          </button>
        </div>
      </div>
    </div>
  );
};
