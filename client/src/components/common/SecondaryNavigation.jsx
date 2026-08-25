import React from 'react';
import { NavLink } from 'react-router-dom';
import { Flame, Clapperboard, Sparkles, Tag, Layers } from 'lucide-react';

export const SecondaryNavigation = () => {
  const navItems = [
    { label: 'All Categories', path: '/categories', icon: Layers },
    { label: 'Deals', path: '/deals', icon: Tag, highlight: true },
    { label: 'Reels Feed', path: '/reels', icon: Clapperboard, highlight: true },
    { label: 'Best Sellers', path: '/products?sort=bestsellers', icon: Flame },
    { label: 'New Releases', path: '/products?sort=newest', icon: Sparkles },
    { label: 'Electronics', path: '/categories/electronics' },
    { label: 'Fashion', path: '/categories/fashion' },
    { label: 'Home', path: '/categories/home' },
    { label: 'Gaming', path: '/categories/gaming' },
    { label: 'Beauty', path: '/categories/beauty' },
    { label: 'Support', path: '/support' },
  ];

  return (
    <nav className="h-[42px] bg-[#232F3E] text-white border-b border-gray-800 text-xs font-semibold overflow-x-auto scrollbar-none select-none">
      <div className="max-w-[1440px] mx-auto h-full px-4 flex items-center gap-1 sm:gap-2 whitespace-nowrap min-w-max">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.label}
              to={item.path}
              className={({ isActive }) =>
                `h-[34px] px-3 rounded flex items-center gap-1.5 transition-colors relative ${
                  isActive
                    ? 'bg-white/15 text-accent font-bold after:absolute after:bottom-0 after:left-3 after:right-3 after:h-[2px] after:bg-accent'
                    : item.highlight
                    ? 'text-accent hover:bg-white/10'
                    : 'text-gray-200 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              {Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default SecondaryNavigation;
