import React from 'react';
import { Sparkles, Clock, ArrowLeft } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export const PlaceholderPage = ({ title, dayPlanned = 'Day 4+' }) => {
  const location = useLocation();

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-surface border border-border rounded-2xl p-8 shadow-lg space-y-6">
        <div className="w-16 h-16 bg-accent/10 border border-accent/30 rounded-2xl flex items-center justify-center mx-auto text-accent">
          <Sparkles className="w-8 h-8" />
        </div>

        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-secondary text-accent text-xs font-bold uppercase tracking-wider mb-2">
            <Clock className="w-3.5 h-3.5" />
            Planned for {dayPlanned}
          </span>
          <h2 className="text-xl font-bold text-text-primary">{title}</h2>
          <p className="text-xs text-text-muted mt-2 font-mono">{location.pathname}</p>
        </div>

        <p className="text-xs text-text-secondary leading-relaxed bg-surface-secondary p-4 rounded-xl border border-border">
          Day 3 scope focuses on building the design system, component architecture, and application shells. This feature will be implemented in upcoming days.
        </p>

        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 w-full py-2.5 bg-accent hover:bg-accent-hover text-gray-950 font-bold text-xs rounded-lg shadow-sm transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Homepage</span>
        </Link>
      </div>
    </div>
  );
};

export default PlaceholderPage;
