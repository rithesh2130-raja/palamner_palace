import React, { useState } from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Clapperboard,
  PlusCircle,
  ShoppingBag,
  BarChart3,
  DollarSign,
  Megaphone,
  Settings,
  Sparkles,
  Menu,
  Sun,
  Moon,
  LogOut,
  ChevronLeft
} from 'lucide-react';
import { IconButton } from '../ui/IconButton.jsx';
import Drawer from '../ui/Drawer.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import Avatar from '../ui/Avatar.jsx';

export const CreatorLayout = () => {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  const sidebarItems = [
    { label: 'Overview', path: '/creator/studio', icon: LayoutDashboard },
    { label: 'My Reels', path: '/creator/studio/reels', icon: Clapperboard },
    { label: 'Create Content', path: '/creator/studio/create', icon: PlusCircle, isAccent: true },
    { label: 'Tagged Products', path: '/creator/studio/products', icon: ShoppingBag },
    { label: 'Analytics', path: '/creator/studio/analytics', icon: BarChart3 },
    { label: 'Earnings', path: '/creator/studio/earnings', icon: DollarSign },
    { label: 'Campaigns', path: '/creator/studio/campaigns', icon: Megaphone },
    { label: 'Studio Settings', path: '/creator/studio/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen flex bg-page text-text-primary">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-60 bg-[#131A22] text-white border-r border-gray-800 shrink-0">
        <div className="h-[64px] px-6 border-b border-gray-800 flex items-center justify-between">
          <Link to="/creator/studio" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-gray-950 font-black">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-sm tracking-tight text-white leading-none">
                CREATOR STUDIO
              </span>
              <span className="text-[9px] text-accent font-bold uppercase tracking-widest">
                SHOPSPHERE
              </span>
            </div>
          </Link>
        </div>

        {/* Creator Info */}
        <div className="p-4 border-b border-gray-800/80 flex items-center gap-3">
          <Avatar
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
            name="Alex Tech"
            size="md"
          />
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-xs text-white truncate">@alex_tech_reviews</span>
            <span className="text-[11px] text-accent font-medium">142K Followers</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.label}
                to={item.path}
                end={item.path === '/creator/studio'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-white/10 text-accent border-l-4 border-accent font-bold pl-2'
                      : item.isAccent
                      ? 'bg-accent/20 text-accent hover:bg-accent/30'
                      : 'text-gray-300 hover:bg-white/5 hover:text-white'
                  }`
                }
              >
                <Icon className={`w-4 h-4 shrink-0 ${item.isAccent ? 'text-accent' : ''}`} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Footer Back Link */}
        <div className="p-3 border-t border-gray-800">
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Marketplace</span>
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-[64px] bg-surface border-b border-border px-4 sm:px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <IconButton
              icon={Menu}
              aria-label="Open sidebar"
              className="lg:hidden"
              onClick={() => setIsMobileDrawerOpen(true)}
            />
            <h1 className="text-base sm:text-lg font-bold text-text-primary">
              Creator Studio Overview
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md hover:bg-surface-secondary text-text-muted hover:text-text-primary"
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun className="w-5 h-5 text-accent" /> : <Moon className="w-5 h-5" />}
            </button>
            <Avatar
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
              name="Alex Tech"
              size="sm"
            />
          </div>
        </header>

        {/* Content Outlet */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Mobile Drawer */}
      <Drawer
        isOpen={isMobileDrawerOpen}
        onClose={() => setIsMobileDrawerOpen(false)}
        title="Creator Navigation"
        position="right"
      >
        <div className="space-y-1">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.label}
                to={item.path}
                onClick={() => setIsMobileDrawerOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-text-primary hover:bg-surface-secondary"
              >
                <Icon className="w-5 h-5 text-accent" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </Drawer>
    </div>
  );
};

export default CreatorLayout;
