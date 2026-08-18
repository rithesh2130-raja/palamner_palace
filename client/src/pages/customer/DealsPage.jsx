import React, { useState, useEffect } from 'react';
import { productService } from '../../services/api/productApi.js';
import { ProductCard } from '../../components/common/ProductCard.jsx';
import { Flame, Clock } from 'lucide-react';

export const DealsPage = () => {
  const [dealProducts, setDealProducts] = useState([]);

  useEffect(() => {
    productService.getProducts().then(prods => {
      setDealProducts(prods.filter(p => p.discountPercentage >= 30));
    });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="bg-gradient-to-r from-amber-500/20 via-slate-900 to-slate-900 border border-amber-500/30 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500 text-slate-950 text-[11px] font-black uppercase tracking-wider mb-2">
            <Flame className="w-3.5 h-3.5 fill-slate-950" />
            <span>Flash Deals of the Day</span>
          </div>
          <h1 className="text-3xl font-black text-white">Up to 40% OFF Special Offers</h1>
          <p className="text-xs text-slate-300 mt-1">Limited-time discounts on sarees, electronics, and home decor.</p>
        </div>

        <div className="flex items-center gap-2 bg-slate-950/80 border border-amber-500/40 px-4 py-2.5 rounded-2xl text-amber-400 font-mono text-xs font-bold shrink-0">
          <Clock className="w-4 h-4 animate-spin" />
          <span>Ends in: 06h 42m 18s</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {dealProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};
