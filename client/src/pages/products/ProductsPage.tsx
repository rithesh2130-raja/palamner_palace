import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, ArrowUpDown, RefreshCw, X } from 'lucide-react';
import { getProducts } from '../../services/productService';
import { Product, ProductPagination } from '../../types/product';
import ProductCard from '../../components/products/ProductCard';
import { ProductGridSkeleton } from '../../components/products/ProductSkeletons';
import EmptyState from '../../components/ui/EmptyState.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';

const CATEGORIES = [
  'All',
  'Electronics',
  'Fashion',
  'Beauty',
  'Home',
  'Gaming',
  'Sports',
];

export const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const currentCategory = searchParams.get('category') || 'All';
  const currentSearch = searchParams.get('search') || '';
  const currentSort = searchParams.get('sort') || 'newest';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const minPriceParam = searchParams.get('minPrice') || '';
  const maxPriceParam = searchParams.get('maxPrice') || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<ProductPagination>({ page: 1, limit: 20, total: 0, pages: 1 });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [searchInput, setSearchInput] = useState<string>(currentSearch);
  const [minPrice, setMinPrice] = useState<string>(minPriceParam);
  const [maxPrice, setMaxPrice] = useState<string>(maxPriceParam);
  const [showMobileFilters, setShowMobileFilters] = useState<boolean>(false);

  useEffect(() => {
    fetchProducts();
  }, [searchParams]);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const filters: any = {
        page: currentPage,
        limit: 20,
        sort: currentSort,
      };

      if (currentCategory && currentCategory !== 'All') {
        filters.category = currentCategory;
      }
      if (currentSearch) {
        filters.search = currentSearch;
      }
      if (minPriceParam) {
        filters.minPrice = Number(minPriceParam);
      }
      if (maxPriceParam) {
        filters.maxPrice = Number(maxPriceParam);
      }

      const response = await getProducts(filters);
      if (response && response.success && response.data) {
        setProducts(response.data.products || []);
        setPagination(response.data.pagination || { page: 1, limit: 20, total: 0, pages: 1 });
      } else {
        setError('Failed to fetch products');
      }
    } catch (err: any) {
      console.error('Products load error:', err);
      setError(err.message || 'Unable to connect to product server');
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySelect = (cat: string) => {
    const params = new URLSearchParams(searchParams);
    if (cat === 'All') {
      params.delete('category');
    } else {
      params.set('category', cat);
    }
    params.set('page', '1');
    setSearchParams(params);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (searchInput.trim()) {
      params.set('search', searchInput.trim());
    } else {
      params.delete('search');
    }
    params.set('page', '1');
    setSearchParams(params);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams);
    params.set('sort', e.target.value);
    params.set('page', '1');
    setSearchParams(params);
  };

  const handlePriceApply = () => {
    const params = new URLSearchParams(searchParams);
    if (minPrice) params.set('minPrice', minPrice);
    else params.delete('minPrice');

    if (maxPrice) params.set('maxPrice', maxPrice);
    else params.delete('maxPrice');

    params.set('page', '1');
    setSearchParams(params);
  };

  const handleClearFilters = () => {
    setSearchInput('');
    setMinPrice('');
    setMaxPrice('');
    setSearchParams(new URLSearchParams());
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > pagination.pages) return;
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background text-text-primary py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-text-primary">
            ShopSphere Catalog
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Discover premium products, curated collections, and exclusive social commerce deals.
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative flex items-center w-full md:w-80">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-10 pr-10 py-2.5 bg-surface border border-border rounded-xl text-sm text-text-primary focus:outline-none focus:border-brand-primary transition-colors"
          />
          <Search className="absolute left-3.5 w-4 h-4 text-text-muted" />
          {searchInput && (
            <button
              type="button"
              onClick={() => {
                setSearchInput('');
                const params = new URLSearchParams(searchParams);
                params.delete('search');
                setSearchParams(params);
              }}
              className="absolute right-3 p-1 text-text-muted hover:text-text-primary"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </form>
      </div>

      {/* Category Pills Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isActive = currentCategory === cat || (cat === 'All' && !searchParams.get('category'));
          return (
            <button
              key={cat}
              onClick={() => handleCategorySelect(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                isActive
                  ? 'bg-brand-primary text-white shadow-md'
                  : 'bg-surface border border-border text-text-secondary hover:border-brand-primary/50 hover:text-text-primary'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Controls Bar: Filters, Product Count, Sort */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-surface p-4 rounded-xl border border-border">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="flex items-center gap-2 px-3 py-2 bg-surface-secondary border border-border rounded-lg text-xs font-bold text-text-primary hover:border-brand-primary transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4 text-brand-primary" />
            <span>Filters</span>
          </button>

          {(currentSearch || currentCategory !== 'All' || minPriceParam || maxPriceParam) && (
            <button
              onClick={handleClearFilters}
              className="text-xs text-brand-primary hover:underline font-semibold flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Product Count & Sort */}
        <div className="flex items-center justify-between sm:justify-end gap-4">
          <span className="text-xs font-bold text-text-muted">
            {pagination.total} {pagination.total === 1 ? 'product' : 'products'} found
          </span>

          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-text-muted hidden sm:block" />
            <select
              value={currentSort}
              onChange={handleSortChange}
              className="bg-surface-secondary border border-border rounded-lg px-3 py-1.5 text-xs font-bold text-text-primary focus:outline-none focus:border-brand-primary"
            >
              <option value="newest">Sort: Newest</option>
              <option value="price_asc">Sort: Price Low to High</option>
              <option value="price_desc">Sort: Price High to Low</option>
              <option value="rating">Sort: Highest Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Price Filter Drawer/Panel */}
      {showMobileFilters && (
        <div className="bg-surface border border-border rounded-xl p-4 space-y-4 animate-fadeIn">
          <h4 className="text-xs font-black uppercase text-text-primary tracking-wider">Filter by Price (₹)</h4>
          <div className="flex items-center gap-3">
            <input
              type="number"
              placeholder="Min ₹"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-full px-3 py-1.5 bg-surface-secondary border border-border rounded-lg text-xs text-text-primary focus:outline-none focus:border-brand-primary"
            />
            <span className="text-text-muted">-</span>
            <input
              type="number"
              placeholder="Max ₹"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full px-3 py-1.5 bg-surface-secondary border border-border rounded-lg text-xs text-text-primary focus:outline-none focus:border-brand-primary"
            />
            <button
              onClick={handlePriceApply}
              className="px-4 py-1.5 bg-brand-primary text-white font-bold text-xs rounded-lg hover:bg-brand-primary-hover transition-colors"
            >
              Apply
            </button>
          </div>
        </div>
      )}

      {/* Main Grid View / UX States */}
      {loading ? (
        <ProductGridSkeleton count={8} />
      ) : error ? (
        <ErrorState
          title="Couldn't load products"
          description={error}
          onRetry={fetchProducts}
        />
      ) : products.length === 0 ? (
        <EmptyState
          title="No products found"
          description="Try changing your category filters, clearing search, or adjusting your price range."
          actionLabel="Clear Filters"
          onAction={handleClearFilters}
        />
      ) : (
        <>
          {/* Responsive Product Grid: 4 cols (desktop), 3 cols (tablet), 2 cols (mobile) */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product) => (
              <ProductCard key={product._id || product.id} product={product} />
            ))}
          </div>

          {/* Pagination Controls */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-8">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="px-4 py-2 border border-border rounded-lg text-xs font-bold bg-surface text-text-primary disabled:opacity-40 disabled:cursor-not-allowed hover:border-brand-primary transition-colors"
              >
                Previous
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: pagination.pages }).map((_, idx) => {
                  const pNum = idx + 1;
                  const isActive = pNum === pagination.page;
                  return (
                    <button
                      key={pNum}
                      onClick={() => handlePageChange(pNum)}
                      className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                        isActive
                          ? 'bg-brand-primary text-white shadow-sm'
                          : 'bg-surface border border-border text-text-primary hover:border-brand-primary/50'
                      }`}
                    >
                      {pNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.pages}
                className="px-4 py-2 border border-border rounded-lg text-xs font-bold bg-surface text-text-primary disabled:opacity-40 disabled:cursor-not-allowed hover:border-brand-primary transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProductsPage;
