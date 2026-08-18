import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Bell,
  MapPin,
  Sparkles,
  X,
  Menu,
  ChevronDown,
  LogOut,
  Package,
  Settings,
  Film,
  CheckCircle2,
  Trash2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useCart } from '../../context/CartContext.jsx';
import { useWishlist } from '../../context/WishlistContext.jsx';
import { useLocationContext } from '../../context/LocationContext.jsx';
import { useNotificationContext } from '../../context/NotificationContext.jsx';
import { useModal } from '../../context/ModalContext.jsx';
import { Dropdown } from '../ui/Dropdown.jsx';

export const Header = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn, logout, toggleAuth } = useAuth();
  const { cartItemCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { location } = useLocationContext();
  const { notifications, unreadCount, markAsRead, clearNotifications } = useNotificationContext();
  const { openModal } = useModal();

  const [searchQuery, setSearchQuery] = useState('');
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0f172a]/95 border-b border-slate-800 backdrop-blur-lg shadow-xl">
      {/* Top Banner Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        {/* Left Section: Mobile Menu Toggle & Brand Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileDrawerOpen(prev => !prev)}
            aria-label="Open mobile menu drawer"
            className="md:hidden p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
          >
            {mobileDrawerOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link to="/" className="flex items-center gap-2.5 text-lg sm:text-xl font-black tracking-tight text-white group">
            <div className="bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 p-2 rounded-xl group-hover:rotate-6 transition-transform shadow-md shadow-amber-500/20">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 fill-slate-950" />
            </div>
            <span>
              PALAMNER<span className="text-amber-400">PALACE</span>
            </span>
          </Link>
        </div>

        {/* Central Search Bar (Desktop) */}
        <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-xl relative">
          <input
            type="text"
            placeholder="Search products, traditional silk, reels, brands..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-10 pr-9 py-2 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
          {searchQuery && (
            <button
              type="button"
              onClick={handleClearSearch}
              aria-label="Clear search text"
              className="absolute right-3 top-2.5 p-1 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </form>

        {/* Right Action Icons: Delivery Location, Notifications, Wishlist, Cart, Account */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* Location Indicator */}
          <button
            onClick={() => openModal('location')}
            className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-400/50 transition-all text-left group"
          >
            <MapPin className="w-4 h-4 text-amber-400 shrink-0 group-hover:animate-bounce" />
            <div className="text-[11px] leading-tight">
              <div className="text-slate-400 font-medium">Deliver to</div>
              <div className="text-white font-bold truncate max-w-[110px]">
                {location.city} {location.pincode}
              </div>
            </div>
          </button>

          {/* Notifications Dropdown */}
          <Dropdown
            trigger={(isOpen) => (
              <button
                aria-label="Notifications"
                className={`p-2 rounded-xl transition-all relative ${
                  isOpen ? 'bg-slate-800 text-amber-400' : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 bg-amber-400 text-slate-950 font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow">
                    {unreadCount}
                  </span>
                )}
              </button>
            )}
          >
            {({ close }) => (
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Notifications</h4>
                  {notifications.length > 0 && (
                    <button
                      onClick={clearNotifications}
                      className="text-[11px] text-slate-400 hover:text-rose-400 flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" /> Clear
                    </button>
                  )}
                </div>

                <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
                  {notifications.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-4">No new notifications</p>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markAsRead(n.id)}
                        className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                          n.read
                            ? 'bg-slate-950/40 border-slate-800 text-slate-400'
                            : 'bg-slate-800/80 border-amber-500/30 text-slate-200'
                        }`}
                      >
                        <div className="font-bold text-white flex items-center justify-between">
                          <span>{n.title}</span>
                          {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>}
                        </div>
                        <p className="text-[11px] mt-1 line-clamp-2 text-slate-300">{n.message}</p>
                        <span className="text-[10px] text-slate-500 mt-1 block">{n.timestamp}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </Dropdown>

          {/* Wishlist Icon */}
          <Link
            to="/wishlist"
            aria-label="Wishlist"
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl relative transition-all"
          >
            <Heart className="w-5 h-5" />
            {wishlistCount > 0 && (
              <span className="absolute top-1 right-1 bg-rose-500 text-white font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart Icon */}
          <Link
            to="/cart"
            aria-label="Shopping Cart"
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl relative transition-all"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartItemCount > 0 && (
              <span className="absolute top-1 right-1 bg-amber-500 text-slate-950 font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow">
                {cartItemCount}
              </span>
            )}
          </Link>

          {/* Account Menu Dropdown */}
          <Dropdown
            trigger={(isOpen) => (
              <button
                className={`flex items-center gap-2 p-1.5 rounded-xl border transition-all ${
                  isOpen
                    ? 'border-amber-400 bg-slate-800'
                    : 'border-slate-800 bg-slate-900/80 hover:border-slate-700'
                }`}
              >
                {isLoggedIn ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-7 h-7 rounded-lg object-cover border border-amber-400"
                  />
                ) : (
                  <User className="w-5 h-5 text-slate-300" />
                )}
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
              </button>
            )}
          >
            {({ close }) => (
              <div className="p-3 space-y-2">
                {isLoggedIn ? (
                  <>
                    <div className="p-2 bg-slate-950/60 rounded-xl border border-slate-800">
                      <div className="text-xs font-bold text-white">{user.name}</div>
                      <div className="text-[11px] text-slate-400 truncate">{user.email}</div>
                    </div>
                    <div className="space-y-1 pt-1">
                      <Link
                        to="/account"
                        onClick={close}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
                      >
                        <User className="w-4 h-4 text-amber-400" />
                        <span>My Account</span>
                      </Link>
                      <Link
                        to="/orders"
                        onClick={close}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
                      >
                        <Package className="w-4 h-4 text-amber-400" />
                        <span>My Orders</span>
                      </Link>
                      <Link
                        to="/wishlist"
                        onClick={close}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
                      >
                        <Heart className="w-4 h-4 text-rose-400" />
                        <span>Wishlist ({wishlistCount})</span>
                      </Link>
                    </div>
                    <div className="border-t border-slate-800 pt-2">
                      <button
                        onClick={() => {
                          logout();
                          close();
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="space-y-2 p-1">
                    <Link
                      to="/account"
                      onClick={close}
                      className="block w-full py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-center font-bold text-xs rounded-xl shadow transition-all"
                    >
                      Sign In
                    </Link>
                    <button
                      onClick={() => {
                        toggleAuth();
                        close();
                      }}
                      className="block w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-center font-semibold text-xs rounded-xl border border-slate-700 transition-all"
                    >
                      Demo Quick Login
                    </button>
                  </div>
                )}
              </div>
            )}
          </Dropdown>
        </div>
      </div>

      {/* Compact Mobile Search Row */}
      <div className="md:hidden px-4 pb-3">
        <form onSubmit={handleSearchSubmit} className="relative">
          <input
            type="text"
            placeholder="Search products, sarees, reels..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-8 py-2 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-amber-400 transition-all"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          {searchQuery && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-2.5 top-2 text-slate-400"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </form>
      </div>

      {/* Slide-out Mobile Drawer */}
      {mobileDrawerOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 p-4 space-y-3 animate-slideDown">
          <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800">
            <span>Navigation Menu</span>
            <button onClick={() => openModal('location')} className="text-amber-400 font-bold flex items-center gap-1">
              <MapPin className="w-3 h-3" /> {location.city} ({location.pincode})
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
            <Link to="/" onClick={() => setMobileDrawerOpen(false)} className="p-2.5 bg-slate-800 rounded-xl text-slate-200">
              Home
            </Link>
            <Link to="/products" onClick={() => setMobileDrawerOpen(false)} className="p-2.5 bg-slate-800 rounded-xl text-slate-200">
              All Products
            </Link>
            <Link to="/categories" onClick={() => setMobileDrawerOpen(false)} className="p-2.5 bg-slate-800 rounded-xl text-slate-200">
              Categories
            </Link>
            <Link to="/deals" onClick={() => setMobileDrawerOpen(false)} className="p-2.5 bg-slate-800 rounded-xl text-slate-200">
              Daily Deals
            </Link>
            <Link to="/reels" onClick={() => setMobileDrawerOpen(false)} className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400 font-bold">
              Reels Shopping
            </Link>
            <Link to="/orders" onClick={() => setMobileDrawerOpen(false)} className="p-2.5 bg-slate-800 rounded-xl text-slate-200">
              My Orders
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
