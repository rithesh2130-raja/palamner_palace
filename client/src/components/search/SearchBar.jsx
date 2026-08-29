import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, X, Loader2 } from 'lucide-react';
import { getSearchSuggestions } from '../../services/productService';
import { SearchSuggestions } from './SearchSuggestions.jsx';
import { categories as ALL_CATEGORIES } from '../../config/categories.js';

export const SearchBar = ({ className = '', placeholder = 'Search products, brands, categories...' }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [query, setQuery] = useState(searchParams.get('q') || searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [suggestionsData, setSuggestionsData] = useState(null);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const searchContainerRef = useRef(null);

  // Sync state with URL parameter changes
  useEffect(() => {
    setQuery(searchParams.get('q') || searchParams.get('search') || '');
    setSelectedCategory(searchParams.get('category') || 'All');
  }, [searchParams]);

  // Debounced search suggestions fetch (~300ms)
  useEffect(() => {
    if (!query.trim() || query.trim().length < 2) {
      setSuggestionsData(null);
      setLoadingSuggestions(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoadingSuggestions(true);
      try {
        const response = await getSearchSuggestions(query.trim());
        if (response && response.success && response.data) {
          setSuggestionsData(response.data);
          setShowSuggestions(true);
        }
      } catch (err) {
        console.error('Failed to fetch search suggestions:', err);
      } finally {
        setLoadingSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Close suggestions when clicking outside container
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    setShowSuggestions(false);
    const trimmed = query.trim();

    const params = new URLSearchParams();
    if (trimmed) params.set('q', trimmed);
    if (selectedCategory && selectedCategory !== 'All') {
      params.set('category', selectedCategory.toLowerCase());
    }

    navigate(`/products?${params.toString()}`);
  };

  const handleClear = () => {
    setQuery('');
    setSuggestionsData(null);
    setShowSuggestions(false);
  };

  const handleSelectSuggestion = (term) => {
    setQuery(term);
    setShowSuggestions(false);
    const params = new URLSearchParams();
    params.set('q', term);
    if (selectedCategory && selectedCategory !== 'All') {
      params.set('category', selectedCategory.toLowerCase());
    }
    navigate(`/products?${params.toString()}`);
  };

  return (
    <div ref={searchContainerRef} className={`relative flex-1 ${className}`}>
      <form
        onSubmit={handleSearchSubmit}
        className="flex items-center h-[42px] rounded-md overflow-hidden bg-white text-gray-900 border border-transparent focus-within:ring-2 focus-within:ring-accent transition-all"
      >
        {/* Category Filter Selector */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="h-full bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold px-3 border-r border-gray-300 focus:outline-none cursor-pointer hidden sm:block shrink-0"
        >
          <option value="All">All Categories</option>
          {ALL_CATEGORIES.map((cat) => (
            <option key={cat.slug} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>

        {/* Text Input */}
        <div className="relative flex-1 h-full flex items-center">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              if (suggestionsData) setShowSuggestions(true);
            }}
            placeholder={placeholder}
            className="w-full h-full pl-3 pr-8 text-xs sm:text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none bg-white font-medium"
          />

          {/* Loading / Clear indicator */}
          <div className="absolute right-2.5 flex items-center gap-1 text-gray-400">
            {loadingSuggestions ? (
              <Loader2 className="w-4 h-4 animate-spin text-accent" />
            ) : query ? (
              <button
                type="button"
                onClick={handleClear}
                className="p-0.5 hover:text-gray-700 transition-colors"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            ) : null}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          aria-label="Search"
          className="h-full px-5 bg-accent hover:bg-accent-hover text-gray-950 flex items-center justify-center transition-colors font-bold shrink-0"
        >
          <Search className="w-5 h-5" />
        </button>
      </form>

      {/* Auto-Complete Suggestions Dropdown */}
      {showSuggestions && suggestionsData && (
        <SearchSuggestions
          suggestionsData={suggestionsData}
          onClose={() => setShowSuggestions(false)}
          onSelectSuggestion={handleSelectSuggestion}
        />
      )}
    </div>
  );
};

export default SearchBar;
