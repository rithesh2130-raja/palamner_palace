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
    <header className="sticky top-0 z-40 bg-white border-b border-neutral-200 shadow-sm">
      {/* Top Header Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        {/* Mobile Menu & Brand Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileDrawerOpen(prev => !prev)}
            aria-label="Open mobile menu drawer"
            className="md:hidden p-2 text-neutral-700 hover:text-black hover:bg-neutral-100 rounded-lg transition-colors"
          >
            {mobileDrawerOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link to="/" className="flex items-center gap-2 text-lg sm:text-xl font-black tracking-tight text-black group">
            <div className="bg-[#E50914] text-white p-2 rounded-xl group-hover:rotate-6 transition-transform shadow-md">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 fill-white" />
            </div>
            <span>
              PALAMNER<span className="text-[#E50914]">PALACE</span>
            </span>
          </Link>
        </div>

        {/* Central Search Bar */}
        <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-xl relative">
          <input
            type="text"
            placeholder="Search products, brands & categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-neutral-100 border border-neutral-300 rounded-xl pl-10 pr-9 py-2 text-sm text-black placeholder-neutral-500 focus:outline-none focus:border-[#E50914] focus:ring-1 focus:ring-[#E50914] focus:bg-white transition-all"
          />
          <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3 pointer-events-none" />
          {searchQuery && (
            <button
              type="button"
              onClick={handleClearSearch}
              aria-label="Clear search text"
              className="absolute right-3 top-2.5 p-1 text-neutral-400 hover:text-black"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </form>

        {/* Right Actions */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* Delivery Location Indicator */}
          <button
            onClick={() => openModal('location')}
            className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-50 border border-neutral-200 hover:border-[#E50914] transition-all text-left group"
          >
            <MapPin className="w-4 h-4 text-[#E50914] shrink-0 group-hover:animate-bounce" />
            <div className="text-[11px] leading-tight">
              <div className="text-neutral-500 font-medium">Deliver to</div>
              <div className="text-black font-bold truncate max-w-[110px]">
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
                  isOpen ? 'bg-neutral-100 text-[#E50914]' : 'text-neutral-700 hover:text-[#E50914] hover:bg-neutral-100'
                }`}
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 bg-[#E50914] text-white font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow">
                    {unreadCount}
                  </span>
                )}
              </button>
            )}
          >
            {({ close }) => (
              <div className="p-4 space-y-3 bg-white border border-neutral-200 rounded-xl shadow-xl">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                  <h4 className="text-xs font-bold text-black uppercase tracking-wider">Notifications</h4>
                  {notifications.length > 0 && (
                    <button
                      onClick={clearNotifications}
                      className="text-[11px] text-neutral-500 hover:text-[#E50914] flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" /> Clear
                    </button>
                  )}
                </div>

                <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
                  {notifications.length === 0 ? (
                    <p className="text-xs text-neutral-500 text-center py-4">No new notifications</p>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markAsRead(n.id)}
                        className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                          n.read
                            ? 'bg-neutral-50 border-neutral-200 text-neutral-600'
                            : 'bg-red-50/50 border-red-200 text-black'
                        }`}
                      >
                        <div className="font-bold text-black flex items-center justify-between">
                          <span>{n.title}</span>
                          {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-[#E50914]"></span>}
                        </div>
                        <p className="text-[11px] mt-1 line-clamp-2 text-neutral-600">{n.message}</p>
                        <span className="text-[10px] text-neutral-400 mt-1 block">{n.timestamp}</span>
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
            className="p-2 text-neutral-700 hover:text-[#E50914] hover:bg-neutral-100 rounded-xl relative transition-all"
          >
            <Heart className="w-5 h-5" />
            {wishlistCount > 0 && (
              <span className="absolute top-1 right-1 bg-[#E50914] text-white font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart Icon */}
          <Link
            to="/cart"
            aria-label="Shopping Cart"
            className="p-2 text-neutral-700 hover:text-[#E50914] hover:bg-neutral-100 rounded-xl relative transition-all"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartItemCount > 0 && (
              <span className="absolute top-1 right-1 bg-[#E50914] text-white font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow">
                {cartItemCount}
              </span>
            )}
          </Link>

          {/* Account Dropdown */}
          <Dropdown
            trigger={(isOpen) => (
              <button
                className={`flex items-center gap-2 p-1.5 rounded-xl border transition-all ${
                  isOpen
                    ? 'border-[#E50914] bg-neutral-100'
                    : 'border-neutral-200 bg-neutral-50 hover:border-neutral-300'
                }`}
              >
                {isLoggedIn ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-7 h-7 rounded-lg object-cover border border-[#E50914]"
                  />
                ) : (
                  <User className="w-5 h-5 text-neutral-700" />
                )}
                <ChevronDown className="w-3.5 h-3.5 text-neutral-500 hidden sm:block" />
              </button>
            )}
          >
            {({ close }) => (
              <div className="p-3 space-y-2 bg-white border border-neutral-200 rounded-xl shadow-xl">
                {isLoggedIn ? (
                  <>
                    <div className="p-2 bg-neutral-50 rounded-xl border border-neutral-200">
                      <div className="text-xs font-bold text-black">{user.name}</div>
                      <div className="text-[11px] text-neutral-500 truncate">{user.email}</div>
                    </div>
                    <div className="space-y-1 pt-1">
                      <Link
                        to="/account"
                        onClick={close}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-neutral-700 hover:text-[#E50914] hover:bg-neutral-100 rounded-xl transition-all"
                      >
                        <User className="w-4 h-4 text-[#E50914]" />
                        <span>My Account</span>
                      </Link>
                      <Link
                        to="/orders"
                        onClick={close}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-neutral-700 hover:text-[#E50914] hover:bg-neutral-100 rounded-xl transition-all"
                      >
                        <Package className="w-4 h-4 text-[#E50914]" />
                        <span>My Orders</span>
                      </Link>
                      <Link
                        to="/wishlist"
                        onClick={close}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-neutral-700 hover:text-[#E50914] hover:bg-neutral-100 rounded-xl transition-all"
                      >
                        <Heart className="w-4 h-4 text-[#E50914]" />
                        <span>Wishlist ({wishlistCount})</span>
                      </Link>
                    </div>
                    <div className="border-t border-neutral-100 pt-2">
                      <button
                        onClick={() => {
                          logout();
                          close();
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-all"
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
                      className="block w-full py-2 bg-[#E50914] hover:bg-[#B20710] text-white text-center font-bold text-xs rounded-xl shadow transition-all"
                    >
                      Sign In
                    </Link>
                    <button
                      onClick={() => {
                        toggleAuth();
                        close();
                      }}
                      className="block w-full py-2 bg-neutral-900 hover:bg-black text-white text-center font-semibold text-xs rounded-xl transition-all"
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

      {/* Mobile Search Row */}
      <div className="md:hidden px-4 pb-3">
        <form onSubmit={handleSearchSubmit} className="relative">
          <input
            type="text"
            placeholder="Search products, brands & categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-neutral-100 border border-neutral-300 rounded-xl pl-9 pr-8 py-2 text-xs text-black placeholder-neutral-500 focus:outline-none focus:border-[#E50914] transition-all"
          />
          <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-2.5 pointer-events-none" />
          {searchQuery && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-2.5 top-2 text-neutral-400"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </form>
      </div>

      {/* Mobile Drawer */}
      {mobileDrawerOpen && (
        <div className="md:hidden bg-white border-b border-neutral-200 p-4 space-y-3 animate-slideDown">
          <div className="flex items-center justify-between text-xs text-neutral-500 pb-2 border-b border-neutral-100">
            <span>Navigation Menu</span>
            <button onClick={() => openModal('location')} className="text-[#E50914] font-bold flex items-center gap-1">
              <MapPin className="w-3 h-3" /> {location.city} ({location.pincode})
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
            <Link to="/" onClick={() => setMobileDrawerOpen(false)} className="p-2.5 bg-neutral-100 rounded-xl text-black">
              Home
            </Link>
            <Link to="/products" onClick={() => setMobileDrawerOpen(false)} className="p-2.5 bg-neutral-100 rounded-xl text-black">
              All Products
            </Link>
            <Link to="/categories" onClick={() => setMobileDrawerOpen(false)} className="p-2.5 bg-neutral-100 rounded-xl text-black">
              Categories
            </Link>
            <Link to="/deals" onClick={() => setMobileDrawerOpen(false)} className="p-2.5 bg-neutral-100 rounded-xl text-black">
              Daily Deals
            </Link>
            <Link to="/reels" onClick={() => setMobileDrawerOpen(false)} className="p-2.5 bg-red-50 border border-red-200 rounded-xl text-[#E50914] font-bold">
              Reels Shopping
            </Link>
            <Link to="/orders" onClick={() => setMobileDrawerOpen(false)} className="p-2.5 bg-neutral-100 rounded-xl text-black">
              My Orders
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
