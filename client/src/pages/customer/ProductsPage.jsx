import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productService } from '../../services/api/productApi.js';
import { ProductCard } from '../../components/common/ProductCard.jsx';
import { ProductSkeleton } from '../../components/ui/Skeletons.jsx';
import { EmptyState } from '../../components/ui/EmptyState.jsx';
import { Search, ArrowUpDown } from 'lucide-react';

export const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || '';
  const initialSearch = searchParams.get('search') || '';
  const initialFilter = searchParams.get('filter') || '';

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [sortBy, setSortBy] = useState('popular');

  useEffect(() => {
    setSelectedCategory(searchParams.get('category') || '');
    setSearchQuery(searchParams.get('search') || '');
  }, [searchParams]);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const [prodList, catList] = await Promise.all([
          productService.getProducts({
            category: selectedCategory,
            search: searchQuery,
            filter: initialFilter
          }),
          productService.getCategories()
        ]);

        let sorted = [...prodList];
        if (sortBy === 'price-low') {
          sorted.sort((a, b) => a.price - b.price);
        } else if (sortBy === 'price-high') {
          sorted.sort((a, b) => b.price - a.price);
        } else if (sortBy === 'rating') {
          sorted.sort((a, b) => b.rating - a.rating);
        }

        setProducts(sorted);
        setCategories(catList);
      } catch (err) {
        console.error('Failed to load products:', err);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [selectedCategory, searchQuery, sortBy, initialFilter]);

  const handleCategoryChange = (slug) => {
    setSelectedCategory(slug);
    if (slug) {
      searchParams.set('category', slug);
    } else {
      searchParams.delete('category');
    }
    setSearchParams(searchParams);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery) {
      searchParams.set('search', searchQuery);
    } else {
      searchParams.delete('search');
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200 pb-6">
          <div>
            <h1 className="text-3xl font-black text-black tracking-tight">Product Catalog</h1>
            <p className="text-xs text-neutral-500 mt-1">
              Explore authentic Palamner products, handwoven silks, electronics, and lifestyle collections.
            </p>
          </div>

          {/* Search & Sort Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <form onSubmit={handleSearchSubmit} className="relative flex-1 sm:w-64">
              <input
                type="text"
                placeholder="Search catalog..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-neutral-100 border border-neutral-300 rounded-xl pl-9 pr-3 py-2 text-xs text-black placeholder-neutral-500 focus:outline-none focus:border-[#E50914]"
              />
              <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-2.5" />
            </form>

            <div className="flex items-center gap-2 bg-neutral-100 border border-neutral-300 rounded-xl px-3 py-2 text-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#E50914]" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-black focus:outline-none font-bold cursor-pointer"
              >
                <option value="popular">Most Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => handleCategoryChange('')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              !selectedCategory
                ? 'bg-[#E50914] text-white shadow-md'
                : 'bg-neutral-100 text-black hover:bg-neutral-200 border border-neutral-200'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.slug)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat.slug
                  ? 'bg-[#E50914] text-white shadow-md'
                  : 'bg-neutral-100 text-black hover:bg-neutral-200 border border-neutral-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <ProductSkeleton />
            <ProductSkeleton />
            <ProductSkeleton />
            <ProductSkeleton />
          </div>
        ) : products.length === 0 ? (
          <EmptyState
            title="No products matched your search"
            description="Try adjusting your category filter or search keywords to find what you are looking for."
            actionLabel="Clear Filters"
            actionTo="/products"
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
