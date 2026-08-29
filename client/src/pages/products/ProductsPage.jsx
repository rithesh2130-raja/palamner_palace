import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getProducts } from '../../services/productService';
import { categories as ALL_CATEGORIES } from '../../config/categories.js';
import ProductCard from '../../components/products/ProductCard';
import { ProductGridSkeleton } from '../../components/products/ProductSkeletons';
import ProductFilters from '../../components/products/ProductFilters.jsx';
import ProductSort from '../../components/products/ProductSort.jsx';
import ActiveFilters from '../../components/products/ActiveFilters.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';
import Drawer from '../../components/ui/Drawer.jsx';
import { Search, SlidersHorizontal, Sparkles, X } from 'lucide-react';

export const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Parse current URL state
  const rawQ = searchParams.get('q') || searchParams.get('search') || '';
  const rawCat = searchParams.get('category') || '';
  const rawSubcat = searchParams.get('subcategory') || '';
  const rawBrand = searchParams.get('brand') || '';
  const rawMinPrice = searchParams.get('minPrice');
  const rawMaxPrice = searchParams.get('maxPrice');
  const rawMinRating = searchParams.get('minRating');
  const rawInStock = searchParams.get('inStock') === 'true';
  const rawSort = searchParams.get('sort') || (rawQ ? 'relevance' : 'newest');
  const rawPage = parseInt(searchParams.get('page') || '1', 10);

  const queryParams = {
    q: rawQ || undefined,
    category: rawCat || undefined,
    subcategory: rawSubcat || undefined,
    brand: rawBrand || undefined,
    minPrice: rawMinPrice ? Number(rawMinPrice) : undefined,
    maxPrice: rawMaxPrice ? Number(rawMaxPrice) : undefined,
    minRating: rawMinRating ? Number(rawMinRating) : undefined,
    inStock: rawInStock,
    sort: rawSort,
    page: rawPage,
    limit: 20,
  };

  // Internal search input state for local text box in header
  const [searchInput, setSearchInput] = useState(rawQ);

  // React Query with queryKey including all filter states for automatic caching
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['productsCatalog', queryParams],
    queryFn: () => getProducts(queryParams),
  });

  const products = data?.data?.products || [];
  const pagination = data?.data?.pagination || { page: 1, limit: 20, total: 0, pages: 1 };

  const handleFilterChange = (newFilters) => {
    const nextParams = new URLSearchParams(searchParams);
    Object.entries(newFilters).forEach(([key, val]) => {
      if (val === undefined || val === null || val === '' || val === false) {
        nextParams.delete(key);
      } else {
        nextParams.set(key, String(val));
      }
    });
    nextParams.set('page', '1');
    setSearchParams(nextParams);
  };

  const handleCategorySelect = (catSlug) => {
    const nextParams = new URLSearchParams(searchParams);
    if (!catSlug || catSlug.toLowerCase() === 'all') {
      nextParams.delete('category');
    } else {
      nextParams.set('category', catSlug.toLowerCase());
    }
    nextParams.set('page', '1');
    setSearchParams(nextParams);
  };

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    const nextParams = new URLSearchParams(searchParams);
    const trimmed = searchInput.trim();
    if (trimmed) {
      nextParams.set('q', trimmed);
    } else {
      nextParams.delete('q');
      nextParams.delete('search');
    }
    nextParams.set('page', '1');
    setSearchParams(nextParams);
  };

  const handleRemoveFilter = (key) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete(key);
    if (key === 'q') {
      nextParams.delete('search');
      setSearchInput('');
    }
    nextParams.set('page', '1');
    setSearchParams(nextParams);
  };

  const handleClearAll = () => {
    setSearchInput('');
    setSearchParams(new URLSearchParams());
  };

  const handleSortChange = (newSort) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('sort', newSort);
    nextParams.set('page', '1');
    setSearchParams(nextParams);
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.pages) return;
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('page', String(newPage));
    setSearchParams(nextParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-page text-text-primary py-6 px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto space-y-6">
      {/* Header Title & Catalog Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/15 border border-accent/30 text-gray-900 font-extrabold text-[10px] uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            <span>Discover & Shop</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-gray-900">
            {rawQ ? `Results for "${rawQ}"` : rawCat ? `${rawCat.toUpperCase()} Catalog` : 'ShopSphere Catalog'}
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Explore authentic products, verified sellers, and trending social commerce collections.
          </p>
        </div>

        {/* Page Inner Search Input */}
        <form onSubmit={handleSearchSubmit} className="relative flex items-center w-full md:w-80">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-10 pr-10 py-2.5 bg-white border border-gray-300 rounded-xl text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-accent font-medium shadow-2xs"
          />
          <Search className="absolute left-3.5 w-4 h-4 text-gray-400" />
          {searchInput && (
            <button
              type="button"
              onClick={() => {
                setSearchInput('');
                handleRemoveFilter('q');
              }}
              className="absolute right-3 p-1 text-gray-400 hover:text-gray-700"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </form>
      </div>

      {/* Category Pills Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          type="button"
          onClick={() => handleCategorySelect('')}
          className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
            !rawCat
              ? 'bg-accent text-gray-950 shadow-md font-black'
              : 'bg-white border border-gray-200 text-gray-700 hover:border-accent'
          }`}
        >
          All Categories
        </button>
        {ALL_CATEGORIES.map((cat) => {
          const isActive = rawCat.toLowerCase() === cat.slug.toLowerCase();
          return (
            <button
              key={cat.slug}
              type="button"
              onClick={() => handleCategorySelect(cat.slug)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-accent text-gray-950 shadow-md font-black'
                  : 'bg-white border border-gray-200 text-gray-700 hover:border-accent'
              }`}
            >
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* Main Catalog Grid & Sidebar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Filter Sidebar */}
        <aside className="hidden lg:block lg:col-span-1 bg-white p-5 rounded-2xl border border-gray-200 shadow-sm h-fit">
          <ProductFilters
            filters={queryParams}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearAll}
          />
        </aside>

        {/* Catalog Main View */}
        <main className="col-span-1 lg:col-span-3 space-y-6">
          {/* Top Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
            {/* Mobile Filter Button */}
            <button
              type="button"
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-xs font-extrabold text-gray-900 hover:border-accent transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4 text-accent" />
              <span>Filters</span>
            </button>

            {/* Total Results Count */}
            <span className="text-xs font-extrabold text-gray-700">
              {pagination.total} {pagination.total === 1 ? 'result' : 'results'}
              {rawQ && ` for "${rawQ}"`}
            </span>

            {/* Sorting Selector */}
            <ProductSort
              currentSort={queryParams.sort}
              onSortChange={handleSortChange}
            />
          </div>

          {/* Active Filters Chips Bar */}
          <ActiveFilters
            filters={queryParams}
            onRemoveFilter={handleRemoveFilter}
            onClearAll={handleClearAll}
          />

          {/* Products Results UX States */}
          {isLoading ? (
            <ProductGridSkeleton count={8} />
          ) : isError ? (
            <ErrorState
              title="Couldn't fetch products"
              description={error?.message || 'Unable to connect to product server'}
              onRetry={refetch}
            />
          ) : products.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 border border-gray-200 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-amber-50 text-accent mx-auto flex items-center justify-center font-black text-2xl">
                🔍
              </div>
              <h3 className="text-lg font-black text-gray-900">
                {rawQ ? `No results found for "${rawQ}"` : 'No matching products found'}
              </h3>
              <p className="text-xs text-gray-500 max-w-md mx-auto">
                Try checking your spelling, using fewer keywords, or broadening your price and category filters.
              </p>
              <div className="pt-2 flex justify-center gap-3">
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="px-5 py-2.5 bg-accent hover:bg-accent-hover text-gray-950 font-black rounded-xl text-xs transition-colors shadow-sm"
                >
                  Browse All Products
                </button>
              </div>
            </div>
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
                    type="button"
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page <= 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-bold bg-white text-gray-800 disabled:opacity-40 disabled:cursor-not-allowed hover:border-accent transition-colors"
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
                          type="button"
                          onClick={() => handlePageChange(pNum)}
                          className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                            isActive
                              ? 'bg-accent text-gray-950 shadow-xs font-black'
                              : 'bg-white border border-gray-200 text-gray-700 hover:border-accent'
                          }`}
                        >
                          {pNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page >= pagination.pages}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-bold bg-white text-gray-800 disabled:opacity-40 disabled:cursor-not-allowed hover:border-accent transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Mobile Drawer Filter */}
      <Drawer
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
        title="Filter Products"
        position="left"
      >
        <div className="p-4">
          <ProductFilters
            filters={queryParams}
            onFilterChange={(newF) => {
              handleFilterChange(newF);
              setIsMobileFilterOpen(false);
            }}
            onClearFilters={() => {
              handleClearAll();
              setIsMobileFilterOpen(false);
            }}
          />
        </div>
      </Drawer>
    </div>
  );
};

export default ProductsPage;
