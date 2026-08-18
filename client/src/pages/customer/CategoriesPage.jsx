import React, { useState, useEffect } from 'react';
import { productService } from '../../services/api/productApi.js';
import { CategoryCard } from '../../components/common/CategoryCard.jsx';
import { Grid } from 'lucide-react';

export const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    productService.getCategories().then(setCategories);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="border-b border-slate-800 pb-6">
        <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-2">
          <Grid className="w-8 h-8 text-amber-400" />
          <span>Product Categories</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Explore all PalamnerPalace product categories and traditional craft collections.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <CategoryCard key={cat.id} category={cat} />
        ))}
      </div>
    </div>
  );
};
