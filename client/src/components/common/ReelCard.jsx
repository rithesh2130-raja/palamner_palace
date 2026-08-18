import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, ShoppingBag, Sparkles, Check } from 'lucide-react';
import { useCart } from '../../context/CartContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { MOCK_PRODUCTS } from '../../constants/mockProducts.js';

export const ReelCard = ({ reel }) => {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(reel.likesCount);
  const { addToCart, cartItems } = useCart();
  const { showToast } = useToast();

  const product = MOCK_PRODUCTS.find(p => p.id === reel.taggedProduct.id) || MOCK_PRODUCTS[0];
  const isInCart = cartItems.some(item => item.product.id === product.id);

  const handleLikeToggle = () => {
    if (liked) {
      setLiked(false);
      setLikesCount(prev => prev - 1);
    } else {
      setLiked(true);
      setLikesCount(prev => prev + 1);
      showToast('Liked reel! ❤️', 'info');
    }
  };

  const handleQuickAdd = () => {
    addToCart(product, 1);
    showToast(`Added tagged product "${product.title}" to cart! 🛍️`, 'success');
  };

  return (
    <div className="relative w-full max-w-sm mx-auto h-[620px] bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between group">
      {/* Background Poster / Simulated Video */}
      <img
        src={reel.videoPoster}
        alt={reel.caption}
        className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700 pointer-events-none"
      />

      {/* Overlay Gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-transparent to-slate-950/95 pointer-events-none"></div>

      {/* Top Bar: Creator Info */}
      <div className="relative z-10 p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={reel.creator.avatar}
            alt={reel.creator.name}
            className="w-10 h-10 rounded-full border-2 border-amber-400 object-cover shadow-lg"
          />
          <div>
            <div className="flex items-center gap-1">
              <h4 className="text-sm font-bold text-white leading-none">{reel.creator.name}</h4>
              {reel.creator.verified && (
                <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              )}
            </div>
            <span className="text-xs text-slate-300 font-medium">{reel.creator.handle}</span>
          </div>
        </div>

        <span className="px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-400 text-[11px] font-bold uppercase tracking-wider">
          Reel Commerce
        </span>
      </div>

      {/* Right Floating Social Action Sidebar */}
      <div className="absolute right-4 bottom-32 z-20 flex flex-col items-center gap-5">
        <button
          onClick={handleLikeToggle}
          className="flex flex-col items-center gap-1 group/btn"
        >
          <div
            className={`p-3 rounded-full backdrop-blur-md transition-all ${
              liked
                ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/40 scale-110'
                : 'bg-slate-900/60 text-white hover:bg-slate-900'
            }`}
          >
            <Heart className={`w-5 h-5 ${liked ? 'fill-white' : ''}`} />
          </div>
          <span className="text-[11px] font-extrabold text-white drop-shadow">
            {(likesCount / 1000).toFixed(1)}k
          </span>
        </button>

        <button className="flex flex-col items-center gap-1">
          <div className="p-3 bg-slate-900/60 text-white hover:bg-slate-900 rounded-full backdrop-blur-md transition-all">
            <MessageCircle className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-extrabold text-white drop-shadow">
            {reel.commentsCount}
          </span>
        </button>

        <button className="flex flex-col items-center gap-1">
          <div className="p-3 bg-slate-900/60 text-white hover:bg-slate-900 rounded-full backdrop-blur-md transition-all">
            <Share2 className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-extrabold text-white drop-shadow">
            {reel.sharesCount}
          </span>
        </button>
      </div>

      {/* Bottom Content: Caption & Tagged Product Overlay Card */}
      <div className="relative z-10 p-5 space-y-4 pr-16">
        <p className="text-xs sm:text-sm text-slate-100 font-medium line-clamp-2 leading-relaxed drop-shadow">
          {reel.caption}
        </p>

        {/* Tagged Product Interactive Card */}
        <div className="bg-slate-900/90 border border-amber-500/40 rounded-2xl p-3 backdrop-blur-md shadow-2xl flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={product.image}
              alt={product.title}
              className="w-12 h-12 rounded-xl object-cover border border-slate-700 shrink-0"
            />
            <div className="min-w-0">
              <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                Tagged Product
              </span>
              <h5 className="text-xs font-bold text-white truncate">{product.title}</h5>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-xs font-extrabold text-white">₹{product.price.toLocaleString('en-IN')}</span>
                <span className="text-[10px] text-amber-400 font-bold">{reel.taggedProduct.discount}</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleQuickAdd}
            className={`p-2.5 rounded-xl font-bold text-xs shrink-0 transition-all ${
              isInCart
                ? 'bg-emerald-600 text-white'
                : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/30'
            }`}
            title="Buy tagged product"
          >
            {isInCart ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
