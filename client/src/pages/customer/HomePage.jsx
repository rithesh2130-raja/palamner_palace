import React, { useEffect, useState } from 'react';
import { fetchHealthCheck } from '../../services/api/healthApi.js';
import { productService } from '../../services/api/productApi.js';
import { reelService } from '../../services/api/reelApi.js';
import { ProductCard } from '../../components/common/ProductCard.jsx';
import { CategoryCard } from '../../components/common/CategoryCard.jsx';
import { ReelCard } from '../../components/common/ReelCard.jsx';
import { ProductSkeleton } from '../../components/ui/Skeletons.jsx';

import { Sparkles, Server, Database, Film, ShoppingBag, ArrowRight, ShieldCheck, RefreshCw, Award, Wand2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const HomePage = () => {
  const [health, setHealth] = useState(null);
  const [healthLoading, setHealthLoading] = useState(true);
  const [healthError, setHealthError] = useState(null);

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [reels, setReels] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  const checkHealth = async () => {
    setHealthLoading(true);
    setHealthError(null);
    try {
      const data = await fetchHealthCheck();
      setHealth(data);
    } catch (err) {
      console.error('Health check failed:', err);
      setHealthError(err.message || 'Backend Offline');
      setHealth(null);
    } finally {
      setHealthLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();
    const loadHomeData = async () => {
      setLoadingData(true);
      try {
        const [prods, cats, rls] = await Promise.all([
          productService.getProducts(),
          productService.getCategories(),
          reelService.getReels()
        ]);
        setProducts(prods);
        setCategories(cats);
        setReels(rls);
      } catch (err) {
        console.error('Failed to load home page data:', err);
      } finally {
        setLoadingData(false);
      }
    };
    loadHomeData();
  }, []);

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* Black Premium Hero Banner */}
        <section className="bg-black border border-neutral-800 rounded-3xl p-6 sm:p-12 shadow-2xl relative overflow-hidden text-white">
          <div className="absolute -right-20 -top-20 w-96 h-96 bg-[#E50914]/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="relative z-10 max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/20 border border-red-500/30 text-[#E50914] text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 fill-[#E50914]" />
              <span>PALAMNERPALACE — AI & SOCIAL COMMERCE</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Discover through <span className="text-[#E50914]">Reels</span>.<br />
              Shop instantly in-stream.
            </h1>

            <p className="text-neutral-300 text-xs sm:text-base leading-relaxed">
              Experience the next generation of social commerce. Watch short video advertisements created with Gemini AI, shop handwoven silks, regional handicrafts, and daily flash deals.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                to="/reels"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#E50914] hover:bg-[#B20710] text-white font-black text-xs sm:text-sm rounded-xl shadow-lg shadow-red-600/30 transition-all"
              >
                <Film className="w-4 h-4" />
                <span>Explore Shoppable Reels</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/admin/advertisements/create"
                className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs sm:text-sm rounded-xl border border-neutral-700 transition-all"
              >
                <Wand2 className="w-4 h-4 text-[#E50914]" />
                <span>AI Ad Studio</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Categories Showcase */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
            <div>
              <h2 className="text-xl font-black text-black tracking-tight">Browse Categories</h2>
              <p className="text-xs text-neutral-500 mt-0.5">Curated departments and regional artisan crafts</p>
            </div>
            <Link to="/categories" className="text-xs font-bold text-[#E50914] hover:underline flex items-center gap-1">
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.slice(0, 6).map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </section>

        {/* Featured Products */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
            <div>
              <h2 className="text-xl font-black text-black tracking-tight flex items-center gap-2">
                <Award className="w-5 h-5 text-[#E50914]" />
                <span>Featured Catalog</span>
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">Top-rated items handpicked for you</p>
            </div>
            <Link to="/products" className="text-xs font-bold text-[#E50914] hover:underline flex items-center gap-1">
              <span>See All Products</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loadingData ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <ProductSkeleton />
              <ProductSkeleton />
              <ProductSkeleton />
              <ProductSkeleton />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.slice(0, 8).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>

        {/* Black Premium Section: Live Shoppable Reels */}
        <section className="bg-black border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl text-white">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600/20 text-[#E50914] text-[11px] font-bold uppercase tracking-wider mb-2">
                <Film className="w-3.5 h-3.5" />
                <span>Trending Short Videos</span>
              </div>
              <h2 className="text-2xl font-black text-white">Live Reels Shopping Feed</h2>
              <p className="text-xs text-neutral-400 mt-1">Watch video ads and click Shop Now to buy tagged products instantly.</p>
            </div>

            <Link
              to="/reels"
              className="px-4 py-2 bg-[#E50914] hover:bg-[#B20710] text-white font-bold text-xs rounded-xl shadow transition-all shrink-0"
            >
              Launch Reels Feed
            </Link>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-transparent">
            {reels.map((reel) => (
              <Link 
                key={reel.id || reel._id} 
                to="/reels"
                className="group relative w-40 sm:w-48 aspect-[9/16] shrink-0 rounded-2xl overflow-hidden snap-start bg-neutral-900 border border-neutral-800"
              >
                <img 
                  src={reel.thumbnailUrl || reel.uploadedImageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80'} 
                  alt={reel.caption || 'Reel thumbnail'} 
                  className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/90 pointer-events-none"></div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="p-3 bg-black/60 rounded-full backdrop-blur-sm">
                    <Film className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="absolute bottom-3 left-3 right-3">
                  <p className="text-xs text-white font-medium line-clamp-2 drop-shadow-md">
                    {reel.caption || 'Watch shoppable reel'}
                  </p>
                  <div className="mt-1.5 flex items-center gap-1.5 text-[10px] text-neutral-300">
                    <span className="truncate">{reel.taggedProduct?.title || 'Featured Product'}</span>
                  </div>
                </div>
              </Link>
            ))}
            <div className="w-40 sm:w-48 aspect-[9/16] shrink-0 rounded-2xl flex items-center justify-center snap-start">
               <Link
                to="/reels"
                className="flex flex-col items-center gap-3 text-neutral-400 hover:text-white transition-colors"
               >
                 <div className="p-4 rounded-full bg-neutral-900 border border-neutral-800">
                   <ArrowRight className="w-6 h-6" />
                 </div>
                 <span className="text-xs font-bold">Watch All Reels</span>
               </Link>
            </div>
          </div>
        </section>

        {/* MERN Stack Health Telemetry */}
        <section className="bg-neutral-50 border border-neutral-200 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-neutral-200 pb-4">
            <div>
              <h2 className="text-lg font-bold text-black flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span>MERN Stack System Telemetry</span>
              </h2>
              <p className="text-xs text-neutral-500 mt-1">
                Live Express REST API & MongoDB connection status for PalamnerPalace backend.
              </p>
            </div>

            <button
              onClick={checkHealth}
              disabled={healthLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-neutral-100 text-black text-xs font-bold rounded-lg border border-neutral-300 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${healthLoading ? 'animate-spin' : ''}`} />
              <span>Re-check</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white border border-neutral-200 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600">
                  <Server className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-neutral-500 font-medium">Express Node Server</div>
                  <div className="text-sm font-bold text-black">Backend REST API (:5000)</div>
                </div>
              </div>

              <div>
                {healthLoading ? (
                  <span className="text-xs text-neutral-400 animate-pulse">Checking...</span>
                ) : health?.success ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-700 text-xs font-black">
                    Connected
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-100 border border-red-300 text-red-700 text-xs font-black">
                    Offline
                  </span>
                )}
              </div>
            </div>

            <div className="bg-white border border-neutral-200 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-red-50 text-[#E50914]">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-neutral-500 font-medium">Database Layer</div>
                  <div className="text-sm font-bold text-black">MongoDB Mongoose</div>
                </div>
              </div>

              <div>
                {healthLoading ? (
                  <span className="text-xs text-neutral-400 animate-pulse">Checking...</span>
                ) : health?.data?.database === 'Connected' ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-700 text-xs font-black">
                    Connected
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-800 text-xs font-black">
                    Fallback Mode
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
