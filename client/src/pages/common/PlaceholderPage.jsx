import React from 'react';
import { Sparkles, Clock, ArrowLeft } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export const PlaceholderPage = ({ title, dayPlanned = 'Day 2+' }) => {
  const location = useLocation();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-slate-900/80 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
        <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-center mx-auto text-amber-400">
          <Sparkles className="w-8 h-8" />
        </div>

        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Clock className="w-3.5 h-3.5" />
            Planned for {dayPlanned}
          </span>
          <h2 className="text-2xl font-black text-white">{title}</h2>
          <p className="text-xs text-slate-400 mt-2 font-mono">{location.pathname}</p>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
          Day 1 scope is strictly limited to core foundation, architecture, and health monitoring. This feature will be implemented incrementally.
        </p>

        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Home</span>
        </Link>
      </div>
    </div>
  );
};
