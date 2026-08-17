import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Video, Sparkles, BarChart2, Home } from 'lucide-react';

export const CreatorLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#0f172a] text-slate-100">
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-amber-500 text-slate-950 p-2 rounded-xl">
            <Video className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-lg text-white">Creator Studio</span>
        </div>

        <div className="flex items-center gap-4 text-xs font-semibold">
          <Link to="/" className="text-slate-400 hover:text-white flex items-center gap-1">
            <Home className="w-4 h-4" /> Home
          </Link>
          <Link to="/creator/studio" className="text-amber-400 hover:underline flex items-center gap-1">
            <Sparkles className="w-4 h-4" /> Studio
          </Link>
          <Link to="/creator/analytics" className="text-slate-400 hover:text-white flex items-center gap-1">
            <BarChart2 className="w-4 h-4" /> Earnings
          </Link>
        </div>
      </header>
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
};
