import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Clapperboard, PlusCircle, ShoppingCart, User } from 'lucide-react';

export const MobileNavigation = () => {
  const items = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Reels', path: '/reels', icon: Clapperboard },
    { label: 'Create', path: '/creator/studio', icon: PlusCircle, isSpecial: true },
    { label: 'Cart', path: '/cart', icon: ShoppingCart },
    { label: 'Profile', path: '/account', icon: User },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-mobile-nav bg-surface border-t border-border shadow-lg pb-[env(safe-area-inset-bottom)] transition-colors">
      <nav className="h-[64px] flex items-center justify-around px-2">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.label}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center w-full h-full gap-1 text-[11px] font-semibold transition-colors ${
                  item.isSpecial
                    ? 'text-accent hover:text-accent-hover scale-105'
                    : isActive
                    ? 'text-accent font-bold'
                    : 'text-text-muted hover:text-text-primary'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={`w-5 h-5 ${isActive ? 'text-accent' : ''}`} />
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};

export default MobileNavigation;
