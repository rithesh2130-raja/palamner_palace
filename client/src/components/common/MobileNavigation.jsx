import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Grid, Film, ShoppingBag, User } from 'lucide-react';
import { useCart } from '../../context/CartContext.jsx';

export const MobileNavigation = () => {
  const { cartItemCount } = useCart();

  const navItems = [
    { label: 'Home', to: '/', icon: Home },
    { label: 'Categories', to: '/categories', icon: Grid },
    { label: 'Reels', to: '/reels', icon: Film, isReels: true },
    { label: 'Cart', to: '/cart', icon: ShoppingBag, badge: cartItemCount },
    { label: 'Account', to: '/account', icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-black border-t border-neutral-800 px-2 py-2 shadow-2xl">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.label}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all relative ${
                  item.isReels
                    ? isActive
                      ? 'text-[#E50914] font-black scale-110'
                      : 'text-[#E50914] font-bold'
                    : isActive
                    ? 'text-[#E50914] font-bold'
                    : 'text-neutral-400 hover:text-white'
                }`
              }
            >
              {item.isReels ? (
                <div className="p-1.5 rounded-full bg-[#E50914] text-white shadow-md">
                  <Icon className="w-4 h-4" />
                </div>
              ) : (
                <div className="relative">
                  <Icon className="w-5 h-5" />
                  {item.badge > 0 && (
                    <span className="absolute -top-1.5 -right-2 bg-[#E50914] text-white font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow">
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
              <span className="text-[10px] mt-1 tracking-tight">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </div>
  );
};
