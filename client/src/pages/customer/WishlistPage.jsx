import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../../context/WishlistContext.jsx';
import { ProductCard } from '../../components/common/ProductCard.jsx';
import { Heart, ShoppingBag, ArrowRight, Loader2 } from 'lucide-react';

export const WishlistPage = () => {
  const { wishlistItems, wishlistCount, loading } = useWishlist();

  if (loading && wishlistItems.length === 0) {
    return (
      <div className="bg-surface min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3 text-text-muted">
          <Loader2 className="w-6 h-6 animate-spin text-brand-primary" />
          <span className="font-semibold text-sm">Loading your wishlist...</span>
        </div>
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="bg-surface min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-surface-secondary border border-border rounded-2xl p-12 text-center max-w-lg mx-auto space-y-5 shadow-sm">
            <div className="w-20 h-20 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto text-brand-primary">
              <Heart className="w-10 h-10" />
            </div>
            <div className="space-y-1">
              <h2 className="text-2xl font-black text-text-primary">Your wishlist is empty</h2>
              <p className="text-sm text-text-muted">Save products you love and find them here later.</p>
            </div>
            <Link
              to="/products"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-brand-primary text-white font-bold text-sm rounded-xl hover:bg-brand-primary-hover shadow-lg shadow-brand-primary/20 transition-all"
            >
              <span>EXPLORE PRODUCTS</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="border-b border-border pb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-text-primary tracking-tight flex items-center gap-3">
              <Heart className="w-7 h-7 text-brand-primary fill-brand-primary" />
              <span>MY WISHLIST ({wishlistCount} items)</span>
            </h1>
            <p className="text-xs text-text-muted mt-1">Products you saved for future purchases.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlistItems.map((product) => (
            <ProductCard key={product._id || product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;
