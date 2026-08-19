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
    <nav className="hidden md:block bg-neutral-900 border-b border-neutral-800 text-white">
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
                  `flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                    item.highlight
                      ? isActive
                        ? 'bg-[#E50914] text-white shadow-md'
                        : 'bg-red-600/20 border border-red-500/40 text-red-400 hover:bg-red-600/30'
                      : isActive
                      ? 'bg-[#E50914] text-white font-extrabold shadow-sm'
                      : 'text-neutral-300 hover:text-white hover:bg-neutral-800'
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
