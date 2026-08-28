import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, ShoppingCart, Heart, User, Bell, Menu, Sun, Moon, ChevronDown, Sparkles } from 'lucide-react';
import { IconButton } from '../ui/IconButton.jsx';
import { Dropdown, DropdownItem } from '../ui/Overlays.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import { useCart } from '../../context/CartContext.jsx';
import { useWishlist } from '../../context/WishlistContext.jsx';

export const Header = ({ onOpenMobileMenu, notificationCount = 3 }) => {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const { cartItemCount, openCart } = useCart();
  const { wishlistCount } = useWishlist();

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Electronics', 'Fashion', 'Home', 'Gaming', 'Beauty'];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}&cat=${selectedCategory}`);
    }
  };

  return (
    <header className="sticky top-0 z-header bg-[#131A22] text-white shadow-md">
      {/* Desktop Header */}
      <div className="hidden lg:flex items-center justify-between h-[64px] px-6 max-w-[1440px] mx-auto gap-4">
        {/* LEFT: Brand & Location */}
        <div className="flex items-center gap-6 shrink-0">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center text-gray-950 font-black shadow-sm group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight text-white leading-none">
                SHOPSPHERE
              </span>
              <span className="text-[9px] font-bold text-accent tracking-widest uppercase">
                DISCOVER. WATCH. SHOP.
              </span>
            </div>
          </Link>

          {/* Location Delivery Selector */}
          <button
            type="button"
            className="flex items-center gap-2 px-2.5 py-1.5 rounded hover:bg-white/10 text-xs transition-colors"
          >
            <MapPin className="w-4 h-4 text-accent shrink-0" />
            <div className="flex flex-col text-left">
              <span className="text-[10px] text-gray-400 font-medium leading-none">Deliver to</span>
              <span className="font-bold text-white leading-tight">New Delhi 110001</span>
            </div>
          </button>
        </div>

        {/* CENTER: Main Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-2xl flex items-center h-[42px] rounded-md overflow-hidden bg-white text-gray-900 border border-transparent focus-within:ring-2 focus-within:ring-accent">
          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="h-full bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold px-3 border-r border-gray-300 focus:outline-none cursor-pointer"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Search Input */}
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products, reels, creators..."
            className="w-full h-full px-3 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none bg-white"
          />

          {/* Search Button */}
          <button
            type="submit"
            aria-label="Search"
            className="h-full px-5 bg-accent hover:bg-accent-hover text-gray-950 flex items-center justify-center transition-colors font-bold shrink-0"
          >
            <Search className="w-5 h-5" />
          </button>
        </form>

        {/* RIGHT: Actions */}
        <div className="flex items-center gap-4 shrink-0 text-xs font-medium">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-md hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Theme"
          >
            {isDark ? <Sun className="w-5 h-5 text-accent" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Wishlist Icon */}
          <Link
            to="/wishlist"
            className="flex items-center gap-1.5 hover:bg-white/10 px-2.5 py-1.5 rounded transition-colors text-white font-bold"
            title="My Saved Wishlist"
          >
            <div className="relative">
              <Heart className="w-5 h-5 text-white" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-accent text-gray-950 font-extrabold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </div>
            <span className="hidden xl:inline text-xs">Wishlist</span>
          </Link>

          {/* Account Dropdown */}
          <Dropdown
            trigger={
              <button className="flex items-center gap-1 hover:bg-white/10 px-2.5 py-1.5 rounded transition-colors text-left">
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-400 leading-none">Hello, Sign in</span>
                  <span className="font-bold text-white flex items-center gap-0.5">
                    Account & Lists <ChevronDown className="w-3 h-3 text-gray-400" />
                  </span>
                </div>
              </button>
            }
          >
            <DropdownItem onClick={() => navigate('/login')}>Sign In</DropdownItem>
            <DropdownItem onClick={() => navigate('/account')}>My Account</DropdownItem>
            <DropdownItem onClick={() => navigate('/orders')}>My Orders</DropdownItem>
            <DropdownItem onClick={() => navigate('/wishlist')}>My Wishlist ({wishlistCount})</DropdownItem>
            <DropdownItem onClick={() => navigate('/creator/studio')}>Creator Studio</DropdownItem>
            <DropdownItem onClick={() => navigate('/admin')}>Admin Dashboard</DropdownItem>
          </Dropdown>

          {/* Orders */}
          <Link to="/orders" className="hover:bg-white/10 px-2.5 py-1.5 rounded transition-colors flex flex-col text-left">
            <span className="text-[10px] text-gray-400 leading-none">Returns</span>
            <span className="font-bold text-white">& Orders</span>
          </Link>

          {/* Cart Drawer Trigger Button */}
          <button
            onClick={openCart}
            className="flex items-center gap-2 hover:bg-white/10 px-3 py-1.5 rounded transition-colors font-bold text-white"
            title="Open Shopping Cart"
          >
            <div className="relative">
              <ShoppingCart className="w-6 h-6 text-white" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent text-gray-950 font-extrabold text-[11px] w-5 h-5 rounded-full flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </div>
            <span className="text-sm">Cart</span>
          </button>
        </div>
      </div>

      {/* Mobile Top Header */}
      <div className="flex lg:hidden flex-col bg-[#131A22] border-b border-gray-800">
        <div className="flex items-center justify-between h-[56px] px-4">
          <div className="flex items-center gap-3">
            <IconButton
              icon={Menu}
              aria-label="Open navigation menu"
              variant="ghost"
              className="text-white hover:bg-white/10"
              onClick={onOpenMobileMenu}
            />
            <Link to="/" className="flex items-center gap-1.5">
              <div className="w-7 h-7 rounded bg-accent flex items-center justify-center text-gray-950 font-black">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-lg tracking-tight text-white">
                SHOPSPHERE
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-300 hover:text-white"
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun className="w-5 h-5 text-accent" /> : <Moon className="w-5 h-5" />}
            </button>
            <Link to="/wishlist" className="relative p-2 text-white" title="Wishlist">
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-gray-950 font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <button onClick={openCart} className="relative p-2 text-white" title="Cart">
              <ShoppingCart className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-gray-950 font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Sticky Mobile Search Bar */}
        <div className="px-3 pb-3">
          <form onSubmit={handleSearchSubmit} className="flex items-center h-10 rounded-md overflow-hidden bg-white text-gray-900">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products, reels, creators..."
              className="w-full h-full px-3 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none"
            />
            <button
              type="submit"
              className="h-full px-4 bg-accent text-gray-950 flex items-center justify-center font-bold"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </header>
  );
};

export default Header;
