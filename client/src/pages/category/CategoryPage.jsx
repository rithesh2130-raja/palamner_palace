import React, { useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getProducts } from '../../services/productService';
import { getCategoryBySlug, categories } from '../../config/categories.js';
import ProductCard from '../../components/products/ProductCard';
import { ProductGridSkeleton } from '../../components/products/ProductSkeletons';
import ProductFilters from '../../components/products/ProductFilters.jsx';
import ProductSort from '../../components/products/ProductSort.jsx';
import ActiveFilters from '../../components/products/ActiveFilters.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';
import Drawer from '../../components/ui/Drawer.jsx';
import { SlidersHorizontal, Layers, ChevronRight } from 'lucide-react';

export const CategoryPage = () => {
  const { category: categorySlugParam } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const currentCategorySlug = categorySlugParam || searchParams.get('category') || 'gaming';
  const categoryInfo = getCategoryBySlug(currentCategorySlug) || {
    name: currentCategorySlug.charAt(0).toUpperCase() + currentCategorySlug.slice(1),
    description: `Browse premium ${currentCategorySlug} products and deals.`,
    subcategories: [],
  };

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Extract search & filter states from URL
  const queryParams = {
    category: currentCategorySlug,
    q: searchParams.get('q') || searchParams.get('search') || undefined,
    subcategory: searchParams.get('subcategory') || undefined,
    brand: searchParams.get('brand') || undefined,
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
    minRating: searchParams.get('minRating') ? Number(searchParams.get('minRating')) : undefined,
    inStock: searchParams.get('inStock') === 'true',
    sort: searchParams.get('sort') || 'newest',
    page: parseInt(searchParams.get('page') || '1', 10),
    limit: 20,
  };

  // Fetch products with React Query for automatic caching
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['categoryProducts', currentCategorySlug, queryParams],
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

  const handleSubcategorySelect = (subcat) => {
    const nextParams = new URLSearchParams(searchParams);
    if (searchParams.get('subcategory') === subcat) {
      nextParams.delete('subcategory');
    } else {
      nextParams.set('subcategory', subcat);
    }
    nextParams.set('page', '1');
    setSearchParams(nextParams);
  };

  const handleRemoveFilter = (key) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete(key);
    nextParams.set('page', '1');
    setSearchParams(nextParams);
  };

  const handleClearAll = () => {
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
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
        <Link to="/" className="hover:text-accent">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <Link to="/products" className="hover:text-accent">Categories</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-900 font-extrabold">{categoryInfo.name}</span>
      </div>

      {/* Category Hero Banner */}
      <div className="bg-gradient-to-r from-[#131A22] to-[#232F3E] text-white p-6 sm:p-8 rounded-2xl shadow-lg relative overflow-hidden">
        <div className="max-w-2xl space-y-2 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/20 border border-accent/40 text-accent font-extrabold text-[10px] uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5" />
            <span>Category Collection</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white">
            {categoryInfo.name}
          </h1>
          <p className="text-sm text-gray-300">
            {categoryInfo.description}
          </p>
        </div>

        {/* Category Selector Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-6 scrollbar-none relative z-10">
          {categories.map((cat) => {
            const isActive = cat.slug.toLowerCase() === currentCategorySlug.toLowerCase();
            return (
              <Link
                key={cat.slug}
                to={`/category/${cat.slug}`}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-accent text-gray-950 shadow-md font-black scale-105'
                    : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'
                }`}
              >
                {cat.name}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Subcategory Navigation Pills (if available) */}
      {categoryInfo.subcategories && categoryInfo.subcategories.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs font-extrabold text-gray-500 uppercase shrink-0">Subcategories:</span>
          {categoryInfo.subcategories.map((subcat) => {
            const isSubSelected = searchParams.get('subcategory') === subcat;
            return (
              <button
                key={subcat}
                type="button"
                onClick={() => handleSubcategorySelect(subcat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all border ${
                  isSubSelected
                    ? 'bg-accent text-gray-950 border-accent shadow-2xs font-extrabold'
                    : 'bg-white border-gray-200 text-gray-700 hover:border-accent'
                }`}
              >
                {subcat}
              </button>
            );
          })}
        </div>
      )}

      {/* Main Layout: Desktop Sidebar + Product Results */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block lg:col-span-1 bg-white p-5 rounded-2xl border border-gray-200 shadow-sm h-fit">
          <ProductFilters
            filters={queryParams}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearAll}
          />
        </aside>

        {/* Main Content Area */}
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
              {pagination.total} {pagination.total === 1 ? 'product' : 'products'} found
            </span>

            {/* Sorting Dropdown */}
            <ProductSort
              currentSort={queryParams.sort}
              onSortChange={handleSortChange}
            />
          </div>

          {/* Active Filter Chips */}
          <ActiveFilters
            filters={queryParams}
            onRemoveFilter={handleRemoveFilter}
            onClearAll={handleClearAll}
          />

          {/* Product Grid State Rendering */}
          {isLoading ? (
            <ProductGridSkeleton count={8} />
          ) : isError ? (
            <ErrorState
              title="Failed to load category products"
              description={error?.message || 'Unable to connect to product service.'}
              onRetry={refetch}
            />
          ) : products.length === 0 ? (
            <EmptyState
              title={`No products in ${categoryInfo.name}`}
              description="Try adjusting your subcategory filters, price range, or minimum rating."
              actionLabel="Clear Filters"
              onAction={handleClearAll}
            />
          ) : (
            <>
              {/* Responsive Grid: 4 cols desktop, 3 tablet, 2 mobile */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id || product.id} product={product} />
                ))}
              </div>

              {/* Pagination Bar */}
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

      {/* Mobile Filter Drawer */}
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

export default CategoryPage;
