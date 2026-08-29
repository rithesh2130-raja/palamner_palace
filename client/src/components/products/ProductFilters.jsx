import React, { useState, useEffect } from 'react';
import { Star, RotateCcw, Check } from 'lucide-react';
import { categories as ALL_CATEGORIES } from '../../config/categories.js';

export const ProductFilters = ({
  filters = {},
  onFilterChange,
  onClearFilters,
  className = '',
}) => {
  const selectedCategory = filters.category || '';
  const [minPriceInput, setMinPriceInput] = useState(filters.minPrice !== undefined ? String(filters.minPrice) : '');
  const [maxPriceInput, setMaxPriceInput] = useState(filters.maxPrice !== undefined ? String(filters.maxPrice) : '');
  const selectedRating = filters.minRating || 0;
  const inStock = Boolean(filters.inStock);

  useEffect(() => {
    setMinPriceInput(filters.minPrice !== undefined ? String(filters.minPrice) : '');
    setMaxPriceInput(filters.maxPrice !== undefined ? String(filters.maxPrice) : '');
  }, [filters.minPrice, filters.maxPrice]);

  const handleCategoryToggle = (slug) => {
    if (selectedCategory.toLowerCase() === slug.toLowerCase()) {
      onFilterChange({ category: '' });
    } else {
      onFilterChange({ category: slug });
    }
  };

  const handlePriceApply = (e) => {
    if (e) e.preventDefault();
    const minVal = minPriceInput !== '' ? Number(minPriceInput) : undefined;
    const maxVal = maxPriceInput !== '' ? Number(maxPriceInput) : undefined;
    onFilterChange({ minPrice: minVal, maxPrice: maxVal });
  };

  const handleRatingSelect = (rating) => {
    if (selectedRating === rating) {
      onFilterChange({ minRating: undefined });
    } else {
      onFilterChange({ minRating: rating });
    }
  };

  const handleStockToggle = () => {
    onFilterChange({ inStock: !inStock });
  };

  const hasActiveFilters = Boolean(
    selectedCategory ||
    filters.minPrice !== undefined ||
    filters.maxPrice !== undefined ||
    filters.minRating !== undefined ||
    filters.inStock
  );

  return (
    <div className={`space-y-6 text-xs text-gray-900 ${className}`}>
      {/* Header with Clear All */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-200">
        <h3 className="font-extrabold text-sm uppercase tracking-wider text-gray-900">
          Filters
        </h3>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className="text-accent hover:underline font-extrabold flex items-center gap-1 text-xs"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Clear All</span>
          </button>
        )}
      </div>

      {/* Category Filter */}
      <div className="space-y-2.5">
        <h4 className="font-bold text-gray-900 uppercase text-[11px] tracking-wide">
          Category
        </h4>
        <div className="space-y-1.5">
          <label
            onClick={() => onFilterChange({ category: '' })}
            className="flex items-center gap-2.5 cursor-pointer py-1 px-1.5 rounded hover:bg-gray-100 transition-colors"
          >
            <input
              type="radio"
              name="categoryFilter"
              checked={!selectedCategory || selectedCategory.toLowerCase() === 'all'}
              onChange={() => onFilterChange({ category: '' })}
              className="accent-accent w-4 h-4 cursor-pointer"
            />
            <span className={`font-semibold ${!selectedCategory ? 'text-accent font-bold' : 'text-gray-700'}`}>
              All Categories
            </span>
          </label>
          {ALL_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory.toLowerCase() === cat.slug.toLowerCase();
            return (
              <label
                key={cat.slug}
                onClick={() => handleCategoryToggle(cat.slug)}
                className="flex items-center justify-between cursor-pointer py-1 px-1.5 rounded hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <input
                    type="radio"
                    name="categoryFilter"
                    checked={isSelected}
                    onChange={() => handleCategoryToggle(cat.slug)}
                    className="accent-accent w-4 h-4 cursor-pointer"
                  />
                  <span className={`font-semibold ${isSelected ? 'text-accent font-extrabold' : 'text-gray-700'}`}>
                    {cat.name}
                  </span>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* Price Filter */}
      <div className="space-y-2.5 pt-4 border-t border-gray-200">
        <h4 className="font-bold text-gray-900 uppercase text-[11px] tracking-wide">
          Price Range (₹)
        </h4>
        <form onSubmit={handlePriceApply} className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-gray-500 font-semibold block mb-0.5">Minimum</label>
              <input
                type="number"
                placeholder="₹0"
                min="0"
                value={minPriceInput}
                onChange={(e) => setMinPriceInput(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-gray-50 border border-gray-300 rounded-lg text-xs font-semibold focus:outline-none focus:border-accent text-gray-900"
              />
            </div>
            <div>
              <label className="text-[10px] text-gray-500 font-semibold block mb-0.5">Maximum</label>
              <input
                type="number"
                placeholder="₹10,000+"
                min="0"
                value={maxPriceInput}
                onChange={(e) => setMaxPriceInput(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-gray-50 border border-gray-300 rounded-lg text-xs font-semibold focus:outline-none focus:border-accent text-gray-900"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-1.5 bg-accent hover:bg-accent-hover text-gray-950 font-black rounded-lg text-xs transition-colors shadow-2xs mt-1"
          >
            Apply Price
          </button>
        </form>
      </div>

      {/* Customer Rating Filter */}
      <div className="space-y-2.5 pt-4 border-t border-gray-200">
        <h4 className="font-bold text-gray-900 uppercase text-[11px] tracking-wide">
          Customer Rating
        </h4>
        <div className="space-y-1.5">
          {[4, 3, 2].map((stars) => {
            const isSelected = selectedRating === stars;
            return (
              <button
                key={stars}
                type="button"
                onClick={() => handleRatingSelect(stars)}
                className={`w-full flex items-center justify-between p-1.5 rounded-lg border text-left transition-all ${
                  isSelected
                    ? 'bg-amber-50 border-accent font-bold'
                    : 'border-transparent hover:bg-gray-100 text-gray-700'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <div className="flex items-center text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < stars ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-bold text-gray-800 text-[11px]">& Above</span>
                </div>
                {isSelected && <Check className="w-4 h-4 text-accent" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Availability Filter */}
      <div className="space-y-2.5 pt-4 border-t border-gray-200">
        <h4 className="font-bold text-gray-900 uppercase text-[11px] tracking-wide">
          Availability
        </h4>
        <label
          onClick={handleStockToggle}
          className="flex items-center gap-2.5 cursor-pointer py-1.5 px-2 rounded-lg border border-gray-200 hover:border-accent bg-gray-50/50 transition-colors"
        >
          <input
            type="checkbox"
            checked={inStock}
            onChange={handleStockToggle}
            className="accent-accent w-4 h-4 cursor-pointer rounded"
          />
          <span className="font-bold text-gray-800 text-xs">In Stock Only</span>
        </label>
      </div>
    </div>
  );
};

export default ProductFilters;
