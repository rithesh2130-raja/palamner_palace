import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const CategoryCard = ({ category }) => {
  return (
    <Link
      to={`/products?category=${category.slug}`}
      className="group relative bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-amber-500/50 hover:shadow-2xl transition-all duration-300 p-4 flex items-center gap-4"
    >
      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-950 shrink-0">
        <img
          src={category.image}
          alt={category.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors truncate">
          {category.name}
        </h4>
        <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
          {category.description}
        </p>
        <span className="inline-block text-[11px] font-semibold text-amber-400/80 mt-1">
          {category.itemCount}+ Products
        </span>
      </div>

      <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-amber-400 group-hover:translate-x-1 transition-all shrink-0" />
    </Link>
  );
};
