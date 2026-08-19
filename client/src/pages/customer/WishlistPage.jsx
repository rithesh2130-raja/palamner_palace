import React from 'react';
import { useWishlist } from '../../context/WishlistContext.jsx';
import { ProductCard } from '../../components/common/ProductCard.jsx';
import { EmptyState } from '../../components/ui/EmptyState.jsx';
import { Heart } from 'lucide-react';

export const WishlistPage = () => {
  const { wishlistItems } = useWishlist();

  if (wishlistItems.length === 0) {
    return (
      <div className="bg-white min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <EmptyState
            icon={Heart}
            title="Your Wishlist is Empty"
            description="Explore our product catalog and click the heart icon on any item to save it for later!"
            actionLabel="Explore Products"
            actionTo="/products"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="border-b border-neutral-200 pb-6">
          <h1 className="text-3xl font-black text-black tracking-tight flex items-center gap-3">
            <Heart className="w-8 h-8 text-[#E50914] fill-[#E50914]" />
            <span>My Wishlist ({wishlistItems.length} items)</span>
          </h1>
          <p className="text-xs text-neutral-500 mt-1">Your saved products for future purchase.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlistItems.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};
