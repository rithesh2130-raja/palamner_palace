import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, ShoppingBag, Check } from 'lucide-react';
import { useCart } from '../../context/CartContext.jsx';
import { useWishlist } from '../../context/WishlistContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';

export const ProductCard = ({ product }) => {
  const { addToCart, cartItems } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { showToast } = useToast();

  const isSaved = isInWishlist(product.id);
  const isInCart = cartItems.some(item => item.product.id === product.id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    showToast(`Added "${product.title}" to cart!`, 'success');
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
    if (isSaved) {
      showToast(`Removed from wishlist`, 'info');
    } else {
      showToast(`Added to wishlist! ❤️`, 'success');
    }
  };

  return (
    <div className="group bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Image Container */}
        <div className="relative aspect-square w-full bg-slate-950 overflow-hidden">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />

          {/* Discount Badge */}
          {product.discountPercentage > 0 && (
            <span className="absolute top-3 left-3 bg-amber-500 text-slate-950 text-[11px] font-black px-2.5 py-1 rounded-lg shadow-md uppercase tracking-wider">
              {product.discountPercentage}% OFF
            </span>
          )}

          {/* Wishlist Button */}
          <button
            onClick={handleToggleWishlist}
            aria-label={isSaved ? 'Remove from wishlist' : 'Add to wishlist'}
            className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all ${
              isSaved
                ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30 scale-110'
                : 'bg-slate-900/70 text-slate-300 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-white' : ''}`} />
          </button>
        </div>

        {/* Info */}
        <div className="p-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold uppercase tracking-wider text-amber-400/90">{product.brand}</span>
            <div className="flex items-center gap-1 text-amber-400 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>{product.rating}</span>
              <span className="text-slate-500 font-normal">({product.reviewCount})</span>
            </div>
          </div>

          <Link to={`/products/${product.id}`} className="block">
            <h3 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-2 leading-snug">
              {product.title}
            </h3>
          </Link>
        </div>
      </div>

      {/* Pricing & CTA */}
      <div className="p-4 pt-0 space-y-3">
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-black text-white">₹{product.price.toLocaleString('en-IN')}</span>
          {product.originalPrice > product.price && (
            <span className="text-xs text-slate-500 line-through">₹{product.originalPrice.toLocaleString('en-IN')}</span>
          )}
        </div>

        <button
          onClick={handleAddToCart}
          className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
            isInCart
              ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-600/30'
              : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md hover:shadow-amber-500/20'
          }`}
        >
          {isInCart ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span>In Cart (+1)</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-4 h-4" />
              <span>Add to Cart</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
