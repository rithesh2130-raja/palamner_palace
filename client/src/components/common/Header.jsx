import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, User, Film, LayoutDashboard, Sparkles } from 'lucide-react';

export const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-[#1e293b]/95 backdrop-blur-md border-b border-slate-700/80 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2 text-xl font-extrabold tracking-tight text-white group">
          <div className="bg-amber-500 text-slate-950 p-2 rounded-xl group-hover:rotate-6 transition-transform">
            <Sparkles className="w-5 h-5 fill-slate-950" />
          </div>
          <span>SHOP<span className="text-amber-400">SPHERE</span></span>
        </Link>

        {/* Global Search Bar */}
        <div className="flex-1 max-w-2xl hidden md:flex items-center relative">
          <input
            type="text"
            placeholder="Search products, video reels, creators..."
            onKeyDown={(e) => {
              if (e.key === 'Enter') navigate('/search');
            }}
            className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5 pointer-events-none" />
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-3">
          <Link
            to="/reels"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-amber-400 bg-amber-400/10 border border-amber-400/30 rounded-lg hover:bg-amber-400/20 transition-all"
          >
            <Film className="w-4 h-4" />
            <span>Reels</span>
          </Link>

          <Link
            to="/creator/studio"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
          >
            <span>Creator Studio</span>
          </Link>

          <Link
            to="/admin"
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Admin</span>
          </Link>

          <Link
            to="/login"
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
            title="Account"
          >
            <User className="w-5 h-5" />
          </Link>

          <Link
            to="/cart"
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg relative transition-all"
            title="Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-amber-400 rounded-full"></span>
          </Link>
        </div>
      </div>
    </header>
  );
};
