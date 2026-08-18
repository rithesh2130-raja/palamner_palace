import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { productService } from '../../services/api/productApi.js';
import { useCart } from '../../context/CartContext.jsx';
import { useWishlist } from '../../context/WishlistContext.jsx';
import { useLocationContext } from '../../context/LocationContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Star, Heart, ShoppingBag, Truck, ShieldCheck, MapPin, ArrowLeft, Check, Share2 } from 'lucide-react';

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
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-400 animate-pulse">
        Loading product details...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Product Not Found</h2>
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back link */}
      <Link to="/products" className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-amber-400">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Products</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl">
        {/* Left Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square w-full bg-slate-950 rounded-2xl overflow-hidden border border-slate-800">
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-full object-cover"
            />
            {product.discountPercentage > 0 && (
              <span className="absolute top-4 left-4 bg-amber-500 text-slate-950 font-black text-xs px-3 py-1.5 rounded-lg shadow-md uppercase">
                {product.discountPercentage}% OFF
              </span>
            )}
          </div>
        </div>

        {/* Right Info */}
        <div className="space-y-6">
          <div className="space-y-2 border-b border-slate-800 pb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              {product.brand}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
              {product.title}
            </h1>

            <div className="flex items-center gap-3 pt-1">
              <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-lg text-amber-400 font-bold text-xs">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>{product.rating}</span>
              </div>
              <span className="text-xs text-slate-400">({product.reviewCount} customer reviews)</span>
              <span className="text-xs text-emerald-400 font-semibold">• In Stock ({product.stock} items)</span>
            </div>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-black text-white">₹{product.price.toLocaleString('en-IN')}</span>
            {product.originalPrice > product.price && (
              <span className="text-lg text-slate-500 line-through">₹{product.originalPrice.toLocaleString('en-IN')}</span>
            )}
            <span className="text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-md">
              Save ₹{(product.originalPrice - product.price).toLocaleString('en-IN')}
            </span>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed">
            {product.description}
          </p>

          {/* Location Delivery Checker */}
          <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl flex items-center justify-between text-xs text-slate-300">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <div className="font-bold text-white">Delivering to {location.city} ({location.pincode})</div>
                <div className="text-slate-400 mt-0.5">Express delivery within 2-3 business days.</div>
              </div>
            </div>
          </div>

          {/* Quantity & Actions */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-4">
              <label className="text-xs font-bold text-slate-400 uppercase">Quantity:</label>
              <div className="flex items-center bg-slate-950 border border-slate-700 rounded-xl overflow-hidden">
                <button
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  className="px-3 py-1.5 text-slate-300 hover:bg-slate-800 font-bold"
                >
                  -
                </button>
                <span className="px-4 py-1.5 text-xs font-bold text-white">{quantity}</span>
                <button
                  onClick={() => setQuantity(prev => prev + 1)}
                  className="px-3 py-1.5 text-slate-300 hover:bg-slate-800 font-bold"
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
                  isSaved ? 'text-rose-400' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-400' : ''}`} />
                <span>{isSaved ? 'In Wishlist' : 'Add to Wishlist'}</span>
              </button>

              <button
                onClick={() => showToast('Product link copied to clipboard!', 'info')}
                className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors"
              >
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
