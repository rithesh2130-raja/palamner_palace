import React from 'react';
import { ArrowUpDown } from 'lucide-react';

export const SORT_OPTIONS = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest Arrivals' },
  { value: 'rating', label: 'Customer Rating' },
  { value: 'popular', label: 'Popular & Reviews' },
];

export const ProductSort = ({ currentSort = 'relevance', onSortChange, className = '' }) => {
  return (
    <div className={`flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-3 py-1.5 text-xs ${className}`}>
      <ArrowUpDown className="w-3.5 h-3.5 text-accent shrink-0" />
      <span className="font-bold text-gray-500 hidden sm:inline">Sort by:</span>
      <select
        value={currentSort}
        onChange={(e) => onSortChange(e.target.value)}
        className="bg-transparent font-extrabold text-gray-900 focus:outline-none cursor-pointer text-xs"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ProductSort;
