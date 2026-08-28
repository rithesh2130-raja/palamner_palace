import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Star,
  Heart,
  ShoppingBag,
  Zap,
  CheckCircle,
  Truck,
  ShieldCheck,
  RotateCcw,
  Minus,
  Plus,
  ArrowLeft,
  Share2,
  Tag,
} from 'lucide-react';
import { getProductBySlug, getProduct } from '../../services/productService';
import { Product } from '../../types/product';
import { ProductDetailsSkeleton } from '../../components/products/ProductSkeletons';
import { useCart } from '../../context/CartContext.jsx';
import { useWishlist } from '../../context/WishlistContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';

export const ProductDetailsPage: React.FC = () => {
  const { productId, slug } = useParams<{ productId?: string; slug?: string }>();
  const navigate = useNavigate();

  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [isWishlisting, setIsWishlisting] = useState<boolean>(false);

  const { addToCart, cartItems } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { showToast } = useToast();

  const identifier = slug || productId;

  useEffect(() => {
    if (identifier) {
      fetchProductDetails(identifier);
    }
  }, [identifier]);

  const fetchProductDetails = async (idOrSlug: string) => {
    setLoading(true);
    setError(null);
    try {
      let res;
      if (slug) {
        res = await getProductBySlug(slug);
      } else {
        res = await getProduct(idOrSlug);
      }

      if (res && res.success && res.data) {
        setProduct(res.data);
        setSelectedImageIndex(0);
      } else {
        setError('Product not found');
      }
    } catch (err: any) {
      console.error('Failed to load product details:', err);
      setError(err.message || 'Unable to fetch product details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ProductDetailsSkeleton />;
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <ErrorState
          title="Product Not Found"
          description={error || 'The requested product could not be loaded.'}
          onBack={() => navigate('/products')}
          backLabel="Back to Products"
        />
      </div>
    );
  }

  const id = product._id;
  const isSaved = isInWishlist ? isInWishlist(id) : false;
  const isInCart = cartItems ? cartItems.some((item: any) => (item.product._id || item.product.id) === id) : false;

  const images = product.images && product.images.length > 0
    ? product.images
    : [{ url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80', alt: product.name }];

  const currentMainImage = images[selectedImageIndex] || images[0];

  const compareAtPrice = product.compareAtPrice;
  const price = product.price;
  let discountPercentage = 0;
  if (compareAtPrice && compareAtPrice > price) {
    discountPercentage = Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
  }

  const handleAddToCart = async () => {
    if (isAdding) return;
    setIsAdding(true);
    try {
      if (addToCart) {
        await addToCart(product, quantity);
        if (showToast) showToast(`Added ${quantity} x "${product.name}" to cart!`, 'success');
      }
    } catch (err: any) {
      if (showToast) showToast(err.message || 'Failed to add to cart', 'error');
    } finally {
      setIsAdding(false);
    }
  };

  const handleBuyNow = async () => {
    if (isAdding) return;
    setIsAdding(true);
    try {
      if (addToCart) {
        await addToCart(product, quantity);
        navigate('/cart');
      }
    } catch (err: any) {
      if (showToast) showToast(err.message || 'Failed to add to cart', 'error');
    } finally {
      setIsAdding(false);
    }
  };

  const handleToggleWishlist = async () => {
    if (isWishlisting) return;
    setIsWishlisting(true);
    try {
      if (toggleWishlist) {
        await toggleWishlist(product);
        if (showToast) {
          showToast(isSaved ? 'Removed from wishlist' : 'Saved to wishlist! ❤️', isSaved ? 'info' : 'success');
        }
      }
    } catch (err: any) {
      if (showToast) showToast(err.message || 'Failed to update wishlist', 'error');
    } finally {
      setIsWishlisting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-text-primary py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Breadcrumb / Back Link */}
      <div className="flex items-center gap-2 text-xs font-semibold text-text-muted">
        <Link to="/products" className="flex items-center gap-1 hover:text-brand-primary transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Products</span>
        </Link>
        <span>/</span>
        <span className="text-text-muted">{product.category}</span>
        <span>/</span>
        <span className="text-text-primary font-bold line-clamp-1">{product.name}</span>
      </div>

      {/* Main Details Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
        {/* Left: Interactive Image Gallery */}
        <div className="space-y-4">
          {/* Main Display Image */}
          <div className="relative aspect-square w-full bg-surface-secondary rounded-2xl overflow-hidden border border-border">
            <img
              src={currentMainImage.url}
              alt={currentMainImage.alt || product.name}
              className="w-full h-full object-cover transition-all duration-300"
            />

            {discountPercentage > 0 && (
              <span className="absolute top-4 left-4 bg-brand-primary text-white text-xs font-black px-3 py-1.5 rounded-lg shadow-md uppercase tracking-wider">
                {discountPercentage}% OFF
              </span>
            )}

            <button
              onClick={handleToggleWishlist}
              className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-md transition-all ${
                isSaved
                  ? 'bg-brand-primary text-white shadow-lg scale-110'
                  : 'bg-surface/90 text-text-muted hover:text-brand-primary hover:bg-surface shadow-md'
              }`}
            >
              <Heart className={`w-5 h-5 ${isSaved ? 'fill-white' : ''}`} />
            </button>
          </div>

          {/* Thumbnail Strip */}
          {images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                    selectedImageIndex === idx
                      ? 'border-brand-primary ring-2 ring-brand-primary/20 scale-105'
                      : 'border-border opacity-70 hover:opacity-100 hover:border-text-muted'
                  }`}
                >
                  <img src={img.url} alt={img.alt || product.name} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Info & Actions */}
        <div className="space-y-6">
          {/* Brand & Title */}
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-brand-primary">{product.brand || 'ShopSphere'}</span>
            <h1 className="text-2xl sm:text-3xl font-black text-text-primary mt-1 leading-snug">
              {product.name}
            </h1>
            <p className="text-xs text-text-muted mt-1 font-mono">SKU: {product.sku}</p>
          </div>

          {/* Rating & Social Proof */}
          <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center gap-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2.5 py-1 rounded-lg font-bold">
              <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
              <span>{product.rating}</span>
            </div>
            <span className="text-text-muted text-xs font-semibold">({product.reviewCount} customer reviews)</span>
            <span className="text-border">|</span>
            <span className="text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" /> Verified Authentic
            </span>
          </div>

          {/* Pricing Box */}
          <div className="p-4 bg-surface border border-border rounded-xl flex items-baseline gap-4">
            <span className="text-3xl font-black text-text-primary">
              ₹{price.toLocaleString('en-IN')}
            </span>
            {compareAtPrice && compareAtPrice > price && (
              <span className="text-lg text-text-muted line-through">
                ₹{compareAtPrice.toLocaleString('en-IN')}
              </span>
            )}
            {discountPercentage > 0 && (
              <span className="text-xs font-bold text-brand-primary bg-brand-primary/10 px-2.5 py-1 rounded-md">
                Save ₹{(compareAtPrice - price).toLocaleString('en-IN')}
              </span>
            )}
          </div>

          {/* Stock Indicator */}
          <div className="flex items-center gap-2">
            <span
              className={`w-3 h-3 rounded-full ${
                product.stock > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-status-danger'
              }`}
            />
            <span className="text-xs font-bold text-text-primary">
              {product.stock > 0 ? `In Stock (${product.stock} units available)` : 'Out of Stock'}
            </span>
          </div>

          {/* Quantity Selector & Action CTAs */}
          <div className="space-y-4 pt-2 border-t border-border">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold uppercase text-text-muted">Quantity:</span>
              <div className="flex items-center border border-border rounded-lg bg-surface">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="p-2.5 text-text-muted hover:text-text-primary disabled:opacity-30"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 font-bold text-sm text-text-primary">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                  className="p-2.5 text-text-muted hover:text-text-primary disabled:opacity-30"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="w-full py-3.5 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 bg-surface-secondary border border-border text-text-primary hover:border-brand-primary hover:text-brand-primary transition-all disabled:opacity-50"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{isInCart ? 'Add More to Cart' : 'Add to Cart'}</span>
              </button>

              <button
                onClick={handleBuyNow}
                disabled={product.stock <= 0}
                className="w-full py-3.5 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 bg-brand-primary text-white hover:bg-brand-primary-hover shadow-lg shadow-brand-primary/20 transition-all disabled:opacity-50"
              >
                <Zap className="w-4 h-4 fill-white" />
                <span>Buy Now</span>
              </button>
            </div>
          </div>

          {/* Guarantee Badges */}
          <div className="grid grid-cols-3 gap-2 pt-4 border-t border-border text-center text-[11px] text-text-muted">
            <div className="p-3 bg-surface rounded-xl border border-border flex flex-col items-center gap-1">
              <Truck className="w-5 h-5 text-brand-primary" />
              <span className="font-bold">Fast Delivery</span>
            </div>
            <div className="p-3 bg-surface rounded-xl border border-border flex flex-col items-center gap-1">
              <ShieldCheck className="w-5 h-5 text-brand-primary" />
              <span className="font-bold">100% Genuine</span>
            </div>
            <div className="p-3 bg-surface rounded-xl border border-border flex flex-col items-center gap-1">
              <RotateCcw className="w-5 h-5 text-brand-primary" />
              <span className="font-bold">7-Day Returns</span>
            </div>
          </div>

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap pt-2">
              <Tag className="w-3.5 h-3.5 text-text-muted" />
              {product.tags.map((tag, idx) => (
                <span key={idx} className="text-[11px] bg-surface-secondary text-text-muted px-2.5 py-1 rounded-md font-semibold">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Tabs Section: Description, Specifications, Reviews */}
      <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex border-b border-border gap-6">
          <button
            onClick={() => setActiveTab('description')}
            className={`pb-3 text-sm font-bold transition-all relative ${
              activeTab === 'description'
                ? 'text-brand-primary border-b-2 border-brand-primary'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            Description
          </button>
          <button
            onClick={() => setActiveTab('specs')}
            className={`pb-3 text-sm font-bold transition-all relative ${
              activeTab === 'specs'
                ? 'text-brand-primary border-b-2 border-brand-primary'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            Specifications
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-3 text-sm font-bold transition-all relative ${
              activeTab === 'reviews'
                ? 'text-brand-primary border-b-2 border-brand-primary'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            Reviews ({product.reviewCount})
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'description' && (
          <div className="prose dark:prose-invert text-sm text-text-secondary leading-relaxed space-y-4 max-w-none">
            <p>{product.description}</p>
          </div>
        )}

        {activeTab === 'specs' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-text-muted font-medium">Brand</span>
              <span className="text-text-primary font-bold">{product.brand || 'N/A'}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-text-muted font-medium">Category</span>
              <span className="text-text-primary font-bold">{product.category}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-text-muted font-medium">Subcategory</span>
              <span className="text-text-primary font-bold">{product.subcategory || 'General'}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-text-muted font-medium">SKU</span>
              <span className="text-text-primary font-bold font-mono">{product.sku}</span>
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-4 text-sm">
            <div className="flex items-center gap-4 p-4 bg-surface-secondary rounded-xl">
              <div className="text-center">
                <div className="text-3xl font-black text-text-primary">{product.rating}</div>
                <div className="flex text-amber-500 justify-center my-1">
                  <Star className="w-4 h-4 fill-amber-500" />
                  <Star className="w-4 h-4 fill-amber-500" />
                  <Star className="w-4 h-4 fill-amber-500" />
                  <Star className="w-4 h-4 fill-amber-500" />
                  <Star className="w-4 h-4 fill-amber-500" />
                </div>
                <div className="text-xs text-text-muted">{product.reviewCount} Reviews</div>
              </div>
              <div className="flex-1 text-xs text-text-muted space-y-1">
                <p>Verified purchaser reviews will appear here.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailsPage;
