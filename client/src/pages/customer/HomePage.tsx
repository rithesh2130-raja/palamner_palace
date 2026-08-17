import React, { useEffect, useState } from "react";
import {
  fetchHealthCheck,
  HealthCheckResponse,
} from "../../services/api/healthApi";
import {
  Sparkles,
  Server,
  Database,
  Film,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import { Link } from "react-router-dom";

export const HomePage: React.FC = () => {
  const [health, setHealth] = useState<HealthCheckResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkHealth = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchHealthCheck();
      setHealth(data);
    } catch (err) {
      console.error("Health check failed:", err);
      setError(err instanceof Error ? err.message : "Backend Offline");
      setHealth(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Hero Header */}
      <section className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700/80 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 fill-amber-400" />
            <span>Social Commerce Marketplace</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-none">
            Discover through <span className="text-amber-400">Reels</span>.
            <br />
            Shop instantly in-stream.
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Combine Amazon-style e-commerce with TikTok-style short-form video
            discovery. Explore tagged products, creator affiliate showcases, and
            personalized AI shopping.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              to="/reels"
              className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm rounded-xl shadow-lg hover:shadow-amber-500/25 transition-all"
            >
              <Film className="w-4 h-4" />
              <span>Explore Reels Feed</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/search"
              className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm rounded-xl border border-slate-700 transition-all"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Browse Catalog</span>
            </Link>
          </div>
        </div>
      </section>

      {/* System Health Check Indicator (Section 22 requirement) */}
      <section className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-6">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>System Health & Architecture Status</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Live real-time backend API connection & database readiness
              telemetry.
            </p>
          </div>

          <button
            onClick={checkHealth}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg border border-slate-700 transition-all disabled:opacity-50"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`}
            />
            <span>Re-check</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Backend Status Card */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-400">
                <Server className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-400 font-medium">
                  Backend API
                </div>
                <div className="text-sm font-bold text-slate-200">
                  Express Node.js Server
                </div>
              </div>
            </div>

            <div>
              {loading ? (
                <span className="text-xs text-slate-400 animate-pulse">
                  Checking...
                </span>
              ) : health?.success ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-extrabold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  Backend: Connected
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-extrabold">
                  Backend: Offline
                </span>
              )}
            </div>
          </div>

          {/* Database Status Card */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-400 font-medium">
                  Database Layer
                </div>
                <div className="text-sm font-bold text-slate-200">
                  MongoDB Mongoose
                </div>
              </div>
            </div>

            <div>
              {loading ? (
                <span className="text-xs text-slate-400 animate-pulse">
                  Checking...
                </span>
              ) : health?.data?.database === "Connected" ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-extrabold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  Database: Connected
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-extrabold">
                  Database: Disconnected
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Dynamic Timestamp Footer */}
        {health && (
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span>Response: {health.message}</span>
            <span>
              Server Time: {new Date(health.timestamp).toLocaleTimeString()}
            </span>
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-300">
            <strong>Error:</strong> {error}. Ensure backend is running on{" "}
            <code>http://localhost:5000</code>.
          </div>
        )}
      </section>
    </div>
  );
};
