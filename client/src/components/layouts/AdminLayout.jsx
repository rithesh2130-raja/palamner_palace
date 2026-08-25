import React, { useState } from 'react';
import { Outlet, NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Wand2,
  Package,
  Layers,
  Boxes,
  ShoppingCart,
  Users,
  Store,
  Video,
  Clapperboard,
  ShieldAlert,
  Megaphone,
  Share2,
  CreditCard,
  Truck,
  BarChart3,
  HelpCircle,
  UserCheck,
  KeyRound,
  Settings,
  FileText,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Search,
  Bell,
  Sun,
  Moon,
  Menu,
  Shield
} from 'lucide-react';
import { IconButton } from '../ui/IconButton.jsx';
import Drawer from '../ui/Drawer.jsx';
import Avatar from '../ui/Avatar.jsx';
import Breadcrumb from '../ui/Breadcrumb.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';

export const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark, toggleTheme } = useTheme();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [adminSearch, setAdminSearch] = useState('');

  const adminNavItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'AI Video Analytics', path: '/admin/ai', icon: Wand2 },
    { label: 'Products', path: '/admin/products', icon: Package },
    { label: 'Categories', path: '/admin/categories', icon: Layers },
    { label: 'Inventory', path: '/admin/inventory', icon: Boxes },
    { label: 'Orders', path: '/admin/orders', icon: ShoppingCart },
    { label: 'Customers', path: '/admin/customers', icon: Users },
    { label: 'Sellers', path: '/admin/sellers', icon: Store },
    { label: 'Creators', path: '/admin/creators', icon: Video },
    { label: 'Reels Moderation', path: '/admin/reels', icon: Clapperboard },
    { label: 'Content Moderation', path: '/admin/moderation', icon: ShieldAlert },
    { label: 'Campaigns', path: '/admin/campaigns', icon: Megaphone },
    { label: 'Affiliate System', path: '/admin/affiliate', icon: Share2 },
    { label: 'Payments', path: '/admin/payments', icon: CreditCard },
    { label: 'Shipping', path: '/admin/shipping', icon: Truck },
    { label: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
    { label: 'Support Tickets', path: '/admin/support', icon: HelpCircle },
    { label: 'Users & Roles', path: '/admin/users', icon: UserCheck },
    { label: 'System Settings', path: '/admin/settings', icon: Settings },
    { label: 'Audit Logs', path: '/admin/audit-logs', icon: FileText },
  ];

  // Helper for Breadcrumb path
  const pathParts = location.pathname.split('/').filter(Boolean);
  const breadcrumbItems = pathParts.slice(1).map((part, i) => ({
    label: part.charAt(0).toUpperCase() + part.slice(1),
    href: `/admin/${pathParts.slice(1, i + 2).join('/')}`,
  }));

  return (
    <div className="min-h-screen flex bg-[#F6F7F9] dark:bg-[#0F1115] text-text-primary transition-colors">
      {/* Desktop Admin Sidebar (250px / 72px collapsed) */}
      <aside
        className={`hidden lg:flex flex-col bg-[#111827] text-white border-r border-gray-800 shrink-0 transition-all duration-300 ${
          isCollapsed ? 'w-[72px]' : 'w-[250px]'
        }`}
      >
        {/* Header */}
        <div className="h-[64px] px-4 border-b border-gray-800 flex items-center justify-between">
          <Link to="/admin" className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded bg-accent flex items-center justify-center text-gray-950 font-black shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col min-w-0">
                <span className="font-extrabold text-sm tracking-tight text-white leading-none truncate">
                  SHOPSPHERE
                </span>
                <span className="text-[9px] text-accent font-bold uppercase tracking-widest">
                  ADMIN ENTERPRISE
                </span>
              </div>
            )}
          </Link>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 text-gray-400 hover:text-white rounded hover:bg-white/10"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 p-2 space-y-1 overflow-y-auto scrollbar-none">
          {adminNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.label}
                to={item.path}
                end={item.path === '/admin'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-all group relative ${
                    isActive
                      ? 'bg-white/10 text-white font-semibold border-l-[3px] border-accent pl-2.5'
                      : 'text-gray-400 hover:bg-white/5 hover:text-gray-200 font-normal'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={`w-5 h-5 shrink-0 ${
                        isActive ? 'text-accent' : 'text-gray-400 group-hover:text-gray-200'
                      }`}
                    />
                    {!isCollapsed && <span className="truncate text-xs font-medium">{item.label}</span>}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Logout Footer */}
        <div className="p-2 border-t border-gray-800">
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium text-red-400 hover:bg-red-950/40 transition-colors"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {!isCollapsed && <span>Exit to Shop</span>}
          </button>
        </div>
      </aside>

      {/* Main Administrative Container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-[64px] bg-white dark:bg-[#171A21] border-b border-border px-4 sm:px-6 flex items-center justify-between gap-4 shrink-0 shadow-xs">
          {/* Left: Mobile Toggle & Breadcrumb */}
          <div className="flex items-center gap-3">
            <IconButton
              icon={Menu}
              aria-label="Open admin menu"
              className="lg:hidden"
              onClick={() => setIsMobileDrawerOpen(true)}
            />
            <div className="hidden sm:block">
              <Breadcrumb items={breadcrumbItems.length > 0 ? breadcrumbItems : [{ label: 'Dashboard' }]} />
            </div>
          </div>

          {/* Center: Global Admin Search */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 absolute left-3 text-text-muted pointer-events-none" />
              <input
                type="text"
                value={adminSearch}
                onChange={(e) => setAdminSearch(e.target.value)}
                placeholder="Search orders, users, products, logs..."
                className="w-full h-9 pl-9 pr-3 text-xs bg-surface-secondary border border-border rounded-md text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>

          {/* Right: Actions & Admin Profile */}
          <div className="flex items-center gap-3 text-xs">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md hover:bg-surface-secondary text-text-muted hover:text-text-primary"
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun className="w-5 h-5 text-accent" /> : <Moon className="w-5 h-5" />}
            </button>

            <button className="relative p-2 rounded-md hover:bg-surface-secondary text-text-muted hover:text-text-primary">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-accent" />
            </button>

            <div className="flex items-center gap-2 pl-2 border-l border-border">
              <Avatar
                name="Admin Master"
                size="sm"
                isOnline={true}
              />
              <div className="hidden sm:flex flex-col text-left">
                <span className="font-bold text-text-primary text-xs leading-none">Super Admin</span>
                <span className="text-[10px] text-text-muted">system@shopsphere.com</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Mobile Drawer */}
      <Drawer
        isOpen={isMobileDrawerOpen}
        onClose={() => setIsMobileDrawerOpen(false)}
        title="Admin Control Center"
        position="left"
      >
        <div className="space-y-1">
          {adminNavItems.map((item) => {
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

export default AdminLayout;
