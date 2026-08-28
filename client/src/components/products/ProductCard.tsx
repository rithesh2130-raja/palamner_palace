import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, ShoppingBag, Check, Loader2 } from 'lucide-react';
import { Product } from '../../types/product';
import { useCart } from '../../context/CartContext.jsx';
import { useWishlist } from '../../context/WishlistContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';

interface ProductCardProps {
  product: Product | any;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, className = '' }) => {
  const { addToCart, cartItems } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { showToast } = useToast();
  const [isAdding, setIsAdding] = useState(false);
  const [isWishlisting, setIsWishlisting] = useState(false);

  const id = product._id || product.id;
  const slug = product.slug || id;
  const name = product.name || product.title || 'Product Name';
  const imageUrl = product.images?.[0]?.url || product.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80';
  const imageAlt = product.images?.[0]?.alt || name;
  const brand = product.brand || 'ShopSphere';
  const price = product.price || 0;
  const compareAtPrice = product.compareAtPrice || product.originalPrice;
  
  let discountPercentage = product.discountPercentage;
  if (!discountPercentage && compareAtPrice && compareAtPrice > price) {
    discountPercentage = Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
  }

  const isSaved = isInWishlist ? isInWishlist(id) : false;
  const isInCart = cartItems ? cartItems.some((item: any) => (item.product._id || item.product.id) === id) : false;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isAdding) return;

    setIsAdding(true);
    try {
      if (addToCart) {
        await addToCart(product, 1);
        if (showToast) showToast(`Added "${name}" to cart!`, 'success');
      }
    } catch (err: any) {
      if (showToast) {
        showToast(err.message || 'Failed to add item to cart', 'error');
      }
    } finally {
      setIsAdding(false);
    }
  };

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isWishlisting) return;

    setIsWishlisting(true);
    try {
      if (toggleWishlist) {
        await toggleWishlist(product);
        if (showToast) {
          if (isSaved) {
            showToast(`Removed from wishlist`, 'info');
          } else {
            showToast(`Added to wishlist! ❤️`, 'success');
          }
        }
      }
    } catch (err: any) {
      if (showToast) showToast(err.message || 'Failed to update wishlist', 'error');
    } finally {
      setIsWishlisting(false);
    }
  };

  return (
    <div className={`group bg-surface border border-border rounded-xl overflow-hidden hover:border-brand-primary hover:shadow-xl transition-all duration-300 flex flex-col justify-between ${className}`}>
      <div>
        {/* Product Image Container */}
        <div className="relative aspect-square w-full bg-surface-secondary overflow-hidden">
          <img
            src={imageUrl}
            alt={imageAlt}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />

          {/* Discount Pill */}
          {discountPercentage && discountPercentage > 0 ? (
            <span className="absolute top-3 left-3 bg-brand-primary text-white text-[11px] font-black px-2.5 py-1 rounded shadow-sm uppercase tracking-wider">
              {discountPercentage}% OFF
            </span>
          ) : null}

          {/* Wishlist Button */}
          <button
            onClick={handleToggleWishlist}
            disabled={isWishlisting}
            aria-label={isSaved ? 'Remove from wishlist' : 'Add to wishlist'}
            className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all ${
              isSaved
                ? 'bg-brand-primary text-white shadow-md scale-110'
                : 'bg-surface/90 text-text-muted hover:text-brand-primary hover:bg-surface shadow-sm'
            }`}
          >
            {isWishlisting ? (
              <Loader2 className="w-4 h-4 animate-spin text-brand-primary" />
            ) : (
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-white' : ''}`} />
            )}
          </button>
        </div>

        {/* Product Info */}
        <div className="p-4 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold uppercase tracking-wider text-brand-primary">{brand}</span>
            {product.rating !== undefined && (
              <div className="flex items-center gap-1 text-text-primary font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span>{product.rating}</span>
                <span className="text-text-muted font-normal">({product.reviewCount || 0})</span>
              </div>
            )}
          </div>

          <Link to={`/products/${slug}`} className="block">
            <h3 className="text-sm font-bold text-text-primary group-hover:text-brand-primary transition-colors line-clamp-2 leading-snug">
              {name}
            </h3>
          </Link>
        </div>
      </div>

      {/* Pricing & CTA */}
      <div className="p-4 pt-0 space-y-3">
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-black text-text-primary">₹{price.toLocaleString('en-IN')}</span>
          {compareAtPrice && compareAtPrice > price && (
            <span className="text-xs text-text-muted line-through">₹{compareAtPrice.toLocaleString('en-IN')}</span>
          )}
        </div>

        <button
          onClick={handleAddToCart}
          disabled={isAdding || product.stock <= 0}
          className={`w-full py-2.5 px-4 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-all disabled:opacity-60 ${
            isInCart
              ? 'bg-emerald-600 text-white hover:bg-emerald-700'
              : 'bg-brand-primary hover:bg-brand-primary-hover text-white shadow-md hover:shadow-brand-primary/30'
          }`}
        >
          {isAdding ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>Adding...</span>
            </>
          ) : isInCart ? (
            <>
              <Check className="w-4 h-4" />
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

export default ProductCard;
