import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import Header from '../common/Header.jsx';
import SecondaryNavigation from '../common/SecondaryNavigation.jsx';
import Footer from '../common/Footer.jsx';
import MobileNavigation from '../common/MobileNavigation.jsx';
import Drawer from '../ui/Drawer.jsx';
import CartDrawer from '../cart/CartDrawer.jsx';
import { ShoppingBag, Clapperboard, Layers, Tag, Shield, Heart, User, LogOut } from 'lucide-react';

import { useAuth } from '../../context/AuthContext.jsx';

export const CustomerLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-page text-text-primary transition-colors">
      {/* Customer Header */}
      <Header onOpenMobileMenu={() => setIsMobileMenuOpen(true)} />

      {/* Secondary Category Navigation */}
      <SecondaryNavigation />

      {/* Main Page Outlet */}
      <main className="flex-1 w-full pb-16 lg:pb-0">
        <Outlet />
      </main>

      {/* Customer Footer */}
      <Footer />

      {/* Mobile Bottom Navigation */}
      <MobileNavigation />

      {/* Cart Drawer */}
      <CartDrawer />

      {/* Mobile Menu Drawer */}
      <Drawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        title="Menu & Navigation"
        position="right"
      >
        <div className="space-y-4 py-2">
          <div className="p-4 rounded-lg bg-surface-secondary flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent text-gray-950 font-bold flex items-center justify-center overflow-hidden">
                {isAuthenticated && (user?.avatar || user?.avatarUrl) ? (
                  <img src={user.avatarUrl || user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <span>{(user?.name || 'G').charAt(0).toUpperCase()}</span>
                )}
              </div>
              <div>
                <p className="font-bold text-text-primary text-sm">
                  {isAuthenticated ? user?.name : 'Welcome Guest'}
                </p>
                {!isAuthenticated ? (
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-xs text-accent font-semibold hover:underline">
                    Sign In / Register
                  </Link>
                ) : (
                  <Link to="/account" onClick={() => setIsMobileMenuOpen(false)} className="text-xs text-accent font-semibold hover:underline">
                    My Account
                  </Link>
                )}
              </div>
            </div>
            {isAuthenticated && (
              <button
                onClick={() => {
                  logout();
                  setIsMobileMenuOpen(false);
                }}
                className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="space-y-1">
            <Link
              to="/products"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-surface-secondary text-sm font-semibold text-text-primary"
            >
              <ShoppingBag className="w-4 h-4 text-accent" />
              <span>Browse Catalog</span>
            </Link>
            <Link
              to="/reels"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-surface-secondary text-sm font-semibold text-text-primary"
            >
              <Clapperboard className="w-4 h-4 text-accent" />
              <span>Trending Reels Feed</span>
            </Link>
            <Link
              to="/deals"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-surface-secondary text-sm font-semibold text-text-primary"
            >
              <Tag className="w-4 h-4 text-accent" />
              <span>Today's Deals</span>
            </Link>
            <Link
              to="/categories"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-surface-secondary text-sm font-semibold text-text-primary"
            >
              <Layers className="w-4 h-4 text-accent" />
              <span>All Categories</span>
            </Link>
            <Link
              to="/wishlist"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-surface-secondary text-sm font-semibold text-text-primary"
            >
              <Heart className="w-4 h-4 text-accent" />
              <span>Wishlist</span>
            </Link>
            <Link
              to="/creator/studio"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-surface-secondary text-sm font-semibold text-text-primary"
            >
              <User className="w-4 h-4 text-accent" />
              <span>Creator Studio</span>
            </Link>
            <Link
              to="/admin"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-surface-secondary text-sm font-semibold text-text-primary"
            >
              <Shield className="w-4 h-4 text-accent" />
              <span>Admin Portal</span>
            </Link>
          </div>
        </div>
      </Drawer>
    </div>
  );
};

export default CustomerLayout;
