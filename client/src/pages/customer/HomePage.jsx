import React, { useEffect, useState } from 'react';
import { fetchHealthCheck } from '../../services/api/healthApi.js';
import { productService } from '../../services/api/productApi.js';
import { reelService } from '../../services/api/reelApi.js';
import { ProductCard } from '../../components/common/ProductCard.jsx';
import { CategoryCard } from '../../components/common/CategoryCard.jsx';
import { ReelCard } from '../../components/common/ReelCard.jsx';
import { ProductSkeleton } from '../../components/ui/Skeletons.jsx';

import { Sparkles, Server, Database, Film, ShoppingBag, ArrowRight, ShieldCheck, RefreshCw, Flame, Award } from 'lucide-react';
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Hero Header */}
      <section className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-12 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 fill-amber-400" />
            <span>PALAMNERPALACE — Short Video Commerce</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Discover through <span className="text-amber-400">Reels</span>.<br />
            Shop instantly in-stream.
          </h1>

          <p className="text-slate-300 text-xs sm:text-base leading-relaxed">
            Welcome to PalamnerPalace — modern Indian e-commerce integrated with social short-video shopping. Browse authentic silk sarees, artisan handicrafts, electronics, and daily deals.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              to="/reels"
              className="inline-flex items-center gap-2 px-5 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs sm:text-sm rounded-xl shadow-lg hover:shadow-amber-500/25 transition-all"
            >
              <Film className="w-4 h-4" />
              <span>Explore Reels Feed</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs sm:text-sm rounded-xl border border-slate-700 transition-all"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Browse Products</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Showcase */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-white tracking-tight">Browse Categories</h2>
            <p className="text-xs text-slate-400 mt-0.5">Explore curated departments and regional crafts</p>
          </div>
          <Link to="/categories" className="text-xs font-bold text-amber-400 hover:underline flex items-center gap-1">
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
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              <span>Featured Products</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Top-rated items handpicked for you</p>
          </div>
          <Link to="/products" className="text-xs font-bold text-amber-400 hover:underline flex items-center gap-1">
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

      {/* Reels Commerce Showcase */}
      <section className="bg-slate-900/80 border border-amber-500/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-[11px] font-bold uppercase tracking-wider mb-2">
              <Film className="w-3.5 h-3.5" />
              <span>Video Commerce</span>
            </div>
            <h2 className="text-2xl font-black text-white">Live Reels Shopping Experience</h2>
            <p className="text-xs text-slate-400 mt-1">Watch real creators demo products and buy directly in-stream.</p>
          </div>

          <Link
            to="/reels"
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow transition-all shrink-0"
          >
            Launch Reels Feed
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
          {reels.map((reel) => (
            <ReelCard key={reel.id} reel={reel} />
          ))}
        </div>
      </section>

      {/* Preserved MERN Stack Health Telemetry */}
      <section className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>MERN Stack Health & Telemetry</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Live Express REST API & MongoDB connection status for PalamnerPalace backend.
            </p>
          </div>

          <button
            onClick={checkHealth}
            disabled={healthLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg border border-slate-700 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${healthLoading ? 'animate-spin' : ''}`} />
            <span>Re-check</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-400">
                <Server className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-400 font-medium">Express Node Server</div>
                <div className="text-sm font-bold text-slate-200">Backend REST API (:5000)</div>
              </div>
            </div>

            <div>
              {healthLoading ? (
                <span className="text-xs text-slate-400 animate-pulse">Checking...</span>
              ) : health?.success ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-extrabold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  Connected
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-extrabold">
                  Offline
                </span>
              )}
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-400 font-medium">Database Layer</div>
                <div className="text-sm font-bold text-slate-200">MongoDB Mongoose</div>
              </div>
            </div>

            <div>
              {healthLoading ? (
                <span className="text-xs text-slate-400 animate-pulse">Checking...</span>
              ) : health?.data?.database === 'Connected' ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-extrabold">
                  Connected
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-extrabold">
                  Disconnected
                </span>
              )}
            </div>
          </div>
        </div>

        {health && (
          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span>Message: {health.message}</span>
            <span>Server Time: {new Date(health.timestamp).toLocaleTimeString()}</span>
          </div>
        )}
      </section>
    </div>
  );
};
