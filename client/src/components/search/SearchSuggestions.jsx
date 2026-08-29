import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Tag, ArrowRight } from 'lucide-react';

export const SearchSuggestions = ({ suggestionsData, onClose, onSelectSuggestion }) => {
  const navigate = useNavigate();

  if (!suggestionsData) return null;

  const { suggestions = [], products = [], categories = [] } = suggestionsData;

  const hasSuggestions = suggestions.length > 0;
  const hasProducts = products.length > 0;
  const hasCategories = categories.length > 0;

  if (!hasSuggestions && !hasProducts && !hasCategories) {
    return null;
  }

  const handleProductClick = (slug) => {
    onClose();
    navigate(`/products/${slug}`);
  };

  const handleCategoryClick = (catName) => {
    onClose();
    navigate(`/products?category=${encodeURIComponent(catName.toLowerCase())}`);
  };

  const handleSuggestionClick = (term) => {
    onClose();
    if (onSelectSuggestion) {
      onSelectSuggestion(term);
    } else {
      navigate(`/products?q=${encodeURIComponent(term)}`);
    }
  };

  return (
    <div className="absolute top-full left-0 right-0 mt-1 bg-white text-gray-900 rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden text-xs animate-fadeIn">
      {/* Suggestions Section */}
      {hasSuggestions && (
        <div className="p-2 border-b border-gray-100">
          <div className="px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-gray-400">
            Search Suggestions
          </div>
          {suggestions.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSuggestionClick(item)}
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 flex items-center justify-between font-semibold text-gray-700 transition-colors group"
            >
              <div className="flex items-center gap-2">
                <Search className="w-3.5 h-3.5 text-gray-400 group-hover:text-accent" />
                <span>{item}</span>
              </div>
              <ArrowRight className="w-3 h-3 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          ))}
        </div>
      )}

      {/* Category Suggestions */}
      {hasCategories && (
        <div className="p-2 border-b border-gray-100 bg-gray-50/50">
          <div className="px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-gray-400">
            Matching Categories
          </div>
          <div className="flex flex-wrap gap-1.5 p-1.5">
            {categories.map((cat, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleCategoryClick(cat)}
                className="px-3 py-1 rounded-full bg-white border border-gray-200 hover:border-accent hover:text-accent font-bold text-[11px] flex items-center gap-1.5 transition-colors shadow-2xs"
              >
                <Tag className="w-3 h-3 text-accent" />
                <span>{cat}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Product Quick Previews */}
      {hasProducts && (
        <div className="p-2">
          <div className="px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-gray-400">
            Matching Products
          </div>
          <div className="space-y-1 mt-1">
            {products.map((prod) => (
              <button
                key={prod._id}
                type="button"
                onClick={() => handleProductClick(prod.slug)}
                className="w-full text-left p-2 rounded-lg hover:bg-gray-100 flex items-center gap-3 transition-colors group"
              >
                {prod.image ? (
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-10 h-10 object-cover rounded-md border border-gray-200 shrink-0"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-md bg-gray-100 border border-gray-200 shrink-0 flex items-center justify-center text-[10px] font-bold text-gray-400">
                    No Img
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 truncate group-hover:text-accent transition-colors">
                    {prod.name}
                  </p>
                  <p className="text-[11px] font-extrabold text-gray-600">
                    ₹{prod.price?.toLocaleString()}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchSuggestions;
