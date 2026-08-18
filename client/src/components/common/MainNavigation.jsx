import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Grid, ShoppingBag, Flame, Film, Sparkles, Award } from 'lucide-react';

export const MainNavigation = () => {
  const navItems = [
    { label: 'Home', to: '/', icon: Home },
    { label: 'Categories', to: '/categories', icon: Grid },
    { label: 'Products', to: '/products', icon: ShoppingBag },
    { label: 'Deals', to: '/deals', icon: Flame },
    { label: 'Reels Feed', to: '/reels', icon: Film, highlight: true },
    { label: 'New Arrivals', to: '/products?filter=new', icon: Sparkles },
    { label: 'Best Sellers', to: '/products?filter=bestseller', icon: Award },
  ];

  return (
    <nav className="hidden md:block bg-slate-900/80 border-b border-slate-800 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-1 overflow-x-auto py-2.5 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.label}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    item.highlight
                      ? isActive
                        ? 'bg-amber-500 text-slate-950 font-extrabold shadow-md shadow-amber-500/20'
                        : 'bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20'
                      : isActive
                      ? 'bg-slate-800 text-amber-400 font-bold border border-slate-700'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`
                }
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
