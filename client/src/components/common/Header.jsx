import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, ShoppingCart, Heart, Menu, Sun, Moon, ChevronDown, Sparkles } from 'lucide-react';
import { IconButton } from '../ui/IconButton.jsx';
import { Dropdown, DropdownItem } from '../ui/Overlays.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import { useCart } from '../../context/CartContext.jsx';
import { useWishlist } from '../../context/WishlistContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { SearchBar } from '../search/SearchBar.jsx';

export const Header = ({ onOpenMobileMenu }) => {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const { cartItemCount, openCart } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, isAuthenticated, logout } = useAuth();

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

        {/* CENTER: Main Search Bar with Auto-complete Suggestions */}
        <SearchBar className="max-w-2xl" placeholder="Search products, brands and categories..." />

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
              <button className="flex items-center gap-1.5 hover:bg-white/10 px-2.5 py-1.5 rounded transition-colors text-left">
                {isAuthenticated && user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-7 h-7 rounded-full object-cover border border-accent shrink-0"
                  />
                ) : null}
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-400 leading-none">
                    {isAuthenticated ? `Hi, ${user?.name?.split(' ')[0] || 'User'}` : 'Hello, Sign in'}
                  </span>
                  <span className="font-bold text-white flex items-center gap-0.5">
                    Account & Lists <ChevronDown className="w-3 h-3 text-gray-400" />
                  </span>
                </div>
              </button>
            }
          >
            {!isAuthenticated ? (
              <>
                <DropdownItem onClick={() => navigate('/login')}>Sign In</DropdownItem>
                <DropdownItem onClick={() => navigate('/register')}>Create Account</DropdownItem>
              </>
            ) : (
              <>
                <div className="px-4 py-2 border-b border-border text-xs">
                  <p className="font-extrabold text-text-primary">{user?.name}</p>
                  <p className="text-[10px] text-text-tertiary">{user?.email}</p>
                </div>
                <DropdownItem onClick={() => navigate('/account?tab=profile')}>My Profile</DropdownItem>
                <DropdownItem onClick={() => navigate('/account?tab=addresses')}>My Addresses</DropdownItem>
                <DropdownItem onClick={() => navigate('/orders')}>My Orders</DropdownItem>
                <DropdownItem onClick={() => navigate('/wishlist')}>My Wishlist ({wishlistCount})</DropdownItem>
                <DropdownItem onClick={() => navigate('/account?tab=security')}>Security Settings</DropdownItem>
                {user?.role === 'creator' || user?.role === 'admin' ? (
                  <DropdownItem onClick={() => navigate('/creator/studio')}>Creator Studio</DropdownItem>
                ) : null}
                {user?.role === 'admin' ? (
                  <DropdownItem onClick={() => navigate('/admin')}>Admin Dashboard</DropdownItem>
                ) : null}
                <DropdownItem onClick={logout} className="text-red-500 font-bold border-t border-border">
                  Sign Out
                </DropdownItem>
              </>
            )}
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

        {/* Mobile Search Bar */}
        <div className="px-3 pb-3">
          <SearchBar placeholder="Search products, brands and categories..." />
        </div>
      </div>
    </header>
  );
};

export default Header;
