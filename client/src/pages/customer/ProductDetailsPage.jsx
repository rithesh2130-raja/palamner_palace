import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { productService } from '../../services/api/productApi.js';
import { useCart } from '../../context/CartContext.jsx';
import { useWishlist } from '../../context/WishlistContext.jsx';
import { useLocationContext } from '../../context/LocationContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Star, Heart, ShoppingBag, MapPin, ArrowLeft, Share2 } from 'lucide-react';

export const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { location } = useLocationContext();
  const { showToast } = useToast();

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      try {
        const prod = await productService.getProductById(id);
        setProduct(prod);
      } catch (err) {
        console.error('Failed to load product details:', err);
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-neutral-500 animate-pulse">
        Loading product details...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-black">Product Not Found</h2>
        <Button variant="primary" onClick={() => navigate('/products')}>
          Back to Catalog
        </Button>
      </div>
    );
  }

  const isSaved = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    showToast(`Added ${quantity} item(s) to cart!`, 'success');
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/cart');
  };

  const handleWishlistToggle = () => {
    toggleWishlist(product);
    showToast(isSaved ? 'Removed from wishlist' : 'Saved to wishlist ❤️', 'info');
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <Link to="/products" className="inline-flex items-center gap-2 text-xs font-bold text-neutral-600 hover:text-[#E50914]">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Products</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 bg-white border border-neutral-200 rounded-2xl p-6 sm:p-10 shadow-lg">
          {/* Image */}
          <div className="space-y-4">
            <div className="relative aspect-square w-full bg-neutral-100 rounded-xl overflow-hidden border border-neutral-200">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-full object-cover"
              />
              {product.discountPercentage > 0 && (
                <span className="absolute top-4 left-4 bg-[#E50914] text-white font-black text-xs px-3 py-1.5 rounded shadow-md uppercase">
                  {product.discountPercentage}% OFF
                </span>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="space-y-6">
            <div className="space-y-2 border-b border-neutral-200 pb-4">
              <span className="text-xs font-black uppercase tracking-wider text-[#E50914]">
                {product.brand}
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-black leading-tight">
                {product.title}
              </h1>

              <div className="flex items-center gap-3 pt-1">
                <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg text-amber-700 font-bold text-xs">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span>{product.rating}</span>
                </div>
                <span className="text-xs text-neutral-500">({product.reviewCount} customer reviews)</span>
                <span className="text-xs text-emerald-700 font-semibold">• In Stock ({product.stock} items)</span>
              </div>
            </div>

            {/* Pricing */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black text-black">₹{product.price.toLocaleString('en-IN')}</span>
              {product.originalPrice > product.price && (
                <span className="text-lg text-neutral-400 line-through">₹{product.originalPrice.toLocaleString('en-IN')}</span>
              )}
              <span className="text-xs font-bold text-[#E50914] bg-red-50 border border-red-200 px-2 py-0.5 rounded">
                Save ₹{(product.originalPrice - product.price).toLocaleString('en-IN')}
              </span>
            </div>

            <p className="text-sm text-neutral-700 leading-relaxed">
              {product.description}
            </p>

            {/* Delivery Checker */}
            <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xl flex items-center justify-between text-xs text-neutral-700">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-[#E50914] shrink-0" />
                <div>
                  <div className="font-bold text-black">Delivering to {location.city} ({location.pincode})</div>
                  <div className="text-neutral-500 mt-0.5">Express delivery within 2-3 business days.</div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-4">
                <label className="text-xs font-bold text-neutral-600 uppercase">Quantity:</label>
                <div className="flex items-center bg-neutral-100 border border-neutral-300 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                    className="px-3 py-1.5 text-black hover:bg-neutral-200 font-bold"
                  >
                    -
                  </button>
                  <span className="px-4 py-1.5 text-xs font-bold text-black">{quantity}</span>
                  <button
                    onClick={() => setQuantity(prev => prev + 1)}
                    className="px-3 py-1.5 text-black hover:bg-neutral-200 font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button variant="primary" size="lg" onClick={handleAddToCart}>
                  <ShoppingBag className="w-5 h-5" />
                  <span>Add to Cart</span>
                </Button>

                <Button variant="secondary" size="lg" onClick={handleBuyNow}>
                  <span>Buy Now</span>
                </Button>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <button
                  onClick={handleWishlistToggle}
                  className={`flex items-center gap-2 text-xs font-bold transition-colors ${
                    isSaved ? 'text-[#E50914]' : 'text-neutral-600 hover:text-black'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isSaved ? 'fill-[#E50914]' : ''}`} />
                  <span>{isSaved ? 'In Wishlist' : 'Add to Wishlist'}</span>
                </button>

                <button
                  onClick={() => showToast('Product link copied to clipboard!', 'info')}
                  className="flex items-center gap-2 text-xs font-bold text-neutral-600 hover:text-black transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
