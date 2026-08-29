import React from 'react';
import { X, RotateCcw } from 'lucide-react';
import { categories as ALL_CATEGORIES } from '../../config/categories.js';

export const ActiveFilters = ({ filters = {}, onRemoveFilter, onClearAll }) => {
  const chips = [];

  // Search Query Chip
  if (filters.q || filters.search) {
    const term = filters.q || filters.search;
    chips.push({
      key: 'q',
      label: `Query: "${term}"`,
      onRemove: () => onRemoveFilter('q'),
    });
  }

  // Category Chip
  if (filters.category && filters.category.toLowerCase() !== 'all') {
    const foundCat = ALL_CATEGORIES.find(c => c.slug.toLowerCase() === filters.category.toLowerCase());
    const catLabel = foundCat ? foundCat.name : filters.category;
    chips.push({
      key: 'category',
      label: `Category: ${catLabel}`,
      onRemove: () => onRemoveFilter('category'),
    });
  }

  // Price Chip
  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    let priceText = '';
    if (filters.minPrice !== undefined && filters.maxPrice !== undefined) {
      priceText = `₹${filters.minPrice}–₹${filters.maxPrice}`;
    } else if (filters.minPrice !== undefined) {
      priceText = `Over ₹${filters.minPrice}`;
    } else {
      priceText = `Under ₹${filters.maxPrice}`;
    }
    chips.push({
      key: 'price',
      label: `Price: ${priceText}`,
      onRemove: () => {
        onRemoveFilter('minPrice');
        onRemoveFilter('maxPrice');
      },
    });
  }

  // Rating Chip
  if (filters.minRating !== undefined && filters.minRating > 0) {
    chips.push({
      key: 'minRating',
      label: `⭐ ${filters.minRating}★ & above`,
      onRemove: () => onRemoveFilter('minRating'),
    });
  }

  // In Stock Chip
  if (filters.inStock) {
    chips.push({
      key: 'inStock',
      label: 'In Stock Only',
      onRemove: () => onRemoveFilter('inStock'),
    });
  }

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 py-2 text-xs">
      <span className="text-[11px] font-extrabold uppercase tracking-wider text-gray-400">
        Active Filters:
      </span>

      {chips.map((chip) => (
        <span
          key={chip.key}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/15 border border-accent/30 text-gray-900 font-bold text-xs shadow-2xs animate-fadeIn"
        >
          <span>{chip.label}</span>
          <button
            type="button"
            onClick={chip.onRemove}
            className="p-0.5 hover:bg-accent/30 rounded-full transition-colors"
            title={`Remove filter ${chip.label}`}
          >
            <X className="w-3 h-3 text-gray-700" />
          </button>
        </span>
      ))}

      <button
        type="button"
        onClick={onClearAll}
        className="text-accent hover:underline font-extrabold flex items-center gap-1 ml-1 text-xs"
      >
        <RotateCcw className="w-3 h-3" />
        <span>Clear All</span>
      </button>
    </div>
  );
};

export default ActiveFilters;
