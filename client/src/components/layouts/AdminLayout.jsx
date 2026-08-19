import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Video,
  Film,
  BarChart3,
  Settings,
  Menu,
  ChevronLeft,
  ShieldCheck,
  Home,
  Sparkles,
} from 'lucide-react';

export const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Products', path: '/admin/products', icon: Package },
    { label: 'AI Ad Studio', path: '/admin/advertisements', icon: Sparkles, highlight: true },
    { label: 'Orders', path: '/admin/orders', icon: ShoppingBag },
    { label: 'Customers', path: '/admin/customers', icon: Users },
    { label: 'Creators', path: '/admin/creators', icon: Video },
    { label: 'Reels', path: '/admin/reels', icon: Film },
    { label: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
    { label: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen flex bg-neutral-950 text-white">
      {/* Sidebar */}
      <aside
        className={`${
          collapsed ? 'w-20' : 'w-64'
        } bg-black border-r border-neutral-800 flex flex-col transition-all duration-300 relative`}
      >
        <div className="h-16 px-4 flex items-center justify-between border-b border-neutral-800">
          {!collapsed && (
            <div className="flex items-center gap-2 font-black text-white text-sm tracking-wide">
              <ShieldCheck className="w-5 h-5 text-[#E50914]" />
              <span>PALAMNER<span className="text-[#E50914]">ADMIN</span></span>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors mx-auto"
          >
            {collapsed ? <Menu className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (item.path === '/admin/advertisements' && location.pathname.startsWith('/admin/advertisements'));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all ${
                  item.highlight
                    ? isActive
                      ? 'bg-[#E50914] text-white shadow-md'
                      : 'bg-red-600/20 text-[#E50914] border border-red-500/40 hover:bg-red-600/30'
                    : isActive
                    ? 'bg-[#E50914] text-white font-extrabold'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                }`}
                title={collapsed ? item.label : undefined}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-neutral-800">
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-neutral-400 hover:text-white hover:bg-neutral-800 transition-all"
          >
            <Home className="w-4 h-4 shrink-0" />
            {!collapsed && <span>Back to Marketplace</span>}
          </Link>
        </div>
      </aside>

      {/* Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-neutral-950">
        <header className="h-16 bg-neutral-900 border-b border-neutral-800 px-6 flex items-center justify-between">
          <h1 className="text-xs font-black text-white uppercase tracking-wider">
            PalamnerPalace Management Console
          </h1>
          <span className="px-3 py-1 rounded-full bg-red-600/20 text-[#E50914] border border-red-500/40 text-xs font-bold">
            Gemini AI Ready
          </span>
        </header>

        <main className="flex-1 p-6 overflow-y-auto bg-neutral-950">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
